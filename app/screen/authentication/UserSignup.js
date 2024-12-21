import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Password icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Email icon
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView from safe-area-context
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../component/axiosInstance"; // Adjust the path as necessary

// Password criteria definitions
const passwordCriteria = [
  {
    label: "At least 8 characters.",
    check: (password) => password.length >= 8,
  },
  {
    label: "Contains at least one letter.",
    check: (password) => /[A-Za-z]/.test(password),
  },
  {
    label: "Contains at least one digit.",
    check: (password) => /\d/.test(password),
  },
  {
    label: "Contains at least one special character.",
    check: (password) => /[@$!%*?&]/.test(password),
  },
];

// Password Criteria Component
const PasswordCriteriaComponent = ({ password }) => {
  return (
    <View style={styles.criteriaContainer}>
      {passwordCriteria.map((criterion, index) => {
        const isValid = criterion.check(password);
        return (
          <View key={index} style={styles.criteriaItem}>
            <Icon
              name={isValid ? "checkmark-circle" : "close-circle"}
              size={16}
              color={isValid ? "green" : "red"}
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: isValid ? "green" : "red" }}>
              {criterion.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

function UserSignup({ navigation }) {
  // Single state for all form fields
  const [formData, setFormData] = useState({
    userName: "",
    specialty: "",
    residencyDuration: "",
    residencyYear: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // For password visibility toggle
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // For confirm password visibility toggle
  const [errors, setErrors] = useState({}); // State to hold error messages
  const nav = useNavigation();
  const scrollViewRef = useRef(null); // Create a ref for ScrollView

  const [emailExitError, setEmailExitError] = useState("");

  // Axios instance for API calls
  const notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      Alert.alert("Warning!", msg);
    }
  };

  // Password format validation
  const validatePasswordFormat = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Email format validation
  const validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const debounceTimeout = useRef(null);

  const checkEmailAvailability = (emailToCheck) => {
    // Clear the previous timeout if it exists
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await axiosInstance.post("/check-email/", {
          email: emailToCheck,
        });
        if (response.data.exists) {
          setEmailExitError("This email is already registered.");
        } else {
          setEmailExitError("This email is already registered.");
          ("");
        }
      } catch (error) {
        console.log("Error checking email availability:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Unable to verify email. Please try again later.",
        }));
      }
    }, 500); // 500ms delay
  };

  // Handle user signup
  const handleUserSignup = async () => {
    let formErrors = {};

    // Validate fields
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        // Convert camelCase to regular text
        const fieldName = field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        formErrors[field] = `${fieldName} is required.`;
      }
    });

    if (formData.email && !validateEmailFormat(formData.email)) {
      formErrors.email = "Invalid email format.";
    }

    if (formData.password && !validatePasswordFormat(formData.password)) {
      formErrors.password =
        "Password must be at least 8 characters long and contain a number, a letter, and a special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(formErrors);

    // Prevent proceeding if there are formErrors or existing errors (e.g., email already exists)
    if (Object.keys(formErrors).length > 0 || errors.email) {
      // Display an overall error message if necessary

      return;
    }

    setIsLoading(true);
    try {
      // Perform email availability check

      // Proceed with signup (send-otp)
      const response = await axiosInstance.post(`/send-otp/`, {
        email: formData.email,
      });

      if (response.status === 200) {
        navigation.navigate("OTP", {
          formData: formData,

          // Add other data you want to send
        });
      }
    } catch (error) {
      if (error.response) {
        // If the server returned a response (e.g., 400 status)
        const errorMessage = error.response.data.error || "Invalid request"; // Adjust based on your API structure
        console.log("Server error:", error.response);

        // Display the error message in a toast or alert
        notifyMessage(errorMessage);

        // Optionally set it in state to display in the UI
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);
        notifyMessage("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle text change for all fields
  const handleTextChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    // Clear the error for the specific field
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));

    // Additional validation for specific fields
    if (field === "email") {
      if (validateEmailFormat(value)) {
        // If email format is valid, check availability
        checkEmailAvailability(value);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
      }
    }

    if (field === "password") {
      if (validatePasswordFormat(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password:
            "Password must be at least 8 characters long and contain a number, a letter, and a special character.",
        }));
      }
    }

    if (field === "confirmPassword" || field === "password") {
      if (value === formData.password) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match.",
        }));
      }
    }
  };
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match.",
        }));
      }
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    // Listen for when the screen loses focus (navigate away)
    const unsubscribeBlur = navigation.addListener("blur", () => {
      // Reset the state when navigating away (screen loses focus)
      setFormData({
        userName: "",
        specialty: "",
        residencyDuration: "",
        residencyYear: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setEmailExitError("");
    });

    // Scroll to the top when the screen is focused
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Scroll to the top when the screen is focused
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    // Return the unsubscribe function to clean up when component unmounts
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar style="dark" backgroundColor="white" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 1 }}
        ref={scrollViewRef}
      >
        <View style={styles.container}>
          {/* Logo Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/MEDLOGO.png")} // Your logo path
              style={styles.image}
            />
          </View>

          {/* Title */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700" }}>
              Create an Account
            </Text>
            <Text>Sign up now to get started on your journey.</Text>
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.userName ? styles.errorInputWrapper : null,
              ]}
            >
              <Icon name="person-outline" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholderTextColor="#888888"
                placeholder="Enter Name"
                value={formData.userName}
                onChangeText={(value) => handleTextChange("userName", value)}
                accessibilityLabel="Username Input"
                accessibilityRole="keyboardkey"
              />
            </View>
            {errors.userName && (
              <Text style={styles.errorText}>{errors.userName}</Text>
            )}
          </View>

          {/* Specialty Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name of the Specialty</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.specialty ? styles.errorInputWrapper : null,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholderTextColor="#888888"
                placeholder="Enter Specialty"
                value={formData.specialty}
                onChangeText={(value) => handleTextChange("specialty", value)}
                accessibilityLabel="Specialty Input"
                accessibilityRole="keyboardkey"
              />
            </View>
            {errors.specialty && (
              <Text style={styles.errorText}>{errors.specialty}</Text>
            )}
          </View>

          {/* Residency duration and year inputs */}
          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFirst}>
              <Text style={styles.labelFirst}>Residency Duration</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.residencyDuration ? styles.errorInputWrapper : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#888888"
                  placeholder="Enter Duration "
                  value={formData.residencyDuration}
                  onChangeText={(value) =>
                    handleTextChange("residencyDuration", value)
                  }
                  keyboardType="numeric"
                  accessibilityLabel="Residency Duration "
                  accessibilityRole="keyboardkey"
                />
              </View>
              {errors.residencyDuration && (
                <Text style={styles.errorText}>{errors.residencyDuration}</Text>
              )}
            </View>
            <View style={styles.inputContainerFirst}>
              <Text style={styles.labelFirst}>Current year of residency</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.residencyYear ? styles.errorInputWrapper : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#888888"
                  placeholder="Enter Year"
                  value={formData.residencyYear}
                  onChangeText={(value) =>
                    handleTextChange("residencyYear", value)
                  }
                  keyboardType="numeric"
                  
                  accessibilityLabel="Residency Year "
                  accessibilityRole="keyboardkey"
                />
              </View>
              {errors.residencyYear && (
                <Text style={styles.errorText}>{errors.residencyYear}</Text>
              )}
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.email || emailExitError
                  ? styles.errorInputWrapper
                  : null,
              ]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#B5B5B5"
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="#888888"
                placeholder="Enter Email"
                value={formData.email}
                onChangeText={(value) => handleTextChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email Input"
                accessibilityRole="keyboardkey"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            {emailExitError && (
              <Text style={styles.errorText}>{emailExitError}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password ? styles.errorInputWrapper : null,
              ]}
            >
              <Icon name="lock-closed-outline" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholderTextColor="#888888"
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                value={formData.password}
                onChangeText={(value) => handleTextChange("password", value)}
                autoCapitalize="none"
                accessibilityLabel="Password Input"
                accessibilityRole="keyboardkey"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Icon
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>

            {/* Password Criteria */}
            {errors.password && (
              <PasswordCriteriaComponent password={formData.password} />
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.confirmPassword ? styles.errorInputWrapper : null,
              ]}
            >
              <Icon name="lock-closed-outline" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholderTextColor="#888888"
                placeholder="Confirm your password"
                secureTextEntry={!confirmPasswordVisible}
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleTextChange("confirmPassword", value)
                }
                autoCapitalize="none"
                accessibilityLabel="Confirm Password Input"
                accessibilityRole="keyboardkey"
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Icon
                  name={confirmPasswordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.loginButton]}
            onPress={handleUserSignup}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Already signed in? */}
          <View style={styles.alreadySignInContainer}>
            <Text style={styles.alreadySignInText}>
              Don’t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("UserLogin")}>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imageContainer: {
    marginBottom: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: "contain",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputContainerFirst: {
    width: "48%",
    marginBottom: 1,
  },
  inputContainerDouble: {
    width: "100%",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
  },
  labelFirst: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
    height: 40,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    height: 56,
  },
  errorInputWrapper: {
    borderColor: "#E91111", // Red border
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc", // Disabled button color
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  alreadySignInContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  alreadySignInText: {
    fontSize: 14,
    color: "#777",
  },
  link: {
    fontSize: 14,
    color: "#FFDC58",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  criteriaContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default UserSignup;

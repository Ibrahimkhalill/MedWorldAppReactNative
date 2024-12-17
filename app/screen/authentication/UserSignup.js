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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Username icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Email icon
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView from safe-area-context
import { useNavigation } from "@react-navigation/native";

import axios from "axios";
import axiosInstance from "../component/axiosInstance";

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

  // Handle user signup
  const handleUserSignup = async () => {
    let formErrors = {};

    // Validate fields
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) formErrors[field] = `${field} is required.`;
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

    if (Object.keys(formErrors).length > 0) return; // If there are errors, do not proceed with the signup

    setIsLoading(true);
    try {
      console.log("dfdsfs", axiosInstance);
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
        notifyMessage(errorMessage); // Replace with your UI feedback mechanism

        // Optionally set it in state to display in the UI
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);
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
  };
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
              Create an account
            </Text>
            <Text>Sign up now to get started on your journey.</Text>
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Icon name="person-outline" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={formData.userName}
                onChangeText={(value) => handleTextChange("userName", value)}
              />
            </View>
            {errors.userName && (
              <Text style={styles.errorText}>{errors.userName}</Text>
            )}
          </View>

          {/* Specialty Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name of the Specialty</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={formData.specialty}
                onChangeText={(value) => handleTextChange("specialty", value)}
              />
            </View>
            {errors.specialty && (
              <Text style={styles.errorText}>{errors.specialty}</Text>
            )}
          </View>

          {/* Residency duration and year inputs */}
          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>Residency duration?</Text>
              <TextInput
                style={styles.inputFirst}
                value={formData.residencyDuration}
                onChangeText={(value) =>
                  handleTextChange("residencyDuration", value)
                }
                keyboardType="numeric"
              />
              {errors.residencyDuration && (
                <Text style={styles.errorText}>{errors.residencyDuration}</Text>
              )}
            </View>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>
                What year is the user in residency?
              </Text>
              <TextInput
                style={styles.inputFirst}
                value={formData.residencyYear}
                onChangeText={(value) =>
                  handleTextChange("residencyYear", value)
                }
                keyboardType="numeric"
              />
              {errors.residencyYear && (
                <Text style={styles.errorText}>{errors.residencyYear}</Text>
              )}
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#B5B5B5"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={formData.email}
                onChangeText={(value) => handleTextChange("email", value)}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock-closed-outline" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                value={formData.password}
                onChangeText={(value) => handleTextChange("password", value)}
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
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock-closed-outline" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                secureTextEntry={!confirmPasswordVisible}
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleTextChange("confirmPassword", value)
                }
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
            style={styles.loginButton}
            onPress={handleUserSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          {/* Already signed in? */}
          <View style={styles.alreadySignInContainer}>
            <Text style={styles.alreadySignInText}>
              Don’t Have an account?{" "}
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
    justifyContent: "start",
    alignItems: "start",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imageContainer: {
    marginBottom: 30,
    display: "flex",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 80,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputContainerFIrst: {
    width: "50%",
    marginBottom: 15,
  },
  inputContainerDouble: {
    width: "100%",
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBCBCB",
    marginBottom: 5,
  },
  labelFirst: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBCBCB",
    marginBottom: 5,
    height: 50,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  inputFirst: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    height: 56,
    width: "95%",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
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
});

export default UserSignup;

import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons"; // Password icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Email icon
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "./Auth";
import ErrorModal from "../component/ErrorModal";

function UserLogin({ navigation }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // For password visibility toggle
  const [errorVisible, setErrorVisible] = useState(false);
  const [error, setError] = useState("");
  const { login, token } = useAuth();

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  // Email format validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle Username Change with Real-time Validation
  const handleUserNameChange = (text) => {
    setUserName(text);

    // Validate Email
    if (text === "") {
      setErrors((prev) => ({ ...prev, userName: "Email cannot be empty" }));
    } else if (!validateEmail(text)) {
      setErrors((prev) => ({
        ...prev,
        userName: "Please enter a valid email address",
      }));
    } else {
      setErrors((prev) => ({ ...prev, userName: "" }));
    }
  };

  // Handle Password Change with Real-time Validation
  const handlePasswordChange = (text) => {
    setPassword(text);

    // Validate Password Length
    if (text === "") {
      setErrors((prev) => ({ ...prev, password: "Password cannot be empty" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleUserLogin = async () => {
    // Final validation before submission
    let valid = true;
    const formErrors = { userName: "", password: "" };

    if (userName === "") {
      formErrors.userName = "Email cannot be empty";
      valid = false;
    } else if (!validateEmail(userName)) {
      formErrors.userName = "Please enter a valid email address";
      valid = false;
    }

    if (password === "") {
      formErrors.password = "Password cannot be empty";
      valid = false;
    }

    setErrors(formErrors);

    if (!valid) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/login/", {
        email: userName,
        password: password,
      });

      if (response.status === 200) {
        login(userName, response.data.token);
        if (token) {
          navigation.navigate("UserHome");
        }
      } else {
        setErrorVisible(true);
        setError("Invalid username or password");
      }
    } catch (error) {
      if (error.response) {
        // If the server returned a response (e.g., 400 status)
        const serverErrors = error.response.data.error; // Adjust based on your API structure
        const formErrors = { userName: "", password: "" };

        setErrors(formErrors);
        setErrorVisible(true);
        setError(serverErrors);
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);
        setErrorVisible(true);
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="white" />

      {/* Logo Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/MEDLOGO.png")} // Your logo path
          style={styles.image}
        />
      </View>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View
          style={[
            styles.inputWrapper,
            errors.userName ? styles.errorInputWrapper : null,
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
            value={userName}
            onChangeText={handleUserNameChange}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email Input"
            accessibilityRole="keyboardkey"
          />
        </View>
        {errors.userName ? (
          <Text style={styles.errorText}>{errors.userName}</Text>
        ) : null}
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
            value={password}
            onChangeText={handlePasswordChange}
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
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
      </View>

      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleUserLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Already signed in? */}
      <View style={styles.alreadySignInContainer}>
        <Text style={styles.alreadySignInText}>Don’t Have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("UserSignup")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Error Modal */}
      <ErrorModal
        message={error}
        isVisible={errorVisible}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 165, // width of the image
    height: 140, // height of the image
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBCBCB",
    marginBottom: 5,
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
    borderColor: "#E91111", // লাল রঙের হেক্স কোড
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#E91111",
    marginTop: 5,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000", // সঠিক রঙ কোড
  },
  alreadySignInContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
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
  forgotPasswordContainer: {
    width: "100%",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#E91111",
    textAlign: "right",
  },
});

export default UserLogin;

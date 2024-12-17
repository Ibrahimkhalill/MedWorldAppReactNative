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

import Icon from "react-native-vector-icons/Ionicons"; // Username icon
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Username icon
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
  const { login } = useAuth();

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  // Email format validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleUserLogin = async () => {
    let valid = true;
    const formErrors = { userName: "", password: "" };

    // Validate fields
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

    // Set errors if validation fails
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

        navigation.navigate("UserHome");
      } else {
        setErrorVisible(true);
        setError("Invalid username or password");
      }
    } catch (error) {
      if (error.response) {
        // If the server returned a response (e.g., 400 status)
        const errorMessage = error.response.data.error || "Invalid request"; // Adjust based on your API structure
        console.log("Server error:", error.response);
        setErrorVisible(true);
        // Display the error message in a toast or alert
        setError(errorMessage); // Replace with your UI feedback mechanism

        // Optionally set it in state to display in the UI
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);
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
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            color="#B5B5B5"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={userName}
            onChangeText={setUserName}
          />
        </View>
        {errors.userName ? (
          <Text style={styles.errorText}>{errors.userName}</Text>
        ) : null}
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
            value={password}
            onChangeText={setPassword}
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
        <Text style={styles.alreadySignInText}>Don’t Have an account ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("UserSignup")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
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
    width: 160, // width of the image
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
    color: "#00000",
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

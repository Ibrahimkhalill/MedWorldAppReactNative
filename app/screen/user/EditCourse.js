import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../authentication/Auth";

function EditCourse({ navigation, route }) {
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ date: "", name: "" });
  const { token } = useAuth();
  const { params } = route; // Get route params for the course data

  // Notify message utility
  function notifyMessage(msg) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      alert(msg); // Fallback for iOS
    }
  }

  // Pre-fill data when navigating to this screen
  useEffect(() => {
    if (params && params.data) {
      const course = params.data;
      setDate(new Date(course.date));
      setName(course.name);
    }
  }, [params]);

  // Handle form submission
  const handleUpdate = async () => {
    let hasError = false;
    let newErrors = { date: "", name: "" };

    if (!date) {
      newErrors.date = "Date is required";
      hasError = true;
    }
    if (!name) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const payload = {
      date,
      name,
    };

    setIsLoading(true);

    try {
      const response = await axiosInstance.put(
        `/courses/${params.data.id}/`, // Update the specific course
        payload,
        {
          headers: {
            Authorization: `Token ${token}`, // Include token for authorization
          },
        }
      );

      if (response.status === 200) {
        notifyMessage("Course updated successfully!");
        navigation.goBack(); // Go back to the previous screen
      } else {
        notifyMessage("Failed to update course.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      notifyMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form errors when input changes
  const handleInputChange = (setter, value, field) => {
    setter(value);
    setErrors({ ...errors, [field]: "" }); // Clear error for the specific field
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <StatusBar style="dark" backgroundColor="white" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 1 }}
      >
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <View className="flex flex-row gap-3 my-3 mb-5">
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("ScientificDcoument")}
          >
            <Text style={styles.navButtonText}>Scientific</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("SurgergeryDcoument")}
          >
            <Text style={styles.navButtonText}>Surgeries</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1 border-b-4 border-[#FFDC58]"
            onPress={() => navigation.navigate("CoursesDocument")}
          >
            <Text style={styles.navButtonText}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("BudgetDcoument")}
          >
            <Text style={styles.navButtonText}>Budget</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {/* Date Input */}
          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>Date</Text>
              <CustomDatePicker
                onDateChange={(selectedDate) =>
                  handleInputChange(setDate, selectedDate, "date")
                }
                date={date}
                setDate={setDate}
              />
              {errors.date ? (
                <Text style={styles.errorText}>{errors.date}</Text>
              ) : null}
            </View>
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.name ? styles.inputErrorBorder : null, // Apply red border if error exists
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter Course Name"
                value={name}
                onChangeText={(text) =>
                  handleInputChange(setName, text, "name")
                }
              />
            </View>
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>
        </View>
        <View className="flex items-center justify-center mb-10">
          <TouchableOpacity style={styles.loginButton} onPress={handleUpdate}>
            <Text style={styles.loginButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    paddingTop: 40,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 10,
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
    flexDirection: "row",
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 5,
  },
  labelFirst: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 40,
    width: 119,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  inputErrorBorder: {
    borderColor: "red", // Red border for error
  },
  navButtonText: {
    fontWeight: "500",
  },
});

export default EditCourse;

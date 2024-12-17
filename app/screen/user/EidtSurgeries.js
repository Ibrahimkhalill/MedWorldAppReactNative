import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { REACT_APP_BASE_URL } from "@env"; // Import your environment variable
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"; // SafeAreaView from safe-area-context

import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import CustomCheckbox from "../component/CheckBox";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
function EidtSurgeries({ route, navigation }) {
  const { data } = route.params || {};

  const [fieldOfSurgery, setFieldOfSurgery] = useState(
    data?.field_of_surgery || ""
  );
  const [surgeryName, setSurgeryName] = useState(data?.name_of_surgery || "");
  const [typeOfSurgery, setTypeOfSurgery] = useState(
    data?.type_of_surgery || ""
  );
  const [date, setDate] = useState(data.date);
  const [mainSurgeon, setMainSurgeon] = useState(data.main_surgeon || false);
  const [histology, setHistology] = useState(data.histology || false);
  const [complications, setComplications] = useState(
    data?.complications || false
  );
  const [histologyDescription, setHistologyDescription] = useState(
    data?.histology_description || ""
  );
  const [complicationDescription, setComplicationDescription] = useState(
    data?.complications_description || ""
  );
  const [notes1, setNotes1] = useState(data.notes1 || "");
  const [notes2, setNotes2] = useState(data.notes2 || "");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleupdate = async () => {
    if (!fieldOfSurgery || !surgeryName || !typeOfSurgery || !date) {
      notifyMessage("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.put(
        `/surgery/${data.id}/`,
        {
          field_of_surgery: fieldOfSurgery,
          name_of_surgery: surgeryName,
          type_of_surgery: typeOfSurgery,
          date,
          main_surgeon: mainSurgeon,
          histology,
          complications,
          histology_description: histologyDescription,
          complications_description: complicationDescription,
          notes1,
          notes2,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Surgeries Updated successfully.");
        navigation.navigate("SurgergeryDcoument");
      } else {
        notifyMessage("Failed to add surgery. Please try again.");
      }
    } catch (error) {
      console.error("Error adding surgery:", error);
      notifyMessage("An error occurred while adding surgery.");
    } finally {
      setIsLoading(false);
    }
  };

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
      Alert.alert(msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <StatusBar style="dark" backgroundColor="white" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <View className="flex flex-row gap-3 my-3 mb-5">
          <TouchableOpacity
            className=" py-1"
            onPress={() => navigation.navigate("ScientificDcoument")}
          >
            <Text style={styles.navButtonText}>Scientific</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border-b-4 border-[#FFDC58] py-1">
            <Text style={styles.navButtonText}>Surgeries</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" py-1"
            onPress={() => navigation.navigate("CoursesDocument")}
          >
            <Text style={styles.navButtonText}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" py-1"
            onPress={() => navigation.navigate("BudgetDcoument")}
          >
            <Text style={styles.navButtonText}>Budget</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>Field of Surgery</Text>
              <TextInput
                style={styles.inputFirst}
                value={fieldOfSurgery}
                onChangeText={setFieldOfSurgery}
              />
            </View>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>Date</Text>
              <CustomDatePicker
                onDateChange={handleDateChange}
                date={date}
                setDate={setDate}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Surgery Name</Text>
            <TextInput
              style={styles.inputWrapper}
              value={surgeryName}
              onChangeText={setSurgeryName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type of Surgery</Text>
            <TextInput
              style={styles.inputWrapper}
              value={typeOfSurgery}
              onChangeText={setTypeOfSurgery}
            />
          </View>

          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>Main Surgeon</Text>
              <View style={{ flexDirection: "row" }}>
                <CustomCheckbox
                  label="Yes"
                  onValueChange={() => setMainSurgeon(true)}
                  value={mainSurgeon === true}
                />
                <View className="ml-3">
                  <CustomCheckbox
                    label="No"
                    onValueChange={() => setMainSurgeon(false)}
                    value={mainSurgeon === false}
                  />
                </View>
              </View>
            </View>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>Histology</Text>
              <View style={{ flexDirection: "row" }}>
                <CustomCheckbox
                  label="Yes"
                  onValueChange={() => setHistology(true)}
                  value={histology === true}
                />
                <View className="ml-3">
                  <CustomCheckbox
                    label="No"
                    onValueChange={() => setHistology(false)}
                    value={histology === false}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>Complications</Text>

              <View className="flex  flex-row ">
                <CustomCheckbox
                  label="Yes"
                  onValueChange={() => setComplications(true)}
                  value={complications === true}
                />
                <View className="ml-3">
                  <CustomCheckbox
                    label="NO"
                    onValueChange={() => setComplications(false)}
                    value={complications === false}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Histology Description</Text>
            <TextInput
              style={styles.textArea}
              multiline
              value={histologyDescription}
              onChangeText={setHistologyDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Complication Description</Text>
            <TextInput
              style={styles.textArea}
              multiline
              value={complicationDescription}
              onChangeText={setComplicationDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes 1</Text>
            <TextInput
              style={styles.textArea}
              multiline
              value={notes1}
              onChangeText={setNotes1}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes 2</Text>
            <TextInput
              style={styles.textArea}
              multiline
              value={notes2}
              onChangeText={setNotes2}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleupdate}>
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
    backgroundColor: "white",
  },
  textArea: {
    height: 80, // Adjust height as needed
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top", // Ensures text starts at the top of the TextInput
    borderRadius: 12,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",

    paddingBottom: 10,
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 100, // width of the image
    height: 80, // height of the image
  },
  Profileimage: {
    width: 120, // width of the image
    height: 120, // height of the image
    borderRadius: 60, // half of width or height for circular shape
    overflow: "hidden", // ensures content stays within the circle
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
  inputWrapperDouble: {
    flexDirection: "column",

    height: 56,
    width: "40%",
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
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
    width: "95%",
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
    width: 119,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
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
  icon: {
    width: 12.5,
    height: 11.5,
  },
  navButtonText: {
    fontWeight: "500",
  },
});

export default EidtSurgeries;

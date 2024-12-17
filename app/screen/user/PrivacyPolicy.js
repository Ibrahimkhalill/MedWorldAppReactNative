import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Switch,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../component/Navbar";

const { height } = Dimensions.get("window"); // Get screen height
const scrollViewHeight = height * 0.8;
const PrivacyPolicy = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [Language, setLaguage] = useState("English");
  const [openDropdown, setOpenDropdown] = useState(null);
  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <SafeAreaView style={styles.safeArea} className="px-5">
      <Navbar navigation_Name={"settings"} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        <View className="mt-10 flex items-center ">
          <Text className="text-[24px] font-bold">Privacy policy</Text>
          <View className="mt-10">
            <Text style={styles.LebelText}>
              Welcome to MedWorld App. By using our services, you agree to abide
              by the terms and conditions outlined below. These terms govern
              your access to and use of MedWorld App’s tools and services, so
              please review them carefully before proceeding. MedWorld App
              provides innovative tools designed to enhance how you capture and
              manage voice recordings. Our services include voice-to-text
              transcription and AI-driven summarization, which are intended for
              lawful, ethical purposes only. You must ensure compliance with
              applicable laws, including obtaining consent from all participants
              when recording conversations. MedWorld App disclaims liability for
              any misuse of its tools.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    backgroundColor: "white",
    height: scrollViewHeight,
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  sentButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 17,
    color: "black",
  },
  sentButtonText: {
    fontSize: 20,
    fontWeight: "400",
  },
  LebelText: {
    fontSize: 14,
    color: "black",
    lineHeight: 30,
    fontWeight: "400",
    textAlign: "left",
  },
  smallText: {
    fontSize: 20,
    color: "black",
    lineHeight: 22,
    marginTop: 15,
  },
  inputContainer: {
    width: "100%",
    marginTop: 30,
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
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 56,
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
  textArea: {
    height: 173, // Adjust height as needed
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top", // Ensures text starts at the top of the TextInput
    borderRadius: 12,
  },
});

export default PrivacyPolicy;

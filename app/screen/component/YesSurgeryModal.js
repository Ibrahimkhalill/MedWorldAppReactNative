import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";
import axiosInstance from "./axiosInstance";
import { useAuth } from "../authentication/Auth";
import { useTranslation } from "react-i18next";

const YesSurgeryModal = ({
  isVisible,
  setIsVisible,
  navigation,
  existingSurgeryNames,
}) => {
  const [surgeryName, setSurgeryName] = useState("");
  const [totalSurgery, setTotalSurgery] = useState("");
  const [surgeryError, setSurgeryError] = useState("");
  const [totalError, setTotalError] = useState("");
  const { token } = useAuth();
  const { t } = useTranslation();
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
      alert(msg);
    }
  };

  const validateAndSave = async () => {
    setTotalError(""); // Clear previous errors
    setSurgeryError(""); // Clear previous errors

    // Validation
    if (!surgeryName.trim()) {
      setSurgeryError(t("surgery_name_error"));
      return;
    }
    const filter = existingSurgeryNames.find(
      (item) =>
        surgeryName.trim().toLowerCase() === item.surgery_name.toLowerCase()
    );
    if (filter) {
      setSurgeryError(t("surgery_name_exit_error"));
      return;
    }

    if (
      !totalSurgery.trim() ||
      isNaN(totalSurgery) ||
      parseInt(totalSurgery) <= 0
    ) {
      setTotalError(t("total_error"));
      return;
    }

    // Save to the server
    try {
      const payload = {
        surgery_name: surgeryName,
        total_surgery: totalSurgery,
      };
      const response = await axiosInstance.post(
        "/percentage-surgery/",
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
    
        closeYesSurgeryModal(); // Close modal
        setSurgeryName("");
        setTotalSurgery("");
        setTotalError("");
        setSurgeryError("");
        navigation.navigate("AddSurgeries", {
          surgery_name: surgeryName,
        });
      } else {
        setError("Failed to save surgery. Please try again.");
      }
    } catch (error) {
      console.error("Error saving surgery:", error);
      setError("An error occurred while saving. Please try again.");
    }
  };

  const closeYesSurgeryModal = () => {
    setIsVisible(false);
    setSurgeryName("");
    setTotalSurgery("");
    setTotalError("");
    setSurgeryError("");
  };

  return (
    <View className=" justify-center items-center ">
      {/* YesSurgeryModal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeYesSurgeryModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          {/* Animated YesSurgeryModal */}
          <Animatable.View
            animation="zoomIn"
            duration={500} // Animation duration (milliseconds)
            easing="ease-out" // Optional easing
            style={styles.container}
          >
            <Text style={styles.header}>{t("surgery_name")}</Text>
            <View className="flex w-full">
              <TextInput
                style={[styles.input, surgeryError ? styles.errorBorder : null]}
                value={surgeryName}
                onChangeText={(text) => {
                  setSurgeryName(text);
                  setSurgeryError(""); // Clear error while typing
                }}
              />
              {surgeryError && (
                <Text style={styles.errorText}>{surgeryError}</Text>
              )}
            </View>
            <Text style={styles.header}>{t("how_many_surgeries")}</Text>
            <View className="flex w-full">
              <TextInput
                style={[styles.input, totalError ? styles.errorBorder : null]}
                value={totalSurgery}
                onChangeText={(text) => {
                  setTotalSurgery(text);
                  setTotalError(""); // Clear error while typing
                }}
                keyboardType="numeric"
              />
              {totalError && <Text style={styles.errorText}>{totalError}</Text>}
            </View>
            <TouchableOpacity
              style={styles.button_first}
              onPress={validateAndSave}
            >
              <Text style={styles.button_text}>{t("save")}</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", // bg-white
    width: "90%", // w-[90%]
    height: 350, // h-[200px]
    padding: 20, // p-5 (padding 5 usually equals 20px)
    borderRadius: 8, // rounded-lg (large border radius)
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 24,
  },
  button_text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },
  button_first: {
    backgroundColor: "#FFDC58",
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 5,
    width: 119,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    height: 56,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  errorBorder: {
    borderColor: "red",
  },
});

export default YesSurgeryModal;

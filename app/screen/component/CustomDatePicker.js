import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";

const CustomDatePicker = ({ onDateChange, date, setDate }) => {
  const [showPicker, setShowPicker] = useState(false);

  // Ensure date is always a Date object
  const currentDate = date instanceof Date ? date : new Date();

  const handleConfirm = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (onDateChange) onDateChange(selectedDate); // Trigger onDateChange callback
    }
    setShowPicker(false);
  };

  const formattedDate = date ? moment(date).format("DD/MM/YYYY") : "";

  return (
    <View>
      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="calendar" size={20} color="gray" />
        <TextInput
          style={[styles.dateTextInput, { color: date ? "#333" : "#bbb" }]} // Text color adjustment
          placeholder="dd/mm/yyyy"
          placeholderTextColor="#bbb"
          value={formattedDate} // Display the formatted date
          editable={false}
          pointerEvents="none" // Prevent direct editing of the input
        />
      </TouchableOpacity>

      {/* Show date picker for both Android and iOS */}
      {showPicker && (
        <>
          {Platform.OS === "android" && (
            <DateTimePicker
              value={currentDate} // Ensure this is always a Date object
              mode="date"
              display="default"
              onChange={handleConfirm}
            />
          )}

          {Platform.OS === "ios" && (
            <Modal transparent={true} animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.iosPickerContainer}>
                  <DateTimePicker
                    value={currentDate} // Ensure this is always a Date object
                    mode="date"
                    display="spinner"
                    onChange={handleConfirm}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowPicker(false)}
                  >
                    <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 55,
    width: "96%",
  },
  dateTextInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  iosPickerContainer: {
    backgroundColor: "white",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2196F3",
    marginTop: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomDatePicker;

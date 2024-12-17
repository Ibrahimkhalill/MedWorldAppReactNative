import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import DateDisplay from "./dateformate";
import axiosInstance from "./axiosInstance";
import { useAuth } from "../authentication/Auth";
const CompeleteDcoument = ({
  data,
  fetchSurgeries,
  navigation,
  subscription,
}) => {
  const { token } = useAuth();
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/surgery/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert("Success", "Surgery deleted successfully.");
        fetchSurgeries(); // Refresh the surgery list after deletion
      }
    } catch (error) {
      console.error("Error deleting surgery:", error);
      Alert.alert("Error", "Could not delete surgery. Please try again later.");
    }
  };
  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the surgery "${item.name_of_surgery}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(item.id), // Pass the id here
        },
      ]
    );
  };

  const handleNavigation = (item) => {
    if (!subscription) {
      Alert.alert(
        "Error",
        "Unable to verify your subscription. Please try again later."
      );
      return;
    }

    // Check Free Trial Status
    if (subscription.free_trial) {
      if (subscription.free_trial) {
        // Free trial is still active
        navigation.navigate("EidtSurgeries", {
          data: item,
        });
        return;
      } else {
        // Free trial has expired
        Alert.alert(
          "Access Denied",
          "Your free trial has expired. Please upgrade your account to access this feature."
        );
        return;
      }
    }

    if (subscription.free_trial_end) {
      // Free trial has expired
      Alert.alert(
        "Access Denied",
        "Your free trial has expired. Please upgrade your account to access this feature."
      );
      return;
    }

    // Check Subscription Status
    if (subscription.is_active) {
      // Subscription is active
      navigation.navigate("EidtSurgeries", {
        data: item,
      });
    } else {
      // Subscription has expired
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
    }
  };
  return (
    <ScrollView
      className="my-2 h-[60vh]"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {data.length > 0 &&
        data.map((item, index) => (
          <View
            className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2"
            key={index}
          >
            <TouchableOpacity
              className="flex flex-row gap-3 items-center"
              onPress={() => handleNavigation(item)}
            >
              <Ionicons name="folder" size={40} color="#FFDC58" />
              <View className="flex ">
                <Text className="text-[14px] mb-1">{item.name_of_surgery}</Text>
                <DateDisplay dateString={item.date} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex flex-row gap-3 items-start"
              onPress={() => confirmDelete(item)}
            >
              <AntDesign name="delete" size={20} color="#E91111" />
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  folderItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  selectedFolder: {
    backgroundColor: "#cce5ff",
  },
  folderText: {
    fontSize: 16,
  },
  selectAllButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  selectAllText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CompeleteDcoument;

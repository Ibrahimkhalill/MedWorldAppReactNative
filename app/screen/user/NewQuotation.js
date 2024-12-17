import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSelector from "../CustomSelecr";

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
} from "react-native";
import { REACT_APP_BASE_URL } from "@env"; // Import your environment variable

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL, // Use the imported environment variable
});
function NewQuotation({ navigation }) {
  const [name, setName] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [color, setColor] = useState([]);
  const [Profilecolor, setPrfilecolor] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [discount, setDiscount] = useState("");

  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      const user = await AsyncStorage.getItem("username");
      const roles = await AsyncStorage.getItem("discount");
      setDiscount(roles);
      try {
        const response = await axiosInstance.get(
          `/customer/getAllByWhom?ByWhom=${user}`
        );
        console.log(response.data);
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(
          `/material/getDistinctCategory`
        );
        console.log(response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCustomerData();
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProfileColorData = async () => {
      try {
        const response = await axiosInstance.get(
          `/material/getDistinctColourByCategory?Category=${category}`
        );
        console.log(response.data);
        setColor(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProfileColorData();
  }, [category]);

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
      AlertIOS.alert(msg);
    }
  }

  const handleClikNext = () => {
    if (customerName === "" && category === "" && Profilecolor === "") {
      notifyMessage("Customer,Profile ,Profile Color field is empty");
      return;
    }
    if (category === "" && Profilecolor === "") {
      notifyMessage("Profile ,Profile Color field is empty");
      return;
    }
    if (customerName === "") {
      notifyMessage("Customer, field is empty");
      return;
    }
    if (category === "") {
      notifyMessage("Profile field is empty");
      return;
    }
    if (Profilecolor === "") {
      notifyMessage("Profile Color field is empty");
      return;
    }
    navigation.navigate("WindowDoor", {
      customerName,
      category,
      Profilecolor,
      customerData,
    });
  };
  //delete
  const options = customerData.map((item) => item.Name);
  const options1 = profileData.map((item) => item.Category);
  const options2 = color.map((item) => item.Colour);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View
      style={styles.container}
      className="bg-background  flex-1 justify-center items-center"
    >
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[95vw]  flex items-center justify-center   rounded"
      >
        <View className="flex flex-col items-start">
          <CustomSelector
            label="Customer"
            options={options}
            selectedValue={customerName}
            onSelect={setCustomerName}
            isOpen={openDropdown === "customer"}
            onToggle={(isOpen) => handleToggle(isOpen ? "customer" : null)}
          />
        </View>
        <View className="flex flex-col items-start">
          <CustomSelector
            label="Profile"
            options={options1}
            selectedValue={category}
            onSelect={setCategory}
            isOpen={openDropdown === "profile"}
            onToggle={(isOpen) => handleToggle(isOpen ? "profile" : null)}
          />
        </View>
        <View className="flex items-start p ">
          <Text className="text-sm  font-bold mt-2 mb-2">
            Max Discount : {discount}
          </Text>
        </View>
        <View className="flex flex-col items-Start">
          <CustomSelector
            label="Profile Color"
            options={options2}
            selectedValue={Profilecolor}
            onSelect={setPrfilecolor}
            isOpen={openDropdown === "profileColor"}
            onToggle={(isOpen) => handleToggle(isOpen ? "profileColor" : null)}
          />
        </View>
      </View>
      <View className="flex  items-center justify-center flex-col  mt-2">
        <TouchableOpacity
          className="p-2 w-[150px] h-[50px]  bg-gradient-to-tl shadow-lg rounded-sm flex items-center justify-center"
          style={styles.loginContainer}
          onPress={() => handleClikNext()}
        >
          <Text className="font-semibold text-xl">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  TableContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRow: {
    backgroundColor: "green",
    color: "white", // Change this color to your preferred highlight color
  },
  loginContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  input: {
    height: 40,
    backgroundColor: "white",
    padding: 10,
    shadowOffset: 2,
    borderRadius: 5,
  },
  head: {
    height: 40,
    backgroundColor: "black",
  },
  text: {
    margin: 6,
    width: 100,
    textAlign: "center",
    color: "#fff",
  },
  td: {
    margin: 6,
    width: 100,
    textAlign: "center",
    color: "black",
  },
  row: {
    flexDirection: "row",

    backgroundColor: "#d8d8d8",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  scrollableContent: {
    maxHeight: 250, // Set the max height for the scrollable content
  },
  selectedRowText: {
    color: "#fff",
  },
});

export default NewQuotation;

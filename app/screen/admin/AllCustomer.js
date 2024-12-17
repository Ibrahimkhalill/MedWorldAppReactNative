import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";
import axios from "axios";

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { REACT_APP_BASE_URL } from "@env"; // Import your environment variable

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL, // Use the imported environment variable
});
function AllCustomer({ navigation }) {
  const [customerData, setCustomerData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [id, setId] = useState(null);
  const [visible, setVisible] = useState(true);
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/customer/getAll");
      setCustomerData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableHead = ["ID", "Name", "Phone", "Email", "Address"];
  const tableData = customerData.map((item) => [
    item.id,
    item.Name,
    item.Phone_no,
    item.Email,
    item.Address,
  ]);

  const handleReset = () => {
    setVisible(true);
    setActiveRowIndex(null);
    setId(null);
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
  };
  const handleRowClick = (row, index) => {
    if (activeRowIndex === row[0]) {
      handleReset();
      return;
    }
    const filterRow = customerData.find((data) => data.id === row[0]);

    setVisible(false);
    setId(filterRow.id);
    setActiveRowIndex(row[0]);
    setName(filterRow.Name);
    setPhone(filterRow.Phone_no);
    setEmail(filterRow.Email);
    setAddress(filterRow.Address);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^\+?\d+$/;
    return regex.test(phone);
  };
  const handleEdit = async () => {
    if (name === "" && phone === "" && address === "" && email === "") {
      alert("Please select a row");
      return;
    }

    if (!name || !phone || !address || !email) {
      alert("Some Field are Required");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!validatePhone(phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/customer/updateCustomerTableByID?Name=${name}&Phone_no=${phone}}&Email=${email}&Address=${address}&id=${id}`
      );

      if (response.status === 200) {
        fetchData();
        handleReset();
        alert("Data Edited Successfuly!");
      } else {
        alert("Failed to Edit Data");
      }
    } catch (error) {
      console.error("Error Edit data:", error);
    }
  };
  //delete
  const handleDelete = async () => {
    if (id === null) {
      alert("Please select a row");

      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/customer/deleteCustomerByID?id=${id}`
      );
      if (response.status === 200) {
        fetchData();
        handleReset();
        alert("Data Deleted Successfuly!");
      } else {
        alert("Failed to Delete Data");
      }
    } catch (error) {
      console.error("Error deleted data:", error);
    }
  };
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
      className="bg-background  flex-1 justify-start items-center"
    >
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[330px] flex justify-center items-center rounded"
      >
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[70px] font-bold"> Name</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="customer name"
            onChangeText={(newText) => setName(newText)}
            value={name}
          ></TextInput>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[70px] font-bold">Phone</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="customer phone"
            onChangeText={(newText) => setPhone(newText)}
            value={phone}
          ></TextInput>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[70px] font-bold">Email</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="customer email address"
            onChangeText={(newText) => setEmail(newText)}
            value={email}
          ></TextInput>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[70px] font-bold">Address</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="customer address"
            onChangeText={(newText) => setAddress(newText)}
            value={address}
          ></TextInput>
        </View>
      </View>
      <View className="flex flex-row mt-6">
        <View className="flex items-center justify-center flex-col ">
          <TouchableOpacity
            className="p-2 w-[90px] h-[70px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => handleEdit()}
          >
            <Image
              className="w-[50px] h-[50px]"
              source={require("../../assets/edit.png")}
            />
          </TouchableOpacity>
          <Text className="font-semibold">Edit</Text>
        </View>
        <View className="flex items-center justify-center flex-col ml-2">
          <TouchableOpacity
            className="p-2 w-[90px] h-[70px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => handleDelete()}
          >
            <Image
              className="w-[50px] h-[50px]"
              source={require("../../assets/delete.png")}
            />
          </TouchableOpacity>
          <Text className="font-semibold">Delete</Text>
        </View>
      </View>
      <View style={styles.container} className=" mt-3 w-[330px]">
        <ScrollView horizontal>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#ccc" }}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.scrollableContent}>
              <Table borderStyle={{ borderWidth: 1, borderColor: "#ccc" }}>
                <TableWrapper>
                  {tableData.map((rowData, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRowClick(rowData)}
                      style={[
                        styles.row,
                        activeRowIndex === rowData[0] && styles.selectedRow, // Conditional styling
                      ]}
                    >
                      <Row data={rowData} textStyle={[styles.td]} />
                    </TouchableOpacity>
                  ))}
                </TableWrapper>
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
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
    width: "70%",
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

export default AllCustomer;

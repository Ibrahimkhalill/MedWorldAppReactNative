import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";

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
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL, // Use the imported environment variable
});
function CreateNewUser({ navigation }) {
  const [Data, setData] = useState([]);
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [maxDis, setMaxDis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(false);
  const [passShow, setPassShow] = useState(false);

  const fatchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/userpassword/getAll");

      const res_Data = response.data;
      console.log(res_Data);
      setData(res_Data);
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fatchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create new Customer
  // http://194.233.87.22:1001/api/userPassword/postUserPasswordAndMaxDiscount?username=&password=&max_discount=
  const handleCreateCustomer = async () => {
    if (!userName && !password && !maxDis) {
      alert("Can't leave empty field");
      return;
    }
    if (!userName) {
      alert("Can't leave empty field");
      return;
    }
    if (!password) {
      alert("Can't leave empty field");
      return;
    }
    if (!maxDis) {
      alert("Can't leave empty field");
      return;
    }
    if (Data.some((item) => item.username === userName)) {
      alert("Username already exists");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/userPassword/postUserPasswordAndMaxDiscount?username=${userName}&password=${password}&max_discount=${maxDis}`
      );
      if (response.status === 200) {
        alert("SuccessFully User Created");
        fatchUserData();
        setUserName("");
        setPassword("");
        setMaxDis("");
        setId("");
        setSelectedID(false);
      } else {
        alert("Sorry We Can't Crated New Customer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Customer
  // http://194.233.87.22:1001/api/userpassword/deleteUserPasswordByID?id=

  const handleDeleteCustomer = async () => {
    if (!id) {
      alerting("Please Selected A Row Data");
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `/userpassword/deleteUserPasswordByID?id=${id}`
      );
      if (response.status === 200) {
        alert("Customer Delete SuccessFully");
        fatchUserData();
        setUserName("");
        setPassword("");
        setMaxDis("");
        setId("");
        setSelectedID(false);
      } else {
        alert("Sorry Customer Can't Delete");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Customer
  // http://194.233.87.22:1001/api/userpassword/updateUserPasswordTableByID?username=&password=&max_discount=&id=
  const handleEditCustomer = async () => {
    if (!id) {
      alerting("Please Selected A Row Data");
      return;
    }
    if (!userName && !password && !maxDis) {
      alert("Can't leave empty field");
      return;
    }
    if (!userName) {
      alert("User name required");
      return;
    }
    if (!password) {
      alert("password required");
      return;
    }
    if (!maxDis) {
      alert("Max discount required");
      return;
    }
    try {
      const response = await axiosInstance.put(
        `/userpassword/updateUserPasswordTableByID?username=${userName}&password=${password}&max_discount=${maxDis}&id=${id}`
      );
      if (response.status === 200) {
        alert("Customer Updateded");
        fatchUserData();
        setUserName("");
        setPassword("");
        setMaxDis("");
        setId("");
        setSelectedID(false);
      } else {
        alert("Sorry Customer Can't Edited");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setUserName("");
    setPassword("");
    setMaxDis("");
    setId("");
    setSelectedID(false);
  };

  const handleRowClick = (row) => {
    if (selectedID === row[0]) {
      handleReset();
      return;
    }
    const item = Data.find((data) => data.id === row[0]);
    setSelectedID(item.id);
    setId(item.id);
    setUserName(item.username);
    setPassword(item.password);
    setMaxDis(item.max_discount);
  };

  const tableHead = ["ID", "User Name", "Password", "MaxDiscount"];
  const tableData = Data.map((item) => [
    item.id,
    item.username,
    item.password,
    item.max_discount,
  ]);
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
      <Text className="mt-3 text-2xl font-bold">Create New User</Text>
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[330px] flex justify-center items-center rounded"
      >
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[75px] font-bold">User Name</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="username"
            onChangeText={(newText) => setUserName(newText)}
            value={userName}
          ></TextInput>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[75px] font-bold">Password</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="password"
            onChangeText={(newText) => setPassword(newText)}
            value={password}
          ></TextInput>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[75px] font-bold">Discount</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="maximum discount"
            onChangeText={(newText) => setMaxDis(newText)}
            value={maxDis}
          ></TextInput>
        </View>
      </View>
      <View className="flex flex-row mt-6">
        <View className="flex items-center justify-center flex-col ">
          <TouchableOpacity
            className="p-2 w-[90px] h-[75px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => handleCreateCustomer()}
          >
            <Image
              className="w-[50px] h-[50px]"
              source={require("../../assets/add.png")}
            />
          </TouchableOpacity>
          <Text className="font-semibold">Save</Text>
        </View>
        <View className="flex items-center justify-center flex-col ml-2">
          <TouchableOpacity
            className="p-2 w-[90px] h-[75px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => handleEditCustomer()}
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
            className="p-2 w-[90px] h-[75px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => handleDeleteCustomer()}
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
                        selectedID === rowData[0] && styles.selectedRow, // Conditional styling
                      ]}
                    >
                      <Row data={rowData} textStyle={styles.td} />
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
});

export default CreateNewUser;

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
import CustomSelector from "../CustomSelecr";
import { REACT_APP_BASE_URL } from "@env"; // Import your environment variable
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL, // Use the imported environment variable
});
function VatInstallation({ navigation }) {
  const [vatInstallationData, setVatInstallationData] = useState([]);
  const [vatData, setVatData] = useState([]);
  const [vat, setVat] = useState("");
  const [type, setTYpe] = useState("");
  const [installation, setInstallation] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [id, setId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/installation/getAll");
      setVatInstallationData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally{
      setIsLoading(false)
    }
  };
  const fetchVatData = async () => {
    try {
      const response = await axiosInstance.get("/vat/getAll");
      console.log(response.data);
      setVatData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchVatData();
  }, []);

  const tableHead = ["ID", "Instalation", "Type"];

  const tableData = vatInstallationData.map((item) => [
    item.id,
    item.Installation,
    item.Type,
  ]);

  const handleAdd = async () => {
    if (type === "" && installation === "") {
      toast.warning("Please filup Type and Installation");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/installation/postInstallation?Type=${type}&Installation=${installation}`
      );
      if (response.status === 200) {
        fetchData();
        handleReset();
        toast.success("Installation Add successfully!");
      } else {
        toast.error("Failed to Add Installation ");
      }
    } catch (error) {
      console.error("Error Adding Installation :", error);
    }
  };

  const handleReset = () => {
    setActiveRowIndex(null);
    setTYpe("");
    setInstallation("");
    setId(null);
  };

  const handleRowClick = (row) => {
    if (activeRowIndex === row[0]) {
      handleReset();
      return;
    }
    console.log(row);
    setActiveRowIndex(row[0]);
    setTYpe(row[2]);
    setInstallation(row[1]);
    setId(row[0]);
  };

  const handleUpdateVat = async () => {
    if (vat === "") {
      alert("Please select Vat");
      return;
    }

    const rate = "7%";
    try {
      const response = await axiosInstance.put(
        `/vat/updateVatTableByID?id=${1}&Vat=${rate}`
      );
      if (response.status === 200) {
        fetchVatData();
        setVat("");
        alert("Vat successfully Updated!");
      } else {
        alert("Failed to Updated Vat");
      }
    } catch (error) {
      console.error("Error Updated vat:", error);
    }
  };

  const handleEdit = async () => {
    if (type === "" && installation === "") {
      alert("Please select a row");
      return;
    }

    if (!type || !installation) {
      alert("Some Field is Required!");
      return;
    }
    try {
      const response = await axiosInstance.put(
        `/installation/updateTypeInstallationByID?Type=${type}&Installation=${installation}&id=${id}`
      );
      if (response.status === 200) {
        fetchData();
        handleReset();
        alert("Data Edit Successfuly!");
      } else {
        alert("Failed to Edit Data");
      }
    } catch (error) {
      console.error("Error Edit data:", error);
    }
  };

  const handleDelete = async () => {
    if (id === null) {
      alert("Please select a row");

      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/installation/deleteInstallationByID?id=${id}`
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
      <Text className="mt-2 text-2xl font-bold">
        Currently VAT rate is {vatData[0]?.Vat}
      </Text>
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[330px] flex justify-center items-center rounded"
      >
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Update Vat"
            options={["5%", "7%", "7.5%", "10%", "15%", "20%", "25%"]}
            selectedValue={vat}
            onSelect={setVat}
            isOpen={openDropdown === "vat"}
            onToggle={(isOpen) => handleToggle(isOpen ? "vat" : null)}
          />
        </View>
        <View className="float-right mt-2 ml-16">
          <TouchableOpacity
            onPress={() => handleUpdateVat()}
            className="flex ml-3 items-center justify-end p-2 rounded bg-gray-700 w-[200px]"
          >
            <Text className="text-white">Update VAT</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Type"
            options={["profile", "mosquitoNet", "glass"]}
            selectedValue={type}
            onSelect={setTYpe}
            isOpen={openDropdown === "type"}
            onToggle={(isOpen) => handleToggle(isOpen ? "type" : null)}
          />
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[75px] font-bold mt-2">Installation</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="Installation"
            onChangeText={(onText) => setInstallation(onText)}
            value={installation}
          ></TextInput>
        </View>
      </View>
      <View className="flex flex-row mt-2">
        <View className="flex items-center justify-center flex-col ">
          <TouchableOpacity
            className="p-2 w-[90px] h-[75px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => handleAdd()}
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
            className="p-2 w-[90px] h-[75px] shadow-lg rounded-sm flex items-center"
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
      <View style={styles.container} className=" mt-2 w-[330px]">
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
                      style={styles.row}
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
  dropdownContainer: {
    width: "70%",
    zIndex: 999,
  },
  dropdown: {
    zIndex: 2009,

    // Ensure this has a higher z-index than other content
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownItem: {
    zIndex: 1009,
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
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "69%",
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
    maxHeight: 220, // Set the max height for the scrollable content
  },
});

export default VatInstallation;

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
  baseURL: REACT_APP_BASE_URL,
});
function MosquitoNetting({ navigation }) {
  const [allMosquito, setallMosquito] = useState([]);
  const [selectedTabId, setSelectedTabId] = useState("");
  const [Design, setDesign] = useState("");
  const [Colour, setColour] = useState("");
  const [Price, setPrice] = useState("");
  const [Discount, setDiscount] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  //========= getAllGlassesData================
  const getAlladdMosquitoData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/mosquitonetting/getAll`);
      if (res.status === 200) {
        setallMosquito(res.data);
      } else {
        console.log(`Error while getting all mosquitonetting`);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAlladdMosquitoData();
  }, []);

  // ===================addMosquito================
  const addMosquito = async () => {
    try {
      if (!Design || !Colour || !Price || !Discount) {
        //toast message:

        alert(`One or Many field is empty !`);
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/mosquitonetting/postMosquitoNetting?Design=${Design}&Colour=${Colour}&Price=${Price}&Discount=${Discount}`
        );
        if (res.status === 200) {
          getAlladdMosquitoData();
          setDesign("");
          setColour("");
          setPrice("");
          setDiscount("");
          //toast message:

          alert(`MosquitoNetting Added successfully`);
        } else {
          console.log(`Error while adding MosquitoNetting`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReset = () => {
    setSelectedTabId("");
    setDesign("");
    setColour("");
    setPrice("");
    setDiscount("");
  };

  // ===========handleClickTableDataShowInputField=================
  const handleRowClick = (mosquito) => {
    if (selectedTabId === mosquito[0]) {
      handleReset();
      return;
    }
    console.log(mosquito);
    setSelectedTabId(mosquito[0]);
    setDesign(mosquito[1]);
    setColour(mosquito[2]);
    setPrice(mosquito[3]);
    setDiscount(mosquito[4]);
  };

  //========= editMosquito================
  const editMosquito = async () => {
    try {
      if (!selectedTabId) {
        //toast message:
        if (toastId) {
          toast.dismiss(toastId);
        }
        alert(`MosquitoNetting is not selected !`);

        return;
      }
      if (!Design || !Colour || !Price || !Discount) {
        alert(`Some Field Is Required !`);

        return;
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/mosquitonetting/updateMosquitoNettingTableByID?Design=${Design}&Colour=${Colour}&Price=${Price}&Discount=${Discount}&id=${selectedTabId}`
        );

        if (res.status === 200) {
          getAlladdMosquitoData();
          setSelectedTabId("");
          setDesign("");
          setColour("");
          setPrice("");
          setDiscount("");
          //toast message:

          alert(`MosquitoNetting updated successfully`, {
            duration: 1000,
          });
        } else {
          console.log(`Error while updating MosquitoNetting`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //========= deleteMosquito================
  const deleteMosquito = async () => {
    try {
      if (!selectedTabId) {
        //toast message:

        alert(`MosquitoNetting is not selected !`);
      } else {
        const res = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/mosquitonetting/deleteUserPasswordByID?id=${selectedTabId}`
        );

        if (res.status === 200) {
          getAlladdMosquitoData();
          setSelectedTabId("");
          setDesign("");
          setColour("");
          setPrice("");
          setDiscount("");
          //toast message:

          alert(`MosquitoNetting deleted successfully`);
        } else {
          console.log(`Error while deleted MosquitoNetting`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const tableHead = ["ID", "Design", "Color", "Price", "Discount"];

  const tableData = allMosquito.map((item) => [
    item.id,
    item.Design,
    item.Colour,
    item.Price,
    item.Discount,
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
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[330px] flex justify-center items-center rounded"
      >
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Design"
            options={["Opening", "Sliding", "Folding"]}
            selectedValue={Design}
            onSelect={setDesign}
            isOpen={openDropdown === "design"}
            onToggle={(isOpen) => handleToggle(isOpen ? "design" : null)}
          />
        </View>
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Color"
            options={["Non", "White", "Black", "Two tone"]}
            selectedValue={Colour}
            onSelect={setColour}
            isOpen={openDropdown === "color"}
            onToggle={(isOpen) => handleToggle(isOpen ? "color" : null)}
          />
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[75px] font-bold">Price</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="Enter price"
            onChangeText={(onText) => setPrice(onText)}
            value={Price}
          ></TextInput>
        </View>
        <View className="flex flex-row items-center">
          <Text className="text-sm w-[75px] font-bold">Discount</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="Enter discount"
            onChangeText={(onText) => setDiscount(onText)}
            value={Discount}
          ></TextInput>
        </View>
      </View>
      <View className="flex flex-row mt-3">
        <View className="flex items-center justify-center flex-col ">
          <TouchableOpacity
            className="p-2 w-[90px] h-[75px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => addMosquito()}
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
            onPress={() => editMosquito()}
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
            onPress={() => deleteMosquito()}
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
                        selectedTabId === rowData[0] && styles.selectedText,
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
  dropdownContainer: {
    width: "70%",
    zIndex: 999,
  },
  dropdown: {
    zIndex: 2009,

    // Ensure this has a higher z-index than other content
  },
  selectedText: {
    backgroundColor: "green",
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
    maxHeight: 250, // Set the max height for the scrollable content
  },
});

export default MosquitoNetting;

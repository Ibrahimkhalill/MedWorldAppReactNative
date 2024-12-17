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
function Glass({ navigation }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [allGlasses, setAllGlasess] = useState([]);
  const [selectedTabId, setSelectedTabId] = useState("");
  const [Glass, setGlass] = useState("");
  const [Colour, setColour] = useState("");
  const [Price, setPrice] = useState("");
  const encodedGlass = encodeURIComponent(Glass);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const getAllGlassesData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/glass/getAll`);
      if (res.status === 200) {
        console.log(res.data);
        setAllGlasess(res.data);
      } else {
        console.log(`Error while getting all glass data`);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllGlassesData();
  }, []);
  const tableHead = ["ID", "Glass", "Color", "Price"];

  const tableData = allGlasses.map((item) => [
    item.id,
    item.Glass,
    item.Colour,
    item.Price,
  ]);
  // ===================addGlasses================
  const addGlasses = async () => {
    try {
      if (!Glass || !Colour || !Price) {
        //toast message:

        alert(`One or Many field is empty !`);
      } else {
        const res = await axiosInstance.post(
          `/glass/postGlass?Glass=${encodedGlass}&Colour=${Colour}&Price=${Price}`
        );
        if (res.status === 200) {
          getAllGlassesData();
          handleReset();
          //toast message:

          alert(`Glass Added successfully`);
        } else {
          console.log(`Error while adding glass`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReset = () => {
    setSelectedTabId("");
    setGlass("");
    setColour("");
    setPrice("");
  };

  // ===========handleClickTableDataShowInputField=================
  const handleRowClick = (glass) => {
    if (selectedTabId === glass[0]) {
      handleReset();
      return;
    }
    console.log(glass);
    setSelectedTabId(glass[0]);
    setGlass(glass[1]);
    setColour(glass[2]);
    setPrice(glass[3]);
  };
  //========= editGlasses================
  const editGlasses = async () => {
    try {
      if (!selectedTabId) {
        alert(`Glass is not selected !`);

        return;
      }
      if (!Glass || !Colour || !Price) {
        alert(`Some Feild Are Required !`);

        return;
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/glass/updateGlassTableByID?id=${selectedTabId}&Glass=${encodedGlass}&Colour=${Colour}&Price=${Price}`
        );

        if (res.status === 200) {
          getAllGlassesData();
          setSelectedTabId("");
          setGlass("");
          setColour("");
          setPrice("");
          //toast message:

          alert(`Glass updated successfully`);
        } else {
          console.log(`Error while updating glass`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //========= deleteGlass================
  const deleteGlass = async () => {
    try {
      if (!selectedTabId) {
        //toast message:

        alert(`Glass is not selected !`);
      } else {
        const res = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/glass/deleteUserPasswordByID?id=${selectedTabId}`
        );

        if (res.status === 200) {
          getAllGlassesData();
          setSelectedTabId("");
          setGlass("");
          setColour("");
          setPrice("");
          //toast message:

          alert(`Glass deleted successfully`);
        } else {
          console.log(`Error while deleting glass`);
        }
      }
    } catch (error) {
      console.log(error.message);
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
      <Text className="mt-2 text-2xl font-bold">Glass Setup</Text>
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[330px] flex justify-center items-center rounded"
      >
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Glass Thickness"
            options={[
              "6mm",
              "8mm",
              "10mm",
              "12mm",
              "5+5mm laminated",
              "6+6mm laminated",
              "5+5mm temper laminated",
              "6+6mm temper laminated",
              "5-8-5 insulated",
              "5-8-6 insulated",
            ]}
            selectedValue={Glass}
            onSelect={setGlass}
            isOpen={openDropdown === "thickness"}
            onToggle={(isOpen) => handleToggle(isOpen ? "thickness" : null)}
          />
        </View>
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Glass Color"
            options={["cllear", "green", "black"]}
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
      </View>
      <View className="flex flex-row mt-6">
        <View className="flex items-center justify-center flex-col ">
          <TouchableOpacity
            className="p-2 w-[90px] h-[75px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => addGlasses()}
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
            onPress={() => editGlasses()}
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
            onPress={() => deleteGlass()}
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
  selectedText: {
    backgroundColor: "green",
  },
  dropdownContainer: {
    width: "70%",
    zIndex: 999,
  },
  dropdown: {
    zIndex: 2009,

    // Ensure this has a higher z-index than other content
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

export default Glass;

import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";
// import { materials, categories, profileColour } from "../Data";
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
  Alert,
} from "react-native";
import CustomSelector from "../CustomSelecr";
import { REACT_APP_BASE_URL } from "@env"; // Import your environment variable
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL, // Use the imported environment variable
});

function Profile({ navigation }) {
  const [selectedTabId, setSelectedTabId] = useState(null);
  const [Material, setMaterial] = useState("");
  const [Category, setCategory] = useState("");
  const [Colour, setColour] = useState("");
  const [Price, setPrice] = useState("");
  const [Discount, setDiscount] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [allProfileData, setAllProfileData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  const getAllProfileData = async () => {
    try {
      const res = await axiosInstance.get(`/material/getAll`);
      console.log(res.data);
      if (res.status === 200) {
        setAllProfileData(res.data);
      } else {
        console.log(`Error while getting all material/profile`);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    getAllProfileData();
  }, []);

  const tableHead = [
    "ID",
    "Material",
    "Category",
    "Color",
    "Price",
    "Discount",
  ];
  const tableData = allProfileData.map((item) => [
    item.id,
    item.Material,
    item.Category,
    item.Colour,
    item.Price,
    item.MaxDiscount,
  ]);

  // ===================addMosquito================
  const addProfile = async () => {
    try {
      if (!Material || !Category || !Colour || !Price || !Discount) {
        //toast message:

        alert(`One or Many field is empty !`);
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/material/postMaterial?Material=${Material}&Category=${Category}&Colour=${Colour}&Price=${Price}&MaxDiscount=${Discount}`
        );

        if (res.status === 200) {
          getAllProfileData();
          setMaterial("");
          setCategory("");
          setColour("");
          setPrice("");
          setDiscount("");
          //toast message:

          alert(`Material Added successfully`);
        } else {
          console.log(`Error while adding  material/profile`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReset = () => {
    setSelectedTabId("");
    setMaterial("");
    setCategory("");
    setColour("");
    setPrice("");
    setDiscount("");
  };

  // ===========handleClickTableDataShowInputField=================
  const handleRowClick = (rowData) => {
    if (selectedTabId === rowData[0]) {
      handleReset();
      return;
    }
    setSelectedTabId(rowData[0]);
    setMaterial(rowData[1]);
    setCategory(rowData[2]);
    setColour(rowData[3]);
    setPrice(rowData[4]);
    setDiscount(rowData[5]);
  };
  //========= editMosquito================
  const editProfile = async () => {
    try {
      if (!selectedTabId) {
        //toast message:
        alert(`Please select a row !`);
        return;
      }
      if (!Material || !Category || !Colour || !Price || !Discount) {
        alert(`Some Field Are Required !`);
        return;
      } else {
        const res = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/material/updateMaterialTableByID?Material=${Material}&Category=${Category}&Colour=${Colour}&Price=${Price}&MaxDiscount=${Discount}&id=${selectedTabId}`
        );

        if (res.status === 200) {
          getAllProfileData();
          handleReset();
          //toast message:

          alert(`Profile updated successfully`);
        } else {
          console.log(`Error while updating  material/profile`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //========= deleteMosquito================
  const deleteProfile = async () => {
    try {
      if (!selectedTabId) {
        //toast message:

        alert(`Profile is not selected !`);
      } else {
        const res = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/material/deleteMaterialByID?id=${selectedTabId}`
        );

        if (res.status === 200) {
          getAllProfileData();
          handleReset();
          //toast message:

          alert(`Profile deleted successfully`);
        } else {
          console.log(`Error while deleting  material/profile`);
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
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[330px] flex justify-center items-center rounded"
      >
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Material"
            options={[
              "sliding window",
              "sliding door",
              "sliding window with fix",
              "sliding door with fix",
              "opening window",
              "opening door",
              "push opening",
              "opening window with fix",
              "fix window",
              "folding",
            ]}
            selectedValue={Material}
            onSelect={setMaterial}
            isOpen={openDropdown === "material"}
            onToggle={(isOpen) => handleToggle(isOpen ? "material" : null)}
          />
        </View>
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Category"
            options={["upvc", "Thai Aluminium", "Euro Aluminium"]}
            selectedValue={Category}
            onSelect={setCategory}
            isOpen={openDropdown === "category"}
            onToggle={(isOpen) => handleToggle(isOpen ? "category" : null)}
          />
        </View>
        <View className="flex flex-row items-center">
          <CustomSelector
            label="Color"
            options={[
              "black",
              "white",
              "sahara",
              "wood design",
              "normal colour",
            ]}
            selectedValue={Colour}
            onSelect={setColour}
            isOpen={openDropdown === "color"}
            onToggle={(isOpen) => handleToggle(isOpen ? "color" : null)}
          />
        </View>
        <View className="flex flex-row items-center">
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="enter price"
            onChangeText={(newText) => setPrice(newText)}
            value={Price}
          ></TextInput>
        </View>
        <View className="flex flex-row items-center">
          <Text style={styles.label}>Discount</Text>
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="maximum discount"
            onChangeText={(newText) => setDiscount(newText)}
            value={Discount}
          ></TextInput>
        </View>
      </View>
      <View className="flex flex-row mt-3">
        <View className="flex items-center justify-center flex-col ">
          <TouchableOpacity
            className="p-2 w-[90px] h-[70px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => addProfile()}
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
            className="p-2 w-[90px] h-[70px] shadow-lg rounded-sm flex items-center"
            style={styles.loginContainer}
            onPress={() => editProfile()}
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
            onPress={() => deleteProfile()}
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
                      <Row
                        data={rowData}
                        style={styles.row}
                        textStyle={styles.td}
                      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedText: {
    backgroundColor: "green",
  },
  TableContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    margin: 10,
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
    fontSize: 14,
    fontWeight: "bold",
    width: 76,
    marginTop: 10,
  },
  input: {
    height: 40,
    width: "68%",
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

    // backgroundColor: "gray",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  scrollableContent: {
    maxHeight: 200, // Set the max height for the scrollable content
  },
});

export default Profile;

import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

import QuotationPDF from "../QuotationPDF";
import {
  ToastAndroid,
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
function QuotationReport({ navigation }) {
  const [quotationNo, setQuotationNo] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [Data, setData] = useState([]);
  const [filterdData, setFilteredData] = useState([]);
  const [uniqueQuotationNos, setUniqueQuotationNos] = useState([]);
  const [uniqueCustomerIds, setUniqueCustomerIds] = useState([]);
  const [FilterItemData, setFiltereItemData] = useState([]);
  const [selectedID, setSelectedID] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [CustomerData, setCustomerData] = useState([]);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });

  const componentRef = useRef();

  const fatchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("quotationClone/getAll");

      const res_Data = response.data;
      console.log("d", res_Data);
      setData(res_Data);
      setFilteredData([...new Set(res_Data)]);

      const uniqueQuotationNos = [
        ...new Set(res_Data.map((item) => item.Quotation_no)),
      ];
      setUniqueQuotationNos(uniqueQuotationNos);

      const uniqueCustomerIds = [
        ...new Set(res_Data.map((item) => item.Customer_id)),
      ];
      setUniqueCustomerIds(uniqueCustomerIds);
      setIsLoading(false);
      //   setFiltereData([...new Set(res_Data)]);
      setQuotationNo("");
      setCustomerId("");
      setSelectedID(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowAll = () => {
    fatchUserData();
    setButtonVisible(false);
  };

  useEffect(() => {
    fatchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      AlertIOS.alert.alert(msg);
    }
  }
  // Quotation search
  const handleFilterQuotation = () => {
    if (!quotationNo || typeof quotationNo !== "string") {
      if (!quotationNo) {
        Alert.alert("Warning!", "Do not field empty");
      }
      return;
    }
    const filterData = filterdData.filter(
      (item) => item.Quotation_no === quotationNo
    );
    if (filterData.length === 0) {
      Alert.alert("Warning!", "Input data not valid");
    }
    setData(filterData);
    setButtonVisible(true);
  };

  // Customer search
  const handleFilterCustomer = () => {
    if (!customerId || typeof customerId !== "string") {
      if (!customerId) {
        Alert.alert("Warning!", "Do not field empty");
      }
      return;
    }
    const filterData = filterdData.filter(
      (item) => item.Customer_id === customerId
    );
    if (filterData.length === 0) {
      Alert.alert("Warning!", "Input data not valid");
    }
    setData(filterData);
    setButtonVisible(false);
  };

  const hendleDataInputField = (item) => {
    if (item.id === selectedID) {
      setSelectedID("");
      return;
    }
    setSelectedID(item.id);
  };

  const FilterItemsData = (Data) => {
    // Ensure Data is always an array
    if (!Array.isArray(Data)) {
      Data = [Data];
    }

    const filteredDataArray = [];

    Data.forEach((item) => {
      // Ensure Item exists and is a string
      if (item && typeof item.Item === "string") {
        // const lines = item.Item.split("\n");
        const lines = item.Item.trim().split(/\n+/);
        const material = lines.shift();

        const extractedData = {};
        lines.forEach((line) => {
          const [key, value] = line.split(" : ");
          if (key && value) {
            const formattedKey = key.trim().replace(/\s+/g, "_"); // Replace spaces with underscores
            extractedData[formattedKey] = value.trim();
          }
        });

        filteredDataArray.push({
          material,
          ...extractedData,
        });
      }
    });

    return filteredDataArray;
  };

  useEffect(() => {
    if (Data.length > 0) {
      const filteredData = FilterItemsData(Data);
      setFiltereItemData(filteredData);
      console.log("filteredData", filteredData);
    }
  }, [Data]);

  const fatchDataItems = FilterItemData.map((item) => ({
    totalHeight: item.Total_Height,
    totalWidth: item.Total_Width,
    material: item.material,
    with_Glass_Color: item.with_Glass_Color,
    with_Glass_Thickness: item.with_Glass_Thickness,
    with_MosquitoNet_Color: item.with_MosquitoNet_Color,
    with_MosquitoNet_Design: item.with_MosquitoNet_Design,
  }));
  console.log("fatchDataItems", fatchDataItems);

  const materialData = [];
  fatchDataItems.forEach((item) => {
    console.log("Material:", item.material);
    materialData.push(item.material); // Store material property in another variable
  });

  const [vatData, setVatData] = useState([]);
  const [ProfileInstalltionData, setProfileInstalltionData] = useState([]);
  const [MosquitoInstalltionData, setMosquitoInstalltionData] = useState([]);
  const [GlassInstalltionData, setGlassInstalltionData] = useState([]);
  useEffect(() => {
    const fetchVatData = async () => {
      try {
        const response = await axiosInstance.get(`/vat/getAll`);

        setVatData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchProfileInstalltionData = async () => {
      try {
        const response = await axiosInstance.get(
          `/installation/getInstallationByTypeProfile`
        );

        setProfileInstalltionData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // glass installtion
    const fetchMosQuitoInstalltionData = async () => {
      try {
        const response = await axiosInstance.get(
          `/installation/getInstallationByTypeMosquitoNet`
        );

        setMosquitoInstalltionData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchGlassInstalltionData = async () => {
      try {
        const response = await axiosInstance.get(
          `/installation/getInstallationByTypeGlass`
        );

        setGlassInstalltionData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchCustomerData = async () => {
      const user = await AsyncStorage.getItem("username");
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
    fetchCustomerData();
    fetchVatData();
    fetchProfileInstalltionData();
    fetchGlassInstalltionData();
    fetchMosQuitoInstalltionData();
  }, []);

  const totalPriceSum = Data.reduce(
    (accumulator, currentValue) =>
      accumulator + parseFloat(currentValue.Price || 0),
    0
  );
  const installation =
    parseFloat(MosquitoInstalltionData[0]?.Installation) +
    parseFloat(ProfileInstalltionData[0]?.Installation) +
    (parseFloat(GlassInstalltionData[0]?.Installation) || 0);
  const vatRate = vatData[0]?.Vat;

  const TotalInstallation = Data.reduce((accumulator, currentValue) => {
    const area =
      parseFloat(currentValue.Height) * parseFloat(currentValue.Width);
    const TotalArea = area < 1000000 ? 1000000 : area;
    return (
      accumulator +
      (TotalArea * parseInt(currentValue.Quantity) * installation) / 1000000
    );
  }, 0);

  const vatAmount = (
    (totalPriceSum + TotalInstallation) *
    (parseFloat(vatRate) / 100)
  ).toFixed(2);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const tableHead = ["ID", "Quotation No", "Customer Id", "Item", "ByWhom"];
  const tableData = Data.map((item) => [
    item.id,
    item.Quotation_no,
    item.Customer_id,
    item.Item,
    item.byWhom,
  ]);
  const generatePdf = async () => {
    try {
      const htmlContent = componentRef.current.generateHtml();

      // Request media library permissions
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to access media library is required!"
        );
        return;
      }

      // Request notification permissions
      const { status: notifStatus } =
        await Notifications.requestPermissionsAsync();
      if (notifStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to send notifications is required!"
        );
        return;
      }

      // Generate the PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Create a new file path in the Downloads directory
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share PDF",
        });
      } else {
        Alert.alert(
          "Sharing not available",
          "Sharing is not available on this device."
        );
      }
      // Show a notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Download Complete",
          body: `Your PDF has been Sucessfully downloaded`,
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF");
      console.error("Error generating PDF:", error);
    }
  };
  console.log(Data);
  return (
    <View
      style={styles.container}
      className="bg-background  w-[100vw] flex-1 justify-start items-center"
    >
      <View
        style={styles.loginContainer}
        className=" p-5 mt-2 pt-3 w-[97%] flex justify-center items-center rounded"
      >
        <View className="flex flex-row items-center justify-center">
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="quotation no"
            onChangeText={(newText) => setQuotationNo(newText)}
            value={quotationNo}
            keyboardType="numeric"
          ></TextInput>
          <TouchableOpacity
            onPress={() => handleFilterQuotation()}
            className="bg-black flex mt-2 ml-2 rounded items-center justify-center w-[70] h-[40]"
          >
            <Text className="text-white">Search</Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center">
          <TextInput
            style={styles.input}
            className="mt-2 "
            placeholder="customer id"
            onChangeText={(newText) => setCustomerId(newText)}
            value={customerId}
            keyboardType="numeric"
          ></TextInput>
          <TouchableOpacity
            onPress={() => handleFilterQuotation()}
            className="bg-black flex mt-2 ml-2 rounded items-center justify-center w-[70] h-[40] mr-1"
          >
            <Text className="text-white">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row mt-6">
        <View style={{ display: "none" }}>
          <QuotationPDF
            ref={componentRef}
            windowData={Data}
            vat={vatAmount}
            installation={TotalInstallation}
            customerName={Data[0]?.Customer_id}
            quotationNo={quotationNo}
            totalPrice={totalPriceSum.toFixed(2)}
            customerData={CustomerData}
          />
        </View>
        {buttonVisible && (
          <View className="flex items-center justify-center flex-col ">
            <TouchableOpacity
              className="p-2 w-[90px] h-[70px] shadow-lg rounded-sm flex items-center justify-center"
              style={styles.loginContainer}
              onPress={() => generatePdf()}
            >
              <FontAwesome5 name="file-pdf" size={43} color="black" />
            </TouchableOpacity>
            <Text className="font-semibold">Genarate PDF</Text>
          </View>
        )}
        <View className="flex items-center justify-center flex-col ml-2">
          <TouchableOpacity
            className="p-2 w-[90px] h-[70px] shadow-lg rounded-sm flex items-center justify-center"
            style={styles.loginContainer}
            onPress={() => handleShowAll()}
          >
            <MaterialIcons name="slideshow" size={50} color="black" />
          </TouchableOpacity>
          <Text className="font-semibold">Show All</Text>
        </View>
      </View>
      <View style={styles.container} className=" mt-3 w-[98vw]">
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
                    <TouchableOpacity key={index} style={styles.row}>
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
    width: "78%",
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
    maxHeight: 350, // Set the max height for the scrollable content
  },
  selectedRowText: {
    color: "#fff",
  },
});

export default QuotationReport;

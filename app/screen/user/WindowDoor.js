import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Selector from "../windowDoorSelect";
import * as Print from "expo-print";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as WebBrowser from "expo-web-browser";
import * as Sharing from "expo-sharing";
import AntDesign from "@expo/vector-icons/AntDesign";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { REACT_APP_BASE_URL } from "@env"; // Import your environment variable
import QuotationPDF from "../QuotationPDF";

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL, // Use the imported environment variable
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function WindowDoor({ route, navigation }) {
  const [visible, setVisible] = useState([]);
  const [visibleContent, setVisibleContent] = useState(false);
  const [visibleSave, setVisibleSave] = useState(false);
  const [vat, setVatData] = useState([]);
  const [ProfileInstalltionData, setProfileInstalltionData] = useState([]);
  const [GlassInstalltionData, setGlassInstalltionData] = useState([]);
  const [MosquitoInstalltionData, setMosquitoInstalltionData] = useState([]);
  const [Material, setMaterial] = useState("");
  const [MosquitoNet_Design, setMosquitoNet_Design] = useState("");
  const [Mosquito_Net_Color, setMosquito_Net_Color] = useState("");
  const [Glass_Color, setGlass_Color] = useState("");
  const [Glass_Thickness, setGlass_Thickness] = useState("");
  const [MaterialPrice, setMaterialPrice] = useState([]);
  const [MosquitoNetDesignPrice, setMosquitoNetDesignPrice] = useState([]);
  const [GlassPrice, setGlassPrice] = useState([]);
  const [design, setDesign] = useState([]);
  const [MosquitoNetColor, setMosquitoNetColor] = useState([]);
  const [MosquitoNetDesign, setMosquitoNetDesign] = useState([]);
  const [glassthickness, setGlassThickness] = useState([]);
  const [glassColor, setGlassColor] = useState([]);
  const [quotationNo, setQuotationNo] = useState([]);
  const [pdfVisible, setPdfVisible] = useState(true);
  const [saveVisible, setSaveVisible] = useState(false);
  const componentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [discount, setDiscount] = useState("");
  const { customerName, category, Profilecolor, customerData } = route.params;

  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

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

  const [windowData, setWindowData] = useState([]);
  const handleAddWindow = () => {
    // Add a new window object to windowData
    setWindowData((prevWindowData) => {
      const newWindowData = [
        ...prevWindowData,
        {
          Material: "",
          MosquitoNet_Design: "",
          Mosquito_Net_Color: "",
          Glass_Color: "",
          Glass_Thickness: "",
          Height: "",
          Width: "",
          Quantity: "",
          Total_Price: "",
          Price_After_discount: "",
        },
      ];
      return newWindowData;
    });
  };

  const handleVisible = () => {
    setVisibleContent(true);
    setVisible((prevVisibleStates) => [...prevVisibleStates, true]);
    handleAddWindow();
  };

  const handleVisibleSave = () => {
    if (!visibleContent) {
      notifyMessage("Plaese Setup window Door");
      return;
    }
    if (windowData.length === 0) {
      notifyMessage("Please filup all field");
      return;
    }
    const hasEmptyFields = windowData.some(
      (item) =>
        item.Material === "" ||
        item.Glass_Color === "" ||
        item.Glass_Thickness === "" ||
        item.Height === "" ||
        item.Width === "" ||
        item.Total_Price === "" ||
        item.Price_After_discount === ""
    );

    // If any field is empty, display an error message and return
    if (hasEmptyFields && Material !== "fix window") {
      notifyMessage("Please fill in all fields before saving.");
      return;
    }
    setVisibleSave(true);

    // toast("This Feacture will be updated later");
  };
  const fetchQuotationData = async () => {
    try {
      // Send a GET request to fetch the last quotation number
      const response = await axiosInstance.get(
        `quotationClone/getLastQuotationNo`
      );

      // Extract the quotation number from the response data
      const currentQuotationNo = response.data[0][0].Quotation_no;

      // Increment the quotation number by 1
      const nextQuotationNo = parseInt(currentQuotationNo) + 1;

      // Set the next quotation number to the state variable
      setQuotationNo(nextQuotationNo);
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error("Error fetching data:", error);
    }
  };

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
    const fetchGlassInstalltionData = async () => {
      try {
        const response = await axiosInstance.get(
          `/installation/getInstallationByTypeMosquitoNet`
        );

        setMosquitoInstalltionData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchMosQuitoInstalltionData = async () => {
      try {
        const response = await axiosInstance.get(
          `/installation/getInstallationByTypeGlass`
        );

        setGlassInstalltionData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVatData();
    fetchProfileInstalltionData();
    fetchGlassInstalltionData();
    fetchMosQuitoInstalltionData();
    fetchQuotationData();
  }, []);

  useEffect(() => {
    const fetchMaterialPrice = async () => {
      try {
        const response = await axiosInstance.get(
          `/material/getPriceAndMaxDiscountByMaterialCategoryColour?Material=${Material}&Category=${category}&Colour=${Profilecolor}`
        );
        console.log("material", response.data);
        setMaterialPrice(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMosquitoPrice = async () => {
      try {
        const response = await axiosInstance.get(
          `/mosquitonetting/getPriceFromMosquitoNettingByDesignColour?Design=${MosquitoNet_Design}&Colour=${Mosquito_Net_Color}`
        );
        console.log("mos", response.data);
        setMosquitoNetDesignPrice(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchGlassPrice = async () => {
      try {
        const response = await axiosInstance.get(
          `/glass/getDistinctPriceFromGlassTableByGlassAndColour?Glass=${Glass_Thickness}&Colour=${Glass_Color}`
        );
        console.log("response.data", response.data[0]);
        setGlassPrice(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMaterialDesignFetch = async () => {
      try {
        const response = await axiosInstance.get(
          `/material/getDistinctMaterialFromMaterialTableByCategory?Category=${category}`
        );

        setDesign(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMosQuitoNetDesign = async () => {
      try {
        const response = await axiosInstance.get(
          `/mosquitonetting/getDistinctDesignFromMosquitoNetting`
        );

        setMosquitoNetDesign(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMosquitoColor = async () => {
      try {
        const response = await axiosInstance.get(
          `/mosquitonetting/getDistinctColourFromMosquitoNetting`
        );

        setMosquitoNetColor(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchGlassColor = async () => {
      try {
        const response = await axiosInstance.get(
          `/glass/getDistinctColourFromGlassTable`
        );

        setGlassColor(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchGlassThickness = async () => {
      try {
        const response = await axiosInstance.get(
          `http://194.233.87.22:1001/api/glass/getDistinctGlassFromGlassTable`
        );

        setGlassThickness(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMosQuitoNetDesign();
    fetchMaterialPrice();
    fetchMosquitoPrice();
    fetchGlassPrice();
    fetchMaterialDesignFetch();
    fetchGlassColor();
    fetchGlassThickness();
    fetchMosquitoColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    Glass_Color,
    Glass_Thickness,
    Material,
    MosquitoNet_Design,
    Mosquito_Net_Color,
    Profilecolor,
    category,
  ]);

  const handleChange = (index, field, value) => {
    const updatedData = [...windowData];
    updatedData[index][field] = value;

    // Calculate Total_Price for the specific window
    let sum =
      parseFloat(MaterialPrice[0]?.Price || 0) +
        parseFloat(MosquitoNetDesignPrice[0]?.Price) ||
      0 + parseFloat(GlassPrice[0]?.Price || 0);

    let area =
      parseFloat(updatedData[index].Height) *
      parseFloat(updatedData[index].Width);

    if (area < 1000000) {
      let Total = (sum * 1000000) / 1000000;
      updatedData[index].Total_Price =
        parseFloat(Total) * parseInt(updatedData[index].Quantity);
      updatedData[index].Price_After_discount = parseFloat(
        updatedData[index].Total_Price -
          (parseFloat(MaterialPrice[0]?.MaxDiscount) * 1000000) / 1000000
      ).toFixed(2);
    } else {
      let Total = (sum * area) / 1000000;
      console.log(Total);
      updatedData[index].Total_Price =
        parseFloat(Total) * parseInt(updatedData[index].Quantity);
      updatedData[index].Price_After_discount = parseFloat(
        updatedData[index].Total_Price -
          (parseFloat(MaterialPrice[0]?.MaxDiscount) *
            parseFloat(updatedData[index].Height) *
            parseFloat(updatedData[index].Width)) /
            1000000
      ).toFixed(2);
    }

    setWindowData(updatedData);
  };

  const totalPriceSum = windowData.reduce(
    (accumulator, currentValue) =>
      accumulator + parseFloat(currentValue.Price_After_discount || 0),
    0
  );
  const installation =
    parseFloat(MosquitoInstalltionData[0]?.Installation) +
    parseFloat(ProfileInstalltionData[0]?.Installation) +
    (parseFloat(GlassInstalltionData[0]?.Installation) || 0);
  const vatRate = vat[0]?.Vat;

  const TotalInstallation = windowData.reduce((accumulator, currentValue) => {
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

  ///save data

  const handleSaveBulk = async () => {
    const Bywhom = await AsyncStorage.getItem("username");
    const newTransactions = windowData.map((item) => {
      return {
        Quotation_no: quotationNo.toString(), // Convert to string
        Customer_id: customerName, // Assuming customerName is available
        Item: `${item.Material}\nWith MosquitoNet Design: ${item.MosquitoNet_Design}\nWith MosquitoNet Color: ${item.Mosquito_Net_Color}\nWith Glass Color: ${item.Glass_Color}\nWith Glass Thickness: ${item.Glass_Thickness}\nTotal Height: ${item.Height}\nTotal Width: ${item.Width}`, // Concatenate strings and add line breaks
        Quantity: item.Quantity.toString(),
        Price: item.Price_After_discount.toString(), // Convert to string
        Total_Price: item.Total_Price,
        byWhom: Bywhom, // Assuming Bywhom is available
        Material: item.Material,
        MosquitoNet_Design: item.MosquitoNet_Design,
        Mosquito_Net_Color: item.Mosquito_Net_Color,
        Glass_Color: item.Glass_Color,
        Glass_Thickness: item.Glass_Thickness,
        Height: item.Height,
        Width: item.Width,
        Profile: category,
        ProfileColor: Profilecolor,
        MaxDiscount: MaterialPrice[0]?.MaxDiscount,
      };
    });

    try {
      console.log(newTransactions);
      const response = await axiosInstance.post(
        "/quotationClone/postQuotationBulk",
        newTransactions, // This is the data you want to send in the request body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSaveVisible(true);
        setPdfVisible(false);
        notifyMessage(`${quotationNo} Quotation saved successfully!`);
      } else {
        notifyMessage("Failed to save data");
      }
    } catch (error) {
      console.error(error);
      notifyMessage("Failed to save data. Please try again later");
    }
  };
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
      const fileName = `Quotation_${quotationNo}.pdf`;
      const newFilePath = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({
        from: uri,
        to: newFilePath,
      });

      // Create a new file path in the Downloads directory
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newFilePath, {
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
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF");
      console.error("Error generating PDF:", error);
    }
  };
  //delete
  //   const options = customerData.map((item) => item.Name);
  //   const options1 = profileData.map((item) => item.Category);
  //   const options2 = color.map((item) => item.Colour);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const handleRemoveItem = (index) => {
    const newData = windowData.filter((_, i) => i !== index);
    setWindowData(newData);
  };
  useEffect(() => {
    if (windowData.length === 0) {
      setVisibleContent(false);
    }
  }, [windowData]);

  return (
    <View
      style={styles.container}
      className="bg-background relative  flex-1 justify-start items-center"
    >
      {!visibleSave ? (
        <>
          <View className="flex flex-row gap-4 mt-1">
            <Text className="text-2xl">Windoow Door</Text>
            <TouchableOpacity
              style={styles.loginContainer}
              className="rounded flex items-center  justify-center w-[50] h-[32]"
              onPress={() => handleVisible()}
            >
              <Text className="text-2xl ">+</Text>
            </TouchableOpacity>
          </View>
          {visibleContent && (
            <ScrollView style={styles.scrollableContent}>
              <View className="bg-white mt-2 p-2 w-[94vw] ">
                {windowData.map(
                  (item, index) =>
                    item && (
                      <View>
                        <View
                          key={index}
                          className="bg-background  rounded mb-4 w-[100%] h-[494] flex items-center"
                        >
                          <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => handleRemoveItem(index)}
                          >
                            <AntDesign
                              name="closecircleo"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                          <Selector
                            label="Design"
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
                            selectedValue={item.Material}
                            onSelect={(value) => {
                              handleChange(index, "Material", value);
                              setMaterial(value);
                            }}
                            isOpen={openDropdown === `material${index}`}
                            onToggle={(isOpen) =>
                              handleToggle(isOpen ? `material${index}` : null)
                            }
                          />
                          <Selector
                            label="MosquitoNet Design"
                            options={["Opening", "Sliding", "Folding"]}
                            selectedValue={item.MosquitoNet_Design}
                            onSelect={(value) => {
                              handleChange(index, "MosquitoNet_Design", value);
                              setMosquitoNet_Design(value);
                            }}
                            isOpen={openDropdown === `mosDesign${index}`}
                            onToggle={(isOpen) =>
                              handleToggle(isOpen ? `mosDesign${index}` : null)
                            }
                          />
                          <Selector
                            label="MosquitoNet Color"
                            options={["Non", "White", "Black", "Two tone"]}
                            selectedValue={item.Mosquito_Net_Color}
                            onSelect={(value) => {
                              handleChange(index, "Mosquito_Net_Color", value);
                              setMosquito_Net_Color(value);
                            }}
                            isOpen={openDropdown === `mosNetColor${index}`}
                            onToggle={(isOpen) =>
                              handleToggle(
                                isOpen ? `mosNetColor${index}` : null
                              )
                            }
                          />
                          <Selector
                            label="Glass Color"
                            options={["cllear", "green", "black"]}
                            selectedValue={item.Glass_Color}
                            onSelect={(value) => {
                              handleChange(index, "Glass_Color", value);
                              setGlass_Color(value);
                            }}
                            isOpen={openDropdown === `glassColor${index}`}
                            onToggle={(isOpen) =>
                              handleToggle(isOpen ? `glassColor${index}` : null)
                            }
                          />
                          <Selector
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
                            selectedValue={item.Glass_Thickness}
                            onSelect={(value) => {
                              handleChange(index, "Glass_Thickness", value);
                              setGlass_Thickness(value);
                            }}
                            isOpen={openDropdown === `glassThickness${index}`}
                            onToggle={(isOpen) =>
                              handleToggle(
                                isOpen ? `glassThickness${index}` : null
                              )
                            }
                          />
                          <TextInput
                            style={styles.input}
                            className="mt-2 w-[300px]"
                            placeholder="Height"
                            onChangeText={(value) =>
                              handleChange(index, "Height", value)
                            }
                            value={item.Height}
                            keyboardType="numeric"
                          ></TextInput>
                          <TextInput
                            style={styles.input}
                            className="mt-2 w-[300px]"
                            placeholder="Width"
                            onChangeText={(value) =>
                              handleChange(index, "Width", value)
                            }
                            value={item.Width}
                            keyboardType="numeric"
                          ></TextInput>
                          <TextInput
                            style={styles.input}
                            className="mt-2 w-[300px]"
                            placeholder="Quantity"
                            onChangeText={(value) =>
                              handleChange(index, "Quantity", value)
                            }
                            value={item.Quantity}
                            keyboardType="numeric"
                          ></TextInput>
                        </View>
                      </View>
                    )
                )}
              </View>
            </ScrollView>
          )}
          {visibleContent && (
            <View className="flex  items-center justify-center flex-col  mt-2">
              <TouchableOpacity
                className="p-2 w-[150px] h-[50px]  bg-gradient-to-tl shadow-lg rounded-sm flex items-center justify-center"
                style={styles.loginContainer}
                onPress={() => handleVisibleSave()}
              >
                <Text className="font-semibold text-xl">Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View>
          <View className="bg-white   mt-2 h-[77%] p-2 w-[100vw] ">
            <ScrollView style={styles.scrollableContent}>
              {windowData.map((data, index) => (
                <View
                  key={index}
                  className="bg-background flex-col  rounded mb-4 w-[98%] h-[210] flex pl-2 pt-2 items-start"
                >
                  <Text>{data.Material}</Text>
                  {data.MosquitoNet_Design && (
                    <Text>
                      With MosquitoNet Design: {data.MosquitoNet_Design}
                    </Text>
                  )}
                  {data.Mosquito_Net_Color && (
                    <Text>
                      With MosquitoNet Color : {data.Mosquito_Net_Color}
                    </Text>
                  )}
                  <Text>With Glass Color : {data.Glass_Color}</Text>
                  <Text>With Glass Thickness : {data.Glass_Thickness}</Text>
                  <Text>Total Height :{data.Height}</Text>
                  <Text>Total Width : {data.Width}</Text>
                  <Text>Quantity : {data.Quantity}</Text>
                  <Text>Total Price : {data.Total_Price.toFixed(2)}</Text>
                  <Text>
                    Price After Discount : {data.Price_After_discount}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View className=" bg-white mt-6 p-3  flex flex-col items-center justify-center">
            <View className="flex flex-row items-center justify-center">
              <View className=" bg-[#0000008f] rounded p-3">
                <Text style={{ color: "white" }}>
                  Vat({vat[0].Vat}): {parseFloat(vatAmount)}
                </Text>
              </View>
              <View className=" bg-[#0000008f] rounded p-3 ml-3">
                <Text style={{ color: "white" }}>
                  Installation : {TotalInstallation.toFixed(2)}
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center justify-center mt-3">
              <TouchableOpacity
                onPress={() => handleSaveBulk()}
                disabled={saveVisible}
                className=" bg-[#0000008f] flex items-center rounded w-[80] p-3"
              >
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
              <View>
                <View style={{ display: "none" }}>
                  <QuotationPDF
                    ref={componentRef}
                    windowData={windowData}
                    vat={vatAmount}
                    installation={TotalInstallation}
                    customerName={customerName}
                    quotationNo={quotationNo}
                    totalPrice={totalPriceSum}
                    customerData={customerData}
                  />
                </View>
                <TouchableOpacity
                  className=" bg-[#0000008f] flex items-center rounded w-[80] p-3 ml-3"
                  onPress={() => generatePdf()}
                  // disabled={pdfVisible}
                >
                  <Text style={{ color: "white" }}>PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  closeButton: {
    marginTop: 4,
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
    maxHeight: 550, // Set the max height for the scrollable content
  },
  selectedRowText: {
    color: "#fff",
  },
});

export default WindowDoor;

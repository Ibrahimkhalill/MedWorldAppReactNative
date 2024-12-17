import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Text,
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import BottomTabNavigator from "../component/BottomTabNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import CompeleteDcoument from "../component/CompeleteDcoument";
import InCompeleteDocument from "../component/InCompeleteDocument";
import SearchPage from "../component/SearchPage";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import QuotationPDF from "../QuotationPDF";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useSubscription } from "../component/SubscriptionContext";
function SurgergeruDcoument({ navigation }) {
  const [isVisible, setIsVisible] = useState(false);
  const { token } = useAuth();
  const { height } = Dimensions.get("window");
  const scrollViewHeight = height * 0.9; // 90% of the screen height
  const [incompleteVisible, setInCompleteVisible] = useState(false);
  const [completeSurgeries, setCompleteSurgeries] = useState([]);
  const [incompleteSurgeries, setIncompleteSurgeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { subscription, loading, error, fetchSubscription } = useSubscription();
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const componentRef = useRef();
  const fetchSurgeries = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/surgery/", {
        headers: {
          Authorization: `Token ${token}`, // Add token for authentication
        },
      });

      const { complete_surgeries, incomplete_surgeries, surgeries } =
        response.data;

      setData(complete_surgeries);
      setCompleteSurgeries(complete_surgeries);
      setIncompleteSurgeries(incomplete_surgeries);
    } catch (error) {
      console.error("Error fetching surgeries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSurgeries();
      fetchSubscription();
    }, [])
  );

  useEffect(() => {
    if (incompleteVisible) {
      setData(incompleteSurgeries);
    } else {
      setData(completeSurgeries);
    }
  }, [incompleteVisible]);

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
      console.log("PDF generated at:", uri);

      // Define the download location
      const downloadUri = `${FileSystem.documentDirectory}SurgeryReport.pdf`;

      // Copy the generated file to the downloads folder
      await FileSystem.copyAsync({
        from: uri,
        to: downloadUri,
      });

      console.log("PDF saved to:", downloadUri);

      // Optionally share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadUri);
      } else {
        alert("PDF downloaded to the app's document folder.");
      }
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
    }
  };

  const fields = [
    "surgery_name",
    "field_of_surgery",
    "type_of_surgery",
    "complications",
    "histology",
    "main_surgeon",
    "histology_description",
    "complications_description",
    "notes1",
    "notes2",
    "date",
  ];
  const handleCheck = () => {
    if (subscription.free_trial) {
      if (subscription.free_trial_end) {
        // Free trial is still active
        generatePdf();
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
      Alert.alert(
        "Access Denied",
        "Your free trial has expired. Please upgrade your account to access this feature."
      );
      return;
    }

    // Check Subscription Status
    if (subscription.is_active) {
      // Subscription is active
      generatePdf();
    } else {
      // Subscription has expired
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea} className="px-5">
      <StatusBar style="dark" backgroundColor="white" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ height: scrollViewHeight }}
      >
        <View className="mt-1 flex">
          <View className="flex items-center justify-between flex-row w-full ">
            <Image
              className="w-[64px] h-[54px]"
              source={require("../../assets/MEDLOGO.png")}
            />
            <View className="flex flex-row gap-5">
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <Ionicons name="search-outline" size={25} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Notification")}
              >
                <SimpleLineIcon
                  name="notifications-none"
                  size={25}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-[24px] font-bold mt-2">{t("document")}</Text>
          <View className="flex flex-row gap-3 my-1 ">
            <TouchableOpacity
              className=" py-1"
              onPress={() => navigation.navigate("ScientificDcoument")}
            >
              <Text style={styles.navButtonText}>{t("scientific")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" border-b-4 border-[#FFDC58] py-1"
              onPress={() => navigation.navigate("SurgergeryDcoument")}
            >
              <Text style={styles.navButtonText}>{t("surgeries")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" py-1 "
              onPress={() => navigation.navigate("CoursesDocument")}
            >
              <Text style={styles.navButtonText}>{t("courses")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" py-1"
              onPress={() => navigation.navigate("BudgetDcoument")}
            >
              <Text style={styles.navButtonText}>{t("budget")}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex items-center flex-row justify-between">
            <View className="flex flex-row  my-2">
              <TouchableOpacity
                onPress={() => {
                  setInCompleteVisible(false);
                }}
              >
                <Text
                  className={`text-[14px] font-[600]  ${
                    incompleteVisible ? "" : "border-b-4 border-[#FFDC58] pb-1"
                  }`}
                >
                  {t("complete")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setInCompleteVisible(true)}>
                <Text
                  className={`text-[14px] font-[600] ml-3 ${
                    incompleteVisible ? "border-b-4 border-[#FFDC58] pb-1" : ""
                  }`}
                >
                  {t("incomplete")}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row gap-2 my-2">
              <TouchableOpacity
                className="mr-2"
                onPress={() => navigation.navigate("PercantagePage")}
              >
                <Image
                  className="w-[20px] h-20px]"
                  source={require("../../assets/icondocumentpage.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCheck()}>
                <Feather name="download" size={25} color="black" />
              </TouchableOpacity>
              <View style={{ display: "none" }}>
                <QuotationPDF
                  ref={componentRef}
                  fields={fields}
                  data={data}
                  title="Surgery Report"
                />
              </View>
            </View>
          </View>
          {incompleteVisible ? (
            <>
              <InCompeleteDocument
                data={data}
                fetchSurgeries={fetchSurgeries}
                navigation={navigation}
                subscription={subscription}
              />
            </>
          ) : (
            <CompeleteDcoument
              data={data}
              fetchSurgeries={fetchSurgeries}
              navigation={navigation}
              subscription={subscription}
            />
          )}
        </View>
      </ScrollView>
      <SearchPage
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        filterData={incompleteVisible ? incompleteSurgeries : completeSurgeries}
        data={data}
        setData={setData}
        value={"name_of_surgery"}
      />
      <BottomTabNavigator navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  partialBackground: {
    height: 170,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Optional background color
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  navButtonText: {
    fontWeight: "500",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  progressBackground: {
    width: "70%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FCE488",
    borderRadius: 10,
  },
  percentageText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
    margin: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  circle: {
    width: 205,
    height: 204,
    borderRadius: 100, // Keeps the outer circle rounded
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute positioning of quadrants
  },
  quadrant: {
    position: "absolute",
    width: "49%", // Reduced size to allow 3px gap
    height: "49%", // Reduced size to allow 3px gap
    justifyContent: "center",
    alignItems: "center",
  },
  topLeft: {
    top: 0,
    left: 0,

    backgroundColor: "#FFDC584D",
    borderTopLeftRadius: 100, // Top-left quadrant rounded
  },
  topRight: {
    top: 0,
    right: 0,
    backgroundColor: "#FFDC58",
    borderTopRightRadius: 100,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    backgroundColor: "#FFDC5880",
    borderBottomLeftRadius: 100, // Bottom-left quadrant rounded
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    backgroundColor: "#FFDC58B2",
    borderBottomRightRadius: 100, // Bottom-right quadrant rounded
  },
  text: {
    fontSize: 11,
    color: "black",
    fontWeight: "bold",
  },

  buttonText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  gap: {
    position: "absolute",
    top: "25%", // Positioning the gap
    left: "25%", // Positioning the gap
    width: "50%", // Filling the center
    height: "50%", // Filling the center
    borderRadius: 50, // Keeps the gap circular
  },
});

export default SurgergeruDcoument;

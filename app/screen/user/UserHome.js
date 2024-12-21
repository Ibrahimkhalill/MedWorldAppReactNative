import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from "react-native";

import HomeModal from "../component/HomeModal";
import { SafeAreaView } from "react-native-safe-area-context";
import SurgeriesModal from "../component/SurgeriesModal";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";

import NotificationButton from "../component/NotificationButton";
import { useTranslation } from "react-i18next";
import NavigationBar from "../component/BottomTabNavigator";
import { useSubscription } from "../component/SubscriptionContext";

function UserHome({ navigation }) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isItSurgeris, setIsItSurgies] = useState(false);
  const [surgeryData, setSurgeryData] = useState([]);
  const { height } = Dimensions.get("window");

  const scrollViewHeight = height * 0.9; // 90% of the screen height
  const { token } = useAuth();
  const [completeSurgeries, setCompleteSurgeries] = useState([]);
  const [incompleteSurgeries, setIncompleteSurgeries] = useState([]);
  const { subscription, loading, error, fetchSubscription } = useSubscription();
  

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
      fetchPerCantageData();
      fetchSurgeries();
      fetchSubscription(); // Call the API when the component mounts
      setIsItSurgies(false);
    }, [])
  );
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
      alert(msg);
    }
  }
  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/user_profile/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      notifyMessage(t("error_fetching_profile"));
    }
  };
  const fetchPerCantageData = async () => {
    try {
      const response = await axiosInstance.get(`/percentage-surgery/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        setSurgeryData(response.data);
      }
    } catch (error) {
      notifyMessage(t("error_fetching_data"));
    }
  };

  const fetchSurgeries = async () => {
    try {
      const response = await axiosInstance.get("/surgery/", {
        headers: {
          Authorization: `Token ${token}`, // Add token for authentication
        },
      });

      const { complete_surgeries, incomplete_surgeries } = response.data;

      setCompleteSurgeries(complete_surgeries);
      setIncompleteSurgeries(incomplete_surgeries);
    } catch (error) {
      console.error("Error fetching surgeries:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const handleNavigation = (screenName) => {
    if (!subscription) {
      Alert.alert(
        "Error",
        "Unable to verify your subscription. Please try again later."
      );
      return;
    }

    // Check Free Trial Status
    if (subscription.free_trial) {
      if (subscription.free_trial_end) {
        if (screenName == "AddSurgeries") {
          setIsItSurgies(true);
          return;
        }
        // Free trial is still active
        navigation.navigate(screenName);
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
      if (screenName == "AddSurgeries") {
        setIsItSurgies(true);
        return;
      }
      // Subscription is active
      navigation.navigate(screenName);
    } else {
      // Subscription has expired
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
    }
  };

  console.log(subscription);

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
            <NotificationButton navigation={navigation} />
          </View>
          {!subscription?.is_active && (
            <View className="flex items-center justify-center">
              <TouchableOpacity
                className="border border-[#FFDC58] px-2  h-[37px] rounded-[5px] flex items-center justify-center"
                onPress={() => navigation.navigate("Subscriptions")}
              >
                <Text className="text-[#FFDC58] text-[14px]">
                  {t("get_a_plan")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View className="mt-5">
            <ImageBackground
              source={require("../../assets/frame.jpg")}
              style={styles.partialBackground}
              resizeMode="cover"
            >
              <View className="p-2 flex flex-row w-full justify-between ">
                <View>
                  <Text className="text-[#000000] text-[20px]">
                    {userData.username}
                  </Text>
                  <Text className="text-[#000000] text-[12px] font-bold mt-4">
                    {t("specialist")}: {userData.specialty}
                  </Text>
                </View>
                <View className="flex items-center justify-center h-full mt-4">
                  <Text className="text-[60px] font-bold ">
                    {userData.residencyYear}/6
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View className="flex flex-row mt-7">
            <View
              style={styles.shadow}
              className="w-[47%] h-[67px] flex justify-between"
            >
              <Text className="text-[12px] ">{t("surgeries_inserted")}</Text>
              <Text className="text-[#FFDC58] text-[20px]">
                {completeSurgeries.length}
              </Text>
            </View>
            <View
              style={styles.shadow}
              className="w-[47%] h-[67px] ml-2 flex justify-between"
            >
              <Text className="text-[12px]">{t("incomplete_surgeries")}</Text>
              <Text className="text-[#FFDC58] text-[20px]">
                {incompleteSurgeries.length}
              </Text>
            </View>
          </View>

          <View className="mt-5 mb-10 flex items-center">
            <View style={styles.circle}>
              {/* Top Left - Scientific */}
              <TouchableOpacity
                style={[styles.quadrant, styles.topLeft]}
                onPress={() => handleNavigation("AddScientific")}
              >
                <Text className="mt-2 ml-4" style={styles.text}>
                  {t("scientific")}
                </Text>
              </TouchableOpacity>

              {/* Top Right - Surgeries */}
              <TouchableOpacity
                style={[styles.quadrant, styles.topRight]}
                onPress={() => handleNavigation("AddSurgeries")}
              >
                <Text className="mt-2 mr-4" style={styles.text}>
                  {t("surgeries")}
                </Text>
              </TouchableOpacity>

              {/* Bottom Left - Courses */}
              <TouchableOpacity
                style={[styles.quadrant, styles.bottomLeft]}
                onPress={() => handleNavigation("AddCourses")}
              >
                <Text className="mb-2 ml-4" style={styles.text}>
                  {t("courses")}
                </Text>
              </TouchableOpacity>

              {/* Bottom Right - Budget */}
              <TouchableOpacity
                style={[styles.quadrant, styles.bottomRight]}
                onPress={() => handleNavigation("AddBudget")}
              >
                <Text className="mb-2 mr-6" style={styles.text}>
                  {t("budget")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <HomeModal setIsVisible={setIsVisible} isVisible={isVisible} />
      <SurgeriesModal
        isVisible={isItSurgeris}
        setIsVisible={setIsItSurgies}
        navigation={navigation}
        existingSurgeryNames={surgeryData}
      />
      <NavigationBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Optional background color
  },
  partialBackground: {
    height: 170,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
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
  iconContainer: {
    position: "relative",
    marginRight: 6,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -3,
    backgroundColor: "red",
    borderRadius: 15,
    width: 15,
    height: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
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
    borderRadius: 100,
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  quadrant: {
    position: "absolute",
    width: "49%",
    height: "49%",
    justifyContent: "center",
    alignItems: "center",
  },
  topLeft: {
    top: 0,
    left: 0,
    backgroundColor: "#FFDC584D",
    borderTopLeftRadius: 100,
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
    borderBottomLeftRadius: 100,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    backgroundColor: "#FFDC58B2",
    borderBottomRightRadius: 100,
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
    top: "25%",
    left: "25%",
    width: "50%",
    height: "50%",
    borderRadius: 50,
  },
});

export default UserHome;

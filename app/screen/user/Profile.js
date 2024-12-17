import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import NavigationBar from "../component/BottomTabNavigator";
import axiosInstance from "../component/axiosInstance";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useSubscription } from "../component/SubscriptionContext";

const { height } = Dimensions.get("window");

function Profile({ navigation }) {
  const { t } = useTranslation(); // Use translation hook

  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [profile_picture, setProfilePicture] = useState("");
  const [residencyDuration, setResidencyDuration] = useState("");
  const [residencyYear, setResidencyYear] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const { subscription, fetchSubscription } = useSubscription();

  const insets = useSafeAreaInsets();

  const notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      Alert.alert("Warning!", msg);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchSubscription();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        notifyMessage(t("error_not_authenticated"));
        return;
      }

      const response = await axiosInstance.get(`/user_profile/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setEmail(data.email);
        setAddress(data.address);
        setResidencyDuration(data.residencyDuration);
        setResidencyYear(data.residencyYear);
        setPhone_number(data.phone_number);
        setGender(data.gender);
        setUserName(data.username);
        setSpecialty(data.specialty);
        setProfilePicture(data.profile_picture);
        setUserData(data);
      }
    } catch (error) {
      notifyMessage(t("error_fetching_profile"));
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(t("permission_required"), t("permission_message"));
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const updatedProfileData = async () => {
    setIsLoading(true);
    const formData = new FormData();

    if (imageUri) {
      formData.append("profile_picture", {
        uri: imageUri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }

    formData.append("email", email);
    formData.append("address", address);
    formData.append("residencyDuration", residencyDuration);
    formData.append("residencyYear", residencyYear);
    formData.append("phone_number", phone_number);
    formData.append("gender", gender);
    formData.append("username", userName);
    formData.append("specialty", specialty);

    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axiosInstance.patch("/user_profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        Alert.alert(t("profile_updated"));
        fetchProfileData();
      } else {
        Alert.alert(t("upload_failed"));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t("error_upload"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = () => {
    if (subscription.free_trial) {
      if (subscription.free_trial_end) {
        // Free trial is still active
        updatedProfileData();
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
      updatedProfileData();
    } else {
      // Subscription has expired
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
    }
  };
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Add listeners for keyboard show and hide
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <StatusBar style="dark" backgroundColor="white" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        Style={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          {/* Logo Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/MEDLOGO.png")} // Your logo path
              style={styles.image}
            />
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={{ fontSize: 24, fontWeight: "700" }}>
              {t("personal_information")}
            </Text>
            <View className="flex flex-row items-center justify-between mt-6">
              <View style={styles.imageContainer}>
                {/* Profile Image */}
                <Pressable onPress={pickImage}>
                  <Image
                    source={
                      imageUri
                        ? { uri: imageUri } // Show selected image
                        : require("../../assets/profile.png") // Default image
                    }
                    style={styles.Profileimage}
                  />
                  {/* Edit Icon */}

                  <FontAwesome
                    name="edit"
                    size={25}
                    color="#25292e"
                    style={styles.editIcon}
                  />
                </Pressable>
              </View>
              <View className="flex items-center gap-3">
                <Text className="text-[24px] font-bold">
                  {userData.username}
                </Text>
                <TouchableOpacity className="bg-[#FCE488] w-[166px] h-[37px] rounded-[400px] flex items-center justify-center flex-row ">
                  {subscription.is_active && (
                    <Image
                      source={require("../../assets/premium.png")} // Your logo path
                      style={styles.icon}
                    />
                  )}
                  <Text className="text-[14px] font-[600] ml-2">
                    {subscription.is_active
                      ? "Premium account"
                      : "Free Account"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("Name")}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                />
              </View>
            </View>
            <Text style={styles.label}>{t("email")}</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholder={t("placeholder_email")}
                value={email}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("speciality")}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t("placeholder_speciality")}
                value={specialty}
                onChangeText={setSpecialty}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("phone_number")}</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color="#B5B5B5"
              />
              <TextInput
                style={styles.input}
                placeholder={t("placeholder_phone_number")}
                value={phone_number}
                onChangeText={setPhone_number}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("address")}</Text>
            <View style={styles.inputWrapper}>
              <SimpleLineIcons name="location-pin" size={20} color="#B5B5B5" />
              <TextInput
                style={styles.input}
                placeholder={t("placeholder_address")}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("gender")}</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="gender-male"
                size={20}
                color="#B5B5B5"
              />
              <TextInput
                style={styles.input}
                placeholder={t("placeholder_gender")}
                value={gender}
                onChangeText={setGender}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleCheck}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>{t("edit_profile")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {!isKeyboardVisible && <NavigationBar navigation={navigation} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Optional background color
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,

    borderRadius: 15,
    padding: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",

    paddingBottom: 90,
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 100, // width of the image
    height: 80, // height of the image
  },
  Profileimage: {
    width: 120, // width of the image
    height: 120, // height of the image
    borderRadius: 60, // half of width or height for circular shape
    overflow: "hidden", // ensures content stays within the circle
  },

  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputContainerFIrst: {
    width: "50%",
    marginBottom: 15,
  },
  inputContainerDouble: {
    width: "100%",
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",

    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBCBCB",
    marginBottom: 5,
  },
  labelFirst: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBCBCB",
    marginBottom: 5,
    height: 50,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    height: 56,
  },
  inputWrapperDouble: {
    flexDirection: "column",

    height: 56,
    width: "40%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  inputFirst: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    height: 56,
    width: "95%",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#00000",
  },
  alreadySignInContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  alreadySignInText: {
    fontSize: 14,
    color: "#777",
  },
  link: {
    fontSize: 14,
    color: "#FFDC58",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  forgotPasswordContainer: {
    width: "100%",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#E91111",
    textAlign: "right",
  },
  icon: {
    width: 12.5,
    height: 11.5,
  },
});

export default Profile;

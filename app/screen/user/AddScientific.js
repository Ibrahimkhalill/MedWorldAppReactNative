import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import CustomCheckbox from "../component/CheckBox";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

function AddScientific({ navigation }) {
  const { t } = useTranslation(); // Translation hook
  const [isLoading, setIsLoading] = useState(false);
  const [tpyesWorks, setTypesWorks] = useState("");
  const [isInternational, setIsInternational] = useState(false);
  const [isNational, setIsNational] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [coAuthors, setCoAuthors] = useState("");
  const [date, setDate] = useState(new Date());
  const { height } = Dimensions.get("window");
  const { token } = useAuth();

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

  const clearForm = () => {
    setDate(new Date());
    setTypesWorks("");
    setIsInternational(false);
    setIsNational(false);
    setRole("");
    setName("");
    setCoAuthors("");
  };

  useFocusEffect(
    React.useCallback(() => {
      clearForm();
    }, [])
  );

  const handleAdd = async () => {
    console.log(
      date,
      tpyesWorks,
      role,
      name,
      coAuthors,
      isInternational,
      isNational
    );

    if (!date || !tpyesWorks || !role || !name || !coAuthors) {
      notifyMessage(t("fill_required_fields"));
      return;
    }
    if (!isInternational && !isNational) {
      notifyMessage(t("fill_required_fields"));
      return;
    }

    const payload = {
      date,
      types_works: tpyesWorks,
      international: isInternational,
      national: isNational,
      role,
      name,
      co_author_names: coAuthors,
    };

    try {
      const response = await axiosInstance.post("/scientifics/", payload, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 201) {
        notifyMessage(t("scientific_added"));
        clearForm();
        navigation.navigate("ScientificDcoument");
      } else {
        notifyMessage(t("scientific_add_failed"));
      }
    } catch (error) {
      console.error("Error adding scientific data:", error);
      notifyMessage(t("error_occurred"));
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <StatusBar style="dark" backgroundColor="white" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        Style={{ flexGrow: 1, height: height }}
      >
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <View className="flex flex-row gap-3 my-3 mb-5">
          <TouchableOpacity
            className="py-1 border-b-4 border-[#FFDC58]"
            onPress={() => navigation.navigate("AddScientific")}
          >
            <Text style={styles.navButtonText}>{t("scientific")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("AddSurgeries")}
          >
            <Text style={styles.navButtonText}>{t("surgeries")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("AddCourses")}
          >
            <Text style={styles.navButtonText}>{t("courses")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("AddBudget")}
          >
            <Text style={styles.navButtonText}>{t("budget")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>{t("date")}</Text>
              <CustomDatePicker
                onDateChange={handleDateChange}
                date={date}
                setDate={setDate}
              />
            </View>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>{t("type_of_work")}</Text>
              <TextInput
                style={styles.inputFirst}
                value={tpyesWorks}
                onChangeText={setTypesWorks}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View className="flex flex-row">
              <CustomCheckbox
                label={t("international")}
                fontSize={16}
                onValueChange={(value) => {
                  setIsInternational(value);
                  setIsNational(false);
                }}
                value={isInternational === true}
              />
              <View className="ml-3">
                <CustomCheckbox
                  label={t("national")}
                  fontSize={16}
                  onValueChange={(value) => {
                    setIsNational(value);
                    setIsInternational(false);
                  }}
                  value={isNational === true}
                />
              </View>
            </View>
          </View>
          <View style={styles.inputContainerDouble}>
            <View style={styles.inputContainerFIrst}>
              <Text style={styles.labelFirst}>{t("role")}</Text>
              <View className="flex flex-row">
                <CustomCheckbox
                  label={t("author")}
                  fontSize={16}
                  onValueChange={() => setRole("Author")}
                  value={role === "Author"}
                />
                <View className="ml-3">
                  <CustomCheckbox
                    label={t("co_author")}
                    fontSize={16}
                    onValueChange={() => setRole("Co-Author")}
                    value={role === "Co-Author"}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("name")}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t("name_placeholder")}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("co_author")}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t("co_author_placeholder")}
                value={coAuthors}
                onChangeText={setCoAuthors}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleAdd}>
            <Text style={styles.loginButtonText}>{t("save")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  textArea: {
    height: 80, // Adjust height as needed

    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top", // Ensures text starts at the top of the TextInput
    borderRadius: 12,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",

    paddingBottom: 10,
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

    flexDirection: "row",

    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 5,
  },
  labelFirst: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,

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

    paddingHorizontal: 10,
    height: 56,
    width: "95%",
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 40,
    width: 119,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
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
  navButtonText: {
    fontWeight: "500",
  },
});

export default AddScientific;

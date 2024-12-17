import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import CustomCheckbox from "../component/CheckBox";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useTranslation } from "react-i18next";

function AddSurgeries({ route, navigation }) {
  const { t } = useTranslation();
  const [fieldOfSurgery, setFieldOfSurgery] = useState("");
  const [surgeryName, setSurgeryName] = useState("");
  const [typeOfSurgery, setTypeOfSurgery] = useState("");
  const [date, setDate] = useState(new Date());
  const [mainSurgeon, setMainSurgeon] = useState(null);
  const [histology, setHistology] = useState(null);
  const [complications, setComplications] = useState(null);
  const [histologyDescription, setHistologyDescription] = useState("");
  const [complicationDescription, setComplicationDescription] = useState("");
  const [notes1, setNotes1] = useState("");
  const [notes2, setNotes2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const [surgerySuggestions, setSurgerySuggestions] = useState([]);
  const [allSurgeryNames, setAllSurgeryNames] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { surgery_name } = route.params || {};
  useEffect(() => {
    if (surgery_name) {
      setSurgeryName(surgery_name);
    }
  }, []);

  const handleSave = async () => {
    if (!fieldOfSurgery || !surgeryName || !typeOfSurgery || !date) {
      notifyMessage(t("error_fill_fields"));
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.post(
        "/surgery/",
        {
          field_of_surgery: fieldOfSurgery,
          name_of_surgery: surgeryName,
          type_of_surgery: typeOfSurgery,
          date,
          main_surgeon: mainSurgeon,
          histology,
          complications,
          histology_description: histologyDescription,
          complication_description: complicationDescription,
          notes1,
          notes2,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        notifyMessage(t("surgery_added_success"));
        clearForm();
      } else {
        notifyMessage(t("error_adding_surgery"));
      }
    } catch (error) {
      console.error("Error adding surgery:", error);
      notifyMessage(t("error_generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFieldOfSurgery("");
    setSurgeryName("");
    setTypeOfSurgery("");
    setDate(new Date());
    setMainSurgeon(null);
    setHistology(null);
    setComplications(null);
    setHistologyDescription("");
    setComplicationDescription("");
    setNotes1("");
    setNotes2("");
  };

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
      alert(msg);
    }
  };

  const handleOutsidePress = () => {
    setDropdownVisible(false); // Hide suggestions on outside click
    Keyboard.dismiss(); // Hide the keyboard if open
  };

  useEffect(() => {
    const fetchSurgeryNames = async () => {
      try {
        const response = await axiosInstance.get("/surgery-names-list/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (response.status === 200) {
          setAllSurgeryNames(response.data.names); // Assume API returns { names: ["Name1", "Name2", ...] }
        }
      } catch (error) {
        console.error("Error fetching surgery names:", error);
      }
    };

    fetchSurgeryNames();
  }, []);

  const handleInputChange = (text) => {
    if (surgery_name) {
      return;
    }
    setSurgeryName(text);
    setDropdownVisible(true);
    if (text.length > 0) {
      const filteredSuggestions = allSurgeryNames.filter((name) =>
        name.toLowerCase().includes(text.toLowerCase())
      );
      setSurgerySuggestions(filteredSuggestions);
    } else {
      setSurgerySuggestions([]);
    }
  };

  const handleSuggestionSelect = (name) => {
    setSurgeryName(name);
    setDropdownVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <SafeAreaView style={styles.safeAreaContainer} className="px-5">
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 1 }}
        >
          <Navbar navigation={navigation} navigation_Name={"UserHome"} />
          <View className="flex flex-row gap-3 my-3 mb-5">
            <TouchableOpacity
              className=" py-1"
              onPress={() => navigation.navigate("AddScientific")}
            >
              <Text style={styles.navButtonText}>Scientific</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border-b-4 border-[#FFDC58] py-1">
              <Text style={styles.navButtonText}>Surgeries</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" py-1"
              onPress={() => navigation.navigate("AddCourses")}
            >
              <Text style={styles.navButtonText}>Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" py-1"
              onPress={() => navigation.navigate("AddBudget")}
            >
              <Text style={styles.navButtonText}>Budget</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFirst}>
                <Text style={styles.label}>{t("field_of_surgery")}</Text>
                <TextInput
                  style={styles.input}
                  value={fieldOfSurgery}
                  onChangeText={setFieldOfSurgery}
                />
              </View>
              <View style={styles.inputContainerFirst}>
                <Text style={styles.label}>{t("date")}</Text>
                <CustomDatePicker
                  onDateChange={setDate}
                  date={date}
                  setDate={setDate}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("surgery_name")}</Text>
              <TextInput
                style={styles.input}
                value={surgeryName}
                onChangeText={handleInputChange}
              />
              {isDropdownVisible && surgerySuggestions.length > 0 && (
                <ScrollView
                  style={styles.suggestionsContainer}
                  nestedScrollEnabled={true} // Allow nested scrolling
                >
                  {surgerySuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => handleSuggestionSelect(item)}
                      style={styles.suggestionItem}
                    >
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("type_of_surgery")}</Text>
              <TextInput
                style={styles.input}
                value={typeOfSurgery}
                onChangeText={setTypeOfSurgery}
              />
            </View>
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFirst}>
                <Text style={styles.labelFirst}>{t("main_surgeon")}</Text>
                <View style={{ flexDirection: "row" }}>
                  <CustomCheckbox
                    label="Yes"
                    onValueChange={() => setMainSurgeon(true)}
                    value={mainSurgeon === true}
                  />
                  <View className="ml-3">
                    <CustomCheckbox
                      label="No"
                      onValueChange={() => setMainSurgeon(false)}
                      value={mainSurgeon === false}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.inputContainerFirst}>
                <Text style={styles.labelFirst}>{t("histology")}</Text>
                <View style={{ flexDirection: "row" }}>
                  <CustomCheckbox
                    label="Yes"
                    onValueChange={() => setHistology(true)}
                    value={histology == true}
                  />
                  <View className="ml-3">
                    <CustomCheckbox
                      label="No"
                      onValueChange={() => setHistology(false)}
                      value={histology === false}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFirst}>
                <Text style={styles.labelFirst}>{t("complications")}</Text>

                <View className="flex  flex-row ">
                  <CustomCheckbox
                    label="Yes"
                    onValueChange={() => setComplications(true)}
                    value={complications === true}
                  />
                  <View className="ml-3">
                    <CustomCheckbox
                      label="NO"
                      onValueChange={() => setComplications(false)}
                      value={complications === false}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("histology_description")}</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={histologyDescription}
                onChangeText={setHistologyDescription}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("complication_description")}</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={complicationDescription}
                onChangeText={setComplicationDescription}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("notes_1")}</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={notes1}
                onChangeText={setNotes1}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("notes_2")}</Text>
              <TextInput
                style={styles.textArea}
                multiline
                value={notes2}
                onChangeText={setNotes2}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleSave}>
              <Text style={styles.loginButtonText}>
                {isLoading ? t("saving") : t("save")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    borderColor: "gray",
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
  suggestionsContainer: {
    borderWidth: 1,

    borderRadius: 8,
    maxHeight: 150, // Limit the height for overflow
    backgroundColor: "#fff",
    zIndex: 1,
    maxHeight: 150, // Limit the height to make it scrollable
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
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
  inputContainerFirst: {
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
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
  },
  inputWrapperDouble: {
    flexDirection: "column",

    height: 56,
    width: "40%",
  },
  input: {
    borderWidth: 1,

    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  inputFirst: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
    width: "95%",
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
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

export default AddSurgeries;

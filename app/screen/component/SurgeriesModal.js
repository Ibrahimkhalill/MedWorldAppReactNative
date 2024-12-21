import React, { useState } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import CustomCheckbox from "./CheckBox";
import YesSurgeryModal from "./YesSurgeryModal";
import { useTranslation } from "react-i18next";
const SurgeriesModal = ({
  isVisible,
  setIsVisible,
  navigation,
  existingSurgeryNames,
}) => {
  const closeSurgeriesModal = () => {
    setIsVisible(false);
  };
  const { t } = useTranslation();
  const [YesSurgeryModalVisible, setYesSurgeryModalVisible] = useState(false);
  const handleCheckboxChange = (isChecked) => {
    if (isChecked) {
      closeSurgeriesModal();
      setYesSurgeryModalVisible(true);
    }
  };
  const handleCheckboxChangeNo = (isChecked) => {
    if (isChecked) {
      closeSurgeriesModal();
      navigation.navigate("AddSurgeries");
    }
  };

  return (
    <View className=" justify-center items-center ">
      {/* SurgeriesModal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeSurgeriesModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          {/* Animated SurgeriesModal */}
          <Animatable.View
            animation="zoomIn"
            duration={500} // Animation duration (milliseconds)
            easing="ease-out" // Optional easing
            style={styles.container}
          >
            <Text style={styles.header}>{t("is_it_new_surgery")}</Text>

            <View className="flex items-center justify-center flex-row mt-4">
              <CustomCheckbox
                label="Yes"
                onValueChange={handleCheckboxChange}
                fontSize={20}
              />
              <View className="ml-3">
                <CustomCheckbox
                  label="NO"
                  onValueChange={handleCheckboxChangeNo}
                  fontSize={20}
                />
              </View>
            </View>
          </Animatable.View>
        </View>
      </Modal>
      <YesSurgeryModal
        isVisible={YesSurgeryModalVisible}
        setIsVisible={setYesSurgeryModalVisible}
        navigation={navigation}
        existingSurgeryNames={existingSurgeryNames}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", // bg-white
    width: "90%", // w-[90%]
    height: 148, // h-[200px]
    padding: 20, // p-5 (padding 5 usually equals 20px)
    borderRadius: 8, // rounded-lg (large border radius)
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 28,
  },
  second_text: {
    fontSize: 14,
    textAlign: "center",
  },
  button_first: {
    backgroundColor: "#FF3B30",
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 20,
  },
  button_second: {
    backgroundColor: "#ffff",
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFDC58",
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default SurgeriesModal;

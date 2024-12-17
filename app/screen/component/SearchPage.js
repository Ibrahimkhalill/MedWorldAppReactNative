import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchPage = ({
  isVisible,
  setIsVisible,
  data,
  setData,
  filterData,
  value,
}) => {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  // Close the modal and reset search
  const closeSearchPage = () => {
    setIsVisible(false);
    setSearch("");
    setData(filterData); // Reset to the original dataset
  };

  // Filter the dataset dynamically based on search input
  const handleSearch = (searchValue) => {
    setSearch(searchValue);
    if (searchValue.trim()) {
      const filtered = filterData.filter((item) =>
        item[value]?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setData(filtered);
    } else {
      setData(filterData); // Reset to the original dataset if input is cleared
    }
  };

  return (
    <View className="justify-center items-center">
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeSearchPage}
      >
        <TouchableWithoutFeedback onPress={closeSearchPage}>
          <View className="flex-1 justify-start items-center bg-black/50">
            <Animatable.View
              animation="zoomIn"
              duration={500}
              easing="ease-out"
              style={styles.container}
            >
              <View className="flex flex-row items-center">
                <View className="py-2 rounded-full bg-gray-100 flex flex-row px-3 w-[83%] items-center">
                  <Ionicons name="search-outline" size={23} color="black" />
                  <TextInput
                    className="w-[80%] pl-2"
                    placeholder={t("search")}
                    onChangeText={handleSearch}
                    value={search}
                  />
                  {search && (
                    <TouchableOpacity
                      onPress={() => {
                        setSearch("");
                        setData(filterData); // Reset dataset
                      }}
                    >
                      <Ionicons name="close-circle" size={23} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity className="ml-3" onPress={closeSearchPage}>
                  <Text className="text-[#f3ce47] text-[14px] font-semibold">
                    {t("cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 30,
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
});

export default SearchPage;

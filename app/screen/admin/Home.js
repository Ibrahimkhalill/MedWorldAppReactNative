import React from "react";
import { StatusBar } from "expo-status-bar";

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

function Home({ navigation }) {
  return (
    <View
      style={styles.container}
      className="bg-background  flex-1 justify-start items-center"
    >
      <View className="flex mt-5 flex-wrap">
        <TouchableOpacity
          onPress={() => navigation.navigate("create_new_user")}
          className=" p-4  shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/group.png")}
          />
          <Text className="text-black text-lg font-medium mt-2">User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("glass")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/window.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">Glass</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("vat_installation")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/dollar.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">
            Vat & Installation
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("mail_data")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/email.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">Mail Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("profile")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/profile.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("mosquito_netting")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/mosquito.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">
            Mosquito Net
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("all_customer")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/customer.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("phone_data")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[90px] h-[90px]"
            source={require("../../assets/phone.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">
            Phone Data
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    color: Platform.OS === "white" ? StatusBar.currentHeight : 0,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default Home;

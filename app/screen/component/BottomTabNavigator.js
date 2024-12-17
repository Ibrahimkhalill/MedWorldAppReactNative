import React from "react";
import { Image, View, TouchableOpacity, StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export default function NavigationBar({ navigation }) {
  const insets = useSafeAreaInsets(); // Get safe area insets dynamically

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.navBar,
          {
            paddingBottom: insets.bottom, // Adjust based on safe area bottom inset
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("UserHome")}>
          <FontAwesome6 name="house" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SurgergeryDcoument")}
        >
          <Image
            style={styles.icon}
            source={require("../../assets/note.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <AntDesign name="setting" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <FontAwesome6 name="circle-user" size={23} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  navBar: {
    width: "100%",
    height: 54, // Fixed height for the navigation bar
    backgroundColor: "#FFDC58", // Background color
    flexDirection: "row", // To align icons horizontally
    justifyContent: "space-around", // Space out the icons evenly
    alignItems: "center", // Center the icons vertically
    position: "absolute",
    bottom: 0,
    borderRadius: 50,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { REACT_APP_BASE_URL } from "@env"; // Import your environment variable
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL, // Use the imported environment variable
});
const PhoneData = () => {
  const [email, setEmail] = useState([]);
  useEffect(() => {
    const fatchEmailData = async () => {
      try {
        const response = await axiosInstance.get("/customer/getAll");
        const res_data = response.data;
        console.log(res_data);
        setEmail(res_data);
      } catch (error) {
        console.log(error);
      }
    };
    fatchEmailData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollViewContent}>
          <View style={styles.textContainer}>
            {email &&
              email.map((data, index) => (
                <Text key={index} style={styles.text}>
                  {data.Email}
                </Text>
              ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: 300,
    height: 600,
  },
  scrollViewContent: {
    maxHeight: 600,
    width: "100%",
  },

  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: "center",
  },
});

export default PhoneData;

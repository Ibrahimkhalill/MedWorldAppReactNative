import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      
      <Text style={styles.headerTitle}>My App</Text>
      <Button
        title="Other Button"
        onPress={() => console.log('Other Button Pressed')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'black',
    height: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
  },
});

export default CustomHeader;

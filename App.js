import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import WelcomeScreen from "./app/screen/WelcomeScreen";
import UserLogin from "./app/screen/authentication/UserLogin";

import { AuthProvider, useAuth } from "./app/screen/authentication/Auth";
import Logout from "./app/screen/authentication/Logout";
import AddScientific from "./app/screen/user/AddScientific";
import UserSignup from "./app/screen/authentication/UserSignup";
import ForgetPassWord from "./app/screen/authentication/ForgetPassword";
import OTP from "./app/screen/authentication/OTP";
import ResetPassWord from "./app/screen/authentication/ResetPassword";
import UserHome from "./app/screen/user/UserHome";
import AddBudget from "./app/screen/user/AddBudget";
import Settings from "./app/screen/component/Settings";
import HelpSupport from "./app/screen/user/HelpSupport";
import TermsAndCondition from "./app/screen/user/TermsAndCondition";
import PrivacyPolicy from "./app/screen/user/PrivacyPolicy";
import Profile from "./app/screen/user/Profile";
import Notification from "./app/screen/component/Notification";
import AddSurgeries from "./app/screen/user/AddSurgeries";
import AddCourses from "./app/screen/user/AddCourses";
import SurgergeruDcoument from "./app/screen/user/SurgergeryDcoument";
import BudgetDcoument from "./app/screen/user/BudgetDcoument";
import ScientificDcoument from "./app/screen/user/ScientificDcoument";
import CoursesDocument from "./app/screen/user/CoursesDocument";
import PercantagePage from "./app/screen/user/PercantagePage";
import Subscriptions from "./app/screen/user/Subscriptions";
import ForgetPasswordOtp from "./app/screen/authentication/ForgetPasswordOtp";
import EditScientific from "./app/screen/user/EditScientific";
import EditBudget from "./app/screen/user/EditBudget";
import EditCourse from "./app/screen/user/EditCourse";
import EidtSurgeries from "./app/screen/user/EidtSurgeries";
import { I18nextProvider } from "react-i18next"; // Import the provider
import i18n from "./app/screen/component/language/i18n"; // Import your i18n instance
import { SubscriptionProvider } from "./app/screen/component/SubscriptionContext";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AdminDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "#fff",
      }}
      drawerContent={(props) => <Logout {...props} />}
    ></Drawer.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator
      initialRouteName="WELCOME"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="WELCOME"
        component={WelcomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="UserHome"
        component={UserHome}
        options={{ title: "User Home" }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupport}
        options={{ title: "Help & Support" }}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{ title: "Terms & Conditions" }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ title: "Privacy Policy" }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="SurgergeryDcoument"
        component={SurgergeruDcoument}
        options={{ title: "Surgery Document" }}
      />
      <Stack.Screen
        name="PercantagePage"
        component={PercantagePage}
        options={{ title: "Percentage" }}
      />
      <Stack.Screen
        name="Subscriptions"
        component={Subscriptions}
        options={{ title: "Subscriptions" }}
      />
      <Stack.Screen
        name="BudgetDcoument"
        component={BudgetDcoument}
        options={{ title: "Budget Document" }}
      />
      <Stack.Screen
        name="ScientificDcoument"
        component={ScientificDcoument}
        options={{ title: "Scientific Document" }}
      />
      <Stack.Screen
        name="CoursesDocument"
        component={CoursesDocument}
        options={{ title: "Courses Document" }}
      />
      <Stack.Screen
        name="AddScientific"
        component={AddScientific}
        options={{ title: "Add Scientific" }}
      />
      <Stack.Screen
        name="AddCourses"
        component={AddCourses}
        options={{ title: "Add Courses" }}
      />
      <Stack.Screen
        name="AddSurgeries"
        component={AddSurgeries}
        options={{ title: "Add Surgeries" }}
      />
      <Stack.Screen
        name="EditScientific"
        component={EditScientific}
        options={{ title: "EditScientific" }}
      />
      <Stack.Screen
        name="EditBudget"
        component={EditBudget}
        options={{ title: "EditBudget" }}
      />
      <Stack.Screen
        name="EditCourse"
        component={EditCourse}
        options={{ title: "EditCourse" }}
      />
      <Stack.Screen
        name="EidtSurgeries"
        component={EidtSurgeries}
        options={{ title: "EidtSurgeries" }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="AddBudget"
        component={AddBudget}
        options={{ title: "Add Budget" }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="UserLogin"
    >
      <Stack.Screen name="UserLogin" component={UserLogin} />
      <Stack.Screen name="UserSignup" component={UserSignup} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassWord} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="ForgetPasswordOtp" component={ForgetPasswordOtp} />
      <Stack.Screen name="ResetPassword" component={ResetPassWord} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isLoggedIn, role } = useAuth();

  if (isLoggedIn) {
    return role === "admin" ? (
      <>
        <AdminDrawer />
      </>
    ) : (
      <UserStack />
    );
  } else {
    return <AuthStack />;
  }
}

export default function App() {
 
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <SubscriptionProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppContent />
            </NavigationContainer>
            <StatusBar style="dark" backgroundColor="white" />
          </SafeAreaProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: Platform.OS === "white" ? StatusBar.currentHeight : 0,
  },
});

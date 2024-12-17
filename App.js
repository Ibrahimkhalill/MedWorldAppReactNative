import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { StyleSheet, Platform } from "react-native";
import WelcomeScreen from "./app/screen/WelcomeScreen";
import UserLogin from "./app/screen/authentication/UserLogin";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Home from "./app/screen/admin/Home";
import AllCustomer from "./app/screen/admin/AllCustomer";
import CreateNewUser from "./app/screen/admin/CreateNewUser";
import Glass from "./app/screen/admin/Glass";
import MosquitoNetting from "./app/screen/admin/MosquitoNetting";
import VatInstallation from "./app/screen/admin/VatInstallation";
import MailData from "./app/screen/admin/MailData";
import PhoneData from "./app/screen/admin/PhoneData";
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
import { StripeProvider } from "@stripe/stripe-react-native";
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
    >
      <Drawer.Screen
        name="Admin_Dashboard"
        component={Home}
        options={{
          title: "Home",
          drawerIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              size={focused ? 25 : 25}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="all_customer"
        component={AllCustomer}
        options={{
          title: "All Customer",
          drawerIcon: ({ focused }) => (
            <MaterialIcons
              name="people"
              size={focused ? 25 : 25}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="create_new_user"
        component={CreateNewUser}
        options={{
          title: "User",
          drawerIcon: ({ focused }) => (
            <MaterialIcons
              name="person-add"
              size={focused ? 25 : 25}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="glass"
        component={Glass}
        options={{
          title: "Glass",
          drawerIcon: ({ focused }) => (
            <MaterialIcons
              name="window"
              size={focused ? 25 : 25}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="mosquito_netting"
        component={MosquitoNetting}
        options={{
          title: "Mosquito Netting",
          drawerIcon: ({ focused }) => (
            <FontAwesome6
              name="mosquito-net"
              size={focused ? 20 : 20}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="vat_installation"
        component={VatInstallation}
        options={{
          title: "Vat & Installation",
          drawerIcon: ({ focused }) => (
            <MaterialIcons
              name="build"
              size={focused ? 25 : 25}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="mail_data"
        component={MailData}
        options={{
          title: "Mail Data",
          drawerIcon: ({ focused }) => (
            <MaterialIcons
              name="mail"
              size={focused ? 25 : 25}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="phone_data"
        component={PhoneData}
        options={{
          title: "Phone Data",
          drawerIcon: ({ focused }) => (
            <MaterialIcons
              name="phone"
              size={focused ? 25 : 25}
              color={focused ? "#7cc" : "#ccc"}
            />
          ),
        }}
      />
    </Drawer.Navigator>
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
      <StripeProvider
        publishableKey="pk_test_51QRTfHALRymUd61pQIlqCCDPqE2qT97tbKJUK2LGFisLHlpqWr6MqPMaz9HRXvjuDxvCVWsLAIQ8YbnoU46P3H8600tmZcy5rk"
        merchantIdentifier=""
      >
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
      </StripeProvider>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: Platform.OS === "white" ? StatusBar.currentHeight : 0,
  },
});

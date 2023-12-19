import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "@/views/login";
import BottomTabs from "@/navigations/bottomTabs";
import CustomNavigationBar from "@/components/appBar";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStacks() {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
      }}
    >
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="main" component={BottomTabs} />
    </Stack.Navigator>
  );
}

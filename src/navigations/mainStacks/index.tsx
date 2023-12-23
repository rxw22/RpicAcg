import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "@/views/login";
import BottomTabs from "@/navigations/bottomTabs";
import CustomNavigationBar from "@/components/appBar";
import Settings from "@/views/settings";
import Search from "@/views/search";
import CustomSearchBar from "@/components/searchBar";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStacks() {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="main"
        component={BottomTabs}
        options={{ title: "main", headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{ title: "设置" }}
      />
      <Stack.Screen
        name="search"
        component={Search}
        options={{
          header: (props) => <CustomSearchBar {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}

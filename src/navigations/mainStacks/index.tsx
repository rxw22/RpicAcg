import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "@/views/login";
import BottomTabs from "@/navigations/bottomTabs";
import CustomNavigationBar from "@/components/appBar";
import Settings from "@/views/settings";
import Search from "@/views/search";
import CustomSearchBar from "@/components/searchBar";
import { useUserStore } from "@/store/userStore";
import CollectBar from "@/components/collectBar";
import ComicDetails from "@/views/details";
import Reader from "@/views/reader";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStacks() {
  const { email, token, password } = useUserStore();
  const isLogin = email && token && password ? "main" : "login";
  return (
    <Stack.Navigator
      initialRouteName={isLogin}
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
      <Stack.Screen
        name="details"
        component={ComicDetails}
        options={{
          title: "漫画详情",
          header: (props) => <CollectBar {...props} />,
        }}
      />
      <Stack.Screen
        name="reader"
        component={Reader}
        options={{
          title: "阅读器",
          // headerShown: false,
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

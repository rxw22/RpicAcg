import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { BottomNavigation } from "react-native-paper";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import Home from "@/views/home";
import Settings from "@/views/settings";
import User from "@/views/user";
import Category from "@/views/category";
import Ranking from "@/views/ranking";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => {
        return (
          <BottomNavigation.Bar
            shifting={true}
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({ focused, color, size: 24 });
              }
              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : // @ts-ignore
                    route.title;
              return label;
            }}
          />
        );
      }}
    >
      <Tab.Screen
        name="home"
        options={{
          tabBarLabel: "首页",
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "home" : "home-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={Home}
      />
      <Tab.Screen
        name="settings"
        options={{
          tabBarLabel: "设置",
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "cog" : "cog-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={Settings}
      />
      <Tab.Screen
        name="user"
        options={{
          tabBarLabel: "我的",
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "account" : "account-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={User}
      />
      <Tab.Screen
        name="ranking"
        options={{
          tabBarLabel: "排行",
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "chart-box" : "chart-box-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={Ranking}
      />
      <Tab.Screen
        name="category"
        options={{
          tabBarLabel: "分类",
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "shape" : "shape-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={Category}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <MyTabs />
        <StatusBar style="auto" />
      </PaperProvider>
    </NavigationContainer>
  );
}

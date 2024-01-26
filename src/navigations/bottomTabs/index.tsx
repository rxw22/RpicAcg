import { CommonActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomNavigation } from "react-native-paper";

import Game from "@/views/game";
import User from "@/views/user";
import Category from "@/views/category";
import { RootBottomTabsParamList } from "./types";
import CategoryAppBar from "@/views/category/AppBar";
import GameAppBar from "@/views/game/AppBar";
import UserAppBar from "@/views/user/appBar";

const Tab = createBottomTabNavigator<RootBottomTabsParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="category"
      tabBar={({ navigation, state, descriptors, insets }) => {
        return (
          <BottomNavigation.Bar
            shifting
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
        name="category"
        options={{
          tabBarLabel: "分类",
          title: "分类",
          header: (props) => <CategoryAppBar {...props} />,
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "shape" : "shape-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={Category}
      />
      {/* <Tab.Screen
        name="ranking"
        options={{
          tabBarLabel: "排行",
          header: (props) => <RankingAppBar {...props} />,
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "equalizer" : "equalizer-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={Ranking}
      /> */}
      <Tab.Screen
        name="game"
        options={{
          tabBarLabel: "游戏",
          header: (props) => <GameAppBar {...props} />,
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "gamepad" : "gamepad-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={Game}
      />
      <Tab.Screen
        name="user"
        options={{
          tabBarLabel: "我的",
          header: (props) => <UserAppBar {...props} />,
          tabBarIcon: ({ color, size, focused }) => {
            const name = focused ? "account" : "account-outline";
            return <Icon name={name} size={size} color={color} />;
          },
        }}
        component={User}
      />
    </Tab.Navigator>
  );
}

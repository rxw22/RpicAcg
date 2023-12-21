import { CommonActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomNavigation } from "react-native-paper";

import Home from "@/views/home";
import User from "@/views/user";
import Category from "@/views/category";
import Ranking from "@/views/ranking";
import usePunchIn from "@/hooks/usePunchIn";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  // const { result } = usePunchIn();
  const srceens: React.ComponentProps<typeof Tab.Screen>[] = [
    {
      name: "home",
      options: {
        tabBarLabel: "首页",
        tabBarIcon: ({ color, size, focused }) => {
          const name = focused ? "home" : "home-outline";
          return <Icon name={name} size={size} color={color} />;
        },
      },
      component: Home,
    },
    {
      name: "category",
      options: {
        tabBarLabel: "分类",
        tabBarIcon: ({ color, size, focused }) => {
          const name = focused ? "shape" : "shape-outline";
          return <Icon name={name} size={size} color={color} />;
        },
      },
      component: Category,
    },
    {
      name: "ranking",
      options: {
        tabBarLabel: "排行",
        tabBarIcon: ({ color, size, focused }) => {
          const name = focused ? "chart-box" : "chart-box-outline";
          return <Icon name={name} size={size} color={color} />;
        },
      },
      component: Ranking,
    },
    {
      name: "user",
      options: {
        tabBarLabel: "我的",
        tabBarIcon: ({ color, size, focused }) => {
          const name = focused ? "account" : "account-outline";
          return <Icon name={name} size={size} color={color} />;
        },
      },
      component: User,
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="user"
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
      {srceens.map((item) => (
        <Tab.Screen {...item} key={item.name} />
      ))}
    </Tab.Navigator>
  );
}

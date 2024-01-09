import { useWindowDimensions } from "react-native";
import React from "react";
import {
  TabBar,
  TabView,
  SceneMap,
  SceneRendererProps,
} from "react-native-tab-view";
import { useTheme, Text } from "react-native-paper";
import { useNetworkProvider } from "@/network/networkProvider";
import { useRequest } from "ahooks";
import { LeaderQuery } from "@/network/types";
import CommonList from "./CommonList";
import BgBox from "@/components/bgBox";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from "@react-navigation/native";
import {
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";

type SceneProps = {
  route: {
    key: string;
    title: string;
    navigation: CompositeNavigationProp<
      BottomTabNavigationProp<RootBottomTabsParamList, "ranking", undefined>,
      NativeStackNavigationProp<
        RootStackParamList,
        keyof RootStackParamList,
        undefined
      >
    >;
  };
} & Omit<SceneRendererProps, "layout">;

const DayRanking: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useNetworkProvider();

  const { loading, data } = useRequest(
    httpRequest.fetchComicsRanking.bind(httpRequest),
    {
      defaultParams: [{ tt: LeaderQuery.Day, ct: "VC" }],
      onError(e) {
        console.log(e);
      }
    }
  );

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5 }}>
      <CommonList
        dataSource={data || []}
        navigation={route.navigation}
        loading={loading}
      />
    </BgBox>
  );
};

const WeekRanking: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useNetworkProvider();

  const { loading, data } = useRequest(
    httpRequest.fetchComicsRanking.bind(httpRequest),
    {
      defaultParams: [{ tt: LeaderQuery.Week, ct: "VC" }],
      onError(e) {
        console.log(e);
      }
    }
  );

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5 }}>
      <CommonList
        dataSource={data || []}
        navigation={route.navigation}
        loading={loading}
      />
    </BgBox>
  );
};

const MonthRanking: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useNetworkProvider();

  const { loading, data } = useRequest(
    httpRequest.fetchComicsRanking.bind(httpRequest),
    {
      defaultParams: [{ tt: LeaderQuery.Month, ct: "VC" }],
      onError(e) {
        console.log(e);
      }
    }
  );

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5 }}>
      <CommonList
        dataSource={data || []}
        navigation={route.navigation}
        loading={loading}
      />
    </BgBox>
  );
};

const renderScene = SceneMap({
  first: DayRanking,
  second: WeekRanking,
  three: MonthRanking,
});

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabsParamList, "ranking">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function Ranking({ navigation }: Props) {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "24小时", navigation },
    { key: "second", title: "7天", navigation },
    { key: "three", title: "30天", navigation },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={({ route }) =>
        route.key === "second" || route.key === "three"
      }
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          style={{ backgroundColor: theme.colors.background }}
          renderLabel={({ route, focused }) => (
            <Text
              variant="labelLarge"
              style={focused ? { color: theme.colors.primary } : {}}
            >
              {route.title}
            </Text>
          )}
          pressColor={theme.colors.primary}
        />
      )}
    />
  );
}

import { useWindowDimensions } from "react-native";
import React, { useCallback, memo } from "react";
import {
  TabBar,
  TabView,
  SceneMap,
  SceneRendererProps,
} from "react-native-tab-view";
import { useTheme, Text } from "react-native-paper";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { LeaderQuery } from "@/network/types";
// import CommonList from "./CommonList";
import List from "@/components/ComicsList";
import BgBox from "@/components/bgBox";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import LoadingMask from "@/components/LoadingMask";
import KnightList from "./KnightList";

type SceneProps = {
  route: {
    key: string;
    title: string;
    navigation: NativeStackNavigationProp<RootStackParamList, "ranking", undefined>
  };
} & Omit<SceneRendererProps, "layout">;

const DayRanking: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useUtilsProvider();

  const { loading, data } = useRequest(
    httpRequest.fetchComicsRanking.bind(httpRequest),
    {
      defaultParams: [{ tt: LeaderQuery.Day, ct: "VC" }],
      onError(e) {
        console.log(e);
      },
    }
  );

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    route.navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5, position: "relative" }}>
      <LoadingMask once={true} loading={loading} />
      <List
        dataSource={data || []}
        navigate={navigate}
        loading={loading}
        loadMore={() => {}}
      />
    </BgBox>
  );
};

const WeekRanking: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useUtilsProvider();

  const { loading, data } = useRequest(
    httpRequest.fetchComicsRanking.bind(httpRequest),
    {
      defaultParams: [{ tt: LeaderQuery.Week, ct: "VC" }],
      onError(e) {
        console.log(e);
      },
    }
  );

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    route.navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5, position: "relative" }}>
      <LoadingMask once={true} loading={loading} />
      <List
        dataSource={data || []}
        navigate={navigate}
        loading={loading}
        loadMore={() => {}}
      />
    </BgBox>
  );
};

const MonthRanking: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useUtilsProvider();

  const { loading, data } = useRequest(
    httpRequest.fetchComicsRanking.bind(httpRequest),
    {
      defaultParams: [{ tt: LeaderQuery.Month, ct: "VC" }],
      onError(e) {
        console.log(e);
      },
    }
  );

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    route.navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5, position: "relative" }}>
      <LoadingMask once={true} loading={loading} />
      <List
        dataSource={data || []}
        navigate={navigate}
        loading={loading}
        loadMore={() => {}}
      />
    </BgBox>
  );
};

const KnightRanking: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useUtilsProvider();

  const { loading, data } = useRequest(
    httpRequest.fetchKinghts.bind(httpRequest),
    {
      onError(e) {
        console.log(e);
      },
    }
  );

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    route.navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5, position: "relative" }}>
      <LoadingMask once={true} loading={loading} />
      <KnightList dataSource={data || []} navigate={navigate} />
    </BgBox>
  );
};

const renderScene = SceneMap({
  first: memo(DayRanking),
  second: memo(WeekRanking),
  three: memo(MonthRanking),
  four: memo(KnightRanking),
});

type Props = NativeStackScreenProps<RootStackParamList, "ranking">;

function Ranking({ navigation }: Props) {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "24小时", navigation },
    { key: "second", title: "7天", navigation },
    { key: "three", title: "30天", navigation },
    { key: "four", title: "骑士榜", navigation },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={({ route }) =>
        route.key === "second" || route.key === "three" || route.key === "four"
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

export default React.memo(Ranking);

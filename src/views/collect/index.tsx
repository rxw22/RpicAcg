import { View, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import {
  TabBar,
  TabView,
  SceneMap,
  SceneRendererProps,
} from "react-native-tab-view";
import { useTheme, Text } from "react-native-paper";
import { useNetworkProvider } from "@/network/networkProvider";
import { useRequest } from "ahooks";
import { ComicSort } from "@/network/types";
import CommonList from "./CommonList";
import BgBox from "@/components/bgBox";

type SceneProps = {
  route: {
    key: string;
    title: string;
  };
} & Omit<SceneRendererProps, "layout">;

const NetCollect: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useNetworkProvider();
  const [page, setPage] = useState(1);

  const { data, loading } = useRequest(
    httpRequest.fetchUserFavourite.bind(httpRequest),
    {
      defaultParams: [{ page: page, s: ComicSort.NewToOld }],
      onError(e) {
        console.log(e);
      },
    }
  );

  const { docs } = data?.data.comics || {};

  return (
    <BgBox style={{ flex: 1 }}>
      <CommonList dataSource={docs || []} />
    </BgBox>
  );
};

const SecondRoute = ({ route }: any) => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const ThreeRoute = () => <View style={{ flex: 1, backgroundColor: "black" }} />;

const renderScene = SceneMap({
  first: NetCollect,
  second: SecondRoute,
  three: ThreeRoute,
});

export default function Collect() {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "网络收藏" },
    { key: "second", title: "浏览记录" },
    { key: "three", title: "本地收藏" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={({ route }) =>
        route.title === "浏览记录" || route.title === "本地收藏"
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

import { View, useWindowDimensions } from "react-native";
import React, { useState, useRef } from "react";
import {
  TabBar,
  TabView,
  SceneMap,
  SceneRendererProps,
} from "react-native-tab-view";
import { useTheme, Text } from "react-native-paper";
import { useNetworkProvider } from "@/network/networkProvider";
import { useRequest } from "ahooks";
import { Comic, ComicSort } from "@/network/types";
import CommonList from "./CommonList";
import BgBox from "@/components/bgBox";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";

type SceneProps = {
  route: {
    key: string;
    title: string;
    navigation: NativeStackNavigationProp<
      RootStackParamList,
      "collect",
      undefined
    >;
  };
} & Omit<SceneRendererProps, "layout">;

const NetCollect: React.FC<SceneProps> = ({ route }) => {
  const { httpRequest } = useNetworkProvider();
  const [dataSource, setDataSource] = useState<Comic[]>([]);
  const pageRef = useRef({
    page: 0,
    pages: 1,
    s: ComicSort.NewToOld,
  });

  const { loading, run } = useRequest(
    httpRequest.fetchUserFavourite.bind(httpRequest),
    {
      manual: true,
      onError(e) {
        console.log(e);
      },
      onSuccess(data, params) {
        const { docs, pages } = data?.data.comics || {};
        setDataSource([...dataSource, ...docs]);
        pageRef.current.page = params[0].page || 1;
        pageRef.current.pages = pages;
        pageRef.current.s = params[0].s || ComicSort.NewToOld;
      },
    }
  );

  const loadMore = () => {
    if (pageRef.current.page < pageRef.current.pages) {
      run({ page: pageRef.current.page + 1, s: pageRef.current.s });
    }
  };

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5 }}>
      <CommonList
        dataSource={dataSource}
        navigation={route.navigation}
        loadMore={loadMore}
        loading={loading}
      />
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

type Props = NativeStackScreenProps<RootStackParamList, "collect">;

export default function Collect({ navigation }: Props) {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "网络收藏", navigation },
    { key: "second", title: "浏览记录", navigation },
    { key: "three", title: "本地收藏", navigation },
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

import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useRequest } from "ahooks";
import { Image, ImageBackground } from "expo-image";
import { useState, useLayoutEffect } from "react";

import BgBox from "@/components/bgBox";
import { useNetworkProvider } from "@/network/networkProvider";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import AppBar from "./appBar";

import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabsParamList, "user">,
  NativeStackScreenProps<RootStackParamList>
>;

const User: React.FC<Props> = (props) => {
  const { httpRequest } = useNetworkProvider();
  const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const [errorMsg, setErrorMsg] = useState("");

  const { data, loading, refresh } = useRequest(
    httpRequest.fetchUserProfile.bind(httpRequest),
    {
      onError(e) {
        console.log(e);
        setErrorMsg(e.message || "发生了某些出乎意料的错误！");
      },
    }
  );

  const {
    data: favourites,
    loading: favouriteLoading,
    refresh: favouriteRefresh,
  } = useRequest(httpRequest.fetchUserFavourite.bind(httpRequest), {
    onError(e) {
      console.log(e);
      setErrorMsg(e.message || "发生了某些出乎意料的错误！");
    },
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTransparent: true,
      header: () => <AppBar flag={true} />,
    });
  }, []);

  const _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent;
    const { y } = contentOffset;
    props.navigation.setOptions({
      header: () => <AppBar flag={y <= 20} />,
    });
  };

  const { user } = data?.data || {};

  return (
    <BgBox
      style={styles.container}
      error={errorMsg}
      loading={loading || favouriteLoading}
      refresh={() => {
        refresh();
        favouriteRefresh();
      }}
    >
      <ImageBackground
        style={[styles.background, { paddingTop: statusBarHeight + 64 }]}
        source={
          loading
            ? require("@/assets/imgs/placeholder1.png")
            : {
                uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
              }
        }
        blurRadius={4}
      >
        <View style={[styles.userWapper, { top: statusBarHeight + 64 }]}>
          <View style={styles.center}>
            <Text variant="bodyLarge" style={{ color: "#fff" }}>
              Lv.{user?.level || 0}
            </Text>
            <Text variant="bodyLarge" style={{ color: "#fff" }}>
              Exp: {user?.exp || 0}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
              }}
              contentPosition="top center"
              style={styles.avatarImage}
              placeholder={require("@/assets/imgs/猫爪.png")}
            />
          </View>
          <View style={styles.center}>
            <Text variant="bodyLarge" style={{ color: "#fff" }}>
              {user?.name}
            </Text>
            <Text
              variant="bodyLarge"
              style={{ color: "#fff" }}
              numberOfLines={2}
            >
              {user?.slogan}
            </Text>
          </View>
        </View>
        <ScrollView
          style={styles.scrollWarpper}
          showsVerticalScrollIndicator={false}
          onScroll={_onScroll}
        >
          <View style={styles.userWapperMask}></View>
          <BgBox style={styles.content}>
            <View style={styles.title}>
              <Text variant="headlineSmall" style={{ lineHeight: 40 }}>
                网络收藏
              </Text>
              <Button icon="unfold-more-vertical">更多</Button>
            </View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={favourites?.data.comics.docs || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{ width: 120, height: 260, marginHorizontal: 8 }}
                  >
                    <Card
                      style={{
                        width: 120,
                        height: 170,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={{
                          uri: `${item.thumb.fileServer}/static/${item.thumb.path}`,
                        }}
                        style={{ width: "100%", height: 170 }}
                        contentFit="cover"
                      />
                    </Card>
                    <View
                      style={{
                        width: 120,
                        height: 90,
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <Text variant="bodyMedium" numberOfLines={4}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </BgBox>
        </ScrollView>
      </ImageBackground>
    </BgBox>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  background: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  userWapper: {
    width: "100%",
    height: 210,
    padding: 5,
    left: 0,
    right: 0,
    position: "absolute",
  },
  userWapperMask: {
    height: 210,
    padding: 5,
    width: "100%",
    opacity: 0,
    pointerEvents: "none",
  },
  content: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 5,
    height: 700,
  },
  center: {
    alignItems: "center",
  },
  avatar: {
    marginVertical: 8,
    alignItems: "center",
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  scrollWarpper: {
    width: "100%",
  },
  title: {
    height: 40,
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
  },
});

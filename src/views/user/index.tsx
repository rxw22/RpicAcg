import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Text } from "react-native-paper";
import { useRequest } from "ahooks";
import { ImageBackground } from "expo-image";
import { useLayoutEffect } from "react";
import Image from "@/components/image";

import BgBox from "@/components/bgBox";
import { useNetworkProvider } from "@/network/networkProvider";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import AppBar from "./appBar";

import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import HorizontalList from "./horizontalList";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabsParamList, "user">,
  NativeStackScreenProps<RootStackParamList>
>;

const User: React.FC<Props> = (props) => {
  const { httpRequest } = useNetworkProvider();
  const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

  const { data, loading, refresh, error } = useRequest(
    httpRequest.fetchUserProfile.bind(httpRequest),
    {
      onError(e) {
        console.log(e);
      },
    }
  );

  const {
    data: favourites,
    loading: favouriteLoading,
    refresh: favouriteRefresh,
    error: favouriteError,
  } = useRequest(httpRequest.fetchUserFavourite.bind(httpRequest), {
    onError(e) {
      console.log(e);
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
      error={error?.message || favouriteError?.message}
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
              source={
                loading
                  ? require("@/assets/imgs/猫爪.png")
                  : {
                      uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
                    }
              }
              contentPosition="top center"
              style={styles.avatarImage}
              // placeholder={require("@/assets/imgs/猫爪.png")}
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
            <HorizontalList title="网络收藏" dataSource={favourites} />
            <View style={styles.sizeBox} />
            <HorizontalList title="浏览记录" dataSource={favourites} />
            <View style={styles.sizeBox} />
            <HorizontalList title="本地收藏" dataSource={favourites} />
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
    // height: 700,
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
  sizeBox: {
    width: "100%",
    height: 30,
  },
});

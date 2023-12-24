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
import { Image, ImageBackground } from "expo-image";
import { useEffect, useState, useLayoutEffect } from "react";

import BgBox from "@/components/bgBox";
import { useNetworkProvider } from "@/network/networkProvider";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import AppBar from "./appBar";
import LoadingWarpper from "@/components/loadingWarpper";

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
    <BgBox style={styles.container}>
      <LoadingWarpper loading={loading} errorMsg={errorMsg} />
      <ImageBackground
        style={[styles.background, { paddingTop: statusBarHeight + 64 }]}
        source={{
          uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
        }}
        blurRadius={4}
      >
        <ScrollView
          style={styles.scrollWarpper}
          showsVerticalScrollIndicator={false}
          onScroll={_onScroll}
        >
          <View style={styles.userWapper}>
            <View style={styles.center}>
              <Text variant="bodyLarge" style={{ color: "#fff" }}>
                Lv.{user?.level}
              </Text>
              <Text variant="bodyLarge" style={{ color: "#fff" }}>
                Exp: {user?.exp}
              </Text>
            </View>
            <View style={styles.avatar}>
              <Image
                source={{
                  uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
                }}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.center}>
              <Text variant="bodyLarge" style={{ color: "#fff" }}>
                {user?.name}
              </Text>
              <Text
                variant="bodyLarge"
                style={{ color: "#fff" }}
                numberOfLines={3}
              >
                {user?.slogan}
              </Text>
            </View>
          </View>
          <BgBox style={styles.content}>
            <Text variant="headlineLarge">{JSON.stringify(data)}</Text>
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
  },
  userWapper: {
    height: 200,
  },
  content: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 5,
    flex: 1,
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
    height: "100%",
    width: "100%",
  },
});

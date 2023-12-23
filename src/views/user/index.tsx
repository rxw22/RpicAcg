import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  LayoutChangeEvent,
} from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useRequest } from "ahooks";
import { Image, ImageBackground } from "expo-image";
import { useEffect, useRef } from "react";

import BgBox from "@/components/bgBox";
import { useNetworkProvider } from "@/network/networkProvider";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";

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
  const imageViewHeight = useRef(0);

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.Content title="我的" />
          <Appbar.Action icon="archive-edit" onPress={() => {}} />
        </Appbar.Header>
      ),
    });
  }, []);

  const imageViewLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    imageViewHeight.current = height;
  };

  const { data, loading, refresh } = useRequest(
    httpRequest.fetchUserProfile.bind(httpRequest),
    {
      onError(e) {
        console.log(e);
      },
    }
  );
  const { user } = data?.data || {};

  return (
    <BgBox style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ImageBackground
          onLayout={imageViewLayout}
          style={[styles.userWarpper]}
          source={{
            uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
          }}
          blurRadius={4}
        >
          <View style={{ alignItems: "center" }}>
            <Text variant="bodyLarge" style={styles.text}>
              Lv.{user?.level}
            </Text>
            <Text variant="bodyLarge" style={styles.text}>
              Exp: {user?.exp}
            </Text>
          </View>
          <View style={{ marginTop: 10, marginBottom: 15 }}>
            <Image
              source={{
                uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
              }}
              style={styles.avatar}
              contentFit="contain"
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text variant="bodyLarge" style={styles.text}>
              {user?.name}
            </Text>
            <Text variant="bodyLarge" style={styles.text}>
              {user?.title}
            </Text>
            <Text variant="bodyLarge" style={styles.text} numberOfLines={3}>
              {user?.slogan}
            </Text>
          </View>
        </ImageBackground>
        <Text variant="headlineLarge">{JSON.stringify(data)}</Text>
      </ScrollView>
    </BgBox>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  userWarpper: {
    width: "100%",
    backgroundColor: "#ccc",
    alignItems: "center",
    padding: 5,
  },
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  text: {
    color: "#fff",
  },
});

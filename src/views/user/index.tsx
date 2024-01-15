import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Card, FAB, Text } from "react-native-paper";
import { useRequest } from "ahooks";
import { ImageBackground } from "expo-image";
import { useState } from "react";
import Image from "@/components/image";

import BgBox from "@/components/bgBox";
import { useUtilsProvider } from "@/network/utilsProvider";
import { RootBottomTabsParamList } from "@/navigations/bottomTabs/types";
import AppBar from "./appBar";

import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import HorizontalList from "./horizontalList";
import { ComicSort } from "@/network/types";
import { useReadStore } from "@/store/readStore";
import React from "react";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabsParamList, "user">,
  NativeStackScreenProps<RootStackParamList>
>;

const User: React.FC<Props> = (props) => {
  const { httpRequest } = useUtilsProvider();
  const { localCollect, browses } = useReadStore();

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
    defaultParams: [{ page: 1, s: ComicSort.NewToOld }],
    onError(e) {
      console.log(e);
    },
  });

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
        style={styles.background}
        source={
          loading
            ? require("@/assets/imgs/placeholder.png")
            : {
                uri: `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`,
              }
        }
        blurRadius={4}
      >
        <View style={styles.userWapper}>
          <View style={styles.center}>
            <Text variant="bodyLarge" style={{ color: "#fff" }}>
              Lv.{user?.level || 0}
            </Text>
            <Text variant="bodyLarge" style={{ color: "#fff" }}>
              Exp: {user?.exp || 0}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Card mode="contained" style={styles.avatarImage}>
              <Image
                source={
                  user?.avatar
                    ? `${user?.avatar?.fileServer}/static/${user?.avatar?.path}`
                    : require("@/assets/imgs/user.png")
                }
                contentPosition="top center"
                style={{ width: "100%", height: "100%" }}
                showLoading={false}
              />
            </Card>
          </View>
          <View style={styles.center}>
            <Text variant="bodyLarge" style={{ color: "#fff" }}>
              {user?.name}
            </Text>
            <Text variant="bodyMedium" style={{ color: "#fff" }}>
              {user?.title}
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
        >
          <View style={styles.userWapperMask} />
          <BgBox style={styles.content}>
            <HorizontalList
              title="网络收藏"
              dataSource={favourites?.data.comics.docs || []}
              navigation={props.navigation}
              total={favourites?.data.comics.total || 0}
            />
            <View style={styles.sizeBox} />
            <HorizontalList
              title="本地收藏"
              dataSource={localCollect}
              navigation={props.navigation}
              total={localCollect.length}
            />
            <View style={styles.sizeBox} />
            <HorizontalList
              title="浏览记录"
              dataSource={browses}
              navigation={props.navigation}
              total={browses.length}
            />
          </BgBox>
        </ScrollView>
        <FAB
          icon="restore"
          style={styles.fab}
          onPress={() => {
            refresh();
            favouriteRefresh();
          }}
          size="medium"
        />
      </ImageBackground>
    </BgBox>
  );
};

export default React.memo(User);

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
    height: 250,
    padding: 5,
    left: 0,
    right: 0,
    position: "absolute",
    paddingTop: 10,
  },
  userWapperMask: {
    height: 250,
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
    overflow: "hidden",
  },
  scrollWarpper: {
    width: "100%",
  },
  sizeBox: {
    width: "100%",
    height: 15,
  },
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});

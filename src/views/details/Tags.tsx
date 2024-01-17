import { StyleSheet, View } from "react-native";
import React, { memo } from "react";
import { Chip, useTheme } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { ComicDetail } from "@/network/types";

interface Props {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "details",
    undefined
  >;
  response: ComicDetail | undefined;
}

const Tags: React.FC<Props> = ({ navigation, response }) => {
  const theme = useTheme();
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Chip style={{ backgroundColor: theme.colors.primaryContainer }}>
          作者
        </Chip>
        <Chip
          onPress={() => {
            navigation.push("comics", {
              a: response?.author,
            });
          }}
          style={{
            marginLeft: 8,
            backgroundColor: theme.colors.surfaceVariant,
          }}
        >
          {response?.author || "未知"}
        </Chip>
      </View>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <Chip style={{ backgroundColor: theme.colors.primaryContainer }}>
          汉化
        </Chip>
        <Chip
          onPress={() => {
            navigation.push("comics", {
              ct: response?.chineseTeam,
            });
          }}
          style={{
            marginLeft: 8,
            backgroundColor: theme.colors.surfaceVariant,
          }}
        >
          {response?.chineseTeam || "未知"}
        </Chip>
      </View>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <View>
          <Chip style={{ backgroundColor: theme.colors.primaryContainer }}>
            分类
          </Chip>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
          {response?.categories.map((item) => (
            <Chip
              onPress={() => {
                navigation.push("comics", {
                  c: item,
                });
              }}
              style={{
                marginLeft: 8,
                backgroundColor: theme.colors.surfaceVariant,
                marginBottom: 8,
              }}
              key={item}
            >
              {item}
            </Chip>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: "row", marginTop: response ? 0 : 8 }}>
        <View>
          <Chip style={{ backgroundColor: theme.colors.primaryContainer }}>
            标签
          </Chip>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
          {response?.tags.map((item) => (
            <Chip
              onPress={() => {
                navigation.push("comics", {
                  t: item,
                });
              }}
              style={{
                marginLeft: 8,
                backgroundColor: theme.colors.surfaceVariant,
                marginBottom: 8,
              }}
              key={item}
            >
              {item}
            </Chip>
          ))}
        </View>
      </View>
    </>
  );
};

export default memo(Tags);

const styles = StyleSheet.create({});

import { View, StyleSheet, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { Comic } from "@/network/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { Card, Icon, Text, useTheme } from "react-native-paper";
import { Image } from "expo-image";

type Props = {
  item: Comic;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "collect",
    undefined
  >;
};

const Item: React.FC<Props> = ({ item, navigation }) => {
  const theme = useTheme();
  const { thumb, author, title, totalLikes, totalViews, categories } = item;
  const [update, setUpdate] = useState(false);
  const lastUri = useRef(`${thumb.fileServer}/static/${thumb.path}`);
  const uri = `${thumb.fileServer}/static/${thumb.path}`;
  if (uri !== lastUri.current) {
    lastUri.current = uri;
    setUpdate(true);
  }

  return (
    <Pressable
      style={({ pressed }) => [
        pressed
          ? {
              backgroundColor: `#00000020`,
            }
          : {},
        styles.itemContainer,
      ]}
      onPress={() => {
        navigation.navigate("details", { comicId: item._id });
      }}
    >
      <View
        style={[
          styles.full,
          {
            flexDirection: "row",
            alignItems: "center",
          },
        ]}
      >
        <Card style={styles.itemWarpper} mode="contained">
          {update && (
            <Image
              style={[
                styles.full,
                { position: "absolute", top: 0, right: 0, opacity: 0 },
              ]}
              source={{ uri }}
              onLoad={() => {
                setUpdate(false);
              }}
            />
          )}
          {update ? (
            <Image style={styles.full} source={{}} />
          ) : (
            <Image style={styles.full} source={{ uri }} />
          )}
        </Card>
        <View style={styles.itemDescription}>
          <View>
            <Text variant="titleMedium" numberOfLines={2}>
              {title}
            </Text>
            <Text variant="labelSmall">{author}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              paddingVertical: 8,
              overflow: "hidden",
            }}
          >
            {categories.map((item) => (
              <View
                key={item}
                style={{
                  padding: 6,
                  backgroundColor: theme.colors.secondaryContainer,
                  borderRadius: 6,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <Text variant="labelMedium">{item}</Text>
              </View>
            ))}
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 80,
                justifyContent: "space-between",
              }}
            >
              <Text variant="labelSmall">{totalLikes} </Text>
              <Icon source="heart" size={12} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 80,
                justifyContent: "space-between",
              }}
            >
              <Text variant="labelSmall">{totalViews} </Text>
              <Icon source="eye" size={12} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default React.memo(Item);

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    height: 210,
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    padding: 5,
  },
  itemWarpper: {
    width: 142,
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  itemDescription: {
    flex: 1,
    marginLeft: 8,
    height: "100%",
    justifyContent: "space-between",
  },
  full: {
    width: "100%",
    height: "100%",
  },
});

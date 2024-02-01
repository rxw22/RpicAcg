import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Card,
  useTheme,
  Text,
  Portal,
  Dialog,
  Button,
} from "react-native-paper";
import dayjs from "dayjs";
import Image from "@/components/image";
import { ComicDetail } from "@/network/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";

interface Props {
  response: ComicDetail | undefined;
  loading: boolean;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "details",
    undefined
  >;
}

const Author: React.FC<Props> = ({ response, loading, navigation }) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const uri = `${response?._creator.avatar?.fileServer}/static/${response?._creator.avatar?.path}`;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        showDialog();
      }}
    >
      <View
        style={[
          styles.author,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <Card style={styles.authorAvatar} mode="contained">
          <Image
            style={{ width: "100%", height: "100%" }}
            pageLoading={loading}
            showLoading={false}
            source={{
              uri,
            }}
            size={14}
          />
        </Card>
        <View>
          <Text variant="headlineSmall" numberOfLines={1}>
            {response?._creator.name}
          </Text>
          <Text variant="bodyMedium" numberOfLines={1}>
            {dayjs(response?.updated_at).format("YYYY-MM-DD")}
          </Text>
        </View>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content style={styles.content}>
            <Card style={styles.dialogAvatar} mode="contained">
              <Image
                style={{ width: "100%", height: "100%" }}
                pageLoading={false}
                showLoading={false}
                source={{
                  uri,
                }}
                size={14}
              />
            </Card>
            <View style={{ height: 5 }} />
            <Text variant="titleLarge">{response?._creator.name}</Text>
            <View style={{ height: 5 }} />
            <Text variant="bodySmall">Lv. {response?._creator.level}</Text>
            <View style={{ height: 15 }} />
            <Text variant="bodyMedium">{response?._creator.slogan}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                hideDialog();
                navigation.push("comics", {
                  ca: response?._creator._id,
                  knight: response?._creator.name,
                });
              }}
            >
              ta的上传
            </Button>
            <Button
              onPress={() => {
                hideDialog();
              }}
            >
              取消
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </TouchableOpacity>
  );
};

export default React.memo(Author);

const styles = StyleSheet.create({
  author: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    backgroundColor: "pink",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  authorAvatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    overflow: "hidden",
    marginRight: 12,
  },
  dialogAvatar: {
    height: 52,
    width: 52,
    borderRadius: 26,
    overflow: "hidden",
    marginRight: 12,
  },
  content: {
    alignItems: "center",
  },
});

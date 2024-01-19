import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Text,
  Dialog,
  List,
  Portal,
  Button,
  ActivityIndicator,
} from "react-native-paper";
// import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";

function ClearCache() {
  const [digVisible, setDigVisible] = useState(false);
  const showDialog = () => setDigVisible(true);
  const hideDialog = () => setDigVisible(false);
  const [loading, setLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [size, setSize] = useState("0M");

  // const clearCache = async () => {
  //   try {
  //     setLoading(true);
  //     const result = await Image.clearDiskCache();
  //     if (result) {
  //       getCacheInfo();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getCacheInfo = async () => {
    try {
      if (FileSystem.cacheDirectory) {
        setInfoLoading(true);
        const info = await FileSystem.getInfoAsync(FileSystem.cacheDirectory);
        if (info.exists) {
          setSize((info.size / 1000 / 1000).toFixed(0) + "M");
        } else {
          setSize("获取缓存大小失败");
        }
      } else {
        setSize("0M");
      }
    } catch (error) {
      setSize("获取缓存大小失败");
    } finally {
      setInfoLoading(false);
    }
  };

  const clearAllCache = async () => {
    try {
      if (FileSystem.cacheDirectory) {
        setLoading(true);
        const info = await FileSystem.readDirectoryAsync(
          FileSystem.cacheDirectory
        );
        const tasks = info.map((uri) =>
          FileSystem.deleteAsync(`${FileSystem.cacheDirectory}/${uri}`)
        );
        await Promise.all(tasks);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      getCacheInfo();
    }
  };

  useEffect(() => {
    getCacheInfo();
  }, []);

  return (
    <>
      <Portal>
        <Dialog visible={digVisible} onDismiss={hideDialog}>
          <Dialog.Title>提示</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              确定要清除缓存吗？有些资源（如图片）下次加载可能会耗费流量。
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>取消</Button>
            <Button
              onPress={() => {
                hideDialog();
                clearAllCache();
              }}
            >
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <List.Item
        title="清除缓存"
        style={styles.listItem}
        left={() => <List.Icon icon="broom" />}
        right={() => (
          <ActivityIndicator size={18} animating={loading} hidesWhenStopped />
        )}
        description={infoLoading ? `计算中...` : size}
        onPress={() => {
          showDialog();
        }}
      />
    </>
  );
}

export default React.memo(ClearCache);

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 12,
  },
});

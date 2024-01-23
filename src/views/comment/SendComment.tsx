import { StyleSheet, TextInput, View } from "react-native";
import React, { memo, useRef, useState } from "react";
import {
  IconButton,
  Searchbar,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { Toast } from "toastify-react-native";

type Props = {
  comicId: string;
  refresh: () => void;
};

const SendComment: React.FC<Props> = ({ comicId, refresh }) => {
  const theme = useTheme();
  const { httpRequest } = useUtilsProvider();
  const [content, setContent] = useState("");
  const inputRef = useRef<TextInput>(null);

  const { run, loading } = useRequest(
    httpRequest.sendComment.bind(httpRequest),
    {
      manual: true,
      onSuccess() {
        setContent("");
        Toast.success("评论成功", "bottom");
        refresh();
      },
      onError(e) {
        Toast.error(e.message, "bottom");
      },
      onFinally() {
        inputRef.current?.blur();
      },
    }
  );

  const send = () => {
    if (!content.length) {
      Toast.info("需要说点什么~", "bottom");
      return;
    }
    run({ comicId, content });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        ref={inputRef}
        placeholder="我有话要说"
        icon="chat"
        onChangeText={setContent}
        value={content}
        keyboardType="default"
        returnKeyType="done"
        style={{ paddingRight: 10 }}
        right={() =>
          loading ? (
            <ActivityIndicator animating size={20} />
          ) : (
            <IconButton icon="send" size={22} onPress={send} />
          )
        }
      />
    </View>
  );
};

export default memo(SendComment);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 8,
    right: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
});

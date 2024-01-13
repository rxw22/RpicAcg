import { StyleSheet, TextInput, View } from "react-native";
import React, { memo, useRef, useState } from "react";
import { IconButton, Searchbar, useTheme } from "react-native-paper";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";

type Props = {
  commentId: string;
  refresh: () => void;
};

const SendComment: React.FC<Props> = ({ commentId, refresh }) => {
  const theme = useTheme();
  const { httpRequest, Toast } = useUtilsProvider();
  const [content, setContent] = useState("");
  const inputRef = useRef<TextInput>(null);

  const { run, loading } = useRequest(httpRequest.sendReply.bind(httpRequest), {
    manual: true,
    onSuccess() {
      setContent("");
      Toast.show("回复成功", "success");
      refresh();
    },
    onError(e) {
      Toast.show(e.message, "error");
    },
    onFinally() {
      inputRef.current?.blur();
    },
  });

  const send = () => {
    if (!content.length) {
      Toast.show("需要说点什么~", "info");
      return;
    }
    run({ commentId, content });
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
        loading={loading}
        keyboardType="default"
        returnKeyType="done"
        right={() => <IconButton icon="send" size={22} onPress={send} />}
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

import { StyleSheet, View } from "react-native";
import {
  Text,
  Button,
  TextInput,
  HelperText,
  useTheme,
  Snackbar,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useState, memo } from "react";
import { useRequest } from "ahooks";

import BgBox from "@/components/bgBox";
import Shunt from "./Shunt";

import type { RootStackParamList } from "@/navigations/mainStacks/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SignInPayload } from "@/network/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useUserStore } from "@/store/userStore";

type Props = NativeStackScreenProps<RootStackParamList, "login">;

const Login: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { email, password, saveUserInfo } = useUserStore();
  const { httpRequest } = useUtilsProvider();
  const [isShow, setIsShow] = useState(true);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<Error>();
  const [isPwd, setIsPwd] = useState(true);

  const { run, loading } = useRequest(httpRequest.signIn.bind(httpRequest), {
    manual: true,
    onSuccess(result, [payload]) {
      if (result.data.token) {
        // 导航前隐藏错误提示
        setIsShow(false);
        // 保存用户信息
        saveUserInfo({ ...payload, token: result.data.token });
        navigation.replace("main");
      }
    },
    onError(e) {
      setVisible(true);
      setError(e);
    },
  });

  // 设置Snackbar的隐藏
  const onDismissSnackBar = () => setVisible(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email,
      password,
    },
  });

  const onSubmit = (data: SignInPayload) => run(data);

  return (
    <BgBox style={styles.container}>
      <View>
        <Text
          variant="displayMedium"
          style={[styles.logoText, { color: theme.colors.primary }]}
        >
          RpicAcg
        </Text>
      </View>
      <View style={styles.loginForm}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label="账号"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              left={
                <TextInput.Icon icon="account" forceTextInputFocus={false} />
              }
            />
          )}
          name="email"
        />
        {isShow && (
          <HelperText type="error" visible={!!errors.email}>
            请输入账号。
          </HelperText>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              label="密码"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={isPwd}
              onSubmitEditing={handleSubmit(onSubmit)}
              left={<TextInput.Icon icon="lock" forceTextInputFocus={false} />}
              right={
                value ? (
                  <TextInput.Icon
                    icon={isPwd ? "eye" : "eye-off"}
                    forceTextInputFocus={false}
                    onPress={() => {
                      setIsPwd(!isPwd);
                    }}
                  />
                ) : null
              }
            />
          )}
          name="password"
        />
        {isShow && (
          <HelperText type="error" visible={!!errors.password}>
            请输入密码。
          </HelperText>
        )}

        <Button
          onPress={handleSubmit(onSubmit)}
          mode="contained"
          loading={loading}
          icon="login"
        >
          登录
        </Button>
      </View>
      <View style={styles.opts}>
        <Button
          onPress={() => {
            navigation.navigate("webview", {
              source: "注册",
              uri: "https://manhuabika.com/pregister/",
            });
          }}
          icon="web-plus"
        >
          注册
        </Button>
        <Button
          onPress={() => {
            navigation.navigate("webview", {
              source: "登录",
              uri: "https://manhuabika.com/plogin/",
              injectedJavaScript: `(function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ token: JSON.parse(window.localStorage.getItem('token')).value }));
              })();`,
            });
          }}
          icon="web-check"
        >
          登录
        </Button>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={{ bottom: 20 }}
        icon="alert-circle"
        onIconPress={() => {}}
      >
        {error?.message}
      </Snackbar>
      <Shunt />
    </BgBox>
  );
};

export default memo(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 150,
  },
  logoView: {},
  logoText: {
    fontFamily: "font1",
  },
  loginForm: {
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  opts: {
    paddingTop: 15,
    paddingHorizontal: 25,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

import { StyleSheet, View } from "react-native";
import {
  Text,
  Button,
  TextInput,
  HelperText,
  useTheme,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

import BgBox from "@/components/bgBox";
import usePicaHttp from "@/services/http";

import type { RootStackParamList } from "@/navigations/mainStacks/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SignInPayload } from "@/services/types";

type Props = NativeStackScreenProps<RootStackParamList, "login">;

const Login: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { signIn } = usePicaHttp();
  // 导航前隐藏错误提示
  const [isShow, setIsShow] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInPayload) => {
    try {
      const result = await signIn(data);
      if (result.data.token) {
        setIsShow(false);
        navigation.replace("main");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              left={<TextInput.Icon icon="account" />}
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
              secureTextEntry
              left={<TextInput.Icon icon="lock" />}
            />
          )}
          name="password"
        />
        {isShow && (
          <HelperText type="error" visible={!!errors.password}>
            请输入密码。
          </HelperText>
        )}

        <Button onPress={handleSubmit(onSubmit)} mode="contained">
          登录
        </Button>
      </View>
    </BgBox>
  );
};

export default Login;

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
});

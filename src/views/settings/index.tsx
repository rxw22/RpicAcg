import { StyleSheet } from "react-native";
import { List } from "react-native-paper";

import BgBox from "@/components/bgBox";
import SwitchDark from "./SwitchDark";
import SwitchShunt from "./SwitchShunt";
import PictureQuality from "./PictureQuality";
import ClearCache from "./ClearCache";
import SwitchTheme from "./SwitchTheme";

export default function Settings() {
  return (
    <BgBox style={styles.container}>
      <List.Section>
        <List.Subheader>外观</List.Subheader>
        <SwitchTheme />
        <SwitchDark />
      </List.Section>
      <List.Section>
        <List.Subheader>浏览</List.Subheader>
        <SwitchShunt />
        <PictureQuality />
      </List.Section>
      <List.Section>
        <List.Subheader>缓存</List.Subheader>
        <ClearCache />
      </List.Section>
    </BgBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

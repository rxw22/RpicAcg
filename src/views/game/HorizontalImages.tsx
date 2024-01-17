import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Icon } from "@/network/types";
import { Card } from "react-native-paper";
import ShotImage from "./Image";

interface Props {
  dataSource: Icon[];
}

const HorizontalImages: React.FC<Props> = ({ dataSource }) => {
  return (
    <FlatList
      keyExtractor={(item) => item.path}
      data={dataSource}
      ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      windowSize={8}
      renderItem={({ item }) => {
        return (
          <Card mode="contained" style={{ overflow: "hidden" }}>
            <ShotImage
              fixedHeight={240}
              recyclingKey={item.path}
              source={`${item.fileServer}/static/${item.path}`}
            />
          </Card>
        );
      }}
    />
  );
};

export default React.memo(HorizontalImages);

const styles = StyleSheet.create({
  full: {
    height: "100%",
    width: "100%",
  },
});

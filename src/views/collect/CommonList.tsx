import { FlatList, View, StyleSheet } from "react-native";
import React from "react";
import { Comic } from "@/network/types";
import { Text } from "react-native-paper";

interface Props {
  dataSource: Comic[];
}

const CommonList: React.FC<Props> = ({ dataSource }) => {
  return (
    <FlatList
      keyExtractor={(item) => item._id}
      data={dataSource}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        return (
          <View>
            <Text>{JSON.stringify(item.thumb)}</Text>
          </View>
        );
      }}
    />
  );
};

export default CommonList;

const styles = StyleSheet.create({
  itemWarpper: {
    width: 142,
    height: 200,
    overflow: "hidden",
  },
});

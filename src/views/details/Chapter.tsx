import { StyleSheet, View } from "react-native";
import React from "react";
import { ComicEpisode } from "@/network/types";
import { Button, Text } from "react-native-paper";

interface Props {
  comicEpisodes: ComicEpisode[] | undefined;
  startReader: (
    order: number,
    isScratch: boolean | undefined,
    hasNext: boolean
  ) => void;
}

const Chapter: React.FC<Props> = ({ comicEpisodes, startReader }) => {
  return (
    <View style={styles.epsView}>
      <View style={{ marginBottom: 8 }}>
        <Text variant="headlineSmall">章节</Text>
      </View>
      <View>
        {Array.from({
          length: Math.ceil((comicEpisodes?.length || 0) / 2),
        }).map((_, index) => {
          return (
            <View
              style={{ flexDirection: "row", flex: 1 }}
              key={comicEpisodes?.[index * 2]._id}
            >
              {comicEpisodes?.[index * 2] ? (
                <Button
                  style={styles.epsBtn}
                  contentStyle={styles.epsCard}
                  mode="contained-tonal"
                  onPress={() => {
                    startReader(
                      comicEpisodes?.[index * 2].order,
                      true,
                      (comicEpisodes?.length || 1) >
                        comicEpisodes?.[index * 2].order
                    );
                  }}
                >
                  {comicEpisodes?.[index * 2].title}
                </Button>
              ) : (
                <Button
                  style={styles.epsBtn}
                  contentStyle={styles.epsCard}
                  mode="text"
                >
                  {null}
                </Button>
              )}
              {comicEpisodes?.[index * 2 + 1] ? (
                <Button
                  style={styles.epsBtn}
                  contentStyle={styles.epsCard}
                  mode="contained-tonal"
                  onPress={() => {
                    startReader(
                      comicEpisodes?.[index * 2 + 1].order,
                      true,
                      (comicEpisodes?.length || 1) >
                        comicEpisodes?.[index * 2 + 1].order
                    );
                  }}
                >
                  {comicEpisodes?.[index * 2 + 1].title}
                </Button>
              ) : (
                <Button
                  style={styles.epsBtn}
                  contentStyle={styles.epsCard}
                  mode="text"
                >
                  {null}
                </Button>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default React.memo(Chapter);

const styles = StyleSheet.create({
  epsView: {
    paddingVertical: 15,
  },
  epsBtn: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  epsCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

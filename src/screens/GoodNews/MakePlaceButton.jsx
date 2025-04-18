import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import SquareButton from "../../components/SquareButton";
import { useNavigation } from "@react-navigation/native";

const MakePlaceButton = ({ type, title, style, placeId }) => {
  const navigate = useNavigation();

  return (
    <View style={[styles.makePlaceContainer, style]}>
      {type === "플레이스" && (
        <Text style={styles.makePlaceText}>함께 희소식을 공유할</Text>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "15",
        }}
      >
        <Text style={styles.makePlaceText}>
          {type === "플레이스"
            ? "플레이스를 만들어주세요"
            : "희소식을 들려주세요"}
        </Text>
        <Image
          style={{ width: "20", height: "14" }}
          source={require("../../../assets/icon.png")}
        />
      </View>
      <SquareButton
        text={type === "플레이스" ? "플레이스 만들기" : "희소식 작성하기"}
        width={117}
        height={28}
        onPress={() => {
          navigate.navigate(
            type === "플레이스" ? "MakePlace" : "WriteGoodNews",
            type === "희소식" ? { title: title, placeId: placeId } : undefined
          );
        }}
      />
    </View>
  );
};

export default MakePlaceButton;

const styles = StyleSheet.create({
  makePlaceContainer: {
    alignItems: "center",
    marginTop: "24",
  },
  makePlaceText: {
    fontFamily: "FontL",
    fontSize: 17,
    fontWeight: "400",
    lineHeight: "22",
    letterSpacing: -0.408,
  },
});

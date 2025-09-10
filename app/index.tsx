import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function App() {
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 100, // animate down
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, // animate back to middle
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("signup");
    }, 2200);

    return () => clearTimeout(timer);
  }, [slideAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#a2c1f5",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {},
  logo: {},
  title: {
    fontSize: 50,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});

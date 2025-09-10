import { useAuth } from "@/components/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { logout, username, email, password, users } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    logout();
    navigation.replace("login");
  };

  console.log("user", users);

  return (
    <>
      <Image
        source={require("../assets/images/bgImage.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome, {username}!</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email ?? "Not logged in"}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.value}>
                {password
                  ? showPassword
                    ? password
                    : password.slice(0, 3) + "***"
                  : "Not logged in"}
              </Text>
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#f7f7f7",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 18,
    color: "#222",
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    backgroundColor: "#ccc",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1,
  },
});

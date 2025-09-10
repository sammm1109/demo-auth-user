import { useAuth } from "@/components/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { signup, login, users, isAuthenticated, username } = useAuth();
  const navigation = useNavigation<any>();
  const [newUsername, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cache cleared!");
    } catch (e) {
      console.error("Failed to clear AsyncStorage:", e);
    }
  };

  useEffect(() => {
    // clearAsyncStorage(); // uncomment to clear cache

    if (isAuthenticated && username) {
      navigation.replace("home");
    }
  }, [isAuthenticated, username, navigation]);

  // Email validation regex
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Password validation: at least 6 chars, at least one number
  const validatePassword = (password: string) => {
    return password.length >= 6 && /\d/.test(password);
  };

  const handleSignUp = () => {
    setError("");
    setSuccess("");

    let hasError = false;

    // Username validation
    if (!newUsername) {
      setUsernameError("Username is required");
      hasError = true;
    } else if (users.some((u) => u.username === newUsername)) {
      setUsernameError("Username already exists");
      hasError = true;
    } else {
      setUsernameError("");
    }

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (users.some((u) => u.email === email)) {
      setEmailError("Email already exists");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 6 characters and contain a number"
      );
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    const result = signup(newUsername, email, password);

    if (!result.success) {
      setError(result.error || "Signup failed");
      return;
    }

    setSuccess("Account created successfully!");
    setUsername("");
    setEmail("");
    setPassword("");
    navigation.replace("home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/images/bgImage2.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={[
                styles.input,
                usernameError ? { borderColor: "red" } : null,
              ]}
              placeholder="Username"
              value={newUsername}
              onChangeText={(text) => {
                setUsername(text);
                if (users.some((u) => u.username === text)) {
                  setUsernameError("Username already exists");
                } else if (!text) {
                  setUsernameError("Username is required");
                } else {
                  setUsernameError("");
                }
              }}
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? { borderColor: "red" } : null]}
              placeholder="Your Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (users.some((u) => u.email === text)) {
                  setEmailError("Email already exists");
                } else if (!validateEmail(text)) {
                  setEmailError("Invalid email");
                } else {
                  setEmailError("");
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  passwordError ? { borderColor: "red" } : null,
                ]}
                placeholder="Enter Your Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (!validatePassword(text)) {
                    setPasswordError(
                      "Password must be at least 6 characters and contain a number"
                    );
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
              />
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.bottomDescLabel}>
                Already have an account?{" "}
              </Text>
              <Text style={styles.loginLink}>Log In</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#f7f7f7",
    position: "relative",
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#323538",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginBottom: 12,
  },
  bottomDescLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 18,
    color: "#323538",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  bottomWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
  },
  inputContainer: {
    width: "100%",
    gap: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
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

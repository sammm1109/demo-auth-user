import { useAuth } from "@/components/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  function reset() {
    setEmail("");
    setPassword("");
    setError("");
  }

  const handleSignIn = () => {
    let isValid = true;

    if (!email || !password) {
      setError("Missing fields");
      isValid = false;
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      isValid = false;
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    setError("");
    const success: boolean = login(email, password);
    if (success) {
      navigation.replace("home");
      reset();
    } else {
      setEmail("");
      setPassword("");
      setError("Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/images/bgImage.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              placeholder="Enter Your Password"
              value={password}
              onChangeText={setPassword}
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
        {error === "Invalid credentials" && (
          <TouchableOpacity onPress={() => navigation.navigate("signup")}>
            <Text style={styles.signupText}>
              Don't have an account? Create one
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        {error !== "Invalid credentials" && (
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate("signup")}
          >
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
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
  },
  signupContainer: {
    width: "100%",
    marginTop: 12,
  },
  signupText: {
    textDecorationLine: "underline",
    fontSize: 16,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
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

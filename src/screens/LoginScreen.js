import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { loginUser } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // toggle between admin & user

  const handleLogin = async () => {
    try {
      const res = await loginUser({
        username,
        password,
        role: isAdmin ? "admin" : "student", // 👈 pass role
      });

      if (res.token) {
        if (isAdmin) {
          navigation.navigate("AdminDashboard"); // 👈 redirect to admin page
        } else {
          navigation.navigate("UserDashboard");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* Toggle for Admin / User */}
      <TouchableOpacity
        onPress={() => setIsAdmin(!isAdmin)}
        style={{
          backgroundColor: isAdmin ? "tomato" : "skyblue",
          padding: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {isAdmin ? "Switch to User Login" : "Switch to Admin Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "green", padding: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

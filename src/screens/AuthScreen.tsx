import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SignInForm } from "../components/SignInForm";
import { SignUpForm } from "../components/SignUpForm";
import { auth } from "../services/firebaseConfig";

export const AuthScreen = ({ navigation }: { navigation: any }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {isSignUp ? (
        <SignUpForm onSuccess={() => navigation.navigate("Home")} />
      ) : (
        <SignInForm onSuccess={() => navigation.navigate("Home")} />
      )}

      <Button
        title={isSignUp ? "Já tem conta? Faça login" : "Criar nova conta"}
        onPress={() => setIsSignUp(!isSignUp)}
      />
    </View>
  );
};

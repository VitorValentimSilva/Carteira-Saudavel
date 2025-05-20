import React from "react";
import { View, Alert, Image } from "react-native";
import FormAuth from "../components/FormAuth";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  navigation: StackNavigationProp<any>;
};

export const LoginScreen = ({ navigation }: Props) => {
  const { signIn, loading } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await signIn(values.email, values.password);
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Erro no login", error.message);
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Image
        source={require("../assets/logo2.png")}
        className="w-full h-80 my-8"
      />

      <FormAuth
        isSignUp={false}
        onSubmit={handleSubmit}
        onSwitchMode={() => navigation.navigate("SignUp")}
      />
    </View>
  );
};

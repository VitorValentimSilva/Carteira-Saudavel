import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import Dashboard from "../screens/Dashboard";
import Tracking from "../screens/Tracking";
import Insights from "../screens/Insights";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

function CustomHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View>
      <Text className="font-bold text-[22px]">{title}</Text>
      {subtitle && (
        <Text className="texte-[14px] text-gray-600">{subtitle}</Text>
      )}
    </View>
  );
}

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFF",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Início"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
          headerTitle: () => (
            <CustomHeader title="Carteira Saudável" subtitle="Início" />
          ),
        }}
      />

      <Tab.Screen
        name="Monitorando"
        component={Tracking}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="activity" size={22} color={color} />
          ),
          headerTitle: () => (
            <CustomHeader
              title="Acompanhamento Diário"
              subtitle="Hábitos de saúde"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Percepções"
        component={Insights}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="insights" size={22} color={color} />
          ),
          headerTitle: () => (
            <CustomHeader
              title="Percepções"
              subtitle="Descubra padrões e tendências"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={22} color={color} />
          ),
          headerTitle: () => (
            <CustomHeader title="Perfil" subtitle="Configurações de Conta" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

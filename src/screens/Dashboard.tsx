import { ScrollView, View } from "react-native";
import RecentActivity from "../components/RecentActivity";
import { useData } from "../contexts/DataContext";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import BasicPercentages from "../components/BasicPercentages";
import WalletScore from "../components/WalletScore";

export default function Dashboard() {
  const { refreshData } = useData();

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        padding: 16,
        alignItems: "center",
        gap: 20,
        paddingBottom: 55,
      }}
    >
      <WalletScore />

      <View className="flex-row justify-between items-center w-full">
        <BasicPercentages view="health" />
        <BasicPercentages view="finance" />
      </View>

      <RecentActivity />

      <View className="h-1 bg-transparent" />
    </ScrollView>
  );
}

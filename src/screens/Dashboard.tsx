import { View } from "react-native";
import RecentActivity from "../components/RecentActivity";
import { useData } from "../contexts/DataContext";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import BasicPercentages from "../components/BasicPercentages";

export default function Dashboard() {
  const { refreshData } = useData();

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="flex-row justify-between items-center mb-4 w-full">
        <BasicPercentages view="health" />
        <BasicPercentages view="finance" />
      </View>

      <RecentActivity />
    </View>
  );
}

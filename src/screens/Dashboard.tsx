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
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <View className="w-full">
        <BasicPercentages />
      </View>

      <RecentActivity />
    </View>
  );
}

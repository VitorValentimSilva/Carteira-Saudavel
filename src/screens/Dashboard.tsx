import { View } from "react-native";
import RecentActivity from "../components/RecentActivity";
import { useData } from "../contexts/DataContext";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import Finance from "../components/Finance";

export default function Dashboard() {
  const { refreshData } = useData();

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  return (
    <View className="flex-1 items-center justify-center p-4">
      <View>
        
        <Finance />
      </View>

      <RecentActivity />
    </View>
  );
}

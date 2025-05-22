import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Gastos, Saude, useData } from "../contexts/DataContext";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function RecentActivity() {
  const { getRecentRecords, loading, refreshData } = useData();
  const [recentItems, setRecentItems] = useState<(Gastos | Saude)[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadRecent = async () => {
        const items = await getRecentRecords();
        setRecentItems(items);
      };
      loadRecent();
    }, [])
  );

  const formatValue = (item: Gastos | Saude) => {
    const isGasto = ["Comida", "Transporte", "Lazer"].includes(item.categoria);

    if (isGasto) {
      return `R$ ${item.valor.toFixed(2)}`;
    }

    switch (item.categoria) {
      case "Exercício":
        return `${item.valor} min`;
      case "Sono":
        return `${item.valor} h`;
      case "Água":
        return `${item.valor} L`;
      default:
        return item.valor.toString();
    }
  };

  const renderItem = ({ item }: { item: Gastos | Saude }) => (
    <View className="py-3 border-b border-gray-100">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="font-medium text-base">{item.descricao}</Text>
          <Text className="text-gray-500 text-sm">
            {item.data.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
        <Text className="text-sm font-semibold">{formatValue(item)}</Text>
      </View>
    </View>
  );

  return (
    <View className="bg-white p-4 rounded-lg mb-8 shadow-sm w-full">
      <Text className="text-lg font-bold mb-4">Atividade Recente</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#3b82f6" />
      ) : recentItems.length === 0 ? (
        <Text className="text-gray-500">Nenhuma atividade recente</Text>
      ) : (
        <FlatList
          data={recentItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
        />
      )}
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useData } from "../contexts/DataContext";
import { Gastos, Saude } from "../contexts/DataContext";

type Props = {
  type: "gastos" | "saude";
};

export default function RecordList({ type }: Props) {
  const { getRecords, loading, error } = useData();
  const [records, setRecords] = useState<(Gastos | Saude)[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data =
        type === "gastos"
          ? await getRecords<Gastos>(type)
          : await getRecords<Saude>(type);
      setRecords(data);
    };

    loadData();
  }, [type]);

  const formatValue = (item: Gastos | Saude) => {
    if (item as Gastos) {
      return `R$ ${item.valor.toFixed(2)}`;
    }

    switch (item.categoria) {
      case "Exercício":
        return `${item.valor} minutos`;
      case "Sono":
        return `${item.valor} horas`;
      case "Água":
        return `${item.valor} litros`;
      default:
        return item.valor.toString();
    }
  };

  const renderItem = ({ item }: { item: Gastos | Saude }) => (
    <View className="bg-white p-4 rounded-lg mb-8 shadow-xl">
      <Text className="text-lg font-semibold text-primary">
        {item.categoria}
      </Text>
      <Text className="text-gray-600 mb-2">{item.descricao}</Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-base font-semibold">{formatValue(item)}</Text>
        <Text className="text-sm text-gray-500">
          {item.data.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={records}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

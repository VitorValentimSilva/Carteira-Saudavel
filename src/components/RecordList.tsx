import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useData } from "../contexts/DataContext";
import { BaseRecord } from "../contexts/DataContext";

type Props = {
  type: "financeiro" | "saude";
};

export default function RecordList({ type }: Props) {
  const { getRecords, loading, error } = useData();
  const [records, setRecords] = useState<BaseRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getRecords<BaseRecord>(type);
      setRecords(data);
    };

    loadData();
  }, [type]);

  const formatValue = (item: BaseRecord) => {
    const isFinanceiro = ["Comida", "Transporte", "Lazer"].includes(
      item.categoria
    );

    if (isFinanceiro) {
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

  const renderItem = ({ item }: { item: BaseRecord }) => (
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
      keyExtractor={(item) => {
        if (!item.id) {
          console.error("Registro inválido:", item);
          return Math.random().toString();
        }
        return item.id;
      }}
    />
  );
}

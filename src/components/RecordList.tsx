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

  const formatFinancialValue = (valor: number, sign: string) => {
    const formattedValue = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sign} R$ ${formattedValue}`;
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await getRecords<BaseRecord>(type);
      setRecords(data);
    };

    loadData();
  }, [type]);

  const formatValue = (type: string, item: BaseRecord) => {
    if (type === "financeiro") {
      const sign = item.transacao === "ganho" ? "+" : "-";
      return formatFinancialValue(item.valor, sign);
    } else if (type === "saude") {
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
    }
    return item.valor.toString();
  };

  const renderItem = ({ item }: { item: BaseRecord }) => (
    <View className="bg-white p-4 rounded-lg mb-4 shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-800">
          {item.categoria}
        </Text>
        {type === "financeiro" && item.transacao && (
          <Text
            className={`text-sm font-medium ${
              item.transacao === "ganho" ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.transacao === "ganho" ? "+" : "-"}
          </Text>
        )}
      </View>
      <Text className="text-gray-600 mb-2">{item.descricao}</Text>
      <View className="flex-row justify-between items-center">
        <Text
          className={`text-base font-semibold ${
            type === "financeiro"
              ? item.transacao === "ganho"
                ? "text-green-600"
                : "text-red-600"
              : "text-gray-800"
          }`}
        >
          {formatValue(type, item)}
        </Text>
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

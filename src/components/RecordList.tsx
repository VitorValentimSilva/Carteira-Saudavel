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

  const renderItem = ({ item }: { item: Gastos | Saude }) => (
    <View className="bg-white p-4 rounded-lg mb-8 shadow-xl">
      <Text>{item.categoria}</Text>
      <Text className="font-semibold ">{item.descricao}</Text>

      <Text className="font-semibold">
        R$ {(item as Gastos).valor?.toFixed(2) || "0.00"}
      </Text>

      <Text>{item.data.toLocaleDateString("pt-BR")}</Text>
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

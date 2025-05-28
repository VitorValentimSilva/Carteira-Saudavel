import { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Form from "../components/Form";
import { colors } from "../styles/colors";
import { useData } from "../contexts/DataContext";
import { useNavigation } from "@react-navigation/native";
import RecordList from "../components/RecordList";

export default function Tracking() {
  const [activeType, setActiveType] = useState<"financeiro" | "saude">("saude");
  const [showForm, setShowForm] = useState(false);
  const { saveRecord } = useData();
  const navigation = useNavigation();

  const handleTypeChange = (type: "financeiro" | "saude") => {
    setActiveType(type);
    setShowForm(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      await saveRecord(activeType, values);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar registro");
    }
  };

  return (
    <View className="flex-1 items-center justify-start bg-Background p-4">
      <View className="flex-row w-full bg-zinc-200 rounded-xl p-1.5 mb-6">
        <TouchableOpacity
          onPress={() => handleTypeChange("saude")}
          className="w-1/2 items-center justify-center"
        >
          <View
            className={`${
              activeType === "saude" ? "bg-white rounded-xl py-2.5 w-full" : ""
            }`}
          >
            <Text className="font-semibold text-center">Saúde</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTypeChange("financeiro")}
          className="w-1/2 items-center justify-center"
        >
          <View
            className={`${
              activeType === "financeiro"
                ? "bg-white rounded-xl py-2.5 w-full"
                : ""
            }`}
          >
            <Text className="font-semibold text-center">Financeiro</Text>
          </View>
        </TouchableOpacity>
      </View>

      {!showForm ? (
        <>
          <View className="flex-row mb-6 w-full">
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="w-full"
            >
              <View className="flex-row items-center justify-center gap-3 py-3 bg-white rounded-xl">
                <AntDesign
                  name="pluscircleo"
                  size={20}
                  color={colors.PrimaryColor}
                />
                <Text className="text-PrimaryColor font-semibold text-lg">
                  Registrar {activeType === "saude" ? "Saúde" : "Financeiro"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-1 w-full mb-10">
            <RecordList type={activeType} />
          </View>
        </>
      ) : (
        <Form
          type={activeType}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </View>
  );
}

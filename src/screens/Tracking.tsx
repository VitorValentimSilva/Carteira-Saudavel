import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Form from "../components/Form";
import { colors } from "../styles/colors";

export default function Tracking() {
  const [activeType, setActiveType] = useState<"gastos" | "saude">("saude");
  const [formType, setFormType] = useState<"gastos" | "saude" | null>(null);

  const handleTypeChange = (type: "gastos" | "saude") => {
    setActiveType(type);
    if (formType !== null) {
      setFormType(type);
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
          onPress={() => handleTypeChange("gastos")}
          className="w-1/2 items-center justify-center"
        >
          <View
            className={`${
              activeType === "gastos" ? "bg-white rounded-xl py-2.5 w-full" : ""
            }`}
          >
            <Text className="font-semibold text-center">Gasto</Text>
          </View>
        </TouchableOpacity>
      </View>

      {!formType ? (
        <View className="flex-row mb-6 w-full">
          <TouchableOpacity
            onPress={() => setFormType(activeType)}
            className="w-full"
          >
            <View className="flex-row items-center justify-center gap-3 py-3 bg-white rounded-xl">
              <AntDesign
                name="pluscircleo"
                size={20}
                color={colors.PrimaryColor}
              />
              <Text className="text-PrimaryColor font-semibold text-lg">
                Registrar {activeType === "saude" ? "Saúde" : "Gasto"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <Form
          type={formType}
          onSubmit={(values) => {
            console.log("Formulário enviado:", values);
            setFormType(null);
          }}
          onCancel={() => setFormType(null)}
        />
      )}
    </View>
  );
}

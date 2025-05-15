import { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Form from "../components/Form";

export default function Tracking() {
  const [activeType, setActiveType] = useState<"gastos" | "saude">("saude");
  const [formType, setFormType] = useState<"gastos" | "saude" | null>(null);

  return (
    <View className="flex-1 items-center justify-start bg-Background px-4 py-6">
      {formType === null && (
        <>
          <View className="flex-row items-center justify-around w-full bg-zinc-200 rounded-[12px] py-2 mb-6">
            <TouchableOpacity onPress={() => setActiveType("saude")}>
              <View
                className={`flex-row items-center justify-center gap-3 px-4 py-2 rounded ${
                  activeType === "saude" ? "bg-white" : ""
                }`}
              >
                <Text className="font-semibold">Saúde</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setActiveType("gastos")}>
              <View
                className={`flex-row items-center justify-center gap-3 px-4 py-2 rounded ${
                  activeType === "gastos" ? "bg-white" : ""
                }`}
              >
                <Text className="font-semibold">Gasto</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4 mb-6">
            {activeType === "gastos" && (
              <TouchableOpacity onPress={() => setFormType("gastos")}>
                <View className="flex-row items-center justify-center gap-3 py-2 px-5 bg-white rounded">
                  <AntDesign name="pluscircleo" size={20} color="black" />
                  <Text className="text-black">Registrar Gasto</Text>
                </View>
              </TouchableOpacity>
            )}

            {activeType === "saude" && (
              <TouchableOpacity onPress={() => setFormType("saude")}>
                <View className="flex-row items-center justify-center gap-3 py-2 px-5 bg-white rounded">
                  <AntDesign name="pluscircleo" size={20} color="black" />
                  <Text className="text-black">Registrar Saúde</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {formType && (
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

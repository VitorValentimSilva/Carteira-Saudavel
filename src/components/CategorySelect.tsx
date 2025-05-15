import { Text, TouchableOpacity, View } from "react-native";
import { useField } from "formik";

type Props = {
  name: string;
  options: string[];
};

export default function CategorySelect({ name, options }: Props) {
  const [field, , helpers] = useField(name);

  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2">Categoria</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => helpers.setValue(option)}
            className={`px-3 py-1 rounded ${
              field.value === option ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={field.value === option ? "text-white" : "text-black"}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

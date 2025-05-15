import { TextInput, Text, View } from "react-native";
import { useField } from "formik";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
};

export default function Input({ name, label, ...props }: Props) {
  const [field, meta, helpers] = useField(name);

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold mb-1">{label}</Text>

      <TextInput
        className="border border-gray-300 rounded px-3 py-2"
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={() => helpers.setTouched(true)}
        {...props}
      />

      {meta.touched && meta.error && (
        <Text className="text-red-500 text-sm mt-1">{meta.error}</Text>
      )}
    </View>
  );
}

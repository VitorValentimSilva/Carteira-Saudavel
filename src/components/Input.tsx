import { TextInput, Text, View, TextInputProps } from "react-native";
import { useField } from "formik";

type Props = {
  name: string;
  label: string;
} & TextInputProps;

export default function Input({ name, label, ...props }: Props) {
  const [field, meta, helpers] = useField(name);

  const handleChangeText = (text: string) => {
    if (name === "data") {
      const cleaned = text.replace(/\D/g, "");
      const day = cleaned.slice(0, 2);
      const month = cleaned.slice(2, 4);
      const year = cleaned.slice(4, 8);
      let formatted = day;
      if (month) formatted += `/${month}`;
      if (year) formatted += `/${year}`;
      helpers.setValue(formatted);
    } else {
      helpers.setValue(text);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-base font-semibold mb-1">{label}</Text>

      <TextInput
        className="border border-gray-300 rounded px-3 py-2"
        value={field.value}
        onChangeText={handleChangeText}
        onBlur={() => helpers.setTouched(true)}
        maxLength={name === "data" ? 10 : undefined}
        {...props}
      />

      {meta.touched && meta.error && (
        <Text className="text-red-500 text-base mt-1">{meta.error}</Text>
      )}
    </View>
  );
}

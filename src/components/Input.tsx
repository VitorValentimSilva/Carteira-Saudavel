import { TextInput, Text, View, TextInputProps } from "react-native";
import { useField, useFormikContext } from "formik";

type Props = {
  name: string;
  label: string;
} & TextInputProps;

export default function Input({ name, label, ...props }: Props) {
  const [field, meta, helpers] = useField(name);
  const { values } = useFormikContext<any>();

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

  const getLabelAndPlaceholder = (name: string, categoria?: string) => {
    if (name === "valor") {
      switch (categoria) {
        case "Exercício":
          return { label: "Tempo (minutos)", placeholder: "Ex: 45" };
        case "Sono":
          return { label: "Horas de sono", placeholder: "Ex: 8" };
        case "Água":
          return { label: "Litros de água", placeholder: "Ex: 2.5" };
        default:
          return { label: "Valor", placeholder: "Valor" };
      }
    }
    return { label: "", placeholder: "" };
  };

  return (
    <View className="mb-4">
      <Text className="text-base font-semibold mb-1">
        {name === "valor" && values.categoria
          ? getLabelAndPlaceholder(name, values.categoria).label
          : label}
      </Text>

      <TextInput
        className="border border-gray-300 rounded px-3 py-2"
        value={field.value}
        onChangeText={handleChangeText}
        onBlur={() => helpers.setTouched(true)}
        maxLength={name === "data" ? 10 : undefined}
        keyboardType={name === "valor" ? "decimal-pad" : "default"}
        placeholder={
          name === "valor" && values.categoria
            ? getLabelAndPlaceholder(name, values.categoria).placeholder
            : props.placeholder
        }
        {...props}
      />

      {meta.touched && meta.error && (
        <Text className="text-red-500 text-base mt-1">{meta.error}</Text>
      )}
    </View>
  );
}

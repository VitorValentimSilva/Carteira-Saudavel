import { View, Button, TouchableOpacity, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "./Input";
import CategorySelect from "./CategorySelect";

type Props = {
  type: "financeiro" | "saude";
  onSubmit: (values: any) => void;
  onCancel: () => void;
};

type FormValues = {
  data: string;
  valor: string;
  descricao: string;
  categoria: string;
  transacao: "gasto" | "ganho";
};

export default function Form({ type, onSubmit, onCancel }: Props) {
  const initialValues: FormValues = {
    data: "",
    valor: "",
    descricao: "",
    categoria: "",
    transacao: "gasto",
  };

  const getValidationSchema = () => {
    const baseSchema = {
      data: Yup.string()
        .matches(/^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/, "Data inválida")
        .required("Obrigatório"),
      descricao: Yup.string().required("Obrigatório"),
      categoria: Yup.string().required("Obrigatório"),
      valor: Yup.number().required("Obrigatório").min(0.01, "Mínimo R$ 0,01"),
      transacao: Yup.string().oneOf(["gasto", "ganho"]).required("Obrigatório"),
    };

    if (type === "financeiro") {
      return Yup.object(baseSchema);
    }

    return Yup.object({
      ...baseSchema,
      valor: Yup.number()
        .typeError("Digite um valor numérico")
        .when("categoria", (categoria: any, schema: any) => {
          const cat = Array.isArray(categoria) ? categoria[0] : categoria;
          switch (cat) {
            case "Exercício":
              return schema
                .min(1, "Mínimo 1 minuto")
                .max(360, "Máximo 6 horas");
            case "Sono":
              return schema.min(1, "Mínimo 1 hora").max(24, "Máximo 24 horas");
            case "Água":
              return schema
                .min(0.3, "Mínimo 300ml")
                .max(10, "Máximo 10 litros");
            default:
              return schema;
          }
        }),
    });
  };

  const getCategories = (transacao: string) => {
    if (type === "financeiro") {
      return transacao === "gasto"
        ? ["Comida", "Transporte", "Lazer"]
        : ["Salário", "Freelance", "Investimentos"];
    }
    return ["Exercício", "Sono", "Água"];
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema}
      onSubmit={(values: FormValues) => onSubmit(values)}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <View className="p-5 gap-4 bg-white rounded-2xl w-full">
          {type === "financeiro" && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-3 text-lg font-semibold">
                Tipo de Transação
              </Text>
              <View className="flex-row gap-3">
                {["gasto", "ganho"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setFieldValue("transacao", option)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      values.transacao === option
                        ? "bg-blue-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        values.transacao === option
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <Input
            name="data"
            label="Data"
            placeholder="Data (dd/mm/aaaa)"
            keyboardType="numeric"
          />

          <CategorySelect
            name="categoria"
            options={getCategories(values.transacao)}
          />

          <Input
            name="valor"
            label={
              type === "financeiro"
                ? "Valor (R$)"
                : values.categoria === "Exercício"
                ? "Tempo (minutos)"
                : values.categoria === "Sono"
                ? "Horas de sono"
                : values.categoria === "Água"
                ? "Litros de água"
                : "Valor"
            }
            placeholder={
              type === "financeiro"
                ? "0,00"
                : values.categoria === "Exercício"
                ? "Ex: 45"
                : values.categoria === "Sono"
                ? "Ex: 8"
                : values.categoria === "Água"
                ? "Ex: 2.5"
                : "Valor"
            }
            keyboardType="decimal-pad"
          />

          <Input name="descricao" label="Descrição" placeholder="Descrição" />

          <View className="flex-row justify-between mt-4">
            <View className="flex-1 mr-2">
              <Button title="Fechar" onPress={onCancel} color="gray" />
            </View>
            <View className="flex-1 ml-2">
              <Button title="Salvar" onPress={handleSubmit as any} />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
}

import { View, Button } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "./Input";
import CategorySelect from "./CategorySelect";

type Props = {
  type: "gastos" | "saude";
  onSubmit: (values: any) => void;
  onCancel: () => void;
};

export default function Form({ type, onSubmit, onCancel }: Props) {
  const initialValues =
    type === "gastos"
      ? { data: "", valor: "", descricao: "", categoria: "" }
      : { data: "", descricao: "", categoria: "" };

  const validationSchema =
    type === "gastos"
      ? Yup.object({
          data: Yup.string()
            .matches(
              /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/,
              "Data deve estar no formato dd/mm/aaaa"
            )
            .required("Informe a data2"),
          valor: Yup.number().required("Informe o valor"),
          descricao: Yup.string().required("Descreva o gasto"),
          categoria: Yup.string().required("Escolha uma categoria"),
        })
      : Yup.object({
          data: Yup.string()
            .matches(
              /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/,
              "Data deve estar no formato dd/mm/aaaa"
            )
            .required("Informe a data2"),
          descricao: Yup.string().required("Descreva a atividade"),
          categoria: Yup.string().required("Escolha uma categoria"),
        });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <View className="p-5 gap-4 bg-white rounded-2xl w-full">
          <Input
            type="date"
            name="data"
            label="Data"
            placeholder="Data (dd/mm/aaaa)"
            keyboardType="numeric"
          />

          {type === "gastos" && (
            <Input
              type="number"
              name="valor"
              label="Valor"
              placeholder="Valor (R$)"
              keyboardType="numeric"
            />
          )}

          <Input
            type="text"
            name="descricao"
            label="Descrição"
            placeholder="Descrição"
          />

          <CategorySelect
            name="categoria"
            options={
              type === "gastos"
                ? ["Comida", "Transporte", "Lazer"]
                : ["Exercício", "Sono", "Água", "Alimentação", "Medicação"]
            }
          />

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

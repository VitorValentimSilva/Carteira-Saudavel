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
          data: Yup.string().required("Informe a data"),
          valor: Yup.number().required("Informe o valor"),
          descricao: Yup.string().required("Descreva o gasto"),
          categoria: Yup.string().required("Escolha uma categoria"),
        })
      : Yup.object({
          data: Yup.string().required("Informe a data"),
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
        <View className="p-4 gap-4 bg-white rounded-[12px]">
          <Input name="data" label="Data" placeholder="Data (dd/mm/aaaa)" />

          {type === "gastos" && (
            <Input name="valor" label="Valor" placeholder="Valor (R$)" />
          )}

          <Input name="descricao" label="Descrição" placeholder="Descrição" />

          <CategorySelect
            name="categoria"
            options={
              type === "gastos"
                ? ["Comida", "Transporte", "Lazer"]
                : ["Exercício", "Sono", "Água", "Alimentação"]
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

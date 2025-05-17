import { View, Button } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "./Input";

type Props = {
  isSignUp: boolean;
  onSubmit: (values: { email: string; password: string }) => void;
  onSwitchMode: () => void;
};

export default function FormAuth({ isSignUp, onSubmit, onSwitchMode }: Props) {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("E-mail inválido").required("Campo obrigatório"),
    password: Yup.string()
      .min(6, "Mínimo de 6 caracteres")
      .required("Campo obrigatório"),
    ...(isSignUp && {
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Senhas devem ser iguais")
        .required("Confirme sua senha"),
    }),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <View className="p-5 gap-4 bg-white rounded-2xl w-full">
          <Input
            name="email"
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            name="password"
            label="Senha"
            placeholder="••••••"
            secureTextEntry
            autoCapitalize="none"
          />

          {isSignUp && (
            <Input
              name="confirmPassword"
              label="Confirme a Senha"
              placeholder="••••••"
              secureTextEntry
              autoCapitalize="none"
            />
          )}

          <View className="mt-4">
            <Button
              title={isSignUp ? "Criar Conta" : "Entrar"}
              onPress={() => handleSubmit()}
            />
          </View>

          <Button
            title={isSignUp ? "Já tem conta? Faça login" : "Criar nova conta"}
            onPress={onSwitchMode}
            color="gray"
          />
        </View>
      )}
    </Formik>
  );
}

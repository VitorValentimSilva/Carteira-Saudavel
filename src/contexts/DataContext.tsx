import { createContext, useContext } from "react";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";

type DataContextType = {
  saveRecord: (type: "gastos" | "saude", data: any) => Promise<void>;
};

const DataContext = createContext<DataContextType>({
  saveRecord: async () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const saveRecord = async (type: "gastos" | "saude", formData: any) => {
    try {
      if (!user) throw new Error("Usuário não autenticado");

      const dateParts = formData.data.split("/");
      if (dateParts.length !== 3) throw new Error("Formato de data inválido");

      const recordData = {
        ...formData,
        data: new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`),
        valor: type === "gastos" ? parseFloat(formData.valor) : null,
        criadoEm: serverTimestamp(),
      };

      const collectionRef = collection(db, "users", user.uid, type);
      const docRef = await addDoc(collectionRef, recordData);
      console.log("Documento salvo com ID:", docRef.id);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      throw error;
    }
  };

  const convertToDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <DataContext.Provider value={{ saveRecord }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

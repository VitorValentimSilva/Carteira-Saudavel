import { createContext, useContext, useState } from "react";
import { db } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

type RecordType = "gastos" | "saude";

interface BaseRecord {
  id: string;
  data: Date;
  descricao: string;
  categoria: string;
  criadoEm: Timestamp;
}

export interface Gastos extends BaseRecord {
  valor: number;
}

export interface Saude extends BaseRecord {
  duracao?: number;
}

type DataContextType = {
  saveRecord: (type: RecordType, data: any) => Promise<void>;
  getRecords: <T extends BaseRecord>(type: RecordType) => Promise<T[]>;
  getRecentRecords: () => Promise<(Gastos | Saude)[]>;
  refreshData: () => void;
  loading: boolean;
  error: string | null;
};

const DataContext = createContext<DataContextType>({
  saveRecord: async () => {},
  getRecords: async () => [],
  getRecentRecords: async () => [],
  refreshData: () => {},
  loading: false,
  error: null,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshData = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const saveRecord = async (type: "gastos" | "saude", formData: any) => {
    try {
      if (!user) throw new Error("Usuário não autenticado");

      const dateParts = formData.data.split("/");
      if (dateParts.length !== 3) throw new Error("Formato de data inválido");

      const recordData = {
        ...formData,
        data: new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`),
        valor: type === "gastos" ? parseFloat(formData.valor) || 0 : null,
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

  const getRecords = async <T extends BaseRecord>(
    type: RecordType
  ): Promise<T[]> => {
    if (!user) return [];

    setLoading(true);
    try {
      const collectionRef = collection(db, "users", user.uid, type);
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            data: (doc.data().data as Timestamp).toDate(),
          } as T)
      );
    } catch (err) {
      setError("Erro ao carregar registros");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getRecentRecords = async (): Promise<(Gastos | Saude)[]> => {
    if (!user) return [];

    setLoading(true);
    try {
      const [gastos, saude] = await Promise.all([
        getRecords<Gastos>("gastos"),
        getRecords<Saude>("saude"),
      ]);

      const allRecords = [...gastos, ...saude]
        .sort((a, b) => b.criadoEm.toMillis() - a.criadoEm.toMillis())
        .slice(0, 6);

      return allRecords;
    } catch (err) {
      setError("Erro ao carregar registros recentes");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        saveRecord,
        getRecords,
        getRecentRecords,
        refreshData,
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

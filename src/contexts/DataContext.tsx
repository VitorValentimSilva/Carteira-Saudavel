import { createContext, useContext, useState } from "react";
import { db } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { FinanceMonthData, MonthlyData } from "../types";
import {
  getCurrentMonthData,
  isDateInCurrentMonth,
} from "../utils/dataProcessing";
import { isWithinInterval } from "date-fns";

type RecordType = "financeiro" | "saude";

export interface BaseRecord {
  id: string;
  data: Date;
  descricao: string;
  categoria: string;
  criadoEm: Timestamp;
  valor: number;
  transacao?: "gasto" | "ganho";
}

type DataContextType = {
  saveRecord: (type: RecordType, data: any) => Promise<void>;
  getRecords: <T extends BaseRecord>(type: RecordType) => Promise<T[]>;
  getRecentRecords: () => Promise<BaseRecord[]>;
  refreshData: () => void;
  getMonthData: () => Promise<MonthlyData>;
  getFinanceMonthData: () => Promise<FinanceMonthData>;
  refreshCount: number;
  loading: boolean;
  error: string | null;
};

const DataContext = createContext<DataContextType>({
  saveRecord: async () => {},
  getRecords: async () => [],
  getRecentRecords: async () => [],
  refreshData: () => {},
  getMonthData: async () => ({ sleep: [], exercise: [], water: [] }),
  getFinanceMonthData: async () => ({
    totalExpenses: 0,
    totalEarnings: 0,
    savings: 0,
  }),
  refreshCount: 0,
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

  const saveRecord = async (type: RecordType, formData: any) => {
    try {
      if (!user) throw new Error("Usuário não autenticado");

      const dateParts = formData.data.split("/");
      if (dateParts.length !== 3) throw new Error("Formato de data inválido");

      const day = Number(dateParts[0]);
      const month = Number(dateParts[1]) - 1;
      const year = Number(dateParts[2]);

      const recordData = {
        ...formData,
        data: new Date(year, month, day),
        valor: parseFloat(formData.valor) || 0,
        criadoEm: serverTimestamp(),
        descricao: formData.descricao || "",
        categoria: formData.categoria || "",
      };

      const collectionRef = collection(db, "users", user.uid, type);
      const docRef = await addDoc(collectionRef, recordData);
      console.log("Documento salvo com ID:", docRef.id);
      refreshData();
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
      const q = query(collectionRef, orderBy("data", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        data: (doc.data().data as Timestamp).toDate(),
      })) as T[];
    } catch (err) {
      setError("Erro ao carregar registros");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getRecentRecords = async (): Promise<BaseRecord[]> => {
    if (!user) return [];

    setLoading(true);
    try {
      const [financeiro, saude] = await Promise.all([
        getRecords<BaseRecord>("financeiro"),
        getRecords<BaseRecord>("saude"),
      ]);

      return [...financeiro, ...saude]
        .sort((a, b) => b.criadoEm.toMillis() - a.criadoEm.toMillis())
        .slice(0, 6);
    } catch (err) {
      setError("Erro ao carregar registros recentes");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMonthData = async (): Promise<MonthlyData> => {
    if (!user) return { sleep: [], exercise: [], water: [] };

    try {
      const healthData = await getRecords<BaseRecord>("saude");
      const { daysInMonth } = getCurrentMonthData();

      const initialData: MonthlyData = {
        sleep: new Array(daysInMonth).fill(0),
        exercise: new Array(daysInMonth).fill(0),
        water: new Array(daysInMonth).fill(0),
      };

      healthData.forEach((record) => {
        if (!isDateInCurrentMonth(record.data)) return;

        const dayIndex = record.data.getDate() - 1;
        switch (record.categoria) {
          case "Sono":
            initialData.sleep[dayIndex] += record.valor;
            break;
          case "Exercício":
            initialData.exercise[dayIndex] += record.valor;
            break;
          case "Água":
            initialData.water[dayIndex] += record.valor;
            break;
        }
      });

      return initialData;
    } catch (error) {
      console.error("Error fetching month data:", error);
      return { sleep: [], exercise: [], water: [] };
    }
  };

  const getFinanceMonthData = async (): Promise<{
    totalExpenses: number;
    totalEarnings: number;
    savings: number;
  }> => {
    if (!user) return { totalExpenses: 0, totalEarnings: 0, savings: 0 };

    const records = await getRecords<BaseRecord>("financeiro");
    const { startOfMonth, endOfMonth } = getCurrentMonthData();

    let totalExpenses = 0;
    let totalEarnings = 0;

    records.forEach((r) => {
      if (!isWithinInterval(r.data, { start: startOfMonth, end: endOfMonth }))
        return;
      if (r.transacao === "gasto") totalExpenses += r.valor;
      else if (r.transacao === "ganho") totalEarnings += r.valor;
    });

    const savings = totalEarnings - totalExpenses;
    return { totalExpenses, totalEarnings, savings };
  };

  return (
    <DataContext.Provider
      value={{
        saveRecord,
        getRecords,
        getRecentRecords,
        refreshData,
        getMonthData,
        getFinanceMonthData,
        refreshCount,
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

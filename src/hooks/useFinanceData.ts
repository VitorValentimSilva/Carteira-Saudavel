import { useEffect, useState } from "react";
import { useData } from "../contexts/DataContext";
import { FinanceMonthData } from "../types";

export const useFinanceData = () => {
  const { getFinanceMonthData, refreshCount } = useData();
  const [financeData, setFinanceData] = useState<FinanceMonthData>({
    totalExpenses: 0,
    totalEarnings: 0,
    savings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinance = async () => {
      setLoading(true);
      try {
        const data = await getFinanceMonthData();
        setFinanceData(data);
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar dados financeiros");
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, [refreshCount]);

  return { financeData, loading, error };
};

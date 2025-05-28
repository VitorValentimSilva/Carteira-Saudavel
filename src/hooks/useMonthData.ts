import { useEffect, useState } from "react";
import { useData } from "../contexts/DataContext";
import { MonthlyData } from "../types/index";

export const useMonthData = () => {
  const { getMonthData, refreshCount } = useData();
  const [monthData, setMonthData] = useState<MonthlyData>({
    sleep: [],
    exercise: [],
    water: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthData();
        setMonthData(data);
      } catch (err) {
        setError("Falha ao carregar dados mensais");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCount]);

  return { monthData, loading, error };
};

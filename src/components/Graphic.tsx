import { Text, View } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import {
  calculateExercisePercentage,
  calculateOverallHealthPercentage,
  calculateSleepPercentage,
  calculateWaterPercentage,
} from "../utils/calculations";
import { BaseRecord, useData } from "../contexts/DataContext";
import { useEffect, useState } from "react";

const MONTH_NAMES_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface MonthlyStats {
  monthIndex: number;
  sleepTotal: number;
  exerciseTotal: number;
  waterTotal: number;
  daysSet: Set<number>;
}

export default function Graphic() {
  const { getRecords } = useData();
  const [monthlyData, setMonthlyData] = useState<
    { monthLabel: string; healthPct: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fonte = useFont(require("../assets/fonts/Roboto-Black.ttf"));

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const healthRecords = await getRecords<BaseRecord>("saude");

        const monthlyStats: MonthlyStats[] = MONTH_NAMES_PT.map((_, index) => ({
          monthIndex: index,
          sleepTotal: 0,
          exerciseTotal: 0,
          waterTotal: 0,
          daysSet: new Set<number>(),
        }));

        healthRecords.forEach((record) => {
          const recordYear = record.data.getFullYear();
          if (recordYear !== currentYear) return;

          const monthIndex = record.data.getMonth();
          const day = record.data.getDate();

          monthlyStats[monthIndex].daysSet.add(day);

          switch (record.categoria) {
            case "Sono":
              monthlyStats[monthIndex].sleepTotal += record.valor;
              break;
            case "Exercício":
              monthlyStats[monthIndex].exerciseTotal += record.valor;
              break;
            case "Água":
              monthlyStats[monthIndex].waterTotal += record.valor;
              break;
          }
        });

        const processedData = monthlyStats.map((month) => {
          const dayCount = month.daysSet.size;

          const avgSleep = dayCount > 0 ? month.sleepTotal / dayCount : 0;
          const avgExercise = dayCount > 0 ? month.exerciseTotal / dayCount : 0;
          const avgWater = dayCount > 0 ? month.waterTotal / dayCount : 0;

          const sleepPct = calculateSleepPercentage(avgSleep);
          const exercisePct = calculateExercisePercentage(avgExercise / 60);
          const waterPct = calculateWaterPercentage(avgWater);

          const healthPct = calculateOverallHealthPercentage(
            sleepPct,
            exercisePct,
            waterPct
          );

          return {
            monthLabel: MONTH_NAMES_PT[month.monthIndex],
            healthPct: Math.round(healthPct),
          };
        });

        setMonthlyData(processedData);
      } catch (err) {
        setError("Erro ao carregar dados anuais");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchYearData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Carregando gráfico…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View className="w-full bg-slate-50 rounded-xl p-4 gap-4">
      <Text className="color-PrimaryColor text-3xl font-semibold">
        Gráfico de Saúde
      </Text>
      <View className="h-96 w-full">
        <CartesianChart
          data={monthlyData}
          xKey="monthLabel"
          yKeys={["healthPct"]}
          axisOptions={{
            tickCount: 10,
            font: fonte,
            labelOffset: { x: 3, y: 3 },
            labelPosition: "outset",
          }}
        >
          {({ points }) => (
            <Line points={points.healthPct} color="green" strokeWidth={3} />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

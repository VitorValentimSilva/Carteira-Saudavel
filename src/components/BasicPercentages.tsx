import { Text, View } from "react-native";
import { useMonthData } from "../hooks/useMonthData";
import {
  calculateSleepAverage,
  calculateExerciseAverage,
  calculateWaterAverage,
  calculateSleepPercentage,
  calculateExercisePercentage,
  calculateWaterPercentage,
  calculateOverallHealthPercentage,
  calculateFinancePercentage,
} from "../utils/calculations";
import { useFinanceData } from "../hooks/useFinanceData";

type Props = {
  view: "health" | "finance";
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-gray-800">{label}</Text>
      <Text className="text-gray-800">{value}</Text>
    </View>
  );
}

export default function BasicPercentages({ view }: Props) {
  const {
    monthData,
    loading: healthLoading,
    error: healthError,
  } = useMonthData();
  const {
    financeData,
    loading: financeLoading,
    error: financeError,
  } = useFinanceData();

  if (view === "health") {
    if (healthLoading) return <Text>Carregando saúde…</Text>;
    if (healthError) return <Text>{healthError}</Text>;

    const sleepAvg = calculateSleepAverage(monthData.sleep);
    const waterAvg = calculateWaterAverage(monthData.water);
    const exerciseAvg = calculateExerciseAverage(monthData.exercise);

    const sleepPct = calculateSleepPercentage(sleepAvg);
    const waterPct = calculateWaterPercentage(waterAvg);
    const exercisePct = calculateExercisePercentage(exerciseAvg);
    const overallPct = calculateOverallHealthPercentage(
      sleepPct,
      exercisePct,
      waterPct
    );

    return (
      <View className="bg-white w-[45%] rounded-xl">
        <View className="bg-PrimaryColor p-4 rounded-xl items-center">
          <Text className="text-white font-semibold">Bem-Estar</Text>
          <Text className="text-white text-3xl font-semibold">
            {overallPct.toFixed(2)}%
          </Text>
        </View>
        <View className="p-3 space-y-2 gap-3">
          <Row label="Água" value={`${waterAvg.toFixed(2)} L/dia`} />
          <Row label="Sono" value={`${sleepAvg.toFixed(2)} h/dia`} />
          <Row label="Exercício" value={`${exerciseAvg.toFixed(2)} h/dia`} />
        </View>
      </View>
    );
  } else {
    if (financeLoading) return <Text>Carregando financias...</Text>;
    if (financeError) return <Text>{financeError}</Text>;

    const { totalExpenses, totalEarnings, savings } = financeData;
    const financePct = calculateFinancePercentage(
      totalExpenses,
      totalEarnings,
      savings
    );

    return (
      <View className="bg-white w-[45%] rounded-xl">
        <View className="bg-SecondaryColor p-4 rounded-xl items-center">
          <Text className="text-white font-semibold">Financeiro</Text>
          <Text className="text-white text-3xl font-semibold">
            {financePct.toFixed(2)}%
          </Text>
        </View>
        <View className="p-3 space-y-2 gap-3">
          <Row label="Gastos" value={`R$ ${totalExpenses.toFixed(2)}`} />
          <Row label="Ganhos" value={`R$ ${totalEarnings.toFixed(2)}`} />
          <Row label="Poupança" value={`R$ ${savings.toFixed(2)}`} />
        </View>
      </View>
    );
  }
}

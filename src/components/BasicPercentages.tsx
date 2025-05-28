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
} from "../utils/calculations";

export default function BasicPercentages() {
  const { monthData, loading, error } = useMonthData();

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const sleepAverage = calculateSleepAverage(monthData.sleep);
  const exerciseAverage = calculateExerciseAverage(monthData.exercise);
  const waterAverage = calculateWaterAverage(monthData.water);

  const sleepPercentage = calculateSleepPercentage(sleepAverage);
  const exercisePercentage = calculateExercisePercentage(exerciseAverage);
  const waterPercentage = calculateWaterPercentage(waterAverage);
  const overallHealthPercentage = calculateOverallHealthPercentage(
    sleepPercentage,
    exercisePercentage,
    waterPercentage
  );

  return (
    <View className="bg-white w-1/2 rounded-xl">
      <View className="bg-PrimaryColor p-4 rounded-xl flex-col items-center">
        <Text className="text-white font-semibold text-base">Bem-Estar</Text>
        <Text className="text-white font-semibold text-3xl">
          {overallHealthPercentage.toFixed(2)}%
        </Text>
      </View>

      <View className="space-y-3 p-3 flex-col gap-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-800 text-base">Água</Text>
          <Text className="text-gray-800 text-base">
            {waterAverage.toFixed(2)} L/dia
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-800 text-base">Sono</Text>
          <Text className="text-gray-800 text-base">
            {sleepAverage.toFixed(2)} h/dia
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-800 text-base">Exercício</Text>
          <Text className="text-gray-800 text-base">
            {exerciseAverage.toFixed(2)} h/dia
          </Text>
        </View>
      </View>
    </View>
  );
}

import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useMonthData } from "../hooks/useMonthData";
import { useFinanceData } from "../hooks/useFinanceData";
import {
  calculateSleepAverage,
  calculateExerciseAverage,
  calculateWaterAverage,
  calculateSleepPercentage,
  calculateExercisePercentage,
  calculateWaterPercentage,
  calculateOverallHealthPercentage,
  calculateFinancePercentage,
  calculateOverallPercentage,
} from "../utils/calculations";

export default function WalletScore() {
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

  if (healthLoading || financeLoading) {
    return (
      <View className="items-center justify-center p-4">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">Carregando pontuação...</Text>
      </View>
    );
  }

  if (healthError || financeError) {
    return (
      <View className="p-4">
        <Text className="text-red-500">{healthError || financeError}</Text>
      </View>
    );
  }

  const sleepAvg = calculateSleepAverage(monthData.sleep);
  const waterAvg = calculateWaterAverage(monthData.water);
  const exerciseAvg = calculateExerciseAverage(monthData.exercise);

  const sleepPct = calculateSleepPercentage(sleepAvg);
  const waterPct = calculateWaterPercentage(waterAvg);
  const exercisePct = calculateExercisePercentage(exerciseAvg);
  const healthPct = calculateOverallHealthPercentage(
    sleepPct,
    exercisePct,
    waterPct
  );

  const { totalExpenses, totalEarnings, savings } = financeData;
  const financePct = calculateFinancePercentage(
    totalExpenses,
    totalEarnings,
    savings
  );

  const walletScore = calculateOverallPercentage(healthPct, financePct).toFixed(
    2
  );

  return (
    <View className="bg-white rounded-xl w-full">
      <View className="items-center p-4 rounded-lg gap-3">
        <Text className="font-semibold text-base">
          Sua pontuação na carteira saudável
        </Text>
        <Text className="text-PrimaryColor font-bold text-5xl">
          {walletScore}
        </Text>
        <Text>Bom equilíbrio entre finanças e bem-estar</Text>
      </View>
    </View>
  );
}

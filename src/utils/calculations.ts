const calculateAverage = (data: number[]): number => {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, value) => sum + value, 0);
  return total / data.length;
};

export const calculateSleepAverage = (sleepData: number[]): number => {
  return calculateAverage(sleepData);
};

export const calculateExerciseAverage = (exerciseData: number[]): number => {
  const avgMinutes = calculateAverage(exerciseData);
  return avgMinutes / 60;
};

export const calculateWaterAverage = (waterData: number[]): number => {
  return calculateAverage(waterData);
};

export const calculateSleepPercentage = (sleepAverage: number): number => {
  return Math.min((sleepAverage / 8) * 100, 100);
};

export const calculateExercisePercentage = (exerciseHours: number): number => {
  return Math.min(exerciseHours * 100, 100);
};

export const calculateWaterPercentage = (waterAverage: number): number => {
  return Math.min((waterAverage / 2.75) * 100, 100);
};

export const calculateOverallHealthPercentage = (
  sleepPercentage: number,
  exercisePercentage: number,
  waterPercentage: number
): number => {
  return (sleepPercentage + exercisePercentage + waterPercentage) / 3;
};

export const calculateBudgetAdherence = (
  expenses: number,
  budget: number
): number => {
  if (budget === 0) return 0;
  if (expenses <= budget) return 100;
  return Math.min((budget / expenses) * 100, 100);
};

export const calculateSavingsEfficiency = (
  savings: number,
  budget: number
): number => {
  if (budget === 0) return 0;
  const idealSavings = budget * 0.1;
  if (savings >= idealSavings) return 100;
  return Math.min((savings / idealSavings) * 100, 100);
};

export const calculateFinancialPercentage = (
  expenses: number,
  budget: number,
  savings: number
): number => {
  const budgetAdherence = calculateBudgetAdherence(expenses, budget);
  const savingsEfficiency = calculateSavingsEfficiency(savings, budget);
  return (budgetAdherence + savingsEfficiency) / 2;
};

export const calculateOverallPercentage = (
  healthPercentage: number,
  financialPercentage: number
): number => {
  return (healthPercentage + financialPercentage) / 2;
};

import {
  format,
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";

export const getCurrentMonthData = () => {
  const today = new Date();
  return {
    currentMonth: format(today, "MM"),
    currentYear: format(today, "yyyy"),
    daysInMonth: getDaysInMonth(today),
    startOfMonth: startOfMonth(today),
    endOfMonth: endOfMonth(today),
  };
};

export const isDateInCurrentMonth = (date: Date) => {
  const { startOfMonth, endOfMonth } = getCurrentMonthData();
  return isWithinInterval(date, { start: startOfMonth, end: endOfMonth });
};

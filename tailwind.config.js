import { colors } from "./src/styles/colors";
import { fontFamily } from "./src/styles/fontFamily";

/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{ts,tsx}"];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    colors,
    fontFamily,
  },
};
export const plugins = [];

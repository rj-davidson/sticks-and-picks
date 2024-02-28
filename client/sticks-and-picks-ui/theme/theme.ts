"use client";
import { Oxygen } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const oxygen = Oxygen({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-oxygen",
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: oxygen.style.fontFamily,
  },
});

export default theme;

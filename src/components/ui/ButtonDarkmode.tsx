"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "./switch";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ButtonDarkmode() {
  const [isSelected, setIsSelected] = useState(true);
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-[25px]">
      <div className="w-[30px] md:w-[65px] md:h-[30px] h-[65px] bg-[#f4f0f9] rounded-3xl flex flex-col md:flex-row items-center justify-between p-[5px]">
        <button
          onClick={() => setTheme("light")}
          className={`${
            theme === "light" ? "  bg-primary-foreground bg-opacity-10 " : ""
          } flex items-center justify-center w-[25px] h-[25px] rounded-full`}
        >
          <SunIcon size={14} className="text-primary" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`${
            theme === "dark" ? "  bg-primary-foreground bg-opacity-10 " : ""
          } flex items-center justify-center w-[25px] h-[25px] rounded-full`}
        >
          <MoonIcon size={14} className="text-primary" />
        </button>
      </div>

    </div>
  );
}

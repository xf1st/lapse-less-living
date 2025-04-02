
import React from "react";
import { cn } from "@/lib/utils";

type ColorOption = {
  name: string;
  value: string;
  className: string;
};

const colorOptions: ColorOption[] = [
  { name: "Синий", value: "blue", className: "bg-blue-500" },
  { name: "Зеленый", value: "green", className: "bg-green-500" },
  { name: "Красный", value: "red", className: "bg-red-500" },
  { name: "Фиолетовый", value: "purple", className: "bg-purple-500" },
  { name: "Желтый", value: "yellow", className: "bg-yellow-500" },
  { name: "Индиго", value: "indigo", className: "bg-indigo-500" },
  { name: "Розовый", value: "pink", className: "bg-pink-500" },
];

type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          type="button"
          className={cn(
            "w-8 h-8 rounded-full transition-all",
            color.className,
            value === color.value && "ring-2 ring-offset-2 ring-gray-400"
          )}
          onClick={() => onChange(color.value)}
          title={color.name}
          aria-label={`Выбрать цвет ${color.name}`}
        />
      ))}
    </div>
  );
};


import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type ColorOption = "blue" | "green" | "red" | "purple" | "yellow" | "indigo" | "pink";

interface ColorPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  colorOptions?: ColorOption[];
}

const ColorPicker = ({ 
  value, 
  onValueChange, 
  colorOptions = ["blue", "green", "red", "purple", "yellow", "indigo", "pink"]
}: ColorPickerProps) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500";
      case "green": return "bg-green-500";
      case "red": return "bg-red-500";
      case "purple": return "bg-purple-500";
      case "yellow": return "bg-yellow-500";
      case "indigo": return "bg-indigo-500";
      case "pink": return "bg-pink-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="flex flex-wrap gap-2"
    >
      {colorOptions.map((colorOption) => (
        <div key={colorOption} className="flex items-center space-x-2">
          <RadioGroupItem
            value={colorOption}
            id={`color-${colorOption}`}
            className="sr-only"
          />
          <Label
            htmlFor={`color-${colorOption}`}
            className={cn(
              "h-8 w-8 rounded-full cursor-pointer ring-offset-background transition-all",
              getColorClass(colorOption),
              value === colorOption
                ? "ring-2 ring-ring ring-offset-2"
                : "hover:ring-2 hover:ring-ring hover:ring-offset-1"
            )}
          />
        </div>
      ))}
    </RadioGroup>
  );
};

export default ColorPicker;

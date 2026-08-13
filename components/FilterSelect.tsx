"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  placeholder: string;
  options: FilterOption[];
  value?: string;
  onValueChange?: (value: string | null) => void;
  className?: string;
};

export function FilterSelect({
  placeholder,
  options,
  value,
  onValueChange,
  className,
}: FilterSelectProps) {
  return (
    <Select
      items={options}
      value={value ?? null}
      onValueChange={onValueChange}
    >
      <SelectTrigger
        className={cn(
          "h-9 w-full rounded-md border-placeholder bg-white px-3 text-sm text-gray-text",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        <SelectGroup>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

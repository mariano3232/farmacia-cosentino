import { cn } from "@/lib/utils";

export default function CarouselDots({
    count,
    active,
    onSelect,
  }: {
    count: number;
    active: number;
    onSelect?: (index: number) => void;
  }) {
    return (
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-current={index === active}
            onClick={() => onSelect?.(index)}
            className={cn(
              "h-[5px] rounded-full transition-all",
              index === active ? "w-8 bg-dark-green" : "w-[5px] bg-placeholder"
            )}
          />
        ))}
      </div>
    );
  }
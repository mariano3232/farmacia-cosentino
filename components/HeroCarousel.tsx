"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const SLIDES = 5;

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi} opts={{ loop: true }} className="mb-6 w-full">
        <CarouselContent className="ml-0">
          {Array.from({ length: SLIDES }).map((_, index) => (
            <CarouselItem key={index} className="pl-0">
              <Card className="rounded-[5px] border-0 bg-placeholder py-0 ring-0">
                <CardContent className="h-[321px] p-0" aria-hidden />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CarouselDots
        count={SLIDES}
        active={current}
        onSelect={(index) => api?.scrollTo(index)}
      />
    </div>
  );
}

function CarouselDots({
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

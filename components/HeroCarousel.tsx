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
import CarouselDots from "./CarouselDots";

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
              {/* <Card className="rounded-[9px] border-0 bg-placeholder py-0 ring-0">
                <CardContent className="h-[321px] p-0" aria-hidden />
              </Card> */}
              <img src="/novedades/NUEVO1.png" alt="" />
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

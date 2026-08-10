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

const offers = ["/OFERTA1.png","/OFERTA2.png","/OFERTA3.png"];

export function ProductCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setSnapCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", () => {
      setSnapCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="mb-6 w-full" >
        <CarouselContent className="ml-0">
          {offers.map((offer, index) => (
            <CarouselItem key={index} className="pl-0">
              <img src={offer} alt="" className="rounded-[9px] px-5"/>
              {/* <Card className="rounded-[9px] border-0 bg-placeholder py-0 ring-0">
                <CardContent className="h-[321px] p-0" aria-hidden />
              </Card> */}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CarouselDots
        count={offers.length}
        active={current}
        onSelect={(index) => api?.scrollTo(index)}
      />
    </div>
  );
}

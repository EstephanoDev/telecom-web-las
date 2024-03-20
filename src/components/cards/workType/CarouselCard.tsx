import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { WorkType } from "./WorkType"; // Asegúrate de importar el componente WorkType desde la ruta correcta

export function CarouselSize({
  data
}: any) {
  return (
    <div className="w-full pb-2"> {/* Contenedor para ocupar todo el ancho de la pantalla */}
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {data.map((item: any) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <WorkType percentaje={item.percentaje} value={item.value} workType={item.workType} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

// app/components/ExplanationCarousel.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ExplanationCard from './ExplanationCard';
import { CarouselProps } from '@/types';

export default function ExplanationCarousel({ explanations }: CarouselProps) {
  return (
    // <Swiper
    //   modules={[Navigation, Pagination, A11y]}
    //   spaceBetween={20}
    //   slidesPerView={1}
    //   navigation
    //   pagination={{ clickable: true }}
    //   breakpoints={{
    //     640: { slidesPerView: 1 },
    //     768: { slidesPerView: 1 },
    //     1024: { slidesPerView: 1 },
    //   }}
    // >
    //   {explanations?.map((exp, idx) => (
    //     <SwiperSlide key={idx}>
    //       <ExplanationCard explanation={exp} />
    //     </SwiperSlide>
    //   ))}
    // </Swiper>

    <div>
      {explanations?.map((exp, idx) => (
        <div key={idx}>
          <ExplanationCard explanation={exp} />
        </div>
      ))}
    </div>
  );
}

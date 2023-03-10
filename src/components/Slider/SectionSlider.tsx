import { Swiper, SwiperSlide } from 'swiper/react'

import { FC } from 'react'
import FilmItem from '../Common/FilmItem'
import { Item } from '../../types'
import { Navigation } from 'swiper'
import Skeleton from '../Common/Skeleton'

const SectionSlider: FC<{
    films: Item[] | undefined
}> = ({ films }) => {
    return (
        <div className='relative'>
            <Swiper
                modules={[Navigation]}
                navigation
                slidesPerView='auto'
                slidesPerGroupAuto
                spaceBetween={30}
                loop
                className='tw-section-slider !w-[calc(100vw-8vw-2px)] !py-2'
            >
                {films?.map((film) => (
                    <SwiperSlide key={film.id} className='!w-[175px]'>
                        <FilmItem item={film} />
                    </SwiperSlide>
                )) || (
                    <>
                        {new Array(Math.ceil(window.innerWidth / 200))
                            .fill('')
                            .map((_, index) => (
                                <SwiperSlide key={index} className='!w-[175px]'>
                                    <Skeleton className='!h-[280px] !w-[175px] shadow-sm' />
                                </SwiperSlide>
                            ))}
                    </>
                )}
                {films && (
                    <>
                        <div className='tw-black-backdrop-2 pointer-events-none absolute top-[2%] left-0 z-10 h-[83%] w-full' />
                        <div className='absolute top-0 left-0 z-10 h-full w-[4%]'></div>
                        <div className='absolute top-0 right-0 z-10 h-full w-[4%]'></div>
                    </>
                )}
            </Swiper>
        </div>
    )
}

export default SectionSlider

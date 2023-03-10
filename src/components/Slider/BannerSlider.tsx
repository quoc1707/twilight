import { Autoplay, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { AiFillStar } from 'react-icons/ai'
import { BsFillPlayFill } from 'react-icons/bs'
import { FC } from 'react'
import { Item } from '../../types'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import Skeleton from '../Common/Skeleton'
import { resizeImage } from '../../helpers'
import useCurrentViewport from '../../hooks/useCurrentViewport'

interface BannerSlider {
    films: Item[] | undefined
    dataDetail: {
        genre: { id: number; name: string }[]
    }[]
    isLoadingBanner: boolean
}

const BannerSlider: FC<BannerSlider> = ({
    films,
    dataDetail,
    isLoadingBanner,
}) => {
    const { isSmallScreen } = useCurrentViewport()

    return (
        <div className='tw-banner-slider relative mt-6 h-0 pb-[55%] md:pb-[45%]'>
            {isLoadingBanner ? (
                <Skeleton className='absolute top-0 left-0 h-full w-full rounded-lg' />
            ) : (
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    slidesPerView={1}
                    className='!absolute !top-0 !left-0 !h-full !w-full !rounded-lg'
                >
                    {(films as Item[]).map((film, index) => (
                        <SwiperSlide key={film.id}>
                            <Link
                                to={
                                    film.media_type === 'movie'
                                        ? `/twilight/movie/${film.id}`
                                        : `/twilight/tv/${film.id}`
                                }
                                className='group'
                            >
                                <LazyLoadImage
                                    src={resizeImage(film.backdrop_path)}
                                    alt='Backdrop image'
                                    effect='blur'
                                />
                                <div className='tw-black-backdrop duration-7000 pointer-events-none absolute top-0 left-0 h-full w-full rounded-lg transition group-hover:bg-[#00000026]'></div>
                                <div className='absolute top-[5%] right-[3%] hidden items-center gap-1 rounded-full bg-primary px-3 py-1  text-white md:flex'>
                                    <span>{film.vote_average.toFixed(1)}</span>
                                    <AiFillStar size={15} />
                                </div>
                                <div className='tw-flex-center invisible absolute top-1/2 left-1/2 z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition duration-700 group-hover:visible group-hover:opacity-100'>
                                    <BsFillPlayFill
                                        size={35}
                                        className='text-white'
                                    />
                                </div>
                                <div className='absolute top-[50%] left-[5%] max-w-[200px] -translate-y-1/2 md:max-w-md'>
                                    <h2 className='md:tw-multiline-ellipsis-2 tw-multiline-ellipsis-3 text-xl font-black tracking-wide text-primary md:text-5xl'>
                                        {film.title || film.name}
                                    </h2>
                                    <div>
                                        <p className='mt-6'>
                                            {film.release_date &&
                                                `Release date: ${film.release_date}`}
                                            {film.first_air_date &&
                                                `First air date: ${film.first_air_date}`}
                                        </p>
                                        {!isSmallScreen && (
                                            <>
                                                <div className='mt-5 flex flex-wrap gap-2'>
                                                    {dataDetail[
                                                        index
                                                    ].genre.map((genre) => (
                                                        <div
                                                            className='rounded-full border px-3 py-1 '
                                                            key={genre.id}
                                                        >
                                                            {genre.name}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className='tw-multiline-ellipsis mt-3 text-base'>
                                                    {film.overview}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                    <div className='absolute top-0 left-0 z-10 h-[11%] w-[8%]'></div>
                </Swiper>
            )}
        </div>
    )
}

export default BannerSlider

import BannerSlider from './Slider/BannerSlider'
import { FC } from 'react'
import { HomeFilms } from '../types'
import SectionSlider from './Slider/SectionSlider'
import Skeleton from './Common/Skeleton'

interface MainHomeFilms {
    data: HomeFilms | undefined
    dataDetail: any
    isLoadingBanner: boolean
    isLoadingSection: boolean
}

const MainHomeFilms: FC<MainHomeFilms> = ({
    data,
    dataDetail,
    isLoadingBanner,
    isLoadingSection,
}) => {
    return (
        <>
            <BannerSlider
                films={data?.Trending}
                dataDetail={dataDetail}
                isLoadingBanner={isLoadingBanner}
            />
            <ul className='mt-12 flex flex-col gap-10'>
                {isLoadingSection ? (
                    <>
                        {new Array(2).fill('').map((_, index) => (
                            <li key={index}>
                                <Skeleton className='mb-3 h-8 max-w-[10%] rounded-md' />
                                <SectionSlider films={undefined} />
                            </li>
                        ))}
                    </>
                ) : (
                    Object.entries(data as HomeFilms)
                        .filter((section) => section[0] !== 'Trending')
                        .map((section, index) => (
                            <li key={index}>
                                <h2 className='mb-3 text-xl font-medium tracking-wider text-white'>
                                    {section[0]}
                                </h2>

                                <SectionSlider films={section[1]} />
                            </li>
                        ))
                )}
            </ul>
        </>
    )
}

export default MainHomeFilms

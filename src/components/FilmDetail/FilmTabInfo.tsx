import { Cast, DetailMovie, DetailTV, Reviews } from '../../types'
import { FC, useState } from 'react'

import { LazyLoadImage } from 'react-lazy-load-image-component'
import ReadMore from '../Common/ReadMore'
import ReviewTab from './ReviewTab'
import Skeleton from '../Common/Skeleton'
import { resizeImage } from '../../helpers'

interface FilmTabInfo {
    detail?: DetailMovie | DetailTV | undefined
    credits?: Cast[] | undefined
    reviews?: Reviews[] | undefined
}

const FilmTabInfo: FC<FilmTabInfo> = ({ detail, credits, reviews }) => {
    const [currentTab, setCurrentTab] = useState('overall')

    return (
        <>
            <div className='flex justify-center gap-10 text-lg text-gray-400'>
                <button
                    className={`pb-1 transition duration-300 hover:text-white  ${
                        currentTab === 'overall' &&
                        '-translate-y-2 border-b-2 border-primary font-medium text-white'
                    }`}
                    onClick={() => setCurrentTab('overall')}
                >
                    Overall
                </button>
                <button
                    className={`pb-1 transition duration-300 hover:text-white ${
                        currentTab === 'cast' &&
                        '-translate-y-2 border-b-2 border-primary font-medium text-white'
                    }`}
                    onClick={() => setCurrentTab('cast')}
                >
                    Cast
                </button>
                <button
                    className={`pb-1 transition duration-300 hover:text-white ${
                        currentTab === 'reviews' &&
                        '-translate-y-2 border-b-2 border-primary font-medium text-white'
                    }`}
                    onClick={() => setCurrentTab('reviews')}
                >
                    Reviews
                </button>
                {detail && detail.media_type === 'tv' && (
                    <button
                        className={`pb-1 transition duration-300 hover:text-white ${
                            currentTab === 'seasons' &&
                            '-translate-y-2 border-b-2 border-primary font-medium text-white'
                        }`}
                        onClick={() => setCurrentTab('seasons')}
                    >
                        Seasons
                    </button>
                )}
            </div>
            <div className='mt-10 text-lg'>
                {currentTab === 'overall' && (
                    <>
                        {detail ? (
                            <p className='mb-8 text-center text-xl italic text-white'>
                                {detail.tagline}
                            </p>
                        ) : (
                            <Skeleton className='mx-auto mb-8 h-6 w-[350px]' />
                        )}
                        <p className='mb-3 font-medium text-white'>STORY</p>
                        {detail ? (
                            <ReadMore limitTextLength={250}>
                                {detail.overview}
                            </ReadMore>
                        ) : (
                            <Skeleton className='h-20' />
                        )}
                        <p className='mt-8 mb-3 font-medium text-white'>
                            DETAILS
                        </p>
                        {detail ? (
                            <>
                                <p>Status: {detail.status}</p>
                                {detail.media_type === 'movie' && (
                                    <p>
                                        Release date:{' '}
                                        {(detail as DetailMovie).release_date}
                                    </p>
                                )}
                                {detail.media_type === 'tv' && (
                                    <p>
                                        Last air date:{' '}
                                        {(detail as DetailTV).last_air_date}
                                    </p>
                                )}
                                <p>
                                    Spoken language:
                                    {detail.spoken_languages.map(
                                        (language, index) =>
                                            `${index ? ', ' : ''} ${
                                                language.english_name
                                            }`
                                    )}
                                </p>{' '}
                            </>
                        ) : (
                            <Skeleton className='h-16 w-[40%]' />
                        )}
                    </>
                )}
                {currentTab === 'cast' && (
                    <ul className='grid grid-cols-2 gap-x-20 gap-y-8'>
                        {credits &&
                            credits.map((cast) => (
                                <li
                                    key={cast.id}
                                    className='flex items-center gap-3'
                                >
                                    <div className='h-[65px] w-full max-w-[65px] shrink-0'>
                                        <LazyLoadImage
                                            src={resizeImage(
                                                cast.profile_path,
                                                'w185'
                                            )}
                                            alt=''
                                            effect='opacity'
                                            className='h-[65px] w-[65px] rounded-full object-cover'
                                        />
                                    </div>
                                    <div className='flex-grow'>
                                        <p className='text-lg font-medium text-primary'>
                                            {cast.name}
                                        </p>
                                        <p className='text-base text-white'>
                                            <span className='italic'>as</span>{' '}
                                            {cast.character}
                                        </p>
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}
                {currentTab === 'reviews' && reviews && (
                    <ReviewTab reviews={reviews} />
                )}
                {currentTab === 'seasons' && (
                    <>
                        <div className='mb-8 flex justify-between'>
                            <p>
                                Total seasons:{' '}
                                {(detail as DetailTV).number_of_seasons}
                            </p>
                            <p>
                                Total episodes:{' '}
                                {(detail as DetailTV).number_of_episodes}
                            </p>
                        </div>

                        <ul className='flex max-h-[400px] flex-col gap-10 overflow-auto'>
                            {(detail as DetailTV).seasons.map((season) => (
                                <li key={season.id}>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-full max-w-[120px] shrink-0'>
                                            <LazyLoadImage
                                                src={resizeImage(
                                                    season.poster_path,
                                                    'w92'
                                                )}
                                                alt=''
                                                effect='opacity'
                                                className='h-full w-[120px] rounded-md object-cover'
                                            />
                                        </div>
                                        <div className='flex-grow'>
                                            <div className='mb-3 flex justify-between'>
                                                <p className='font-medium text-white'>
                                                    {season.name}
                                                </p>
                                                <p>
                                                    {season.episode_count}{' '}
                                                    episodes
                                                </p>
                                            </div>
                                            <ReadMore
                                                limitTextLength={130}
                                                className='mb-2 inline-block'
                                            >
                                                {season.overview}
                                            </ReadMore>
                                            <p className='text-base'>
                                                {season.air_date}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </>
    )
}
export default FilmTabInfo

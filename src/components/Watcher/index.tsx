import { AiFillStar, AiTwotoneCalendar } from 'react-icons/ai'
import {
    DetailMovie,
    DetailTV,
    Episode,
    GetWatchReturnedType,
    Item,
} from '../../types'
import { FC, useEffect, useState } from 'react'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { embedMovie, embedTV } from '../../helpers'

import { BsThreeDotsVertical } from 'react-icons/bs'
import Comment from './Comment'
import { GiHamburgerMenu } from 'react-icons/gi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import ReadMore from '../Common/ReadMore'
import RightbarFilms from '../Common/RightbarFilms'
import SeasonSelection from './SeasonSelection'
import Sidebar from '../Common/Sidebar'
import SidebarMini from '../Common/SidebarMini'
import Skeleton from '../Common/Skeleton'
import Title from '../Common/Title'
import { db } from '../../lib/firebase'
import { useAppSelector } from '../../store/hooks'
import useCurrentViewport from '../../hooks/useCurrentViewport'

interface FilmWatch {
    media_type: 'movie' | 'tv'
    seasonId?: number
    episodeId?: number
    currentEpisode?: Episode
}

const FilmWatch: FC<FilmWatch & GetWatchReturnedType> = ({
    detail,
    recommendations,
    detailSeasons,
    media_type,
    seasonId,
    episodeId,
    currentEpisode,
}) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const { isSmallScreen } = useCurrentViewport()
    const [isSidebarActive, setIsSidebarActive] = useState(false)

    useEffect(() => {
        if (!currentUser) return
        if (!detail) return // prevent this code from storing undefined value to Firestore (which cause error)

        getDoc(doc(db, 'users', currentUser.uid)).then((docSnap) => {
            const isAlreadyStored = docSnap
                .data()
                ?.recentlyWatch.some((film: Item) => film.id === detail?.id)

            if (!isAlreadyStored) {
                updateDoc(doc(db, 'users', currentUser.uid), {
                    recentlyWatch: arrayUnion({
                        poster_path: detail?.poster_path,
                        id: detail?.id,
                        vote_average: detail?.vote_average,
                        media_type: media_type,
                        ...(media_type === 'movie' && {
                            title: (detail as DetailMovie)?.title,
                        }),
                        ...(media_type === 'tv' && {
                            name: (detail as DetailTV)?.name,
                        }),
                    }),
                })
            } else {
                const updatedRecentlyWatch = docSnap
                    .data()
                    ?.recentlyWatch.filter(
                        (film: Item) => film.id !== detail?.id
                    )
                    .concat({
                        poster_path: detail?.poster_path,
                        id: detail?.id,
                        vote_average: detail?.vote_average,
                        media_type: media_type,
                        ...(media_type === 'movie' && {
                            title: (detail as DetailMovie)?.title,
                        }),
                        ...(media_type === 'tv' && {
                            name: (detail as DetailTV)?.name,
                        }),
                    })

                updateDoc(doc(db, 'users', currentUser.uid), {
                    recentlyWatch: updatedRecentlyWatch,
                })
            }
        })
    }, [currentUser, detail, media_type])

    return (
        <>
            {detail && (
                <Title
                    value={`Watch: ${
                        (detail as DetailMovie).title ||
                        (detail as DetailTV).name
                    } ${
                        media_type === 'tv'
                            ? `- Season ${seasonId} - Ep ${episodeId}`
                            : ''
                    }`}
                />
            )}

            <div className='my-5 flex items-center justify-between px-5 md:hidden'>
                <Link to='/twilight/' className='flex items-center gap-2'>
                    <LazyLoadImage
                        src='/images/logo.png'
                        className='h-10 w-10 rounded-full object-cover'
                    />
                    <p className='text-xl font-medium uppercase tracking-wider text-white'>
                        Twi<span className='text-primary'>light</span>
                    </p>
                </Link>
                <button onClick={() => setIsSidebarActive((prev) => !prev)}>
                    <GiHamburgerMenu size={25} />
                </button>
            </div>

            <div className='flex flex-col md:flex-row'>
                {!isSmallScreen && <SidebarMini />}
                {isSmallScreen && (
                    <Sidebar
                        setIsSidebarActive={setIsSidebarActive}
                        isSidebarActive={isSidebarActive}
                    />
                )}
                <div className='flex-grow px-[2vw] pt-0 md:pt-11'>
                    <div className='relative h-0 pb-[56.25%]'>
                        {!detail && (
                            <Skeleton className='absolute top-0 left-0 h-full w-full rounded-sm' />
                        )}
                        {detail && (
                            <iframe
                                className='absolute top-0 left-0 h-full w-full'
                                src={
                                    media_type === 'movie'
                                        ? embedMovie(detail.id)
                                        : embedTV(
                                              detail.id,
                                              seasonId as number,
                                              episodeId as number
                                          )
                                }
                                title='Film Video Player'
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                    <div className='mt-5 pb-8'>
                        <div className='flex justify-between text-sm md:text-base'>
                            <div className='flex-1'>
                                {detail ? (
                                    <>
                                        <h1 className='text-xl font-medium text-white md:text-3xl'>
                                            <Link
                                                to={
                                                    media_type === 'movie'
                                                        ? `/twilight/movie/${detail.id}`
                                                        : `/twilight/tv/${detail.id}`
                                                }
                                                className='transition duration-300 hover:brightness-75'
                                            >
                                                {(detail as DetailMovie)
                                                    .title ||
                                                    (detail as DetailTV).name}
                                            </Link>
                                        </h1>
                                        <div className='mt-5 flex gap-5'>
                                            <div className='flex items-center gap-2'>
                                                <AiFillStar
                                                    size={25}
                                                    className='text-primary'
                                                />
                                                {media_type === 'movie' && (
                                                    <p>
                                                        {detail.vote_average.toFixed(
                                                            1
                                                        )}
                                                    </p>
                                                )}
                                                {media_type === 'tv' && (
                                                    <p>
                                                        {currentEpisode?.vote_average.toFixed(
                                                            1
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <AiTwotoneCalendar
                                                    size={25}
                                                    className='text-primary'
                                                />
                                                <p>
                                                    {media_type === 'movie' &&
                                                        new Date(
                                                            (
                                                                detail as DetailMovie
                                                            ).release_date
                                                        ).getFullYear()}
                                                    {media_type === 'tv' &&
                                                        new Date(
                                                            (
                                                                currentEpisode as Episode
                                                            ).air_date
                                                        ).getFullYear()}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Skeleton className='h-8 w-[400px]' />
                                        <Skeleton className='mt-5 h-[23px] w-[100px]' />
                                    </>
                                )}
                                {!detail && (
                                    <Skeleton className='mt-2 h-[23px] w-[100px]' />
                                )}
                                {!isSmallScreen && detail && (
                                    <ul className='mt-3 flex flex-wrap gap-2'>
                                        {detail.genres.map((genre) => (
                                            <li key={genre.id} className='mb-2'>
                                                <Link
                                                    to={`/twilight/explore?genre=${genre.id}`}
                                                    className='rounded-full bg-dark-lighten px-3 py-1 transition duration-300 hover:brightness-75'
                                                >
                                                    {genre.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {media_type === 'tv' && currentEpisode && (
                                <div className='flex-1'>
                                    <h2 className='mt-2 text-right uppercase italic text-gray-200 md:text-xl'>
                                        {currentEpisode.name}
                                    </h2>
                                    <p className='mt-2 text-right md:text-lg'>
                                        Season {seasonId} &#8212; Episode{' '}
                                        {episodeId}
                                    </p>
                                </div>
                            )}
                        </div>
                        {isSmallScreen && detail && (
                            <ul className='mt-3 flex flex-wrap gap-2'>
                                {detail.genres.map((genre) => (
                                    <li key={genre.id} className='mb-2'>
                                        <Link
                                            to={`/twilight/explore?genre=${genre.id}`}
                                            className='rounded-full bg-dark-lighten px-3 py-1 transition duration-300 hover:brightness-75'
                                        >
                                            {genre.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className='mt-5 text-lg font-medium text-white md:text-xl'>
                            Overview:
                        </div>
                        {!detail && <Skeleton className='mt-2 h-[84px]' />}
                        {detail && (
                            <ReadMore
                                limitTextLength={300}
                                className='mt-1 text-base md:text-lg'
                            >
                                {media_type === 'movie'
                                    ? detail.overview
                                    : currentEpisode?.overview}
                            </ReadMore>
                        )}
                    </div>
                    <Comment media_type={media_type} id={detail?.id} />
                </div>
                <div className='relative w-full shrink-0 px-6 md:max-w-[400px]'>
                    {media_type === 'movie' && (
                        <RightbarFilms
                            name='Recommendations'
                            films={recommendations?.filter(
                                (item) => item.id !== detail?.id
                            )}
                            limitNumber={4}
                            isLoading={!recommendations}
                            className='mt-0 md:mt-24'
                        />
                    )}
                    {media_type === 'tv' && (
                        <div className='mt-0 md:mt-10'>
                            <p className='mb-6 flex items-center justify-between text-xl font-medium'>
                                <span className='text-white'>Seasons:</span>
                                <BsThreeDotsVertical size={20} />
                            </p>
                            <SeasonSelection
                                detailSeasons={detailSeasons}
                                seasonId={seasonId}
                                episodeId={episodeId}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FilmWatch

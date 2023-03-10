import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { DetailMovie, DetailTV, FilmInfo } from '../../types'
import { FC, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import {
    arrayRemove,
    arrayUnion,
    doc,
    onSnapshot,
    updateDoc,
} from 'firebase/firestore'

import { AiFillHeart } from 'react-icons/ai'
import { BsFillPlayFill } from 'react-icons/bs'
import FilmTabInfo from './FilmTabInfo'
import { GiHamburgerMenu } from 'react-icons/gi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import Sidebar from '../Common/Sidebar'
import SidebarMini from '../Common/SidebarMini'
import Skeleton from '../Common/Skeleton'
import Title from '../Common/Title'
import { db } from '../../lib/firebase'
import { resizeImage } from '../../helpers'
import { useAppSelector } from '../../store/hooks'
import useCurrentViewport from '../../hooks/useCurrentViewport'

const FilmDetail: FC<FilmInfo> = ({ similar, videos, detail, ...others }) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const { isSmallScreen } = useCurrentViewport()
    const [isSidebarActive, setIsSidebarActive] = useState(false)
    useEffect(() => {
        if (!currentUser) {
            return
        }

        const unsubDoc = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (doc) => {
                setIsBookmarked(
                    doc
                        .data()
                        ?.bookmarks.some((item: any) => item.id === detail?.id)
                )
            }
        )

        return () => unsubDoc()
    }, [currentUser, detail?.id])

    const bookmarkedHandler = async () => {
        if (!detail) return

        if (!currentUser) {
            toast.dark('You need to sign in to bookmark films')
            return
        }

        await updateDoc(doc(db, 'users', currentUser.uid), {
            bookmarks: !isBookmarked
                ? arrayUnion({
                      poster_path: detail?.poster_path,
                      id: detail?.id,
                      vote_average: detail?.vote_average,
                      media_type: detail?.media_type,
                      ...(detail?.media_type === 'movie' && {
                          title: detail?.title,
                      }),
                      ...(detail?.media_type === 'tv' && {
                          name: detail?.name,
                      }),
                  })
                : arrayRemove({
                      poster_path: detail?.poster_path,
                      id: detail?.id,
                      vote_average: detail?.vote_average,
                      media_type: detail?.media_type,
                      ...(detail?.media_type === 'movie' && {
                          title: detail?.title,
                      }),
                      ...(detail?.media_type === 'tv' && {
                          name: detail?.name,
                      }),
                  }),
        })

        toast.dark(
            `${
                !isBookmarked
                    ? 'This film is now bookmarked'
                    : 'This film is removed from your bookmarks'
            }`,
            {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        )
    }

    return (
        <>
            {detail && (
                <Title
                    value={
                        (detail as DetailMovie).title ||
                        (detail as DetailTV).name
                    }
                />
            )}
            <div className='my-3 flex items-center justify-between px-5 md:hidden'>
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
            <ToastContainer />
            <div className='flex flex-col md:flex-row'>
                {isSmallScreen ? (
                    <Sidebar
                        setIsSidebarActive={setIsSidebarActive}
                        isSidebarActive={isSidebarActive}
                    />
                ) : (
                    <SidebarMini />
                )}
                <div className='min-h-screen flex-grow'>
                    {detail ? (
                        <div
                            style={{
                                backgroundImage: `url(${resizeImage(
                                    detail.backdrop_path
                                )})`,
                            }}
                            className='relative h-[300px] rounded-bl-2xl bg-cover bg-center bg-no-repeat md:h-[400px]'
                        >
                            <div className='h-full rounded-bl-2xl bg-gradient-to-br from-transparent to-black/70'>
                                <div className='absolute bottom-[-85%] left-1/2 flex w-full max-w-[1145px] -translate-x-1/2 flex-col items-start  md:bottom-[-20%] md:flex-row '>
                                    <div className='flex items-center gap-5'>
                                        <div className='ml-3 w-[185px] shrink-0 md:ml-0'>
                                            <LazyLoadImage
                                                src={resizeImage(
                                                    detail.poster_path,
                                                    'w185'
                                                )}
                                                effect='opacity'
                                                className='h-full w-full rounded-md object-cover'
                                                alt='Poster'
                                            />
                                        </div>
                                        {isSmallScreen && (
                                            <Link
                                                to='watch'
                                                className='mt-24 flex items-center gap-6 rounded-full bg-primary py-3 pl-6 pr-12 text-white transition duration-300 hover:bg-blue-600 '
                                            >
                                                <BsFillPlayFill size={25} />
                                                <span className='text-lg font-medium'>
                                                    WATCH
                                                </span>
                                            </Link>
                                        )}
                                    </div>

                                    <div className='mt-6 ml-6 flex-grow md:mt-0 md:ml-14'>
                                        <div className='flex items-end md:h-28'>
                                            <h1 className=' text-[45px] font-bold leading-tight text-white '>
                                                {(detail as DetailMovie)
                                                    .title ||
                                                    (detail as DetailTV).name}
                                            </h1>
                                        </div>
                                        <ul className='mt-3 flex flex-wrap gap-3 md:mt-7'>
                                            {detail.genres
                                                .slice(0, 3)
                                                .map((genre) => (
                                                    <li
                                                        key={genre.id}
                                                        className='mb-3'
                                                    >
                                                        <Link
                                                            to={`/twilight/explore?genre=${genre.id}`}
                                                            className='rounded-full border border-gray-300 px-3 py-1 font-medium uppercase transition duration-300 hover:brightness-75 md:py-2 md:px-5 md:text-white'
                                                        >
                                                            {genre.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>

                                    {!isSmallScreen && (
                                        <Link
                                            to='watch'
                                            className='mt-24 flex items-center gap-6 rounded-full bg-primary py-3 pl-6 pr-12 text-white transition duration-300 hover:bg-blue-600 '
                                        >
                                            <BsFillPlayFill size={25} />
                                            <span className='text-lg font-medium'>
                                                WATCH
                                            </span>
                                        </Link>
                                    )}
                                </div>
                                <div className='absolute top-[5%] right-[3%] flex gap-3'>
                                    <button
                                        onClick={bookmarkedHandler}
                                        className={`tw-flex-center group h-12 w-12 rounded-full border-[3px] border-white shadow-lg transition duration-300 hover:border-primary ${
                                            isBookmarked && '!border-primary'
                                        }`}
                                    >
                                        <AiFillHeart
                                            size={20}
                                            className={`text-white transition duration-300 group-hover:text-primary ${
                                                isBookmarked && '!text-primary'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Skeleton className='h-[400px] rounded-bl-2xl '></Skeleton>
                    )}
                    <div className='relative z-20 mt-32 flex flex-col md:mt-0 md:flex-row'>
                        {!isSmallScreen && (
                            <div className='flex w-full shrink-0 flex-row items-center justify-center gap-20 border-dark-lighten pt-16 md:max-w-[150px] md:flex-col md:border-r'>
                                <div className='flex flex-col items-center gap-6'>
                                    <p className='text-lg font-medium text-white'>
                                        RATING
                                    </p>
                                    {!isSmallScreen && (
                                        <div className='w-16'>
                                            {detail ? (
                                                <CircularProgressbar
                                                    value={detail.vote_average}
                                                    maxValue={10}
                                                    text={`${detail.vote_average.toFixed(
                                                        1
                                                    )}`}
                                                    styles={buildStyles({
                                                        textSize: '25px',
                                                        pathColor: `rgba(81, 121, 255, ${
                                                            (detail.vote_average *
                                                                10) /
                                                            100
                                                        })`,
                                                        textColor: '#fff',
                                                        trailColor:
                                                            'transparent',
                                                        backgroundColor:
                                                            '#5179ff',
                                                    })}
                                                />
                                            ) : (
                                                <Skeleton className='h-16 w-16 rounded-full' />
                                            )}
                                        </div>
                                    )}
                                    {isSmallScreen && detail && (
                                        <p className='-mt-3 text-2xl'>
                                            {detail.vote_average.toFixed(1)}
                                        </p>
                                    )}
                                </div>

                                <div className='flex flex-col items-center gap-3'>
                                    {detail && (
                                        <>
                                            <p className='text-lg font-medium text-white'>
                                                {detail.media_type === 'movie'
                                                    ? 'RUNTIME'
                                                    : 'EP LENGTH'}
                                            </p>
                                            <div className='flex items-center gap-2'>
                                                {detail.media_type ===
                                                    'movie' && (
                                                    <p className='text-2xl'>
                                                        {
                                                            (
                                                                detail as DetailMovie
                                                            ).runtime
                                                        }
                                                    </p>
                                                )}
                                                {detail.media_type === 'tv' && (
                                                    <p className='text-2xl'>
                                                        {
                                                            (detail as DetailTV)
                                                                .episode_run_time[0]
                                                        }
                                                    </p>
                                                )}
                                                <span>min</span>
                                            </div>
                                        </>
                                    )}
                                    {!detail && (
                                        <>
                                            <p className='text-lg font-medium text-white'>
                                                RUNTIME
                                            </p>
                                            <Skeleton className='h-6 w-14' />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='min-h-[500px] flex-grow border-dark-lighten px-5 pt-40 md:border-r md:py-7 md:px-16'>
                            <FilmTabInfo detail={detail} {...others} />
                        </div>

                        {isSmallScreen && (
                            <div className='mt-8 flex w-full shrink-0 flex-row items-center justify-center gap-20 border-dark-lighten  pt-0 md:mt-20 md:max-w-[150px] md:flex-col md:border-r md:pt-16'>
                                <div className='flex flex-col items-center gap-6'>
                                    <p className='text-lg font-medium text-white'>
                                        RATING
                                    </p>
                                    {!isSmallScreen && (
                                        <div className='w-16'>
                                            {detail ? (
                                                <CircularProgressbar
                                                    value={detail.vote_average}
                                                    maxValue={10}
                                                    text={`${detail.vote_average.toFixed(
                                                        1
                                                    )}`}
                                                    styles={buildStyles({
                                                        textSize: '25px',
                                                        pathColor: `rgba(81, 121, 255, ${
                                                            (detail.vote_average *
                                                                10) /
                                                            100
                                                        })`,
                                                        textColor: '#fff',
                                                        trailColor:
                                                            'transparent',
                                                        backgroundColor:
                                                            '#5179ff',
                                                    })}
                                                />
                                            ) : (
                                                <Skeleton className='h-16 w-16 rounded-full' />
                                            )}
                                        </div>
                                    )}
                                    {isSmallScreen && detail && (
                                        <p className='-mt-3 text-2xl'>
                                            {detail.vote_average.toFixed(1)}
                                        </p>
                                    )}
                                </div>

                                <div className='flex flex-col items-center gap-3'>
                                    {detail && (
                                        <>
                                            <p className='text-lg font-medium text-white'>
                                                {detail.media_type === 'movie'
                                                    ? 'RUNTIME'
                                                    : 'EP LENGTH'}
                                            </p>
                                            <div className='flex items-center gap-2'>
                                                {detail.media_type ===
                                                    'movie' && (
                                                    <p className='text-2xl'>
                                                        {
                                                            (
                                                                detail as DetailMovie
                                                            ).runtime
                                                        }
                                                    </p>
                                                )}
                                                {detail.media_type === 'tv' && (
                                                    <p className='text-2xl'>
                                                        {
                                                            (detail as DetailTV)
                                                                .episode_run_time[0]
                                                        }
                                                    </p>
                                                )}
                                                <span>min</span>
                                            </div>
                                        </>
                                    )}
                                    {!detail && (
                                        <>
                                            <p className='text-lg font-medium text-white'>
                                                RUNTIME
                                            </p>
                                            <Skeleton className='h-6 w-14' />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilmDetail

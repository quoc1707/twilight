import { HomeFilms, Item } from '../types'
import { getBannerInfo, getHomeMovies, getHomeTVs } from '../services/home'

import { GiHamburgerMenu } from 'react-icons/gi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import MainHomeFilms from '../components/MainHomeFilm'
import Sidebar from '../components/Common/Sidebar'
import SidebarMini from '../components/Common/SidebarMini'
import Title from '../components/Common/Title'
import { useAppSelector } from '../store/hooks'
import useCurrentViewport from '../hooks/useCurrentViewport'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const Home = () => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const [currentTab, setCurrentTab] = useState(
        localStorage.getItem('currentTab') || 'tv'
    )
    const [isSidebarActive, setIsSidebarActive] = useState(false)
    const { isSmallScreen } = useCurrentViewport()

    const {
        data: dataMovie,
        isLoading: isLoadingMovie,
        isError: isErrorMovie,
        error: errorMovie,
    } = useQuery<HomeFilms, Error>(['home-movies'], getHomeMovies)

    const {
        data: dataMovieDetail,
        isLoading: isLoadingMovieDetail,
        isError: isErrorMovieDetail,
        error: errorMovieDetail,
    } = useQuery<any, Error>(
        ['detailMovies', dataMovie?.Trending],
        () => getBannerInfo('movie', dataMovie?.Trending as Item[]),
        { enabled: !!dataMovie?.Trending }
    )

    const {
        data: dataTV,
        isLoading: isLoadingTV,
        isError: isErrorTV,
        error: errorTV,
    } = useQuery<HomeFilms, Error>(['home-tvs'], getHomeTVs)

    const {
        data: dataTVDetail,
        isLoading: isLoadingTVDetail,
        isError: isErrorTVDetail,
        error: errorTVDetail,
    } = useQuery<any, Error>(
        ['detailTvs', dataTV?.Trending],
        () => getBannerInfo('tv', dataTV?.Trending as Item[]),
        { enabled: !!dataTV?.Trending }
    )

    if (isErrorMovie) return <p>ERROR: {errorMovie.message}</p>

    if (isErrorMovieDetail) return <p>ERROR: {errorMovieDetail.message}</p>

    if (isErrorTV) return <p>ERROR: {errorTV.message}</p>

    if (isErrorTVDetail) return <p>ERROR: {errorTVDetail.message}</p>

    return (
        <>
            <Title value='Twilight - Watch TV Shows Online, Watch Movies Online' />
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
            <div className='flex items-start'>
                {isSmallScreen ? (
                    <Sidebar
                        setIsSidebarActive={setIsSidebarActive}
                        isSidebarActive={isSidebarActive}
                    />
                ) : (
                    <SidebarMini />
                )}
                <div className='min-h-screen flex-grow border-x border-gray-darken px-[4vw] pt-0 pb-7 md:px-[2vw] md:pt-7'>
                    <div className='flex items-center justify-between md:items-end'>
                        <div className='relative inline-flex gap-[40px] border-b border-gray-darken pb-[14px]'>
                            <button
                                onClick={() => {
                                    setCurrentTab('tv')
                                    localStorage.setItem('currentTab', 'tv')
                                }}
                                className={`${
                                    currentTab === 'tv' &&
                                    'font-medium text-white after:absolute after:bottom-0 after:left-[11%] after:h-[3px] after:w-10 after:bg-white'
                                } transition duration-300 hover:text-white`}
                            >
                                TV Series
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentTab('movie')
                                    localStorage.setItem('currentTab', 'movie')
                                }}
                                className={`${
                                    currentTab === 'movie' &&
                                    'font-medium text-white after:absolute after:bottom-0 after:right-[1%] after:h-[3px] after:w-10 after:bg-white'
                                } transition duration-300 hover:text-white`}
                            >
                                Movie
                            </button>
                        </div>

                        {/* <div className='flex items-center gap-6'>
                            <p>{currentUser?.displayName || 'Anonymous'}</p>
                            <LazyLoadImage
                                src={
                                    currentUser
                                        ? (currentUser.photoURL as string)
                                        : '/images/avatar.png'
                                }
                                alt='User avatar'
                                className='h-7 w-7 rounded-full object-cover'
                                effect='opacity'
                                referrerPolicy='no-referrer'
                            /> 
                        </div> */}
                    </div>
                    {currentTab === 'movie' && (
                        <MainHomeFilms
                            data={dataMovie}
                            dataDetail={dataMovieDetail}
                            isLoadingBanner={isLoadingMovieDetail}
                            isLoadingSection={isLoadingMovie}
                        />
                    )}
                    {currentTab === 'tv' && (
                        <MainHomeFilms
                            data={dataTV}
                            dataDetail={dataTVDetail}
                            isLoadingBanner={isLoadingTVDetail}
                            isLoadingSection={isLoadingTV}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Home

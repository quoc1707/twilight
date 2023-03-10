import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { BsFillArrowUpCircleFill } from 'react-icons/bs'
import { ConfigType } from '../types'
import ExploreResult from '../components/Slider/ExploreResult'
import Filter from '../components/Filter'
import { GiHamburgerMenu } from 'react-icons/gi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import SearchBox from '../components/Common/SearchBox'
import Sidebar from '../components/Common/Sidebar'
import SidebarMini from '../components/Common/SidebarMini'
import Title from '../components/Common/Title'
import useCurrentViewport from '../hooks/useCurrentViewport'

const Explore = () => {
    const [currentTab, setCurrentTab] = useState(
        localStorage.getItem('currentTab') || 'tv'
    )
    const { isSmallScreen } = useCurrentViewport()
    const [isShowScrollUpBtn, setIsShowScrollUpBtn] = useState(false)
    const [isSidebarActive, setIsSidebarActive] = useState(false)

    useEffect(() => {
        const checkIfShowScrollUpBtn = () => {
            const scrollOffset = document.documentElement.scrollTop
            if (scrollOffset > 1000) {
                setIsShowScrollUpBtn(true)
            } else {
                setIsShowScrollUpBtn(false)
            }
        }

        window.addEventListener('scroll', checkIfShowScrollUpBtn)

        return () =>
            window.removeEventListener('scroll', checkIfShowScrollUpBtn)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    const [searchParams, setSearchParams] = useSearchParams()
    const [config, setConfig] = useState<ConfigType>({})

    useEffect(() => {
        const changeConfig = (key: string, value: string | number) => {
            setConfig((prevConfig) => ({
                ...prevConfig,
                [key]: value,
            }))
        }

        const sortType = searchParams.get('sort_by') || 'popularity.desc'
        changeConfig('sort_by', sortType)

        const genreType = searchParams.getAll('genre') || []
        changeConfig('with_genres', genreType.toString())

        const minRuntime = Number(searchParams.get('minRuntime')) || 0
        const maxRuntime = Number(searchParams.get('maxRuntime')) || 200
        changeConfig('with_runtime.gte', minRuntime)
        changeConfig('with_runtime.lte', maxRuntime)

        const releaseFrom = searchParams.get('from') || '2002-11-04'
        const releaseTo = searchParams.get('to') || '2022-07-28'
        changeConfig('primary_release_date.gte', releaseFrom)
        changeConfig('primary_release_date.lte', releaseTo)
        changeConfig('air_date.gte', releaseFrom)
        changeConfig('air_date.lte', releaseTo)

        // eslint-disable-next-line
    }, [location.search])
    return (
        <>
            <Title value='Explore' />
            {isShowScrollUpBtn && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-[30px] right-[30px] z-10 transition duration-500 ${
                        isShowScrollUpBtn ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <BsFillArrowUpCircleFill
                        size={35}
                        className='text-primary transition duration-300 hover:brightness-75'
                    />
                </button>
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

            <div className='flex flex-col-reverse md:flex-row'>
                {isSmallScreen ? (
                    <Sidebar
                        setIsSidebarActive={setIsSidebarActive}
                        isSidebarActive={isSidebarActive}
                    />
                ) : (
                    <SidebarMini />
                )}
                <div className='flex-grow px-[2vw] pt-6'>
                    {!isSmallScreen && (
                        <div className='mb-8 flex items-center justify-between'>
                            <h2 className='text-3xl font-medium uppercase text-white '>
                                Find films that best fit you
                            </h2>
                        </div>
                    )}

                    <div className='relative mb-6 inline-flex gap-[40px] border-b border-gray-darken pb-[14px]'>
                        <button
                            onClick={() => {
                                setCurrentTab('tv')
                                localStorage.setItem('currentTab', 'tv')
                                setSearchParams({})
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
                                setSearchParams({})
                            }}
                            className={`${
                                currentTab === 'movie' &&
                                'font-medium text-white after:absolute after:bottom-0 after:right-[1%] after:h-[3px] after:w-10 after:bg-white'
                            } transition duration-300 hover:text-white`}
                        >
                            Movie
                        </button>
                    </div>
                    <ExploreResult currentTab={currentTab} config={config} />
                </div>
                <div className='sticky top-0 hidden w-full max-w-[310px] shrink-0 px-6 lg:block'>
                    <SearchBox />
                    <div className='mt-28 flex flex-wrap gap-3'>
                        <Filter currentTab={currentTab} />
                    </div>
                </div>
                {isSmallScreen && (
                    <h2 className='mt-3 ml-3 text-3xl font-medium uppercase text-white'>
                        Find films that best fit you
                    </h2>
                )}
            </div>
        </>
    )
}

export default Explore

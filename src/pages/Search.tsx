import { Link, useSearchParams } from 'react-router-dom'

import { GiHamburgerMenu } from 'react-icons/gi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import SearchBox from '../components/Common/SearchBox'
import SearchResult from '../components/Search/SearchResult'
import Sidebar from '../components/Common/Sidebar'
import SidebarMini from '../components/Common/SidebarMini'
import Title from '../components/Common/Title'
import useCurrentViewport from '../hooks/useCurrentViewport'
import { useState } from 'react'

const Search = () => {
    const [isSidebarActive, setIsSidebarActive] = useState(false)
    const { isSmallScreen } = useCurrentViewport()
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')
    const page = searchParams.get('page') || 1

    return (
        <>
            {query ? (
                <Title value={`Search: ${query}`} />
            ) : (
                <Title value='Search' />
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
            <div className='flex min-h-screen flex-col-reverse md:flex-row'>
                {isSmallScreen ? (
                    <Sidebar
                        setIsSidebarActive={setIsSidebarActive}
                        isSidebarActive={isSidebarActive}
                    />
                ) : (
                    <SidebarMini />
                )}
                <div className='flex-grow'>
                    <div
                        className={`relative z-30 mx-auto w-full translate-y-[120px] text-xl transition duration-300 md:max-w-[50vw] ${
                            query && '!translate-y-0'
                        }`}
                    >
                        <h1
                            className={`absolute -top-14 left-0 right-0 text-center text-[25px] font-medium text-white md:-top-6  ${
                                query
                                    ? 'invisible opacity-0'
                                    : 'visible opacity-100'
                            } transition duration-500`}
                        >
                            Find your favourite movies, TV series, people and
                            more
                        </h1>
                        <SearchBox autoFocus />
                    </div>
                    {query ? (
                        <SearchResult
                            currentTab='multi'
                            query={query}
                            page={Number(page)}
                        />
                    ) : (
                        <div className='mt-[250px] flex justify-center'>
                            <LazyLoadImage
                                src='/images/sample.png'
                                alt=''
                                effect='opacity'
                                className='w-[80vw] max-w-[700px] rounded-xl object-cover '
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Search

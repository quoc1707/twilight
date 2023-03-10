import { FC, useState } from 'react'
import { HiOutlineLogin, HiOutlineLogout } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import { AiOutlineHome } from 'react-icons/ai'
import { BiUserCircle } from 'react-icons/bi'
import { BsBookmarkHeart } from 'react-icons/bs'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { MdOutlineExplore } from 'react-icons/md'
import { auth } from '../../lib/firebase'
import { signOut } from 'firebase/auth'
import { useAppSelector } from '../../store/hooks'
import useCurrentViewport from '../../hooks/useCurrentViewport'

const Sidebar: FC<{
    isSidebarActive: boolean
    setIsSidebarActive: any
}> = ({ isSidebarActive, setIsSidebarActive }) => {
    const location = useLocation()
    const currentUser = useAppSelector((state) => state.auth.user)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { isSmallScreen } = useCurrentViewport()

    const signOutHandler = () => {
        setIsLoading(true)
        signOut(auth)
            .then(() => {
                toast.dark('Sign out successfully')
                setTimeout(() => window.location.reload(), 1000)
            })
            .finally(() => setIsLoading(false))
    }

    const shouldRedirect = (destinationUrl: string) => {
        currentUser
            ? navigate(destinationUrl)
            : toast.dark('You need to login to use this feature')
    }

    return (
        <>
            <ToastContainer />
            {isLoading && (
                <div className='tw-flex-center fixed top-0 left-0 z-10 h-full w-full'>
                    <div className='h-28 w-28 animate-spin rounded-full border-[10px] border-primary border-t-transparent '></div>
                </div>
            )}
            <div
                className={`fixed top-0 z-50 h-screen w-[70vw] shrink-0  
        -translate-x-full bg-dark-lighten pl-8 pt-10
    
      shadow-md transition duration-300 md:sticky md:max-w-[260px] md:translate-x-0 md:bg-transparent md:shadow-none ${
          isSidebarActive && 'translate-x-0'
      }`}
            >
                {!isSmallScreen && (
                    <Link to='/twilight/' className='flex items-center gap-3'>
                        <LazyLoadImage
                            alt='Logo'
                            src='/images/logo.png'
                            effect='opacity'
                            className='h-10 w-10'
                        />
                        <h1 className='text-xl font-semibold uppercase tracking-widest text-white'>
                            <span>Twi</span>
                            <span className='text-primary'>light</span>
                        </h1>
                    </Link>
                )}
                <div
                    className={`text-lg font-medium text-white ${
                        isSidebarActive ? '-mt-6' : 'mt-12'
                    }`}
                >
                    MENU
                </div>
                <div className='mt-8 ml-4 flex flex-col gap-6'>
                    <Link
                        to='/twilight/'
                        className={`flex items-center gap-6  ${
                            location.pathname === '/' &&
                            'border-r-4 border-primary font-medium !text-primary'
                        } transition duration-300 hover:text-white`}
                    >
                        <AiOutlineHome size={25} />
                        <p>Home</p>
                    </Link>
                    <Link
                        to='/twilight/explore'
                        className={`flex items-center gap-6  ${
                            location.pathname === '/explore' &&
                            'border-r-4 border-primary font-medium !text-primary'
                        } transition duration-300 hover:text-white`}
                    >
                        <MdOutlineExplore size={25} />
                        <p>Explore</p>
                    </Link>
                    {/* <Link
                        to='/twilight/search'
                        className={`flex gap-6 items-center  ${
                            location.pathname === '/search' &&
                            '!text-primary border-r-4 border-primary font-medium'
                        } hover:text-white transition duration-300`}
                    >
                        <BiSearch size={25} />
                        <p>Search</p>
                    </Link> */}
                </div>
                <div className='mt-12 text-lg font-medium text-white'>
                    PERSONAL
                </div>
                <div className='mt-8 ml-4 flex flex-col gap-6'>
                    <button
                        onClick={() => shouldRedirect('/twilight/bookmarked')}
                        className={`flex items-center gap-6  ${
                            location.pathname === '/bookmarked' &&
                            'border-r-4 border-primary font-medium !text-primary'
                        } transition duration-300 hover:text-white`}
                    >
                        <BsBookmarkHeart size={25} />
                        <p>Bookmarked</p>
                    </button>
                </div>
                <div className='mt-12 text-lg font-medium text-white'>
                    GENERAL
                </div>
                <div className='mt-8 ml-4 flex flex-col gap-6'>
                    <button
                        onClick={() => shouldRedirect('/twilight/profile')}
                        className={`flex items-center gap-6  ${
                            location.pathname === '/profile' &&
                            'border-r-4 border-primary font-medium !text-primary'
                        } transition duration-300 hover:text-white`}
                    >
                        <BiUserCircle size={25} />
                        <p>Profile</p>
                    </button>
                    {currentUser ? (
                        <button
                            onClick={signOutHandler}
                            className='flex items-center gap-5'
                        >
                            <HiOutlineLogout size={30} />
                            <p>Logout</p>
                        </button>
                    ) : (
                        <Link
                            to={`/twilight/auth?redirect=${encodeURIComponent(
                                location.pathname
                            )}`}
                            className='flex items-center gap-5'
                        >
                            <HiOutlineLogin size={30} />
                            <p>Login</p>
                        </Link>
                    )}
                </div>
            </div>
            <div
                onClick={() => setIsSidebarActive(false)}
                className={`fixed top-0 left-0 z-[5] h-full w-full bg-black/60 transition duration-300 md:opacity-100 ${
                    isSidebarActive
                        ? 'visible opacity-100'
                        : 'invisible opacity-0'
                }`}
            ></div>
        </>
    )
}

export default Sidebar

import { HiOutlineLogin, HiOutlineLogout } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import { AiOutlineHome } from 'react-icons/ai'
import { BiUserCircle } from 'react-icons/bi'
import { BsBookmarkHeart } from 'react-icons/bs'
import { MdOutlineExplore } from 'react-icons/md'
import { auth } from '../../lib/firebase'
import { signOut } from 'firebase/auth'
import { useAppSelector } from '../../store/hooks'

const SidebarMini = () => {
    const location = useLocation()
    const currentUser = useAppSelector((state) => state.auth.user)
    const navigate = useNavigate()

    const signOutHandler = () => {
        signOut(auth)
            .then(() => {
                toast.dark('Sign out successfully')
                setTimeout(() => window.location.reload(), 1000)
            })
            .catch(console.error)
    }

    const shouldRedirect = (destinationUrl: string) => {
        if (!currentUser) {
            toast.dark('You need to login to use this feature')
            return
        }

        navigate(destinationUrl)
    }

    return (
        <>
            <ToastContainer />
            <div className='sticky top-0 flex h-screen w-full max-w-[80px] shrink-0 flex-col items-center justify-center py-8'>
                <div className='flex flex-col gap-7'>
                    <Link
                        to='/twilight/'
                        className={`transition duration-300 hover:text-primary ${
                            location.pathname === '/' && 'text-primary'
                        }`}
                    >
                        <AiOutlineHome size={25} />
                    </Link>
                    <Link
                        to='/twilight/explore'
                        className={`transition duration-300 hover:text-primary ${
                            location.pathname === '/explore' && 'text-primary'
                        }`}
                    >
                        <MdOutlineExplore size={25} />
                    </Link>
                    {/* <Link
                        to='/twilight/search'
                        className={`hover:text-primary transition duration-300 ${
                            location.pathname === '/search' && 'text-primary'
                        }`}
                    >
                        <BiSearch size={25} />
                    </Link> */}
                    <button
                        onClick={() => shouldRedirect('/twilight/bookmarked')}
                        className={`transition duration-300 hover:text-primary ${
                            location.pathname === '/bookmarked' &&
                            'text-primary'
                        }`}
                    >
                        <BsBookmarkHeart size={25} />
                    </button>
                    <button
                        onClick={() => shouldRedirect('/twilight/profile')}
                        className={`transition duration-300 hover:text-primary ${
                            location.pathname === '/profile' && 'text-primary'
                        }`}
                    >
                        <BiUserCircle size={25} />
                    </button>
                    {currentUser ? (
                        <button
                            onClick={signOutHandler}
                            className='transition duration-300 hover:text-primary'
                        >
                            <HiOutlineLogout size={25} />
                        </button>
                    ) : (
                        <Link
                            to={`/twilight/auth?redirect=${encodeURIComponent(
                                location.pathname
                            )}`}
                            className='transition duration-300 hover:text-primary'
                        >
                            <HiOutlineLogin size={25} />
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}

export default SidebarMini

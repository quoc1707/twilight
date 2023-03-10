import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import { FC, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'

import { BiSelectMultiple } from 'react-icons/bi'
import BookmarkResult from './Bookmark'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Item } from '../types'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { MdOutlineCancel } from 'react-icons/md'
import Sidebar from './Common/Sidebar'
import SidebarMini from './Common/SidebarMini'
import Skeleton from './Common/Skeleton'
import { db } from '../lib/firebase'
import { useAppSelector } from '../store/hooks'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import useCurrentViewport from '../hooks/useCurrentViewport'

interface ListView {
    films: Item[]
    isLoading: boolean
    pageType: string
}

const ListView: FC<ListView> = ({ films, isLoading, pageType }) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const [isSidebarActive, setIsSidebarActive] = useState(false)
    const { isSmallScreen } = useCurrentViewport()
    const [isEditing, setIsEditing] = useState(false)
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [selections, setSelections] = useState<number[]>([])
    const [isShowPrompt, setIsShowPrompt] = useState(false)

    const [currentTab, setCurrentTab] = useState(
        localStorage.getItem('bookmarkCurrentTab') || 'all'
    )

    const [parent] = useAutoAnimate()
    const [action] = useAutoAnimate()
    const [show] = useAutoAnimate()

    const selectAllHandler = () => {
        if (isSelectAll) {
            setSelections([])
            setIsSelectAll(false)
            return
        }

        setIsSelectAll(true)

        if (currentTab === 'all') {
            setSelections(films.map((film) => film.id))
        } else if (currentTab === 'tv') {
            setSelections(
                films
                    .filter((film) => film.media_type === 'tv')
                    .map((film) => film.id)
            )
        } else if (currentTab === 'movie') {
            setSelections(
                films
                    .filter((film) => film.media_type === 'movie')
                    .map((film) => film.id)
            )
        }
    }

    const clearSelection = () => {
        if (!currentUser) return

        const editedFilms = films.filter(
            (film) => selections.indexOf(film.id) === -1
        )

        updateDoc(doc(db, 'users', currentUser?.uid), {
            ...(pageType === 'bookmark' && {
                bookmarks: editedFilms.reverse(),
            }),
            ...(pageType === 'history' && {
                recentlyWatch: editedFilms.reverse(),
            }),
        })

        setSelections([])
        setIsSelectAll(false)
        setIsShowPrompt(false)
    }

    return (
        <>
            <div
                // @ts-ignore
                ref={show}
            >
                {isShowPrompt && (
                    <>
                        <div className='fixed top-[30%] right-[5%] left-[5%] z-40 min-h-[100px] rounded-md bg-dark-lighten py-5 px-3 shadow-md md:left-[40%] md:w-[400px]'>
                            <div className='tw-flex-center mx-auto mb-7 h-16 w-16 rounded-full border-[3px] border-red-500'>
                                <AiOutlineDelete
                                    size={40}
                                    className='text-red-500 '
                                />
                            </div>
                            <p className='mb-4 text-center text-xl font-medium text-white'>
                                You are about to remove
                                {selections.length === 1
                                    ? ' this film.'
                                    : ' these films.'}
                            </p>
                            <p className='mb-[2px] text-center'>
                                This will remove your films from this {pageType}{' '}
                                list.
                            </p>
                            <p className='text-center '>Are you sure?</p>
                            <div className='mt-8 flex justify-end'>
                                <button
                                    onClick={() => setIsShowPrompt(false)}
                                    className='rounded-md px-6 py-1 text-white transition duration-300 hover:brightness-75'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={clearSelection}
                                    className='rounded-md bg-red-500 px-6 py-1 text-white transition duration-300 hover:bg-red-600'
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                        <div
                            onClick={() => setIsShowPrompt(false)}
                            className='fixed top-0 left-0 z-30 h-full w-full bg-black/60'
                        ></div>
                    </>
                )}
            </div>

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

            {/*
            <div className='absolute top-4 right-5 hidden items-center gap-6 md:flex'>
                <p>{currentUser?.displayName || 'Anonymous'}</p>
                <LazyLoadImage
                    src={
                        currentUser
                            ? (currentUser.photoURL as string)
                            : '/images/avatar.png'
                    }
                    alt='User avatar'
                    className='h-10 w-10 rounded-full object-cover'
                    effect='opacity'
                    referrerPolicy='no-referrer'
                />
                </div> */}

            <div className='flex'>
                {!isSmallScreen && <SidebarMini />}
                {isSmallScreen && (
                    <Sidebar
                        setIsSidebarActive={setIsSidebarActive}
                        isSidebarActive={isSidebarActive}
                    />
                )}
                <div className='min-h-screen flex-grow px-[2vw] pt-7 pb-16'>
                    <h1 className='mb-4 text-[35px] font-semibold uppercase text-white '>
                        {pageType === 'bookmark'
                            ? 'My favourite films'
                            : 'Films I Watched'}
                    </h1>
                    <div
                        // @ts-ignore
                        ref={action}
                        className='m mb-8 flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between'
                    >
                        <div className='relative inline-flex gap-[30px] border-b border-gray-darken pb-[14px]'>
                            <button
                                onClick={() => {
                                    setCurrentTab('all')
                                    localStorage.setItem(
                                        'bookmarkCurrentTab',
                                        'all'
                                    )
                                }}
                                className={`${
                                    currentTab === 'all' &&
                                    'font-medium text-white after:absolute after:bottom-0 after:left-[0%] after:h-[3px] after:w-5 after:bg-white'
                                } transition duration-300 hover:text-white`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentTab('tv')
                                    localStorage.setItem(
                                        'bookmarkCurrentTab',
                                        'tv'
                                    )
                                }}
                                className={`${
                                    currentTab === 'tv' &&
                                    'font-medium text-white after:absolute after:bottom-0 after:left-[38%] after:h-[3px] after:w-5 after:bg-white'
                                } transition duration-300 hover:text-white`}
                            >
                                TV Series
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentTab('movie')
                                    localStorage.setItem(
                                        'bookmarkCurrentTab',
                                        'movie'
                                    )
                                }}
                                className={`${
                                    currentTab === 'movie' &&
                                    'font-medium text-white after:absolute after:bottom-0 after:right-[5%] after:h-[3px] after:w-5 after:bg-white'
                                } transition duration-300 hover:text-white`}
                            >
                                Movie
                            </button>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='flex items-center gap-2 self-end text-lg transition duration-300 hover:text-primary'
                            >
                                <AiOutlineEdit size={25} />
                                <p>Edit</p>
                            </button>
                        )}

                        {isEditing && (
                            <div className='flex gap-5 self-end'>
                                <button
                                    onClick={selectAllHandler}
                                    className={`flex items-center gap-2 text-lg transition duration-300 hover:text-primary ${
                                        isSelectAll
                                            ? 'text-primary'
                                            : '!text-gray-lighten'
                                    }`}
                                >
                                    <BiSelectMultiple size={25} />
                                    <p>Select all</p>
                                </button>
                                <button
                                    onClick={() => setIsShowPrompt(true)}
                                    disabled={selections.length === 0}
                                    className='flex items-center gap-2 text-lg transition duration-300 hover:text-red-500 disabled:text-gray-700'
                                >
                                    <AiOutlineDelete size={25} />
                                    <p>Clear</p>
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className='flex items-center gap-2 text-lg transition duration-300 hover:text-green-700'
                                >
                                    <MdOutlineCancel size={25} />
                                    <p>Cancel</p>
                                </button>
                            </div>
                        )}
                    </div>

                    <ul
                        // @ts-ignore
                        ref={parent}
                        className={`grid grid-cols-sm gap-x-8 gap-y-10 md:grid-cols-lg ${
                            isEditing && '!gap-y-16'
                        }`}
                    >
                        {isLoading &&
                            [...new Array(6)].map((_, index) => (
                                <li key={index}>
                                    <Skeleton className='h-0 pb-[160%]' />
                                </li>
                            ))}
                        {currentTab === 'all' && (
                            <BookmarkResult
                                films={films}
                                isEditing={isEditing}
                                selections={selections}
                                setSelections={setSelections}
                                isLoading={isLoading}
                                pageType={pageType}
                            />
                        )}
                        {currentTab === 'tv' && (
                            <BookmarkResult
                                films={films.filter(
                                    (film) => film.media_type === 'tv'
                                )}
                                isEditing={isEditing}
                                selections={selections}
                                setSelections={setSelections}
                                isLoading={isLoading}
                                pageType={pageType}
                            />
                        )}
                        {currentTab === 'movie' && (
                            <BookmarkResult
                                films={films.filter(
                                    (film) => film.media_type === 'movie'
                                )}
                                isEditing={isEditing}
                                selections={selections}
                                setSelections={setSelections}
                                isLoading={isLoading}
                                pageType={pageType}
                            />
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ListView

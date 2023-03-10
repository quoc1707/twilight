import { FC, FormEvent, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    addDoc,
    collection,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore'

import CommentUserData from './Data'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { MdSend } from 'react-icons/md'
import { db } from '../../../lib/firebase'
import { useAppSelector } from '../../../store/hooks'
import useCollectionQuery from '../../../hooks/useCollectionQuery'

const Comment: FC<{
    id?: number
    media_type: string
}> = ({ id, media_type }) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const location = useLocation()
    const [commentInputValue, setCommentInputValue] = useState('')
    const [isSendingComment, setIsSendingComment] = useState(false)
    const [commentLimit, setCommentLimit] = useState(5)
    const [sortType, setSortType] = useState('latest')

    const commentSubmitHandler = (e: FormEvent) => {
        e.preventDefault()

        if (!commentInputValue) return

        setIsSendingComment(true)
        addDoc(collection(db, `${media_type}-${id as number}`), {
            user: currentUser,
            value: commentInputValue.trim().slice(0, 500),
            reactions: {},
            createdAt: serverTimestamp(),
            isEdited: false,
        }).finally(() => setIsSendingComment(false))

        setCommentInputValue('')
    }

    const {
        data: commentData,
        isLoading,
        isError,
    } = useCollectionQuery(
        id,
        query(
            collection(db, `${media_type}-${id}`),
            orderBy('createdAt', 'desc')
        )
    )

    return (
        <div className='mb-16'>
            <div className='mb-6 flex items-center justify-between'>
                <div className='relative w-[140px]'>
                    <p className='text-xl font-medium text-white md:text-2xl'>
                        Comments
                    </p>
                </div>
                <div className='flex'>
                    <button
                        onClick={() => setSortType('latest')}
                        className={`rounded-l-xl border border-dark-lighten px-2 py-1 transition duration-300   hover:text-white ${
                            sortType === 'latest' &&
                            'bg-dark-lighten-2 text-white'
                        }`}
                    >
                        Latest
                    </button>
                    <button
                        onClick={() => setSortType('popular')}
                        className={`rounded-r-xl border border-dark-lighten px-2 py-1 transition duration-300   hover:text-white ${
                            sortType === 'popular' &&
                            'bg-dark-lighten-2 text-white'
                        }`}
                    >
                        Popular
                    </button>
                </div>
            </div>

            <div className='px-1 md:px-4'>
                <div className='mb-12'>
                    {currentUser ? (
                        <form
                            onSubmit={commentSubmitHandler}
                            className='flex items-center gap-4'
                        >
                            <LazyLoadImage
                                src={currentUser.photoURL as string}
                                alt=''
                                effect='opacity'
                                className='h-12 w-12 shrink-0 rounded-full object-cover'
                                referrerPolicy='no-referrer'
                            />
                            <input
                                value={commentInputValue}
                                onChange={(e) =>
                                    setCommentInputValue(e.target.value)
                                }
                                type='text'
                                className='flex-1 rounded-full bg-dark-lighten px-4 py-3 text-white outline-none'
                                placeholder='Write comment...'
                            />
                            {isSendingComment ? (
                                <div className='h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent'></div>
                            ) : (
                                <button>
                                    <MdSend
                                        size={30}
                                        className='text-primary '
                                    />
                                </button>
                            )}
                        </form>
                    ) : (
                        <p className='text-center text-lg'>
                            You need to
                            <Link
                                to={`/twilight/auth?redirect=${encodeURIComponent(
                                    location.pathname
                                )}`}
                                className='font-medium text-primary'
                            >
                                {' login '}
                            </Link>
                            to comment.
                        </p>
                    )}
                </div>
                <CommentUserData
                    isLoading={isLoading}
                    isError={isError}
                    sortType={sortType}
                    commentData={commentData}
                    commentLimit={commentLimit}
                    media_type={media_type}
                    id={id}
                    role='comment'
                />
            </div>

            {commentData && commentData.size > commentLimit && (
                <button
                    className='font-medium'
                    onClick={() => setCommentLimit((prev) => prev + 5)}
                >
                    Load more comments ({commentLimit}/{commentData.size})
                </button>
            )}
        </div>
    )
}

export default Comment

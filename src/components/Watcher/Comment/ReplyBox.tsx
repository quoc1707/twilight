import { FC, FormEvent, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import { LazyLoadImage } from 'react-lazy-load-image-component'
import { MdSend } from 'react-icons/md'
import { User } from '../../../types'
import { db } from '../../../lib/firebase'
import { useAppSelector } from '../../../store/hooks'

const ReplyBox: FC<{
    commendId: string
}> = ({ commendId }) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const [commentInputValue, setCommentInputValue] = useState('')
    const [isSendingComment, setIsSendingComment] = useState(false)

    const commentSubmitHandler = (e: FormEvent) => {
        e.preventDefault()

        if (!commentInputValue) return

        setIsSendingComment(true)
        addDoc(collection(db, `replyTo-${commendId}`), {
            user: currentUser,
            value: commentInputValue.trim().slice(0, 500),
            reactions: {},
            createdAt: serverTimestamp(),
        }).finally(() => setIsSendingComment(false))
        setCommentInputValue('')
    }

    return (
        <form
            onSubmit={commentSubmitHandler}
            className='relative z-20 mt-4 mb-10 flex items-center gap-4 last:mb-0'
        >
            <LazyLoadImage
                src={(currentUser as User).photoURL as string}
                alt=''
                effect='opacity'
                className='h-11 w-11 shrink-0 rounded-full object-cover'
                referrerPolicy='no-referrer'
            />
            <input
                value={commentInputValue}
                onChange={(e) => setCommentInputValue(e.target.value)}
                type='text'
                className='flex-1 rounded-full bg-dark-lighten px-4 py-3 text-white outline-none'
                placeholder='Write reply...'
            />
            {isSendingComment ? (
                <div className='h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent'></div>
            ) : (
                <button>
                    <MdSend size={30} className='text-primary ' />
                </button>
            )}
        </form>
    )
}

export default ReplyBox

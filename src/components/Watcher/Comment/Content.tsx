import { AiFillHeart, AiTwotoneLike } from 'react-icons/ai'
import { CommentDataType, User } from '../../../types'
import { DocumentData, QuerySnapshot, doc, updateDoc } from 'firebase/firestore'
import { FC, Fragment, useRef, useState } from 'react'
import { FaAngry, FaSadTear, FaSurprise } from 'react-icons/fa'

import { BsEmojiLaughingFill } from 'react-icons/bs'
import EditComment from './Edit'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { MdSend } from 'react-icons/md'
import ReactionInfo from './Reaction'
import Reply from './Reply'
import ReplyBox from './ReplyBox'
import { calculateTimePassed } from '../../../helpers'
import { db } from '../../../lib/firebase'
import { useAppSelector } from '../../../store/hooks'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface CommentUserContent {
    commentData: QuerySnapshot<DocumentData> | null
    sortType: string
    commentLimit: number
    media_type: string
    id?: number | string
    role: string
}

const CommentUserContent: FC<CommentUserContent> = ({
    commentData,
    sortType,
    commentLimit,
    media_type,
    id,
    role,
}) => {
    const [parent] = useAutoAnimate()
    const currentUser = useAppSelector((state) => state.auth.user)
    const [commentHiden, setCommentHiden] = useState<string[]>([])
    const [showOptionFor, setShowOptionFor] = useState<string | undefined>(
        undefined
    )
    const [editingCommentFor, setEditingCommentFor] = useState<
        string | undefined
    >()
    const editValueRef = useRef<HTMLInputElement>(null!)
    const [isReplyingFor, setIsReplyingFor] = useState<string | undefined>()

    const sortComment = (
        commentData: QuerySnapshot<DocumentData> | null,
        type: string
    ) => {
        if (!commentData) return undefined

        if (type === 'popular') {
            return commentData.docs
                .slice()
                .sort(
                    (a, b) =>
                        Object.values(b.data()?.reactions).length -
                        Object.values(a.data()?.reactions).length
                )
        } else if (type === 'latest') {
            return commentData.docs
        }
    }

    const addReaction = (commentId: string, value: string) => {
        if (!currentUser) return

        updateDoc(doc(db, `${media_type}-${id as number}`, commentId), {
            [`reactions.${currentUser.uid}`]: value,
        })
    }

    const determineReactionText = (reactions: { [key: string]: string }) => {
        if (!Object.keys(reactions).includes((currentUser as User).uid)) {
            return 'Reaction'
        }

        // @ts-ignore
        const userReactionValue = Object.entries(reactions).find(
            (entry) => entry[0] === (currentUser as User).uid
        )[1]

        return userReactionValue[0].toUpperCase() + userReactionValue.slice(1)
    }

    const removeReaction = (docData: CommentDataType, commentId: string) => {
        const filteredReactionUsers = Object.entries(docData.reactions).filter(
            (entry) => entry[0] !== (currentUser?.uid as string)
        )

        const updatedReactionUserObj = filteredReactionUsers.reduce(
            (acc, current) => ({
                ...acc,
                [current[0]]: current[1],
            }),
            {} as { [key: string]: string }
        )

        updateDoc(doc(db, `${media_type}-${id as number}`, commentId), {
            reactions: updatedReactionUserObj,
        })
    }

    const handleEditComment = (commentId: string) => {
        const editText = editValueRef.current.value

        if (!editText.trim()) return

        updateDoc(doc(db, `${media_type}-${id}`, commentId), {
            value: editText,
        })

        setEditingCommentFor(undefined)

        updateDoc(doc(db, `${media_type}-${id as number}`, commentId), {
            isEdited: true,
        })
    }

    return (
        <ul
            // @ts-ignore
            ref={parent}
        >
            {sortComment(commentData, sortType)
                ?.slice(0, commentLimit)
                .map((doc) => {
                    const docData = doc.data() as CommentDataType
                    const timePassed = calculateTimePassed(
                        docData.createdAt?.seconds * 1000 || 0
                    )
                    return (
                        <Fragment key={doc.id}>
                            {!commentHiden.includes(doc.id) && (
                                <li className='mb-6 flex items-start gap-2 last:mb-0 md:gap-4'>
                                    <div className='h-[44px] w-[44px] shrink-0'>
                                        <LazyLoadImage
                                            src={
                                                docData.user.photoURL as string
                                            }
                                            alt=''
                                            effect='opacity'
                                            className='h-11 w-11 rounded-full object-cover '
                                            referrerPolicy='no-referrer'
                                        />
                                    </div>
                                    <div
                                        className={`peer ${
                                            editingCommentFor === doc.id &&
                                            'flex-1'
                                        }`}
                                    >
                                        <div
                                            className={`relative rounded-2xl bg-dark-lighten px-4 py-2 ${
                                                editingCommentFor === doc.id
                                                    ? 'block'
                                                    : 'inline-block'
                                            }`}
                                        >
                                            <ReactionInfo docData={docData} />

                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-4'>
                                                    <p className='font-medium text-white'>
                                                        {
                                                            docData.user
                                                                .displayName
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            {editingCommentFor !== doc.id && (
                                                <p
                                                    style={{
                                                        wordWrap: 'break-word',
                                                    }}
                                                    className='mt-1 max-w-[63vw] text-lg md:max-w-none'
                                                >
                                                    {docData.value}{' '}
                                                    {docData.isEdited && (
                                                        <span>(edited)</span>
                                                    )}
                                                </p>
                                            )}
                                            {editingCommentFor === doc.id && (
                                                <>
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault()
                                                            handleEditComment(
                                                                doc.id
                                                            )
                                                        }}
                                                        className='flex items-center gap-2'
                                                    >
                                                        <input
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    'Escape'
                                                                )
                                                                    setEditingCommentFor(
                                                                        undefined
                                                                    )
                                                            }}
                                                            ref={editValueRef}
                                                            defaultValue={
                                                                docData.value
                                                            }
                                                            type='text'
                                                            className='mt-1 w-full rounded-md bg-dark-lighten-2 px-2 py-1 text-lg text-white outline-none'
                                                            autoFocus
                                                        />
                                                        <button type='submit'>
                                                            <MdSend
                                                                size={25}
                                                                className='text-primary'
                                                            />
                                                        </button>
                                                    </form>
                                                    <p className='mt-1 text-sm'>
                                                        Press Esc to cancel
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <div className='mt-3 flex items-center gap-3'>
                                            {currentUser && (
                                                <div className='group relative'>
                                                    <>
                                                        <button>
                                                            {determineReactionText(
                                                                docData.reactions
                                                            ) ===
                                                                'Reaction' && (
                                                                <p>React</p>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                removeReaction(
                                                                    docData,
                                                                    doc.id
                                                                )
                                                            }
                                                        >
                                                            {determineReactionText(
                                                                docData.reactions
                                                            ) === 'Like' && (
                                                                <p className='text-primary'>
                                                                    {determineReactionText(
                                                                        docData.reactions
                                                                    )}
                                                                </p>
                                                            )}
                                                            {determineReactionText(
                                                                docData.reactions
                                                            ) === 'Love' && (
                                                                <p className='text-red-500'>
                                                                    {determineReactionText(
                                                                        docData.reactions
                                                                    )}
                                                                </p>
                                                            )}
                                                            {determineReactionText(
                                                                docData.reactions
                                                            ) === 'Haha' && (
                                                                <p className='text-yellow-500'>
                                                                    {determineReactionText(
                                                                        docData.reactions
                                                                    )}
                                                                </p>
                                                            )}
                                                            {determineReactionText(
                                                                docData.reactions
                                                            ) === 'Wow' && (
                                                                <p className='text-green-500'>
                                                                    {determineReactionText(
                                                                        docData.reactions
                                                                    )}
                                                                </p>
                                                            )}
                                                            {determineReactionText(
                                                                docData.reactions
                                                            ) === 'Sad' && (
                                                                <p className='text-purple-500'>
                                                                    {determineReactionText(
                                                                        docData.reactions
                                                                    )}
                                                                </p>
                                                            )}
                                                            {determineReactionText(
                                                                docData.reactions
                                                            ) === 'Angry' && (
                                                                <p className='text-orange-500'>
                                                                    {determineReactionText(
                                                                        docData.reactions
                                                                    )}
                                                                </p>
                                                            )}
                                                        </button>
                                                    </>
                                                    <div className='invisible absolute -top-8 -right-[105px] z-40 flex gap-2 rounded-full bg-dark-lighten-2 py-2 px-2 opacity-0 shadow-md transition duration-300 group-hover:visible group-hover:opacity-100'>
                                                        <button
                                                            onClick={() =>
                                                                addReaction(
                                                                    doc.id,
                                                                    'like'
                                                                )
                                                            }
                                                        >
                                                            <AiTwotoneLike
                                                                className='text-blue-500 transition duration-300 hover:scale-125'
                                                                size={20}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                addReaction(
                                                                    doc.id,
                                                                    'love'
                                                                )
                                                            }
                                                        >
                                                            <AiFillHeart
                                                                className='text-red-500 transition duration-300 hover:scale-125'
                                                                size={20}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                addReaction(
                                                                    doc.id,
                                                                    'haha'
                                                                )
                                                            }
                                                        >
                                                            <BsEmojiLaughingFill
                                                                className='text-yellow-500 transition duration-300 hover:scale-125'
                                                                size={20}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                addReaction(
                                                                    doc.id,
                                                                    'wow'
                                                                )
                                                            }
                                                        >
                                                            <FaSurprise
                                                                className='text-green-500 transition duration-300 hover:scale-125'
                                                                size={20}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                addReaction(
                                                                    doc.id,
                                                                    'sad'
                                                                )
                                                            }
                                                        >
                                                            <FaSadTear
                                                                className='text-purple-500 transition duration-300 hover:scale-125'
                                                                size={20}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                addReaction(
                                                                    doc.id,
                                                                    'angry'
                                                                )
                                                            }
                                                        >
                                                            <FaAngry
                                                                className='text-orange-500 transition duration-300 hover:scale-125'
                                                                size={20}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {role !== 'reply' && (
                                                <button
                                                    onClick={() => {
                                                        if (!currentUser) return
                                                        if (
                                                            isReplyingFor !==
                                                            doc.id
                                                        )
                                                            setIsReplyingFor(
                                                                doc.id
                                                            )
                                                        else
                                                            setIsReplyingFor(
                                                                undefined
                                                            )
                                                    }}
                                                >
                                                    <p className='transition duration-300 hover:text-white'>
                                                        Reply
                                                    </p>
                                                </button>
                                            )}
                                            <p>
                                                {timePassed}{' '}
                                                {timePassed === 'Just now'
                                                    ? ''
                                                    : 'ago'}
                                            </p>
                                        </div>
                                        {isReplyingFor === doc.id && (
                                            <ReplyBox commendId={doc.id} />
                                        )}
                                        <Reply commendId={doc.id} />
                                    </div>

                                    <EditComment
                                        setEditingCommentFor={
                                            setEditingCommentFor
                                        }
                                        media_type={media_type}
                                        id={id}
                                        singleDoc={doc}
                                        showOptionFor={showOptionFor}
                                        setShowOptionFor={setShowOptionFor}
                                        setCommentHiden={setCommentHiden}
                                    />
                                </li>
                            )}
                        </Fragment>
                    )
                })}
        </ul>
    )
}

export default CommentUserContent

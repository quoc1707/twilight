import { doc, getDoc } from 'firebase/firestore'
import { FC, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineClose, AiTwotoneLike } from 'react-icons/ai'
import { FaAngry, FaSadTear, FaSurprise } from 'react-icons/fa'

import { BsEmojiLaughingFill } from 'react-icons/bs'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { db } from '../../../lib/firebase'

interface UserWhoReact {
    docData: any
    isShowReactionData: boolean
    setIsShowReactionData: any
}

const UserWhoReact: FC<UserWhoReact> = ({
    docData,
    isShowReactionData,
    setIsShowReactionData,
}) => {
    const [infoReactionUser, setInfoReactionUser] = useState<
        {
            user: any
            reaction: string
        }[]
    >([])

    useEffect(() => {
        const infoReactionUser = Object.entries(docData.reactions).map(
            async (entry) => {
                const docSnap = await getDoc(doc(db, 'users', entry[0]))
                return {
                    user: {
                        firstName: docSnap.data()?.firstName,
                        lastName: docSnap.data()?.lastName,
                        photoUrl: docSnap.data()?.photoUrl,
                    },
                    reaction: entry[1],
                }
            }
        )

        const reactionInfo = [] as any

        infoReactionUser.forEach(async (promise) => {
            reactionInfo.push(await promise)
        })
        setInfoReactionUser(reactionInfo)
    }, [docData.reactions])

    return (
        <>
            {isShowReactionData && (
                <>
                    <div
                        onClick={() => setIsShowReactionData(false)}
                        className='fixed top-0 left-0 z-40 h-full w-full bg-black/60'
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className='fixed top-1/2 left-1/2 w-full max-w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-dark-lighten-2 py-3 px-4 shadow-md'
                        >
                            <div className='mb-6 flex items-center justify-between'>
                                <p className='text-lg font-medium text-white'>
                                    People's reaction to this info
                                </p>
                                <button
                                    onClick={() => setIsShowReactionData(false)}
                                >
                                    <AiOutlineClose
                                        size={20}
                                        className='text-white transition duration-300 hover:brightness-75'
                                    />
                                </button>
                            </div>

                            <ul className='flex flex-col gap-3'>
                                {infoReactionUser.map((item, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className='flex items-center justify-between'
                                        >
                                            <div className='flex items-center gap-3'>
                                                <div className='h-10 w-10 shrink-0'>
                                                    <LazyLoadImage
                                                        src={item.user.photoUrl}
                                                        alt=''
                                                        effect='opacity'
                                                        className='h-10 w-10 rounded-full object-cover'
                                                        referrerPolicy='no-referrer'
                                                    />
                                                </div>
                                                <p className='max-w-[225px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-300'>{`${item.user.lastName} ${item.user.firstName}`}</p>
                                            </div>
                                            <div>
                                                {item.reaction === 'like' && (
                                                    <AiTwotoneLike
                                                        className='text-blue-500'
                                                        size={20}
                                                    />
                                                )}
                                                {item.reaction === 'love' && (
                                                    <AiFillHeart
                                                        className='text-red-500'
                                                        size={20}
                                                    />
                                                )}
                                                {item.reaction === 'haha' && (
                                                    <BsEmojiLaughingFill
                                                        className='text-yellow-500'
                                                        size={20}
                                                    />
                                                )}
                                                {item.reaction === 'wow' && (
                                                    <FaSurprise
                                                        className='text-green-500'
                                                        size={20}
                                                    />
                                                )}
                                                {item.reaction === 'sad' && (
                                                    <FaSadTear
                                                        className='text-purple-500'
                                                        size={20}
                                                    />
                                                )}
                                                {item.reaction === 'angry' && (
                                                    <FaAngry
                                                        className='text-orange-500'
                                                        size={20}
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UserWhoReact

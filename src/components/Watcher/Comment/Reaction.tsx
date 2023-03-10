import { AiFillHeart, AiTwotoneLike } from 'react-icons/ai'
import { FC, useState } from 'react'
import { FaAngry, FaSadTear, FaSurprise } from 'react-icons/fa'

import { BsEmojiLaughingFill } from 'react-icons/bs'
import UserWhoReact from './UserWhoReact'

const ReactionInfo: FC<{
    docData: any
}> = ({ docData }) => {
    const [isShowReactionData, setIsShowReactionData] = useState(false)

    const convertReaction = (reactions: { [key: string]: string }) => {
        const countNumberOfEachReaction = Object.values(reactions).reduce(
            (acc, current) => {
                acc[current] = 1 + (acc[current] || 0)

                return acc
            },
            {} as { [key: string]: number }
        )

        const sortedByNumberOfReaction = Object.entries(
            countNumberOfEachReaction
        ).sort((a, b) => b[1] - a[1])

        return sortedByNumberOfReaction
    }

    return (
        <>
            {Object.values(docData.reactions).length > 0 && (
                <>
                    <UserWhoReact
                        docData={docData}
                        isShowReactionData={isShowReactionData}
                        setIsShowReactionData={setIsShowReactionData}
                    />
                    <button
                        onClick={() => setIsShowReactionData(true)}
                        className='peer absolute -right-10 -bottom-3 flex items-center  gap-1 rounded-full bg-dark-lighten-2 px-1 py-[2px] pl-3 shadow-md transition duration-300 hover:brightness-75'
                    >
                        {convertReaction(docData.reactions)
                            .slice(0, 3)
                            .map((reactionEntry: any, index: number) => (
                                <div key={index}>
                                    {reactionEntry[0] === 'like' && (
                                        <AiTwotoneLike
                                            className={`relative -ml-2 text-blue-500 ${
                                                index === 0
                                                    ? 'z-30'
                                                    : index === 1
                                                    ? 'z-20'
                                                    : 'z-10'
                                            }`}
                                            size={20}
                                        />
                                    )}
                                    {reactionEntry[0] === 'love' && (
                                        <AiFillHeart
                                            className={`relative -ml-2 text-red-500 ${
                                                index === 0
                                                    ? 'z-30'
                                                    : index === 1
                                                    ? 'z-20'
                                                    : 'z-10'
                                            }`}
                                            size={20}
                                        />
                                    )}
                                    {reactionEntry[0] === 'haha' && (
                                        <BsEmojiLaughingFill
                                            className={`relative -ml-2 text-yellow-500 ${
                                                index === 0
                                                    ? 'z-30'
                                                    : index === 1
                                                    ? 'z-20'
                                                    : 'z-10'
                                            }`}
                                            size={20}
                                        />
                                    )}
                                    {reactionEntry[0] === 'wow' && (
                                        <FaSurprise
                                            className={`relative -ml-2 text-green-500 ${
                                                index === 0
                                                    ? 'z-30'
                                                    : index === 1
                                                    ? 'z-20'
                                                    : 'z-10'
                                            }`}
                                            size={20}
                                        />
                                    )}
                                    {reactionEntry[0] === 'sad' && (
                                        <FaSadTear
                                            className={`relative -ml-2 text-purple-500 ${
                                                index === 0
                                                    ? 'z-30'
                                                    : index === 1
                                                    ? 'z-20'
                                                    : 'z-10'
                                            }`}
                                            size={20}
                                        />
                                    )}
                                    {reactionEntry[0] === 'angry' && (
                                        <FaAngry
                                            className={`relative -ml-2 text-orange-500 ${
                                                index === 0
                                                    ? 'z-30'
                                                    : index === 1
                                                    ? 'z-20'
                                                    : 'z-10'
                                            }`}
                                            size={20}
                                        />
                                    )}
                                </div>
                            ))}
                        <p className='text-sm'>
                            {Object.values(docData.reactions).length}
                        </p>
                    </button>
                    <ul className='invisible absolute -right-24 top-[90px] z-10 flex flex-col gap-2 rounded-md bg-dark-lighten-2/60 px-3 py-2 opacity-0 shadow-md transition duration-300 peer-hover:visible peer-hover:opacity-100'>
                        {convertReaction(docData.reactions).map(
                            (reactionEntry: any, index: number) => (
                                <li key={index}>
                                    {reactionEntry[0] === 'like' && (
                                        <div className='flex gap-2'>
                                            <AiTwotoneLike
                                                className={`relative -ml-1 text-blue-500 ${
                                                    index === 0
                                                        ? 'z-30'
                                                        : index === 1
                                                        ? 'z-20'
                                                        : 'z-10'
                                                }`}
                                                size={20}
                                            />
                                            <p>{reactionEntry[1]}</p>
                                        </div>
                                    )}
                                    {reactionEntry[0] === 'love' && (
                                        <div className='flex gap-2'>
                                            <AiFillHeart
                                                className={`relative -ml-1 text-red-500 ${
                                                    index === 0
                                                        ? 'z-30'
                                                        : index === 1
                                                        ? 'z-20'
                                                        : 'z-10'
                                                }`}
                                                size={20}
                                            />
                                            <p>{reactionEntry[1]}</p>
                                        </div>
                                    )}
                                    {reactionEntry[0] === 'haha' && (
                                        <div className='flex gap-2'>
                                            <BsEmojiLaughingFill
                                                className={`relative -ml-1 text-yellow-500 ${
                                                    index === 0
                                                        ? 'z-30'
                                                        : index === 1
                                                        ? 'z-20'
                                                        : 'z-10'
                                                }`}
                                                size={20}
                                            />
                                            <p>{reactionEntry[1]}</p>
                                        </div>
                                    )}
                                    {reactionEntry[0] === 'wow' && (
                                        <div className='flex gap-2'>
                                            <FaSurprise
                                                className={`relative -ml-1 text-green-500 ${
                                                    index === 0
                                                        ? 'z-30'
                                                        : index === 1
                                                        ? 'z-20'
                                                        : 'z-10'
                                                }`}
                                                size={20}
                                            />
                                            <p>{reactionEntry[1]}</p>
                                        </div>
                                    )}
                                    {reactionEntry[0] === 'sad' && (
                                        <div className='flex gap-2'>
                                            <FaSadTear
                                                className={`relative -ml-1 text-purple-500 ${
                                                    index === 0
                                                        ? 'z-30'
                                                        : index === 1
                                                        ? 'z-20'
                                                        : 'z-10'
                                                }`}
                                                size={20}
                                            />
                                            <p>{reactionEntry[1]}</p>
                                        </div>
                                    )}
                                    {reactionEntry[0] === 'angry' && (
                                        <div className='flex gap-2'>
                                            <FaAngry
                                                className={`relative -ml-1 text-orange-500 ${
                                                    index === 0
                                                        ? 'z-30'
                                                        : index === 1
                                                        ? 'z-20'
                                                        : 'z-10'
                                                }`}
                                                size={20}
                                            />
                                            <p>{reactionEntry[1]}</p>
                                        </div>
                                    )}
                                </li>
                            )
                        )}
                    </ul>
                </>
            )}{' '}
        </>
    )
}

export default ReactionInfo

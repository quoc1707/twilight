import { DocumentData, QuerySnapshot } from 'firebase/firestore'

import { FC } from 'react'
import Skeleton from '../../Common/Skeleton'
import CommentUserContent from './Content'

interface CommentUserData {
    id?: number | string
    media_type: string
    commentLimit: number
    isLoading: boolean
    isError: boolean
    commentData: QuerySnapshot<DocumentData> | null
    sortType: string
    role: string
}

const CommentUserData: FC<CommentUserData> = ({
    id,
    media_type,
    commentLimit,
    isLoading,
    isError,
    commentData,
    sortType,
    role,
}) => {
    return (
        <>
            {isError ? (
                <p className='mb-6 text-center text-lg text-red-500'>
                    ERROR: Loading comment failed. Your free service exceeded
                    the limitation already.
                </p>
            ) : isLoading ? (
                <ul>
                    {new Array(5).fill('').map((_, index) => (
                        <li key={index} className='mb-6 flex items-start gap-4'>
                            <Skeleton className='h-11 w-11 !rounded-full' />
                            <div>
                                <Skeleton className='h-[72px] w-[850px]' />
                                <div className='mt-3 flex gap-3'>
                                    <Skeleton className='h-[20px] w-[50px]' />
                                    <Skeleton className='h-[20px] w-[50px]' />
                                    <Skeleton className='h-[20px] w-[50px]' />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : commentData?.size === 0 && role === 'comment' ? (
                <div className='text-center text-lg text-white'>
                    There are no comments yet.
                </div>
            ) : (
                <CommentUserContent
                    commentData={commentData}
                    commentLimit={commentLimit}
                    media_type={media_type}
                    sortType={sortType}
                    id={id}
                    role={role}
                />
            )}
        </>
    )
}

export default CommentUserData

import { collection, orderBy, query } from 'firebase/firestore'
import { FC, useState } from 'react'

import useCollectionQuery from '../../../hooks/useCollectionQuery'
import { db } from '../../../lib/firebase'
import CommentUserData from './Data'

const Reply: FC<{
    commendId: string
}> = ({ commendId }) => {
    const [commentLimit, setCommentLimit] = useState(5)

    const {
        data: commentData,
        isLoading,
        isError,
    } = useCollectionQuery(
        commendId,
        query(
            collection(db, `replyTo-${commendId}`),
            orderBy('createdAt', 'desc')
        )
    )

    return (
        <>
            {commentData && commentData.size > 0 && (
                <div className='mt-5'>
                    <CommentUserData
                        role='reply'
                        isLoading={isLoading}
                        isError={isError}
                        sortType='latest'
                        // @ts-ignore
                        commentData={commentData}
                        commentLimit={commentLimit}
                        media_type='replyTo'
                        id={commendId}
                    />
                </div>
            )}
            {commentData && commentData.size > commentLimit && (
                <button
                    className='mt-3 font-medium'
                    onClick={() => setCommentLimit((prev) => prev + 5)}
                >
                    Load more replies ({commentLimit}/{commentData.size})
                </button>
            )}
        </>
    )
}

export default Reply

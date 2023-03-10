// THIS FILE CONTAINS 2 COMPONENT

import { FC, useState } from 'react'

import ReadMore from '../Common/ReadMore'
import { Reviews } from '../../types'
import { SortReview } from './SortReview'
import StarRating from '../Common/StarRating'
import { calculateTimePassed } from '../../helpers'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const ReviewContent: FC<{
    reviews: Reviews[]
    type: string
}> = ({ reviews, type }) => {
    const [parent] = useAutoAnimate()
    return (
        <ul
            // @ts-ignore
            ref={parent}
            className='flex max-h-[400px] flex-col gap-12 overflow-y-auto pr-4'
        >
            {SortReview(reviews, type).map((review) => (
                <li key={review.id} className='flex gap-7'>
                    <div className='flex-grow'>
                        <div className='flex justify-between'>
                            <p className='text-white'>{review.author}</p>
                            <StarRating
                                star={Math.round(
                                    review.author_details.rating / 2
                                )}
                                maxStar={5}
                            />
                        </div>
                        <ReadMore limitTextLength={150}>
                            {review.content}
                        </ReadMore>
                        <p className='text-right text-base'>
                            {calculateTimePassed(
                                new Date(review.created_at).getTime()
                            )}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    )
}

const ReviewTab: FC<{
    reviews: Reviews[]
}> = ({ reviews }) => {
    const [reviewSortType, setReviewSortType] = useState('desc')

    return (
        <>
            <div className='mb-10 -mt-5 flex justify-end gap-4'>
                <p>Sort Rating: </p>
                <select
                    className='bg-inherit outline-none'
                    value={reviewSortType}
                    onChange={(e) => setReviewSortType(e.target.value)}
                >
                    <option className='bg-dark' value='asc'>
                        Ascending
                    </option>
                    <option className='bg-dark' value='desc'>
                        Descending
                    </option>
                </select>
            </div>
            <div>
                {reviews.length === 0 && (
                    <p className='text-center text-lg text-white'>
                        There is no reviews yet.
                    </p>
                )}
                {reviews.length > 0 && (
                    <ReviewContent reviews={reviews} type={reviewSortType} />
                )}
            </div>
        </>
    )
}

export default ReviewTab

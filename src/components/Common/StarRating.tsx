import { AiFillStar } from 'react-icons/ai'
import { FC } from 'react'

const StarRating: FC<{
    star: number
    maxStar: number
}> = ({ star, maxStar }) => {
    if (star === 0) return <p></p>
    return (
        <div className='flex gap-[2px]'>
            {[...new Array(maxStar)].map((_, index) => (
                <AiFillStar
                    key={index}
                    className={`${index < star && 'text-primary'} `}
                    size={15}
                />
            ))}
        </div>
    )
}
export default StarRating

import { FC, HTMLProps, ReactNode, useState } from 'react'

interface ReadMore {
    children: ReactNode
    className?: string
    limitTextLength: number
}

const ReadMore: FC<ReadMore & HTMLProps<HTMLSpanElement>> = ({
    children,
    className = '',
    limitTextLength,
    ...others
}) => {
    const [isReadingMore, setIsReadingMore] = useState(false)

    const content = isReadingMore
        ? children
        : (children as string).slice(0, limitTextLength)

    return (
        <span {...others} className={`${className} inline-block`}>
            {content}
            <button
                onClick={() => setIsReadingMore((prev) => !prev)}
                className='font-medium italic transition duration-300 hover:brightness-75'
            >
                {!isReadingMore &&
                    (children as string).length > limitTextLength &&
                    '... See more'}
                {isReadingMore && <>&nbsp; Show less</>}
            </button>
        </span>
    )
}

export default ReadMore

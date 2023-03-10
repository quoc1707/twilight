import { useAutoAnimate } from '@formkit/auto-animate/react'
import { FC } from 'react'
import FilterByDate from './Date'
import FilterByGenre from './Genre'
import FilterByOther from './Other'
import FilterByRating from './Rating'

const Filter: FC<{
    currentTab: string
}> = ({ currentTab }) => {
    const [filter] = useAutoAnimate()
    return (
        <div
            // @ts-ignore
            ref={filter}
            className='rounded-md bg-dark-lighten px-4 pt-3 shadow-md'
        >
            <p className='mb-4 text-lg text-white/80'>Sort by</p>
            <FilterByOther />
            <p className='mt-8 mb-2 text-lg text-white/80'>Genres</p>
            <FilterByGenre currentTab={currentTab} />
            <p className='mt-8 mb-2 text-lg text-white/80'>Runtime</p>
            <FilterByRating />
            <p className='mt-8 mb-2 text-lg text-white/80'>Release Dates</p>
            <FilterByDate />
        </div>
    )
}

export default Filter

import { FC } from 'react'
import { Link } from 'react-router-dom'
import { getRecommendGenres } from '../services/search'
import { getRecommendGenresType } from '../types'
import { useQuery } from '@tanstack/react-query'

const getRandomGenres = (genres: { id: number; name: string }[]) => {
    const myChoiceGenresIndex = [5, 2, 13, 14, 6, 7, 4]
    return myChoiceGenresIndex.map((index) => genres[index])
}

const RecommendGenres: FC<{
    currentTab: string
}> = ({ currentTab }) => {
    const { isLoading, data, isError, error } = useQuery<
        getRecommendGenresType,
        Error
    >(['genres'], getRecommendGenres)

    if (isError) return <div>ERROR: {error.message}</div>

    if (isLoading)
        return (
            <div className='mx-auto mt-36 mb-20 h-10 w-10 animate-spin rounded-full border-[5px] border-dark-lighten border-t-transparent'></div>
        )

    //  as { id: number; name: string }[]
    const randomGenres = getRandomGenres(
        currentTab === 'movie' ? data.movieGenres : data.tvGenres
    )

    return (
        <ul className='mt-28 flex flex-wrap gap-3'>
            {randomGenres.map((genre) => (
                <li key={genre.id} className='mb-2'>
                    <Link
                        to={`/twilight/explore?genre=${String(genre.id)}`}
                        className='rounded-full bg-dark-lighten px-4 py-2 transition duration-300 hover:brightness-75'
                    >
                        {genre.name}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default RecommendGenres

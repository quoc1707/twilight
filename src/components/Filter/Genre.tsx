import { FC } from 'react'
import { getRecommendGenres } from '../../services/search'
import { getRecommendGenresType } from '../../types'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import useCurrentParams from '../../hooks/useCurrentParams'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

const FilterByGenres: FC<{
    currentTab: string
}> = ({ currentTab }) => {
    const [genres] = useAutoAnimate()
    const { isLoading, data, isError, error } = useQuery<
        getRecommendGenresType,
        Error
    >(['genres'], getRecommendGenres)
    const [searchParam, setSearchParam] = useSearchParams()
    const [currentSearchParams] = useCurrentParams()

    if (isError) return <div>ERROR: {error.message}</div>

    if (isLoading)
        return (
            <div className='mx-auto mt-20 mb-20 h-10 w-10 animate-spin rounded-full border-[5px] border-dark-darken border-t-transparent'></div>
        )

    const chooseGenre = (genreId: string) => {
        const existingGenres = searchParam.getAll('genre')

        if (existingGenres.includes(genreId)) {
            const newGenres = existingGenres.filter(
                (genre: string) => genre !== genreId
            )
            setSearchParam({
                ...currentSearchParams,
                genre: newGenres,
            })
        } else {
            setSearchParam({
                ...currentSearchParams,
                genre: [...existingGenres, genreId],
            })
        }
    }

    return (
        <ul
            // @ts-ignore
            ref={genres}
            className='flex flex-wrap gap-3'
        >
            {currentTab === 'movie' &&
                data.movieGenres.map((genre) => (
                    <li key={genre.id}>
                        <button
                            onClick={() => chooseGenre(String(genre.id))}
                            className={`inline-block rounded-full border border-[#989898] px-4 py-1 transition duration-300 hover:brightness-75 ${
                                searchParam
                                    .getAll('genre')
                                    .includes(String(genre.id)) &&
                                'bg-primary text-white'
                            }`}
                        >
                            {genre.name}
                        </button>
                    </li>
                ))}
            {currentTab === 'tv' &&
                data.tvGenres.map((genre) => (
                    <li key={genre.id}>
                        <button
                            onClick={() => chooseGenre(String(genre.id))}
                            className={`inline-block rounded-full border border-[#989898] px-4 py-1 transition duration-300 hover:brightness-75 ${
                                searchParam
                                    .getAll('genre')
                                    .includes(String(genre.id)) &&
                                'bg-primary text-white'
                            }`}
                        >
                            {genre.name}
                        </button>
                    </li>
                ))}
        </ul>
    )
}

export default FilterByGenres

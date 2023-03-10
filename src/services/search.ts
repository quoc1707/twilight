import { Item, ItemsPage, getRecommendGenresType } from '../types'

import axios from '../lib/axios'

export const getSearchKeyword = async (query: string): Promise<string[]> => {
    const { data } = await axios('/search/keyword', {
        method: 'GET',
        params: {
            query,
        },
    })
    return (data.results as { name: string }[])
        .map(({ name }) => name)
        .filter((_, index) => index < 5)
}

export const getRecommendGenres = async (): Promise<getRecommendGenresType> => {
    const movieGenres = await axios.get('/genre/movie/list')
    const tvGenres = await axios.get('/genre/tv/list')

    return {
        movieGenres: movieGenres.data.genres,
        tvGenres: tvGenres.data.genres,
    }
}

export const getSearchResult = async (
    typeSearch: string,
    query: string,
    page: number
): Promise<ItemsPage> => {
    const { data } = await axios(`/search/${typeSearch}`, {
        method: 'GET',
        params: {
            query,
            page,
        },
    })

    const results = (data.results as Item[])
        .map((item) => ({
            ...item,
            ...(typeSearch !== 'multi' && { media_type: typeSearch }),
        }))
        .filter(({ poster_path, profile_path }) => poster_path || profile_path)

    return {
        ...data,
        results,
    }
}

import { HomeFilms, Item } from '../types'

import axios from '../lib/axios'

interface Genres {
    data: {
        genres: string[]
    }
}

export const getHomeMovies = async (): Promise<HomeFilms> => {
    const endpoints: Record<string, string> = {
        Hot: '/trending/movie/day',
        Popular: '/movie/popular',
        Upcoming: '/movie/upcoming',
        'Top Rated': '/movie/top_rated',
    }

    const responses = await Promise.all(
        Object.entries(endpoints).map((endpoint) => axios.get(endpoint[1]))
    )

    const data = responses.reduce((final, current, index) => {
        final[Object.entries(endpoints)[index][0]] = current.data.results.map(
            (item: Item) => ({
                ...item,
                media_type: 'movie',
            })
        )

        return final
    }, {} as HomeFilms)

    return data
}

export const getHomeTVs = async (): Promise<HomeFilms> => {
    const endpoints: Record<string, string> = {
        Trending: '/trending/tv/day',
        Popular: '/tv/popular',
        'Top Rated': '/tv/top_rated',
        Hot: '/trending/tv/day?page=2',
        // 'On the air': '/tv/on_the_air',
    }
    const responses = await Promise.all(
        Object.entries(endpoints).map((endpoint) => axios.get(endpoint[1]))
    )
    const data = responses.reduce((final, current, index) => {
        final[Object.entries(endpoints)[index][0]] = (
            current.data.results as Item[]
        ).map((item) => ({
            ...item,
            media_type: 'tv',
        }))
        return final
    }, {} as HomeFilms)

    return data
}

export const getBannerInfo = async (
    type: 'movie' | 'tv',
    list: Item[]
): Promise<any> => {
    const detailRes = (await Promise.all(
        list.map(({ id }) => axios.get(`/${type}/${id}`))
    )) as Genres[]
    const genres = detailRes.map(({ data }) =>
        data.genres.filter((_, index) => index < 3)
    )

    return genres.map((genre, index) => ({
        genre,
    }))
}

export const getTrendingNow = async (): Promise<Item[]> => {
    const { data } = await axios.get('/trending/all/day?page=2')
    return data.results
}

import { FilmInfo, GetWatchReturnedType, Item, Reviews, Video } from '../types'

import axios from '../lib/axios'

export const getMovieFullDetail = async (id: number): Promise<FilmInfo> => {
    const response = await Promise.all([
        axios.get(`/movie/${id}`),
        axios.get(`/movie/${id}/credits`),
        axios.get(`/movie/${id}/reviews`),
        axios.get(`/movie/${id}/similar`),
        axios.get(`/movie/${id}/videos`),
    ])

    const movieInfo = response.reduce((final, current, index) => {
        switch (index) {
            case 0:
                final.detail = { ...current.data, media_type: 'movie' }
                break

            case 1:
                final.credits = current.data.cast.slice(0, 8)
                break

            case 2:
                final.reviews = (current.data.results as Reviews[]).filter(
                    ({ author }) => author !== 'MSB'
                )
                break

            case 3:
                final.similar = (current.data.results as Item[]).map(
                    (item) => ({
                        ...item,
                        media_type: 'movie',
                    })
                )
                break

            case 4:
                final.videos = (current.data.results as Video[])
                    .filter(({ site }) => site === 'YouTube')
                    .reduce(
                        (acc, current) =>
                            current.type === 'Trailer'
                                ? [current, ...acc]
                                : [...acc, current],
                        [] as Video[]
                    )
                break
        }

        return final
    }, {} as FilmInfo)

    return movieInfo
}

export const getWatchMovie = async (
    id: number
): Promise<GetWatchReturnedType> => {
    const res = await Promise.all([
        axios.get(`/movie/${id}`),
        axios.get(`/movie/${id}/recommendations`),
    ])

    return {
        detail: res[0].data,
        recommendations: (res[1].data.results as Item[]).filter(
            ({ poster_path }) => poster_path
        ),
    }
}

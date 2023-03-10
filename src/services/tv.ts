import {
    DetailSeason,
    FilmInfo,
    GetWatchReturnedType,
    Item,
    Reviews,
    Video,
} from '../types'

import axios from '../lib/axios'

export const getTVFullDetail = async (id: number): Promise<FilmInfo> => {
    const response = await Promise.all([
        axios.get(`/tv/${id}`),
        axios.get(`/tv/${id}/credits`),
        axios.get(`/tv/${id}/reviews`),
        axios.get(`/tv/${id}/similar`),
        axios.get(`/tv/${id}/videos`),
    ])

    const tvInfo = response.reduce((final, current, index) => {
        switch (index) {
            case 0:
                final.detail = { ...current.data, media_type: 'tv' }
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
                        media_type: 'tv',
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

    return tvInfo
}

export const getWatchTV = async (id: number): Promise<GetWatchReturnedType> => {
    const res = await Promise.all([
        axios.get(`/tv/${id}`),
        axios.get(`/tv/${id}/recommendations`),
    ])
    const data = {
        detail: res[0].data,
        recommendations: res[1].data.results,
    }
    const detailSeasonsRes = (await Promise.all(
        (data.detail.seasons as DetailSeason[]).map(({ season_number }) =>
            axios.get(`/tv/${id}/season/${season_number}`)
        )
    )) as { data: any }[]

    const detailSeasons = detailSeasonsRes.map(({ data }) => data)

    return { ...data, detailSeasons }
}

import { ConfigType, Item, ItemsPage } from '../types'

import axios from '../lib/axios'

const getExplore = async (
    type: 'movie' | 'tv',
    page: number,
    config = {} as ConfigType | undefined
): Promise<ItemsPage> => {
    const { data } = await axios(`/discover/${type}`, {
        method: 'GET',
        params: {
            ...config,
            page,
        },
    })

    const adjustedItems = (data.results as Item[])
        .filter(({ poster_path }) => poster_path)
        .map((item) => ({
            ...item,
            media_type: type,
        }))

    return {
        ...data,
        results: adjustedItems,
    }
}

export default getExplore

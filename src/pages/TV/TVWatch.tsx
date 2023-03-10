import { useParams, useSearchParams } from 'react-router-dom'

import Error from '../Error'
import FilmWatch from '../../components/Watcher'
import { GetWatchReturnedType } from '../../types'
import { getWatchTV } from '../../services/tv'
import { useQuery } from '@tanstack/react-query'

const TVWatch = () => {
    const { id } = useParams()
    const { data, error } = useQuery<GetWatchReturnedType, Error>(
        ['watchTV', id],
        () => getWatchTV(Number(id as string))
    )
    const [queryParams] = useSearchParams()
    const seasonId = Number(queryParams.get('season')) || 1
    const episodeId = Number(queryParams.get('episode')) || 1

    if (error) return <Error />

    const currentSeason = data?.detailSeasons?.find(
        (season) => season.season_number === seasonId
    )
    const currentEpisode = currentSeason?.episodes.find(
        (episode) => episode.episode_number === episodeId
    )

    if (!currentEpisode && data) return <Error />

    return (
        <FilmWatch
            {...data}
            media_type='tv'
            seasonId={seasonId}
            episodeId={episodeId}
            currentEpisode={currentEpisode}
        />
    )
}

export default TVWatch

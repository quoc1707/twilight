import Error from '../Error'
import FilmWatch from '../../components/Watcher'
import { GetWatchReturnedType } from '../../types'
import { getWatchMovie } from '../../services/movie'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const MovieWatch = () => {
    const { id } = useParams()
    const { data, error } = useQuery<GetWatchReturnedType, Error>(
        ['watchMovie', id],
        () => getWatchMovie(Number(id as string))
    )

    return error ? <Error /> : <FilmWatch {...data} media_type='movie' />
}

export default MovieWatch

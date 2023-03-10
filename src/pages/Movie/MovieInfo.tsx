import Error from '../Error'
import FilmDetail from '../../components/FilmDetail'
import { FilmInfo } from '../../types'
import { getMovieFullDetail } from '../../services/movie'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const MovieInfo = () => {
    const { id } = useParams()
    const { data, error } = useQuery<FilmInfo, Error>(['movieDetail', id], () =>
        getMovieFullDetail(Number(id as string))
    )

    return error ? <Error /> : <FilmDetail {...data} />
}

export default MovieInfo

import Error from '../Error'
import FilmDetail from '../../components/FilmDetail'
import { FilmInfo } from '../../types'
import { getTVFullDetail } from '../../services/tv'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const TVInfo = () => {
    const { id } = useParams()

    const { data, isError } = useQuery<FilmInfo, Error>(['tvDetail', id], () =>
        getTVFullDetail(Number(id as string))
    )

    if (isError) return <Error />

    return <FilmDetail {...data} />
}

export default TVInfo

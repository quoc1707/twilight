import { AiFillStar } from 'react-icons/ai'
import { FC } from 'react'
import { Item } from '../../types'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { resizeImage } from '../../helpers'

const FilmItem: FC<{
    item: Item
}> = ({ item }) => {
    return (
        <Link
            to={
                item.media_type === 'movie'
                    ? `/twilight/movie/${item.id}`
                    : item.media_type === 'tv'
                    ? `/twilight/tv/${item.id}`
                    : `/`
            }
        >
            <div className='group relative overflow-hidden rounded-md bg-dark-darken pb-2 shadow-sm transition duration-300 hover:scale-105 hover:brightness-110'>
                <LazyLoadImage
                    alt='Poster film'
                    src={resizeImage(
                        item.profile_path || item.poster_path,
                        'w342'
                    )}
                    className='h-60 object-cover'
                    effect='blur'
                />
                <p className='mt-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 text-center text-base text-gray-300 transition duration-300 group-hover:text-white'>
                    {item.title || item.name}
                </p>
                <div className='absolute top-[5%] left-[8%] z-20 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs text-white'>
                    {item.vote_average?.toFixed(1)}
                    <AiFillStar size={15} />
                </div>
            </div>
        </Link>
    )
}

export default FilmItem

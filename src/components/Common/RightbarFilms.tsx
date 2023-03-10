import { Link, useNavigate } from 'react-router-dom'

import { AiFillStar } from 'react-icons/ai'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FC } from 'react'
import { Item } from '../../types'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Skeleton from './Skeleton'
import { resizeImage } from '../../helpers'

interface RightbarFilms {
    films: Item[] | undefined
    name: string
    limitNumber?: number
    isLoading: boolean
    className?: string
}

const RightbarFilms: FC<RightbarFilms> = ({
    films,
    name,
    limitNumber,
    isLoading,
    className = '',
}) => {
    const navigate = useNavigate()

    return (
        <div className={className}>
            <p className='mb-6 flex items-center justify-between text-xl font-medium'>
                <span className='text-white'>{name}</span>
                <BsThreeDotsVertical size={20} />
            </p>
            <ul className='flex flex-col gap-5'>
                {isLoading
                    ? new Array(limitNumber).fill('').map((_, index) => (
                          <li
                              key={index}
                              className='flex h-[156px] items-center gap-5'
                          >
                              <Skeleton className='h-full w-full max-w-[100px] shrink-0 rounded-md' />
                              <Skeleton className='h-[85%] flex-grow rounded-md' />
                          </li>
                      ))
                    : (films as Item[]).slice(0, limitNumber).map((item) => (
                          <li key={item.id}>
                              <Link
                                  to={
                                      item.media_type === 'movie'
                                          ? `/twilight/movie/${item.id}`
                                          : `/twilight/tv/${item.id}`
                                  }
                                  className='transiton flex items-center gap-5 duration-300 hover:brightness-75'
                              >
                                  <div className='w-full max-w-[100px] shrink-0'>
                                      <LazyLoadImage
                                          src={resizeImage(
                                              item.poster_path,
                                              'w154'
                                          )}
                                          className='h-full w-full rounded-md object-cover'
                                          alt='poster'
                                          effect='blur'
                                      />
                                  </div>
                                  <div className='flex-grow'>
                                      <p className='mb-3 text-lg text-white'>
                                          {item.title || item.name}
                                      </p>
                                      <p className='mb-8'>
                                          {item.release_date ||
                                              item.first_air_date}
                                      </p>
                                      <div className='inline-flex items-center gap-2 rounded-full border border-primary px-3 py-[2px] text-sm text-primary'>
                                          <span>
                                              {item.vote_average.toFixed(1)}
                                          </span>
                                          <AiFillStar size={15} />
                                      </div>
                                  </div>
                              </Link>
                          </li>
                      ))}
            </ul>
            <button
                onClick={() => navigate('/explore')}
                className='mt-7 w-full rounded-full bg-dark-lighten py-2 transition duration-300 hover:brightness-75 '
            >
                See more
            </button>
        </div>
    )
}

export default RightbarFilms

import { ConfigType, ItemsPage } from '../../types'

import { FC } from 'react'
import FilmItem from '../Common/FilmItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Skeleton from '../Common/Skeleton'
import getExplore from '../../services/explore'
import { useInfiniteQuery } from '@tanstack/react-query'

const ExploreMovieResult: FC<{
    pages?: ItemsPage[]
}> = ({ pages }) => {
    return (
        <ul className='grid grid-cols-sm gap-x-8 gap-y-10 pt-2 lg:grid-cols-lg'>
            {pages &&
                pages.map((page) =>
                    page.results.map((item) => (
                        <li key={item.id}>
                            <FilmItem item={item} />
                        </li>
                    ))
                )}
            {!pages &&
                [...new Array(15)].map((_, index) => (
                    <li key={index}>
                        <Skeleton className='h-0 pb-[160%]' />
                    </li>
                ))}
        </ul>
    )
}

const ExploreTVResult: FC<{
    pages?: ItemsPage[]
}> = ({ pages }) => {
    return (
        <ul className='grid grid-cols-sm gap-x-8 gap-y-10 lg:grid-cols-lg'>
            {pages
                ? pages.map((page) =>
                      page.results.map((item) => (
                          <li key={item.id}>
                              <FilmItem item={item} />
                          </li>
                      ))
                  )
                : [...new Array(15)].map((_, index) => (
                      <li key={index}>
                          <Skeleton className='h-0 pb-[160%]' />
                      </li>
                  ))}
        </ul>
    )
}

const ExploreResult: FC<{
    currentTab: string
    config: ConfigType
}> = ({ currentTab, config }) => {
    const {
        data: movies,
        error: errorMovies,
        fetchNextPage: fetchNextPageMovie,
        hasNextPage: hasNextPageMovie,
    } = useInfiniteQuery<ItemsPage, Error>(
        ['explore-result-movie', config],
        ({ pageParam = 1 }) => getExplore('movie', pageParam, config),
        {
            getNextPageParam: (lastPage) =>
                lastPage.page + 1 <= lastPage.total_pages
                    ? lastPage.page + 1
                    : undefined,
        }
    )

    const {
        data: tvs,
        error: errorTvs,
        fetchNextPage: fetchNextPageTv,
        hasNextPage: hasNextPageTv,
    } = useInfiniteQuery<ItemsPage, Error>(
        ['explore-result-tv', config],
        ({ pageParam = 1, queryKey }) =>
            getExplore(
                'tv',
                pageParam,
                queryKey[1] as { [key: string]: string }
            ),
        {
            getNextPageParam: (lastPage) =>
                lastPage.page + 1 <= lastPage.total_pages
                    ? lastPage.page + 1
                    : undefined,
        }
    )

    if (errorMovies) return <div>ERROR: {errorMovies.message}</div>

    if (errorTvs) return <div>ERROR: {errorTvs.message}</div>

    return (
        <>
            {currentTab === 'movie' && (
                <>
                    {movies?.pages.reduce(
                        (acc, current) => [...acc, ...current.results],
                        [] as any
                    ).length === 0 ? (
                        <div className='mb-12 flex flex-col items-center'>
                            <LazyLoadImage
                                src='/images/error.png'
                                alt=''
                                effect='opacity'
                                className='w-[600px]'
                            />
                            <p className='mt-5 text-3xl text-white'>
                                There is no such films
                            </p>
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={movies?.pages.length || 0}
                            next={() => fetchNextPageMovie()}
                            hasMore={Boolean(hasNextPageMovie)}
                            loader={<div>Loading...</div>}
                            endMessage={<></>}
                        >
                            <ExploreMovieResult pages={movies?.pages} />
                        </InfiniteScroll>
                    )}
                </>
            )}

            {currentTab === 'tv' && (
                <>
                    {tvs?.pages.reduce(
                        (acc, current) => [...acc, ...current.results],
                        [] as any
                    ).length === 0 ? (
                        <div className='mb-12 flex flex-col items-center'>
                            <LazyLoadImage
                                src='/images/error.png'
                                alt=''
                                effect='opacity'
                                className='w-[600px]'
                            />
                            <p className='mt-5 text-3xl text-white'>
                                There is no such films
                            </p>
                        </div>
                    ) : (
                        <InfiniteScroll
                            dataLength={tvs?.pages.length || 0}
                            next={() => fetchNextPageTv()}
                            hasMore={Boolean(hasNextPageTv)}
                            loader={<div>Loading...</div>}
                            endMessage={<></>}
                        >
                            <ExploreTVResult pages={tvs?.pages} />
                        </InfiniteScroll>
                    )}
                </>
            )}
        </>
    )
}

export default ExploreResult

import { FC } from 'react'
import FilmItem from '../Common/FilmItem'
import { ItemsPage } from '../../types'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Pagination from './Pagination'
import Skeleton from '../Common/Skeleton'
import { getSearchResult } from '../../services/search'
import { useQuery } from '@tanstack/react-query'

interface SearchResult {
    currentTab: string
    query: string
    page: number
}

const SearchResult: FC<SearchResult> = ({ currentTab, query, page }) => {
    const { data, error, isPreviousData } = useQuery<ItemsPage, Error>(
        ['search-result', currentTab, query, page],
        () => getSearchResult(currentTab, query, page),
        {
            keepPreviousData: true,
        }
    )

    if (error) return <div>ERROR: ${error.message}</div>

    const changePageHandler = (page: number): string => {
        if (isPreviousData) return ''
        return `/search?query=${encodeURIComponent(query)}&page=${page}`
    }

    return (
        <div className='mt-7 px-[2vw] md:mt-32'>
            <p className='mb-6 text-lg text-white md:text-xl'>
                Search results for "{query}" ({data?.total_results} results
                found)
            </p>
            {data && data.results.length === 0 && (
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
            )}
            <ul className='grid grid-cols-sm gap-x-8 gap-y-10 md:grid-cols-lg'>
                {data
                    ? data.results.map((item) => (
                          <li key={item.id}>
                              <FilmItem item={item} />
                          </li>
                      ))
                    : [...new Array(15)].map((_, index) => (
                          <li key={index}>
                              <Skeleton className='h-0 pb-[160%]' />
                          </li>
                      ))}
            </ul>
            {data && (
                <Pagination
                    maxPage={data.total_pages}
                    currentPage={data.page}
                    onChangePage={changePageHandler}
                />
            )}
        </div>
    )
}

export default SearchResult

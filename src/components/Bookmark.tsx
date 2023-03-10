import { FC } from 'react'
import FilmItem from './Common/FilmItem'
import { HiCheck } from 'react-icons/hi'
import { Item } from '../types'
import { LazyLoadImage } from 'react-lazy-load-image-component'

interface BookmarkResult {
    films: Item[]
    isEditing: boolean
    selections: number[]
    setSelections: any
    isLoading: boolean
    pageType: string
}

const BookmarkResult: FC<BookmarkResult> = ({
    films,
    isEditing,
    selections,
    setSelections,
    isLoading,
    pageType,
}) => {
    return (
        <>
            {films.length === 0 && !isLoading && (
                <div className='col-span-full mt-10 text-center text-2xl text-white'>
                    <div className='flex justify-center '>
                        <LazyLoadImage
                            src='/images/error.png'
                            alt=''
                            className='w-[600px] object-cover'
                        />
                    </div>
                    <p className='mt-5'>
                        {pageType === 'bookmark'
                            ? "Your bookmark list for this type is empty. Let's bookmark some!"
                            : "Your recently watched films for this type is empty. Let's watch some! "}
                    </p>
                </div>
            )}
            {films.length > 0 &&
                films.map((item) => (
                    <li key={item.id} className='relative'>
                        <FilmItem item={item} />
                        {isEditing && (
                            <button
                                onClick={() =>
                                    setSelections((prev: number[]) =>
                                        prev.includes(item.id)
                                            ? prev.filter(
                                                  (id: number) => id !== item.id
                                              )
                                            : prev.concat(item.id)
                                    )
                                }
                                className='tw-absolute-center-horizontal tw-flex-center mt-2 h-6 w-6 border-[3px] border-primary'
                            >
                                <HiCheck
                                    size={20}
                                    className={`${
                                        selections.includes(item.id)
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    } text-white transition duration-300`}
                                />
                            </button>
                        )}
                    </li>
                ))}
        </>
    )
}

export default BookmarkResult

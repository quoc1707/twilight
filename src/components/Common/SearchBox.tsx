import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { BiSearch } from 'react-icons/bi'
import { getSearchKeyword } from '../../services/search'

let isInitial = true

const SearchBox: FC<{
    autoFocus?: boolean
}> = ({ autoFocus = false }) => {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const [searchInput, setSearchInput] = useState(
        searchParams.get('query') || ''
    )
    const timeoutRef = useRef<any>(null)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        setSuggestions([])

        if (!searchInput.trim()) return

        timeoutRef.current = setTimeout(async () => {
            const keywords = await getSearchKeyword(searchInput.trim())

            setSuggestions(keywords)

            if (isInitial) {
                isInitial = false
                setSuggestions([])
            }
        }, 300)

        return () => clearTimeout(timeoutRef.current)
    }, [searchInput])

    const searchSubmitHandler = (e: FormEvent) => {
        e.preventDefault()

        if (!searchInput.trim()) return

        navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`)
        clearTimeout(timeoutRef.current)
        setSuggestions([])
    }

    useEffect(() => {
        setSuggestions([])
        clearTimeout(timeoutRef.current)
    }, [location.search])

    return (
        <div
            className={`group absolute left-6 right-6 top-7 z-30 rounded-full bg-dark-lighten shadow-md ${
                suggestions.length > 0 && '!rounded-3xl'
            }`}
        >
            <form className='relative' onSubmit={searchSubmitHandler}>
                <button className='absolute top-1/2 left-5 -translate-y-1/2'>
                    <BiSearch
                        className='transition duration-300 hover:text-white'
                        size={25}
                    />
                </button>
                <input
                    className='w-full bg-transparent py-3 pl-14 pr-7 text-white placeholder-gray-500 outline-none'
                    type='text'
                    placeholder='Search...'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    autoFocus={autoFocus}
                />
            </form>

            {suggestions.length > 0 && (
                <ul className='relative hidden flex-col gap-3 py-3 after:absolute after:top-0 after:left-[5%] after:right-[5%]  after:h-[2px] after:bg-gray-darken group-focus-within:flex'>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className='outline-none focus:bg-red-500'
                            tabIndex={index - 1}
                        >
                            <button
                                onClick={() => {
                                    navigate(
                                        `/search?query=${encodeURIComponent(
                                            suggestion
                                        )}`
                                    )
                                    setSuggestions([])
                                }}
                                className='ml-5 flex items-center gap-3 transition duration-300 hover:text-white'
                            >
                                <BiSearch size={25} />
                                <span>{suggestion}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchBox

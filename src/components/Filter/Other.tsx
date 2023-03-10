import Select from 'react-select'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import useCurrentParams from '../../hooks/useCurrentParams'
import { useSearchParams } from 'react-router-dom'

const FilterByOthers = () => {
    const [parent] = useAutoAnimate()
    const [searchParams, setSearchParams] = useSearchParams()

    const options = [
        { value: 'popularity.desc', label: 'Most popular' },
        { value: 'vote_average.desc', label: 'Most rating' },
        { value: 'release_date.desc', label: 'Most recent' },
    ]

    const customStyles = {
        control: (styles: any) => ({
            ...styles,
            backgroundColor: '#49494b',
            boxShadow: 'none',
            border: 0,
        }),
        option: (styles: any, { isSelected }: any) => ({
            ...styles,
            backgroundColor: isSelected ? '#989898' : '#49494b',
        }),
        singleValue: (provided: any) => {
            return { ...provided, color: 'white' }
        },
        menu: (styles: any) => ({
            ...styles,
            backgroundColor: '#49494b',
        }),
    }

    const [currentSearchParams] = useCurrentParams()

    const chooseSort = (option: any) => {
        const sortValue = option?.value || ''
        setSearchParams({
            ...currentSearchParams,
            sort_by: sortValue,
        })
    }

    const sortType = searchParams.get('sort_by') || 'popularity.desc'

    return (
        <div
            // @ts-ignore
            ref={parent}
            className='flex flex-wrap gap-3'
        >
            <Select
                options={options}
                styles={customStyles}
                defaultValue={options[0]}
                value={options.find((option) => option.value === sortType)}
                onChange={chooseSort}
            />
        </div>
    )
}

export default FilterByOthers

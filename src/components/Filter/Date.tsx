import { ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import useCurrentParams from '../../hooks/useCurrentParams'

const FilterByDate = () => {
    const [currentSearchParams] = useCurrentParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const handleFilterDate = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'from') {
            setSearchParams({
                ...currentSearchParams,
                from: e.target.value,
            })
        } else {
            setSearchParams({
                ...currentSearchParams,
                to: e.target.value,
            })
        }
    }

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
                <label htmlFor='from'>From</label>
                <input
                    type='date'
                    id='from'
                    name='from'
                    className='rounded-md bg-dark-lighten-2 px-3 py-1 outline-none'
                    onChange={handleFilterDate}
                    value={searchParams.get('from') || '2002-11-04'}
                />
            </div>
            <div className='flex items-center justify-between'>
                <label htmlFor='from'>To</label>
                <input
                    type='date'
                    id='to'
                    name='to'
                    className='rounded-md bg-dark-lighten-2 px-3 py-1 outline-none'
                    onChange={handleFilterDate}
                    value={searchParams.get('to') || '2022-07-28'}
                />
            </div>
        </div>
    )
}

export default FilterByDate

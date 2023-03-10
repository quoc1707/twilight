import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import useCurrentParams from '../../hooks/useCurrentParams'

const MAX_RUNTIME = 240
const GAP = 20

const FilterByRating = () => {
    const sliderRangeRef = useRef<HTMLDivElement>(null!)
    const location = useLocation()

    const [minRuntime, setMinRuntime] = useState(0)
    const [maxRuntime, setMaxRuntime] = useState(MAX_RUNTIME)

    const timeoutRef = useRef<any>(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentSearchParams] = useCurrentParams()

    useEffect(() => {
        updateMinRangeBar(Number(searchParams.get('minRuntime')) ?? 0)
        updateMaxRangeBar(Number(searchParams.get('maxRuntime')) || MAX_RUNTIME)
    }, [location.search, searchParams])

    const updateMinRangeBar = (value: number) => {
        setMinRuntime(value)
        const leftOffet = (value / MAX_RUNTIME) * 100
        sliderRangeRef.current.style.left = leftOffet + '%'
    }

    const updateMaxRangeBar = (value: number) => {
        setMaxRuntime(value)
        const rightOffet = 100 - (value / MAX_RUNTIME) * 100
        sliderRangeRef.current.style.right = rightOffet + '%'
    }

    const handleDragSliderRange = (e: ChangeEvent<HTMLInputElement>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        if (e.target.name === 'min-range') {
            updateMinRangeBar(
                maxRuntime - Number(e.target.value) < GAP
                    ? maxRuntime - GAP
                    : Number(e.target.value)
            )

            timeoutRef.current = setTimeout(() => {
                setSearchParams({
                    ...currentSearchParams,
                    minRuntime: e.target.value,
                })
            }, 500)
        } else {
            updateMaxRangeBar(
                Number(e.target.value) - minRuntime < GAP
                    ? minRuntime + GAP
                    : Number(e.target.value)
            )

            timeoutRef.current = setTimeout(() => {
                setSearchParams({
                    ...currentSearchParams,
                    maxRuntime: e.target.value,
                })
            }, 500)
        }
    }

    return (
        <div>
            <div className='mb-3 flex justify-between'>
                <div className='flex items-center gap-2'>
                    <span>From</span>
                    <p className='flex items-center gap-1'>
                        <span className='text-lg font-medium text-white/60'>
                            {minRuntime}
                        </span>
                        <span className='text-sm'>min</span>
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <span>To</span>
                    <p className='flex items-center gap-1'>
                        <span className='text-lg font-medium text-white/60'>
                            {maxRuntime}
                        </span>
                        <span className='text-sm'>min</span>
                    </p>
                </div>
            </div>
            <div className='relative h-[5px] rounded-md bg-dark-darken'>
                <div
                    ref={sliderRangeRef}
                    className='absolute top-0 h-[5px] rounded-md bg-primary'
                ></div>
            </div>
            <div className='relative'>
                <input
                    className='tw-slider-range pointer-events-none absolute -top-[5px] left-0 h-[5px] w-full appearance-none [background:none]'
                    type='range'
                    min='0'
                    max={MAX_RUNTIME}
                    step='10'
                    name='min-range'
                    value={minRuntime}
                    onChange={handleDragSliderRange}
                />
                <input
                    className='tw-slider-range pointer-events-none absolute -top-[5px] left-0 h-[5px] w-full appearance-none [background:none]'
                    type='range'
                    min='0'
                    max={MAX_RUNTIME}
                    step='10'
                    name='max-range'
                    value={maxRuntime}
                    onChange={handleDragSliderRange}
                />
            </div>
        </div>
    )
}

export default FilterByRating

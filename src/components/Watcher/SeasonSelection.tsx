import { DetailSeason } from '../../types'
import { FC } from 'react'
import Season from './Season'
import Skeleton from '../Common/Skeleton'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface SeasonSelection {
    detailSeasons?: DetailSeason[]
    seasonId?: number
    episodeId?: number
}

const SeasonSelection: FC<SeasonSelection> = ({
    detailSeasons,
    seasonId,
    episodeId,
}) => {
    const [parent] = useAutoAnimate()

    return (
        <ul
            // @ts-ignore
            ref={parent}
            className='flex max-h-[750px] flex-col gap-4 overflow-y-auto'
        >
            {detailSeasons ? (
                (detailSeasons as DetailSeason[]).map((season) => (
                    <Season
                        key={season.id}
                        season={season}
                        seasonId={seasonId}
                        episodeId={episodeId}
                    />
                ))
            ) : (
                <div>
                    <Skeleton className='mb-6 h-[118px]' />
                    <ul className='flex flex-col gap-4 pl-10'>
                        {new Array(6).fill('').map((_, index) => (
                            <li key={index}>
                                <Skeleton className='h-[81px]' />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </ul>
    )
}

export default SeasonSelection

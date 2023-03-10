import { FC, useState } from 'react'

import { DetailSeason } from '../../types'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { resizeImage } from '../../helpers'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface Season {
    season: DetailSeason
    seasonId?: number
    episodeId?: number
}

const Season: FC<Season> = ({ season, seasonId, episodeId }) => {
    const [seasonExpanded, setSeasonExpanded] = useState<number | undefined>(
        seasonId
    )
    const [list] = useAutoAnimate()
    return (
        <li
            // @ts-ignore
            ref={list}
            // key={season.id}:  key is now set for custom component named Season
        >
            <button
                onClick={() =>
                    setSeasonExpanded(
                        seasonExpanded !== season.season_number
                            ? season.season_number
                            : undefined
                    )
                }
                className='transiton inline-flex w-full items-center gap-7 rounded-md px-2 pt-2 pb-1 duration-300 hover:bg-dark-lighten'
            >
                <div className='w-full max-w-[100px] shrink-0'>
                    <LazyLoadImage
                        src={resizeImage(season.poster_path, 'w154')}
                        effect='opacity'
                        alt=''
                        className='h-[100px] w-[100px] rounded-md object-cover '
                    />
                </div>
                <div className='flex-grow text-left'>
                    <p
                        className={`mb-2 text-lg text-white transition duration-300 ${
                            season.season_number === seasonId && '!text-primary'
                        }`}
                    >
                        {season.name}
                    </p>
                    <p
                        className={` transition duration-300 ${
                            season.season_number === seasonId && 'text-white'
                        }`}
                    >
                        Episode: {season.episodes.length}
                    </p>
                </div>
            </button>

            {seasonExpanded === season.season_number && (
                <ul className='mt-2 flex flex-col gap-4 pl-6'>
                    {season.episodes.map((episode) => (
                        <li key={episode.id}>
                            <Link
                                to={{
                                    pathname: '',
                                    search: `?season=${season.season_number}&episode=${episode.episode_number}`,
                                }}
                                className='transiton flex items-center gap-3 rounded-md pl-2 duration-300 hover:bg-dark-lighten'
                            >
                                <div className='w-full max-w-[15px] shrink-0'>
                                    <p
                                        className={`font-medium text-white transition duration-300 ${
                                            episode.episode_number ===
                                                episodeId &&
                                            season.season_number === seasonId &&
                                            '!text-primary'
                                        }`}
                                    >
                                        {episode.episode_number}
                                    </p>
                                </div>
                                <div className='w-full max-w-[120px] shrink-0 pt-2'>
                                    <LazyLoadImage
                                        src={resizeImage(
                                            episode.still_path,
                                            'w185'
                                        )}
                                        alt=''
                                        effect='opacity'
                                        className='w-[120px] rounded-md object-cover'
                                    />
                                </div>
                                <div className='flex-grow'>
                                    <p
                                        className={`text-sm transition duration-300 ${
                                            episode.episode_number ===
                                                episodeId &&
                                            season.season_number === seasonId &&
                                            'text-white'
                                        }`}
                                    >
                                        {episode.name}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    )
}

export default Season

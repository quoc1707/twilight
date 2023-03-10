import { EMBED_TO, IMAGE_URL } from './constants'

export const resizeImage = (
    imageUrl: string,
    width: string = 'original'
): string => `${IMAGE_URL}/${width}${imageUrl}`

export const embedMovie = (id: number): string => `${EMBED_TO}/movie?id=${id}`

export const embedTV = (id: number, season: number, episode: number): string =>
    `${EMBED_TO}/tv?id=${id}&s=${season}&e=${episode}`

export const calculateTimePassed = (time: number): string => {
    const unit = {
        year: 12 * 30 * 7 * 24 * 60 * 60 * 1000,
        month: 30 * 7 * 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
    }
    const diff = Date.now() - time

    for (const key in unit) {
        if (diff > unit[key as keyof typeof unit]) {
            const timePassed = Math.floor(diff / unit[key as keyof typeof unit])
            return `${timePassed} ${key}${timePassed > 1 ? 's' : ''}`
        }
    }

    return 'Just now'
}

export const getErrorMessage = (code: string) => {
    const dictionary: Record<string, string> = {
        'auth/email-already-in-use': 'Your email is already in use.',
        'auth/user-not-found': 'Your email may be incorrect.',
        'auth/wrong-password': 'Your password is incorrect.',
        'auth/invalid-email': 'Your email is invalid',
        'auth/too-many-requests': 'You request too many times!',
    }
    return dictionary[code] || 'Something weird happened.'
}

export const getRandomAvatar = (): string => {
    const avatar = `https://avatars.dicebear.com/api/bottts/${Date.now()}.svg`
    return avatar
}

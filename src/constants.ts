import { object, string } from 'yup'

export const BASE_URL = 'https://api.themoviedb.org/3'
export const IMAGE_URL = 'https://image.tmdb.org/t/p'
export const EMBED_TO = 'https://www.2embed.to/embed/tmdb'
export const SUPPORTED_QUERY = {
    genre: [],
    sort_by: [],
    minRuntime: [],
    maxRuntime: [],
    from: [],
    to: [],
}

export const validateSignUpSchema = object({
    firstName: string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    lastName: string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    email: string().email('Invalid email address').required('Required'),
    password: string()
        .required('No password provided.')
        .min(6, 'Password is too short - should be 6 chars minimum.'),
})

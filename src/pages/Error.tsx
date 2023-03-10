import { Link } from 'react-router-dom'

const Error = () => {
    return (
        <div className='tw-flex-center min-h-screen bg-dark md:bg-black/60'>
            <div>
                <p className='text-[150px] font-semibold leading-none text-white'>
                    404
                </p>
                <p className='mt-6 text-center text-2xl text-white'>
                    There is nothing here
                </p>
                <div className='flex justify-center'>
                    <Link
                        to='/twilight/'
                        className='mt-8 inline-block rounded-md bg-primary px-8 py-2 text-xl text-white transition duration-300 hover:bg-blue-600'
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Error

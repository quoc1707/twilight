import { FC, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface Notification {
    type: string
    message: string
    setError?: any
}

const Notification: FC<Notification> = ({ type, message, setError }) => {
    const [timeLeft, setTimeLeft] = useState(type === 'success' ? 2 : 5)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isCloseModalAutomatically = timeLeft === 0

    useEffect(() => {
        if (isCloseModalAutomatically) {
            type === 'success'
                ? navigate(`${searchParams.get('redirect') || '/'}`)
                : setError('')
        }
    }, [isCloseModalAutomatically])

    useEffect(() => {
        const timeout = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
        return () => clearInterval(timeout)
    }, [])

    return (
        <>
            <div
                style={{
                    backgroundImage: `${
                        type === 'success'
                            ? "url('/images/success.png')"
                            : "url('/images/fail.png')"
                    } `,
                }}
                className='tw-absolute-center fixed z-30 min-h-[450px] w-full max-w-[350px] rounded-xl bg-cover bg-center bg-no-repeat'
            >
                <div className='mt-[230px] text-center text-[40px] font-bold text-black'>
                    {type === 'success' ? 'Woo hoo!' : 'Oh no.'}
                </div>
                <p className='mt-1 text-center text-xl font-medium text-gray-600'>
                    {message}
                    <br></br>
                    {type === 'error' && <span>Keep calm and try again.</span>}
                    {type === 'success' && (
                        <span>Let's "Twilight and chill".</span>
                    )}
                </p>
                <button
                    onClick={() => {
                        if (type === 'success') {
                            navigate(`${searchParams.get('redirect') || '/'}`)
                        } else {
                            setError('')
                        }
                    }}
                    className={`${
                        type === 'success'
                            ? 'bg-primary shadow-primary hover:bg-blue-600'
                            : 'bg-red-500 shadow-red-500 hover:bg-red-600'
                    } absolute left-1/2 mt-5 flex -translate-x-1/2 items-center gap-2 rounded-md px-4  py-2 text-white shadow-md transition duration-300`}
                >
                    <p>{type === 'success' ? 'CONTINUE' : 'TRY AGAIN'} </p>
                    <p>({timeLeft})</p>
                </button>
            </div>
            <div
                onClick={() => setError('')}
                className='fixed top-0 left-0 z-20 h-full w-full bg-black/60'
            ></div>
        </>
    )
}

export default Notification

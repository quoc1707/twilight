import { FC, FormEvent, useRef, useState } from 'react'

import { AiOutlineMail } from 'react-icons/ai'
import Notification from './Notification'
import { RiLockPasswordLine } from 'react-icons/ri'
import ThirdPartyProvider from './ThirdPartyProvider'
import { auth } from '../../lib/firebase'
import { getErrorMessage } from '../../helpers'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAppSelector } from '../../store/hooks'

const SignIn: FC<{
    setIsSignIn: any
    isSignIn: boolean
}> = ({ setIsSignIn, isSignIn }) => {
    const emailRef = useRef<HTMLInputElement>(null!)
    const passwordRef = useRef<HTMLInputElement>(null!)
    const currentUser = useAppSelector((state) => state.auth.user)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const signInHandler = (e: FormEvent) => {
        e.preventDefault()

        const email = emailRef.current.value
        const password = passwordRef.current.value

        if (!email.trim() || !password.trim()) return

        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                setError(getErrorMessage(error.code))
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            {currentUser && (
                <Notification type='success' message={'Sign in successfully'} />
            )}
            {isLoading && (
                <div className='tw-flex-center relative z-10 h-screen'>
                    <div className='h-28 w-28 animate-spin rounded-full border-[10px] border-primary border-t-transparent '></div>
                </div>
            )}
            {error && (
                <Notification
                    type='error'
                    message={error}
                    setError={setError}
                />
            )}
            <div className='absolute top-1/2 left-1/2 min-h-[500px] w-full max-w-xl -translate-y-1/2 -translate-x-1/2 rounded-xl px-4 py-2 text-white/70'>
                <div className='mb-5 flex flex-col items-center'>
                    <div className='mx-auto mb-1 text-[50px] font-semibold'>
                        <div className='mb-4 text-center leading-none text-primary'>
                            Sign In
                        </div>
                    </div>
                    <ThirdPartyProvider />
                    <p className='text-lg'>or use your email account: </p>
                </div>
                <form onSubmit={signInHandler}>
                    <div className='relative mb-6'>
                        <input
                            ref={emailRef}
                            name='email'
                            type='email'
                            placeholder='Email'
                            className='peer w-full rounded-xl px-5 py-4 pr-12 text-black outline-none'
                            autoComplete='off'
                        />
                        <label
                            htmlFor='email'
                            className={`pointer-events-none visible absolute left-5 translate-y-[-50%] text-gray-400 
        transition duration-500 ease-in-out peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] peer-placeholder-shown:opacity-0
        `}
                        >
                            Email
                        </label>
                        <AiOutlineMail
                            size={25}
                            className='absolute top-1/2 right-4 -translate-y-1/2'
                        />
                    </div>
                    <div className='relative mb-12'>
                        <input
                            ref={passwordRef}
                            name='password'
                            type='password'
                            placeholder='Password'
                            className='peer w-full rounded-xl px-5 py-4 pr-12 text-black outline-none'
                            autoComplete='off'
                        />
                        <label
                            htmlFor='password'
                            className={`pointer-events-none visible absolute left-5 translate-y-[-50%] text-gray-400 
        transition duration-500 ease-in-out peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] peer-placeholder-shown:opacity-0
        `}
                        >
                            Password
                        </label>
                        <RiLockPasswordLine
                            size={25}
                            className='absolute top-1/2 right-4 -translate-y-1/2'
                        />
                    </div>
                    <button className='absolute left-1/2 -translate-x-1/2 rounded-full bg-primary px-12 py-3 text-lg uppercase text-white transition duration-300 hover:bg-[#4161cc]'>
                        Sign In
                    </button>
                </form>

                <p className='mt-32 flex justify-center gap-2 text-xl'>
                    <span>Not a member?</span>
                    <button
                        type='submit'
                        onClick={() => setIsSignIn(!isSignIn)}
                        className='text-primary/90 underline'
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </>
    )
}

export default SignIn

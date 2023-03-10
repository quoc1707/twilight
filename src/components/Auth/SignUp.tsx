import { ErrorMessage, Field, Form, Formik } from 'formik'
import { FC, useState } from 'react'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { getErrorMessage, getRandomAvatar } from '../../helpers'

import { AiOutlineMail } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import Notification from './Notification'
import { RiLockPasswordLine } from 'react-icons/ri'
import ThirdPartyProvider from './ThirdPartyProvider'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useAppSelector } from '../../store/hooks'
import { validateSignUpSchema } from '../../constants'

const SignUp: FC<{
    setIsSignIn: any
    isSignIn: boolean
}> = ({ setIsSignIn, isSignIn }) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const signUpHandler = async (values: { [key: string]: string }) => {
        try {
            setIsLoading(true)
            const user = (
                await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                )
            ).user

            setDoc(doc(db, 'users', user.uid), {
                firstName: values.firstName,
                lastName: values.lastName,
                photoUrl: getRandomAvatar(),
                bookmarks: [],
                recentlyWatch: [],
            })
        } catch (error: any) {
            setError(getErrorMessage(error.code))
        }

        setIsLoading(false)
    }

    return (
        <>
            {currentUser && (
                <Notification type='success' message={'Sign up successfully'} />
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
                    <div className='mx-auto mb-1 text-center text-[50px] font-semibold md:text-left'>
                        <div className='mb-2 text-xl font-medium uppercase tracking-wider'>
                            Start for free
                        </div>
                        <div className='mb-4 leading-none text-primary '>
                            Create Account
                        </div>
                    </div>
                    <ThirdPartyProvider />
                    <p className='text-lg'>or use your email account: </p>
                </div>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                    }}
                    validationSchema={validateSignUpSchema}
                    onSubmit={signUpHandler}
                >
                    <Form>
                        <div className='mb-6 flex gap-8 md:justify-between md:gap-0'>
                            <div className='relative'>
                                <Field
                                    name='firstName'
                                    type='text'
                                    placeholder='First name'
                                    className='peer w-full rounded-xl px-5 py-4 pr-12 text-black outline-none'
                                />
                                <label
                                    htmlFor='firstName'
                                    className='pointer-events-none visible absolute left-5 translate-y-[-50%] text-gray-400 
                transition duration-500 ease-in-out peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] peer-placeholder-shown:opacity-0'
                                >
                                    First name
                                </label>
                                <CgProfile
                                    size={25}
                                    className='absolute top-1/2 right-4 -translate-y-1/2'
                                />
                                <p className='absolute top-[95%] left-[3%] text-red-600'>
                                    <ErrorMessage name='firstName' />
                                </p>
                            </div>

                            <div className='relative'>
                                <Field
                                    name='lastName'
                                    type='text'
                                    placeholder='Last name'
                                    className='peer w-full rounded-xl px-5 py-4 pr-12 text-black outline-none'
                                />
                                <label
                                    htmlFor='lastName'
                                    className='pointer-events-none visible absolute left-5 translate-y-[-50%] text-gray-400 
                transition duration-500 ease-in-out peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] peer-placeholder-shown:opacity-0'
                                >
                                    Last name
                                </label>
                                <CgProfile
                                    size={25}
                                    className='absolute top-1/2 right-4 -translate-y-1/2'
                                />
                                <p className='absolute top-[95%] left-[3%] text-red-600'>
                                    <ErrorMessage name='lastName' />
                                </p>
                            </div>
                        </div>
                        <div className='relative mb-6'>
                            <Field
                                name='email'
                                type='email'
                                placeholder='Email'
                                className='peer w-full rounded-xl px-5 py-4 pr-12 text-black outline-none'
                            />
                            <label
                                htmlFor='email'
                                className='pointer-events-none visible absolute left-5 translate-y-[-50%] text-gray-400 
                transition duration-500 ease-in-out peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] peer-placeholder-shown:opacity-0'
                            >
                                Email
                            </label>
                            <AiOutlineMail
                                size={25}
                                className='absolute top-1/2 right-4 -translate-y-1/2'
                            />
                            <p className='absolute top-[95%] left-[3%] text-red-600'>
                                <ErrorMessage name='email' />
                            </p>
                        </div>
                        <div className='relative mb-12'>
                            <Field
                                name='password'
                                type='password'
                                placeholder='Password'
                                className='peer w-full rounded-xl px-5 py-4 pr-12 text-black outline-none'
                            />
                            <label
                                htmlFor='password'
                                className='pointer-events-none visible absolute left-5 translate-y-[-50%] text-gray-400 
                transition duration-500 ease-in-out peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] peer-placeholder-shown:opacity-0
                '
                            >
                                Password
                            </label>
                            <RiLockPasswordLine
                                size={25}
                                className='absolute top-1/2 right-4 -translate-y-1/2'
                            />
                            <p className='absolute top-[95%] left-[3%] text-red-600'>
                                <ErrorMessage name='password' />
                            </p>
                        </div>
                        <button
                            type='submit'
                            className='absolute left-1/2 -translate-x-1/2 rounded-full bg-primary px-12 py-3 text-lg uppercase text-white transition duration-300 hover:bg-[#4161cc]'
                        >
                            Register
                        </button>
                    </Form>
                </Formik>
                <p className='mt-32 flex justify-center gap-2 text-xl'>
                    <span>Already a member?</span>
                    <button
                        type='submit'
                        onClick={() => setIsSignIn(!isSignIn)}
                        className='text-primary/90 underline'
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </>
    )
}

export default SignUp

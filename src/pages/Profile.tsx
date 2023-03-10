import {
    EmailAuthProvider,
    deleteUser,
    reauthenticateWithCredential,
    updateEmail,
    updatePassword,
} from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify'
import { useRef, useState } from 'react'

import DeleteAccount from '../components/Profile/DeleteAcount'
import Email from '../components/Profile/Email'
import EmailVerification from '../components/Profile/EmailVerification'
import { GiHamburgerMenu } from 'react-icons/gi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import Name from '../components/Profile/Name'
import Password from '../components/Profile/Password'
import ProfileImage from '../components/Profile/ProfileImage'
import Sidebar from '../components/Common/Sidebar'
import SidebarMini from '../components/Common/SidebarMini'
import Title from '../components/Common/Title'
import { auth } from '../lib/firebase'
import { getErrorMessage } from '../helpers'
import useCurrentViewport from '../hooks/useCurrentViewport'

const Profile = () => {
    const [isSidebarActive, setIsSidebarActive] = useState(false)
    const { isSmallScreen } = useCurrentViewport()
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
    const emailValueRef = useRef<HTMLInputElement>(null!)

    const [isUpdatedPassword, setIsUpdatedPassword] = useState(false)
    const oldPasswordValueRef = useRef<HTMLInputElement>(null!)
    const newPasswordValueRef = useRef<HTMLInputElement>(null!)

    const [isUpdating, setIsUpdating] = useState(false)
    const [isShowPromptReAuthFor, setIsShowPromptReAuthFor] = useState<
        string | undefined
    >()
    const firebaseUser = auth.currentUser

    const reAuthentication = async (type: string) => {
        const oldPassword = oldPasswordValueRef.current.value

        if (!oldPassword.trim().length) {
            toast.dark('You gotta type something', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return
        }

        const credential = EmailAuthProvider.credential(
            // @ts-ignore
            firebaseUser.email,
            oldPassword
        )

        reauthenticateWithCredential(
            // @ts-ignore
            firebaseUser,
            credential
        )
            .then(() => {
                if (type === 'password') {
                    changePassword()
                } else if (type === 'email') {
                    changeEmail()
                } else if (type === 'delete') {
                    deleteAccount()
                }

                setIsShowPromptReAuthFor(undefined)
            })
            .catch((error) => {
                console.log(error)
                // alert(getErrorMessage(error.code));
                toast.dark(getErrorMessage(error.code))
            })
    }

    const changeEmail = () => {
        const emailValue = emailValueRef.current.value

        if (!emailValue.trim().length) {
            toast.dark('You gotta type something', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return
        }
        setIsUpdating(true)
        // @ts-ignore
        updateEmail(firebaseUser, emailValue)
            .then(() => {
                setIsUpdatingEmail(false)
                window.location.reload()
            })
            .catch((error) => toast.dark(getErrorMessage(error.code)))
            .finally(() => setIsUpdating(false))
    }

    const changePassword = () => {
        const newPassword = newPasswordValueRef.current.value
        if (!newPassword.trim().length) {
            toast.dark('You gotta type something')
            return
        }
        setIsUpdating(true)
        // @ts-ignore
        updatePassword(firebaseUser, newPassword)
            .then(() => {
                setIsUpdatedPassword(true)
                newPasswordValueRef.current.value = ''
            })
            .catch((error) => {
                console.log(error)
                toast.dark(getErrorMessage(error.code))
            })
            .finally(() => setIsUpdating(false))
    }

    const deleteAccount = () => {
        setIsUpdating(true)
        // @ts-ignore
        deleteUser(firebaseUser).finally(() => {
            setIsUpdating(false)
        })
    }

    return (
        <>
            <Title value='Profile' />
            <ToastContainer />
            <div className='my-5 flex items-center justify-between px-5 md:hidden'>
                <Link to='/twilight/' className='flex items-center gap-2'>
                    <LazyLoadImage
                        src='/images/logo.png'
                        className='h-10 w-10 rounded-full object-cover'
                    />
                    <p className='text-xl font-medium uppercase tracking-wider text-white'>
                        Twi<span className='text-primary'>light</span>
                    </p>
                </Link>
                <button onClick={() => setIsSidebarActive((prev) => !prev)}>
                    <GiHamburgerMenu size={25} />
                </button>
            </div>

            {isShowPromptReAuthFor && (
                <>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            reAuthentication(isShowPromptReAuthFor)
                        }}
                        className='fixed top-[40%] right-[5%] left-[5%] z-10 min-h-[230px] rounded-md bg-dark-lighten py-2 px-3 md:left-[35%] md:min-h-[200px] md:w-[500px]'
                    >
                        <p className='mb-3 text-center text-lg font-medium text-white'>
                            Type your password again to reauthenticate
                        </p>
                        <input
                            ref={oldPasswordValueRef}
                            type='password'
                            autoFocus
                            className='mt-3 mb-4 w-full rounded-md bg-dark-lighten-2 px-5 py-3 text-white outline-none'
                            placeholder='Type your password...'
                        />
                        <button className='tw-absolute-center-horizontal top-[160px] rounded-xl bg-dark-lighten-2 py-4 px-6 text-white transition duration-300 hover:brightness-125 md:top-[130px]'>
                            Continue
                        </button>
                    </form>
                    <div
                        onClick={() => setIsShowPromptReAuthFor(undefined)}
                        className='fixed top-0 left-0 z-[5] h-full w-full bg-black/60'
                    ></div>
                </>
            )}

            {isUpdating && (
                <>
                    <div className='fixed top-[40%] left-[40%] z-10 h-32 w-32 animate-spin rounded-full border-[8px] border-primary border-t-transparent'></div>
                    <div className='fixed top-0 left-0 z-[5] h-full w-full'></div>
                </>
            )}

            <div className='flex'>
                {isSmallScreen ? (
                    <Sidebar
                        setIsSidebarActive={setIsSidebarActive}
                        isSidebarActive={isSidebarActive}
                    />
                ) : (
                    <SidebarMini />
                )}
                <div className='flex-grow px-3 pt-7 md:pl-10'>
                    <div className='border-b border-dark-lighten-2 pb-4'>
                        <h1 className='text-[35px] font-semibold uppercase text-white'>
                            Account settings
                        </h1>
                    </div>
                    <div className='flex flex-col-reverse gap-8 md:flex-row md:gap-0 '>
                        <div>
                            <p className='mt-5 mb-3 text-xl font-medium text-white'>
                                Basic information
                            </p>
                            <p>
                                Here you can edit public information about
                                yourself. However, if you signed in with Google
                                or Facebook, you can't change your email and
                                password.
                            </p>
                            <div className='mt-7 flex w-full flex-col gap-3'>
                                <Name setIsUpdating={setIsUpdating} />
                                <Email
                                    setIsShowPromptReAuthFor={
                                        setIsShowPromptReAuthFor
                                    }
                                    isUpdatingEmail={isUpdatingEmail}
                                    setIsUpdatingEmail={setIsUpdatingEmail}
                                    emailValueRef={emailValueRef}
                                    isVerified={
                                        <EmailVerification
                                            setIsUpdating={setIsUpdating}
                                        />
                                    }
                                />
                            </div>
                            <Password
                                setIsShowPromptReAuthFor={
                                    setIsShowPromptReAuthFor
                                }
                                isUpdatedPassword={isUpdatedPassword}
                                setIsUpdatedPassword={setIsUpdatedPassword}
                                newPasswordValueRef={newPasswordValueRef}
                            />
                            <DeleteAccount
                                setIsShowPromptReAuthFor={
                                    setIsShowPromptReAuthFor
                                }
                            />
                        </div>
                        <ProfileImage />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile

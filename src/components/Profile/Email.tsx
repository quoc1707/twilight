import { toast, ToastContainer } from 'react-toastify'

import { FC } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { BiSend } from 'react-icons/bi'
import { useAppSelector } from '../../store/hooks'

interface Email {
    setIsShowPromptReAuthFor: any
    isUpdatingEmail: boolean
    setIsUpdatingEmail: any
    emailValueRef: any
    isVerified: JSX.Element
}

const Email: FC<Email> = ({
    setIsShowPromptReAuthFor,
    isUpdatingEmail,
    setIsUpdatingEmail,
    emailValueRef,
    isVerified,
}) => {
    const currentUser = useAppSelector((state) => state.auth.user)

    return (
        <>
            <ToastContainer />
            <div>
                <p className='text-lg text-white'>Email</p>
                {isUpdatingEmail ? (
                    <>
                        <form
                            // onSubmit={changeEmail}
                            onSubmit={(e) => {
                                e.preventDefault()
                                if (
                                    !emailValueRef.current.value.trim().length
                                ) {
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
                                setIsShowPromptReAuthFor('email')
                            }}
                            className='mt-1 flex justify-between gap-48'
                        >
                            <input
                                type='email'
                                ref={emailValueRef}
                                defaultValue={currentUser?.email || ''}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape')
                                        setIsUpdatingEmail(false)
                                }}
                                className='w-full rounded-md bg-dark-lighten px-2 py-1 outline-none'
                            />
                            <button className='transition duration-300 hover:text-primary'>
                                <BiSend size={25} />
                            </button>
                        </form>
                        <p className='mt-1 text-sm'>Press Esc to cancel</p>
                    </>
                ) : (
                    <div className='mt-1 flex justify-between'>
                        <p>
                            {currentUser?.email} ({isVerified})
                        </p>
                        <button
                            className='transition duration-300 hover:text-primary'
                            onClick={() => setIsUpdatingEmail(true)}
                        >
                            <AiOutlineEdit size={25} />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Email

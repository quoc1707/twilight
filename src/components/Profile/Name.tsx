import { doc, updateDoc } from 'firebase/firestore'
import { FC, FormEvent, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import { AiOutlineEdit } from 'react-icons/ai'
import { BiSend } from 'react-icons/bi'
import { getErrorMessage } from '../../helpers'
import { db } from '../../lib/firebase'
import { useAppSelector } from '../../store/hooks'

const Name: FC<{
    setIsUpdating: any
}> = ({ setIsUpdating }) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const [isUpdatingName, setIsUpdatingName] = useState(false)
    const firstNameValueRef = useRef<HTMLInputElement>(null!)
    const lastNameValueRef = useRef<HTMLInputElement>(null!)

    const changeName = (e: FormEvent) => {
        e.preventDefault()

        const firstNameValue = firstNameValueRef.current.value
        const lastNameValue = lastNameValueRef.current.value

        if (!firstNameValue.trim().length || !lastNameValue.trim().length) {
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
        updateDoc(doc(db, 'users', currentUser.uid), {
            firstName: firstNameValue,
            lastName: lastNameValue,
        })
            .then(() => {
                setIsUpdatingName(false)
            })
            .catch((error) => {
                toast.dark(getErrorMessage(error.code))
            })
            .finally(() => setIsUpdating(false))
    }

    return (
        <>
            {' '}
            <ToastContainer />
            <div>
                <p className='text-lg text-white'>Name</p>
                {isUpdatingName ? (
                    <>
                        <form
                            onSubmit={changeName}
                            className='mt-1 flex justify-between'
                        >
                            <div className='flex gap-3'>
                                <input
                                    type='text'
                                    ref={firstNameValueRef}
                                    autoFocus
                                    placeholder='First name'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape')
                                            setIsUpdatingName(false)
                                    }}
                                    className='w-full rounded-md bg-dark-lighten px-2 py-1 outline-none'
                                />
                                <input
                                    type='text'
                                    ref={lastNameValueRef}
                                    placeholder='Last name'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape')
                                            setIsUpdatingName(false)
                                    }}
                                    className='w-full rounded-md bg-dark-lighten px-2 py-1 outline-none'
                                />
                            </div>
                            <button className='transition duration-300 hover:text-primary'>
                                <BiSend size={25} />
                            </button>
                        </form>
                        <p className='mt-1 text-sm'>Press Esc to cancel</p>
                    </>
                ) : (
                    <div className='mt-1 flex justify-between'>
                        <p>{currentUser?.displayName}</p>
                        <button
                            onClick={() => setIsUpdatingName(true)}
                            className='transition duration-300 hover:text-primary'
                        >
                            <AiOutlineEdit size={25} />
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Name

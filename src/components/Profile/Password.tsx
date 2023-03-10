import { toast, ToastContainer } from 'react-toastify'

import { FC } from 'react'

interface Password {
    setIsShowPromptReAuthFor: any
    isUpdatedPassword: boolean
    setIsUpdatedPassword: any
    newPasswordValueRef: any
}

const Password: FC<Password> = ({
    setIsShowPromptReAuthFor,
    isUpdatedPassword,
    setIsUpdatedPassword,
    newPasswordValueRef,
}) => {
    const onPasswordChanged = (event: KeyboardEvent) => {
        if (event.code === 'Enter') {
            if (!newPasswordValueRef.current.value.trim().length) {
                toast.dark('You gotta type something')
                return
            }
            setIsShowPromptReAuthFor('password')
        }
    }
    return (
        <>
            <ToastContainer />
            {isUpdatedPassword && (
                <>
                    <div className='fixed top-[35%] right-[5%] left-[5%] z-10 min-h-[100px] rounded-md bg-dark-lighten-2 py-3 px-5 md:left-[35%] md:w-[350px]'>
                        <p className='text-center text-lg text-white'>
                            Updating password successfully
                        </p>
                        <button
                            onClick={() => setIsUpdatedPassword(false)}
                            className='tw-absolute-center-horizontal mt-3 rounded-full bg-dark-lighten px-6 py-1 transition duration-300 hover:brightness-75'
                        >
                            OK
                        </button>
                    </div>
                    <div
                        onClick={() => setIsUpdatedPassword(false)}
                        className='fixed top-0 left-0 z-[5] h-full w-full bg-black/60'
                    ></div>
                </>
            )}
            <div className='mt-10'>
                <p className='mb-3 text-lg font-medium text-white'>
                    Update password
                </p>
                <form className='flex items-center justify-between'>
                    <div className='flex-[1_1]'>
                        <input
                            ref={newPasswordValueRef}
                            type='password'
                            className='w-full rounded-md bg-dark-lighten px-5 py-3 text-white outline-none'
                            placeholder='New password'
                            // @ts-ignore
                            onKeyDown={onPasswordChanged}
                        />
                    </div>
                </form>
            </div>
        </>
    )
}

export default Password

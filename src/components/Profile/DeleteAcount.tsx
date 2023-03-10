import { FC, useState } from 'react'

import { AiOutlineDelete } from 'react-icons/ai'

const DeleteAccount: FC<{
    setIsShowPromptReAuthFor: any
}> = ({ setIsShowPromptReAuthFor }) => {
    const [isShowPrompt, setIsShowPrompt] = useState(false)
    return (
        <>
            {isShowPrompt && (
                <>
                    <div className='fixed top-[30%] left-[5%] right-[5%] z-50 min-h-[100px] rounded-md bg-dark-lighten px-3 py-5 shadow-md md:left-[40%] md:w-[390px]'>
                        <div className='tw-flex-center mx-auto mb-7 h-16 w-16 rounded-full border-[3px] border-red-500'>
                            <AiOutlineDelete
                                size={40}
                                className='text-red-500 '
                            />
                        </div>
                        <p className='mb-4 text-center text-xl font-medium text-white'>
                            You are about to delete this account
                        </p>
                        <p className='mb-[2px] text-center'>
                            This will remove your account and cannot recover
                        </p>
                        <p className='text-center '>Are you sure?</p>
                        <div className='mt-8 flex justify-end'>
                            <button
                                onClick={() => setIsShowPrompt(false)}
                                className='rounded-md px-6 py-1 text-white transition duration-300 hover:brightness-75'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsShowPromptReAuthFor('delete')
                                    setIsShowPrompt(false)
                                }}
                                className='rounded-md bg-red-500 px-6 py-1 text-white transition duration-300 hover:bg-red-600'
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                    <div
                        onClick={() => setIsShowPrompt(false)}
                        className='fixed top-0 left-0 z-40 h-full w-full bg-black/60'
                    ></div>
                </>
            )}
            <div className='mt-12 mb-6 flex justify-center'>
                <button
                    onClick={() => setIsShowPrompt(true)}
                    className='rounded-full border border-dark-lighten-2 bg-dark-lighten px-5 py-2 text-red-500 transition duration-300 hover:bg-red-500 hover:text-white'
                >
                    Delete account
                </button>
            </div>
        </>
    )
}

export default DeleteAccount

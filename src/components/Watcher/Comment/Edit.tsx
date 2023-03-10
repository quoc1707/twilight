import { deleteDoc, doc } from 'firebase/firestore'
import { FC, useState } from 'react'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import { db } from '../../../lib/firebase'
import { useAppSelector } from '../../../store/hooks'

interface EditComment {
    singleDoc: any
    showOptionFor: string | undefined
    setShowOptionFor: any
    media_type: string
    id?: number | string
    setEditingCommentFor: any
    setCommentHiden: any
}

const EditComment: FC<EditComment> = ({
    singleDoc,
    showOptionFor,
    setShowOptionFor,
    media_type,
    id,
    setEditingCommentFor,
    setCommentHiden,
}) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const [isShowPrompt, setIsShowPrompt] = useState(false)
    const [show] = useAutoAnimate()
    return (
        <>
            <div className='relative z-[39]'>
                <button
                    onClick={() =>
                        showOptionFor === singleDoc.id
                            ? setShowOptionFor(undefined)
                            : setShowOptionFor(singleDoc.id)
                    }
                    className='tw-flex-center mt-4 h-8 w-8 rounded-full bg-transparent transition duration-300 hover:bg-dark-lighten-2'
                >
                    <BsThreeDots size={20} />
                </button>
                {showOptionFor === singleDoc.id && (
                    <div className='absolute -left-8 flex w-[70px] flex-col gap-1 rounded-md bg-dark-lighten-2 px-3 py-2 shadow-md'>
                        {currentUser &&
                            currentUser.uid === singleDoc.data()?.user.uid && (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditingCommentFor(singleDoc.id)
                                            setShowOptionFor(undefined)
                                        }}
                                        className='text-left transition duration-300 hover:text-white'
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsShowPrompt(true)
                                            setShowOptionFor(undefined)
                                        }}
                                        className='text-left transition duration-300 hover:text-white'
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        {(!currentUser ||
                            currentUser.uid !== singleDoc.data()?.user.uid) && (
                            <button
                                onClick={() =>
                                    setCommentHiden((prev: string[]) =>
                                        prev.concat(singleDoc.id)
                                    )
                                }
                                className='transition duration-300 hover:text-white '
                            >
                                Hide
                            </button>
                        )}
                    </div>
                )}
            </div>
            {showOptionFor === singleDoc.id && (
                <div
                    onClick={() => setShowOptionFor(undefined)}
                    className='fixed top-0 left-0 z-[35] h-full w-full'
                ></div>
            )}
            <div
                // @ts-ignore
                ref={show}
            >
                {isShowPrompt && (
                    <>
                        <div className='fixed top-[30%] left-[5%] right-[5%] z-50 min-h-[100px] rounded-md bg-dark-lighten px-3 py-5 shadow-md md:left-[40%] md:right-auto md:w-[400px]'>
                            <div className='tw-flex-center mx-auto mb-7 h-16 w-16 rounded-full border-[3px] border-red-500'>
                                <AiOutlineDelete
                                    size={40}
                                    className='text-red-500 '
                                />
                            </div>
                            <p className='mb-4 text-center text-xl font-medium text-white'>
                                You are about to remove this comment
                            </p>
                            <p className='mb-[2px] text-center'>
                                This will remove your films and cannot recover
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
                                    onClick={() =>
                                        deleteDoc(
                                            doc(
                                                db,
                                                `${media_type}-${id}`,
                                                singleDoc.id
                                            )
                                        )
                                    }
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
            </div>
        </>
    )
}

export default EditComment

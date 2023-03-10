import { doc, updateDoc } from 'firebase/firestore'
import { ChangeEvent, useState } from 'react'

import axios from 'axios'
import { HiOutlineUpload } from 'react-icons/hi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { imgbbApiKey } from '../../env'
import { db } from '../../lib/firebase'
import { useAppSelector } from '../../store/hooks'

const ProfileImage = () => {
    const [isUpdatingImg, setIsUpdatingImg] = useState(false)
    const currentUser = useAppSelector((state) => state.auth.user)

    const changeProfileImage = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            setIsUpdatingImg(true)

            if (!currentUser) return

            const form = new FormData()

            form.append('image', (e.target.files as FileList)[0])

            const res = await axios({
                method: 'POST',
                url: `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                data: form,
                headers: {
                    'content-type': 'multipart/form-data',
                },
            })

            updateDoc(doc(db, 'users', currentUser.uid), {
                photoUrl: res.data.data.display_url,
            }).finally(() => setIsUpdatingImg(false))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='w-full shrink-0 px-4 md:max-w-[500px]'>
            <p className='mt-5 text-center text-xl font-medium text-white'>
                Profile photo
            </p>
            <div className='mt-4 flex flex-col items-center '>
                <div className='relative h-[250px] w-[250px]'>
                    <LazyLoadImage
                        src={currentUser?.photoURL || '/images/avatar.png'}
                        alt='profile picture'
                        className='h-[250px] w-[250px] rounded-full object-cover'
                    />
                    {isUpdatingImg && (
                        <div className='absolute top-[40%] left-[40%] z-10 h-12 w-12 animate-spin rounded-full border-[4px] border-dark border-t-transparent'></div>
                    )}
                </div>
                <label
                    htmlFor='upload-img'
                    className='mt-8 flex cursor-pointer items-center gap-3 rounded-full bg-dark-lighten py-3 px-5 transition duration-300 hover:brightness-75 md:mt-[3.2rem]'
                >
                    <HiOutlineUpload size={25} className='text-primary' />
                    <p className='text-white'>Upload new photo</p>
                </label>
                <input
                    id='upload-img'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={changeProfileImage}
                />
            </div>
        </div>
    )
}

export default ProfileImage

import React, { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Home = () => {

    const nameRef = useRef()

    const navigate = useNavigate()
    const query = new URLSearchParams(useLocation().search)

    const handleClick = () => {
        const status = nameRef.current.checkValidity()
        nameRef.current.reportValidity()
        if (status) {
            if (query.get('roomId'))
                navigate(`/room/${query.get('roomId')}?name=${nameRef.current.value}`)
            else
                navigate(`/room/${Math.floor(100000 + Math.random() * 900000)}?name=${nameRef.current.value}`)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='flex flex-col items-center font-mono'>
                <form className='font-mono w-full mb-5'>
                    <div className='mt-4 mb-4'>
                        <label className='font-bold text-xs'>Enter your name</label>
                        <div>
                            <input ref={nameRef} className='border-2 p-2 rounded-lg w-full' type='text' required />
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-around'>
                        <button className='bg-black text-white font-bold text-sm p-2 rounded-xl cursor-pointer w-full' onClick={(e) => {
                            e.preventDefault()
                            handleClick()
                        }}>
                            Start Game
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Home
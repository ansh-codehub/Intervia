import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from "../App"
import { FaArrowLeft } from 'react-icons/fa';

function InterviewHistory() {
    const [interviews, setInterviews] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(
                    ServerUrl + "/api/interview/get-interview",
                    { withCredentials: true }
                )
                setInterviews(result.data)

            } catch (error) {
                console.log(error);
            }
        }

        getMyInterviews()
    }, [])

    return (
        <div className='min-h-screen bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] py-10'>
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>

                <div className='mb-10 w-full flex items-start gap-4 flex-wrap'>

                    <button
                        onClick={() => navigate("/")}
                        className='mt-1 p-3 rounded-full bg-[#17104A] shadow-lg hover:shadow-pink-900/40 transition border border-purple-700/40'
                    >
                        <FaArrowLeft className='text-pink-300' />
                    </button>

                    <div>
                        <h1 className='text-3xl font-bold flex-nowrap text-white'>
                            Interview History
                        </h1>

                        <p className='text-purple-200/70 mt-2'>
                            Track your past interviews and performance reports.
                        </p>
                    </div>

                </div>

                {interviews.length === 0 ? (

                    <div className='bg-[#0B0825] p-10 rounded-2xl shadow-xl text-center border border-purple-700/40'>
                        <p className='text-purple-200/60'>
                            No interviews found. Start your first interview.
                        </p>
                    </div>

                ) : (

                    <div className='grid gap-6'>

                        {interviews.map((item, index) => (

                            <div
                                key={index}
                                onClick={() => navigate(`/report/${item._id}`)}
                                className='bg-[#0B0825] p-6 rounded-2xl shadow-lg hover:shadow-pink-900/30 hover:border-pink-700/50 transition-all duration-300 cursor-pointer border border-purple-800/40'
                            >

                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

                                    <div>

                                        <h3 className='text-lg font-semibold text-white'>
                                            {item.role}
                                        </h3>

                                        <p className='text-purple-200/70 text-sm mt-1'>
                                            {item.experience} • {item.mode}
                                        </p>

                                        <p className='text-xs text-purple-300/40 mt-2'>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>

                                    </div>

                                    <div className='flex items-center gap-6'>

                                        <div className='text-right'>

                                            <p className='text-xl font-bold text-pink-400'>
                                                {item.finalScore || 0}/10
                                            </p>

                                            <p className='text-xs text-purple-300/40'>
                                                Overall Score
                                            </p>

                                        </div>

                                        <span
                                            className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "Completed"
                                                    ? "bg-pink-900/40 text-pink-300"
                                                    : "bg-purple-900/40 text-purple-300"
                                                }`}
                                        >
                                            {item.status}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
        </div>
    )
}

export default InterviewHistory
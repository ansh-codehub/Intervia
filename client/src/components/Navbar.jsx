import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { MdLogout } from 'react-icons/md'
import { RiRobot3Line } from 'react-icons/ri'
import { ImCoinDollar } from 'react-icons/im'
import { FaUserAstronaut } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import AuthModel from './AuthModel'
  


function Navbar() {
  const { userData } = useSelector((state) => state.user)
  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showAuth, setShowAuth] = useState(false)

  const handleLogout = async () => {
  try {
    await axios.get(
      ServerUrl + "/api/auth/logout",
      {
        withCredentials: true
      }
    )

    dispatch(setUserData(null))
    setShowCreditPopup(false)
    setShowUserPopup(false)
    navigate("/")
  } catch (error) {
    console.log("Logout error:", error)
  }
}
  return (
    <div className="bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] flex justify-center px-4 pt-6">
      
      <motion.div
        initial={{
          opacity: 0,
          y: -40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="w-full max-w-6xl bg-gradient-to-r from-[#05051A] via-[#17104A] to-[#24103F] rounded-[24px] shadow-lg shadow-fuchsia-950/30
        border border-fuchsia-500/30 px-8 py-4 flex justify-between
        items-center relative"
      >

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-gradient-to-br from-[#17104A] to-[#9D174D] text-fuchsia-100 p-2 rounded-lg border border-fuchsia-400/30 shadow-md shadow-fuchsia-950/30">
            <RiRobot3Line size={18} />
          </div>

          <h1 className="font-semibold hidden md:block text-lg text-white">
            Intervia.Ai
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6 relative">

          {/* Credits */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true)
                  return
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false)
              }}
              className="flex items-center gap-2 bg-[#17104A]
              border border-fuchsia-500/30
              px-4 py-2 rounded-full text-md
              text-fuchsia-100
              hover:bg-[#261B69] hover:border-fuchsia-400/50 transition"
            >
              <ImCoinDollar size={20} className="text-fuchsia-400" />

              <span>
                {userData?.credits ?? 0}
              </span>
            </button>

            {showCreditPopup && (
              <div className='absolute right-[-50px] mt-3 w-64 bg-[#17104A]
              shadow-xl shadow-fuchsia-950/40 border border-fuchsia-500/30 rounded-xl
              p-5 z-50'>
                <p className='text-sm text-slate-300
                mb-4'>Need more credits to continue interviews?
                </p>

                <button
                 onClick={() => navigate("/pricing")}
                 className='w-full bg-gradient-to-r from-[#17104A] to-[#9D174D] text-white
                py-2 rounded-lg text-sm border border-fuchsia-500/30
                hover:from-[#261B69] hover:to-[#BE185D] transition'>
                  Buy more credits
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true)
                  return
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false)
              }}
              className="w-9 h-9 bg-gradient-to-br from-[#17104A] to-[#9D174D] text-fuchsia-100
              border border-fuchsia-400/30
              rounded-full flex items-center justify-center
              font-semibold shadow-md shadow-fuchsia-950/30"
            >
              {userData?.name ? (
                userData.name.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={16} />
              )}
            </button>

            {showUserPopup && (
              <div className='absolute right-[-50px] mt-3 w-64 bg-[#17104A]
              shadow-xl shadow-fuchsia-950/40 border border-fuchsia-500/30 rounded-xl
              p-5 z-50'>

                <p className='text-md text-fuchsia-400 font-medium
                mb-1'>{userData?.name}
                </p>

                <button
                 onClick={() => navigate("/history")}
                 className='w-full text-left
                py-2 text-slate-300 hover:text-white text-sm transition'>
                  Interview History
                </button>

                <button
                 onClick={handleLogout}
                 className='w-full text-left
                py-2 flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm transition'>
                  <MdLogout size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          

        </div>

      </motion.div>
      
      {showAuth && <AuthModel onClose={() => setShowAuth(false)}/>}

    </div>
  )
}

export default Navbar
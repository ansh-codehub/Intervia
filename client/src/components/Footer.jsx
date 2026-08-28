import React from 'react'
import { RiRobot3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div className="bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] flex justify-center px-4 py-10">
            <div
                className="w-full max-w-6xl rounded-[24px]
                bg-gradient-to-br from-[#17104A] to-[#05051A]
                border border-fuchsia-500/30
                shadow-lg shadow-fuchsia-950/40
                py-10 px-6 text-center"
            >
                {/* Logo */}
                <div className="flex justify-center items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg text-fuchsia-300">
                        <RiRobot3Fill size={20} />
                    </div>

                    <h2 className="font-bold text-lg bg-gradient-to-r from-[#17104A] to-[#9D174D] text-fuchsia-100 px-3 py-1 rounded-lg inline-block border border-fuchsia-400/20">
                        Intervia.AI
                    </h2>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm max-w-xl mx-auto">
                    AI-Powered interview preparation platform designed to improve
                    communication skills, technical depth and professional confidence.
                </p>

                {/* Footer Links */}
                <div className="flex justify-center items-center gap-6 mt-6">
                    <Link
                        to="/contact"
                        className="text-fuchsia-300 text-sm font-medium
                        hover:text-white transition-colors duration-200"
                    >
                        Contact Us
                    </Link>

                    <span className="text-fuchsia-500/50">|</span>

                    <Link
                        to="/privacy-policy"
                        className="text-fuchsia-300 text-sm font-medium
                        hover:text-white transition-colors duration-200"
                    >
                        Privacy Policy
                    </Link>
                </div>

                {/* Copyright */}
                <div className="mt-6 pt-5 border-t border-fuchsia-500/10">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} Intervia.AI. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer

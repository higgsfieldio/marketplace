import React from 'react'
import './SearchPreloader.css'

const SearchPreloader = () => {
    return (
        <div className="search-preloader">
            <div className="search-preloader__container">
                
                <svg className="search-preloader__loader" width="157" height="157" viewBox="0 0 157 157" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M48.9511 28.8531C61.9991 21.3157 77.5911 19.2709 92.2971 23.1686C107.003 27.0662 119.618 36.5869 127.368 49.6364" stroke="url(#paint0_linear_1096_31551)" strokeWidth="14" strokeLinecap="round" strokeDasharray="4 4" />
                    <defs>
                        <linearGradient id="paint0_linear_1096_31551" x1="135.391" y1="78.7464" x2="20.9502" y2="78.7464" gradientUnits="userSpaceOnUse">
                            <stop className="search-preloader__loader-color" stopColor="#6F6FE9" />
                            <stop className="search-preloader__loader-color" offset="0.755208" stopColor="#6F6FE9" stopOpacity="0.01" />
                            <stop className="search-preloader__loader-color" offset="1" stopColor="#6F6FE9" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>

            </div>


        </div>
    )
};

export default SearchPreloader
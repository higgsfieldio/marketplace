import '../../index.css';
import './MenuPopup.css';
import React from "react";
import { Link } from 'react-router-dom';





function MenuPopup(props) {
  function handleThemeChange() {
    if (props.theme === 'dark') {
      props.setTheme('light')
    }
    else if (props.theme === 'light') {
      props.setTheme('neon')
    }
    else if (props.theme === 'neon') {
      props.setTheme('dark')
    }
  }
  function handleClose() {
    props.setMenuPopupOpen(false)
  }
  return (
    <>
      <div className={`menu-popup ${props.isMenuPopupOpen ? 'menu-popup_active' : ''}`}>
        <div className={`menu-popup__container ${props.isMenuPopupOpen ? 'menu-popup__container_active' : ''}`}>


        </div>
        <div className={`menu-popup__background ${props.isMenuPopupOpen ? 'menu-popup__background_active' : ''}`} onClick={handleClose}>

        </div>
      </div>
      <div className={`menu-popup-top ${props.isMenuPopupOpen ? 'menu-popup_active' : ''}`}>
        <div className={`menu-popup__container ${props.isMenuPopupOpen ? 'menu-popup__container_active' : ''}`}>
          <div className="menu-popup__heading">
            <Link to='/' className="menu-popup__logo-container" onClick={handleClose}>
              <svg className="menu-popup__logo-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_903_1249)">
                  <rect width="40" height="40" rx="12" fill="white" />
                  <circle cx="1" cy="1" r="5" fill="url(#paint0_angular_903_1249)" />
                  <circle cx="1" cy="39" r="5" fill="url(#paint1_angular_903_1249)" />
                  <circle cx="39" cy="1" r="5" fill="url(#paint2_angular_903_1249)" />
                  <circle cx="39" cy="39" r="5" fill="url(#paint3_angular_903_1249)" />
                  <ellipse cx="19.666" cy="20.333" rx="5" ry="5" transform="rotate(90 19.666 20.333)" fill="url(#paint4_linear_903_1249)" />
                  <circle cx="4" cy="20" r="8" transform="rotate(90 4 20)" fill="url(#paint5_linear_903_1249)" />
                  <ellipse cx="36" cy="20" rx="8" ry="8" transform="rotate(90 36 20)" fill="url(#paint6_linear_903_1249)" />
                  <circle cx="20" cy="4" r="8" fill="url(#paint7_angular_903_1249)" />
                  <circle cx="20" cy="36" r="8" fill="url(#paint8_angular_903_1249)" />
                </g>
                <defs>
                  <radialGradient id="paint0_angular_903_1249" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1 1.11628) rotate(180) scale(5)">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </radialGradient>
                  <radialGradient id="paint1_angular_903_1249" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1 39.1163) rotate(180) scale(5)">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </radialGradient>
                  <radialGradient id="paint2_angular_903_1249" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 1.11628) rotate(180) scale(5)">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </radialGradient>
                  <radialGradient id="paint3_angular_903_1249" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 39.1163) rotate(180) scale(5)">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </radialGradient>
                  <linearGradient id="paint4_linear_903_1249" x1="24.666" y1="20.4493" x2="14.666" y2="20.4493" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </linearGradient>
                  <linearGradient id="paint5_linear_903_1249" x1="12" y1="20.186" x2="-4" y2="20.186" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </linearGradient>
                  <linearGradient id="paint6_linear_903_1249" x1="44" y1="20.186" x2="28" y2="20.186" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </linearGradient>
                  <radialGradient id="paint7_angular_903_1249" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 4.18605) rotate(180) scale(8)">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </radialGradient>
                  <radialGradient id="paint8_angular_903_1249" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 36.186) rotate(180) scale(8)">
                    <stop stopColor="#E250E5" />
                    <stop offset="0.482292" stopColor="#4B50E6" />
                    <stop offset="0.982292" stopColor="#E250E5" />
                  </radialGradient>
                  <clipPath id="clip0_903_1249">
                    <rect width="40" height="40" rx="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Link>
            <div className="menu-popup__close-container">
              <svg className="menu-popup__close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleClose}>
                <path className="menu-popup__close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
              </svg>
            </div>
          </div>
          <div className="menu-popup__links">
            <div className="menu-popup__link-container">
              <Link className="menu-popup__link" to='/explore-collections/collectables' onClick={handleClose}>Explore collections</Link>
            </div>
            <div className="menu-popup__link-container">
              <Link className="menu-popup__link" to='/collections-stats' onClick={handleClose}>Explore stats</Link>
            </div>
            <div className="menu-popup__link-container">
              <Link className="menu-popup__link" to='/explore-items' onClick={handleClose}>Explore NFTs</Link>
            </div>
            <div className="menu-popup__link-container">
              <Link className="menu-popup__link" to='/calendar' onClick={handleClose}>Calendar</Link>
            </div>
            <div className="menu-popup__link-container">
              <Link className="menu-popup__link" to='/earn/referral' onClick={handleClose}>Referral</Link>
            </div>
            {/* <div className="menu-popup__link-container menu-popup__link-container_soon">
              <p className="menu-popup__soon-text">Coming soon!</p>
              <Link className="menu-popup__link menu-popup__link_soon" to=''>Referral</Link>
            </div> */}
            <div className="menu-popup__link-container menu-popup__link-container_soon">
              <p className="menu-popup__soon-text">Coming soon!</p>
              <Link className="menu-popup__link menu-popup__link_soon" to=''>Launch</Link>
            </div>
          </div>
          <div className='menu-popup__btn-theme' onClick={handleThemeChange}>
            <div className={`menu-popup__btn-theme-selector ${props.theme === 'dark' ? 'menu-popup__btn-theme-selector_position_dark' : ''} ${props.theme === 'light' ? 'menu-popup__btn-theme-selector_position_light' : ''} ${props.theme === 'neon' ? 'menu-popup__btn-theme-selector_position_trip' : ''}`}>
              {props.theme === 'dark' ? <>
                <p className='menu-popup__btn-theme-selector-text'>Dark</p>
                <svg className='menu-popup__btn-theme-selector-icon' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_893_42583)">
                    <path d="M9.83688 1.20097C10.2045 1.18732 10.393 1.6692 10.0557 1.90187C5.40508 5.36483 9.14031 12.9096 14.7875 11.0915C15.1622 10.9706 15.4384 11.393 15.1658 11.738C12.2706 15.3862 6.47037 14.8983 4.29784 10.6547C2.11501 6.39092 5.15372 1.37455 9.83688 1.20097ZM6.21429 9.42847C7.88889 12.6995 5.35714 8.28562 11.0714 12.2856C5.58579 12.8316 1.64286 10.6547 7.35733 4.57133C7.35733 10.857 4.52709 6.13284 6.21429 9.42847Z" fill="#F6F2FC" />
                  </g>
                  <defs>
                    <clipPath id="clip0_893_42583">
                      <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </> : <></>}

              {props.theme === 'light' ? <>
                <p className='menu-popup__btn-theme-selector-text'>Light</p>
                <svg className='menu-popup__btn-theme-selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_893_42601)">
                    <path d="M7.98903 3.52832C5.52574 3.52832 3.52148 5.5328 3.52148 7.99617C3.52148 10.4597 5.5257 12.464 7.98903 12.464C10.4526 12.464 12.4569 10.4595 12.4569 7.99617C12.4567 5.53266 10.4524 3.52832 7.98903 3.52832ZM7.98903 11.2045C6.2203 11.2045 4.78102 9.76523 4.78102 7.99638C4.14588 9.76264 6.31667 11.5078 8.0854 11.5078C9.85427 11.5078 11.7312 9.62442 11.1972 7.99638C11.1972 9.76523 9.7579 11.2045 7.98903 11.2045Z" fill="#121212" />
                    <path d="M7.98925 1.51068C8.33702 1.51068 8.61901 1.22869 8.61901 0.880816V0.629866C8.61901 0.282378 8.33702 0 7.98925 0C7.64137 0 7.35938 0.282402 7.35938 0.629866V0.880816C7.35938 1.22869 7.64164 1.51068 7.98925 1.51068Z" fill="#121212" />
                    <path d="M15.3492 7.37402H15.0986C14.7507 7.37402 14.4688 7.65643 14.4688 8.00389C14.4688 8.35204 14.7507 8.63375 15.0986 8.63375H15.3492C15.697 8.63375 15.9789 8.35189 15.9789 8.00389C15.9791 7.6564 15.6971 7.37402 15.3492 7.37402Z" fill="#121212" />
                    <path d="M7.97547 14.4824C7.6276 14.4824 7.3457 14.7644 7.3457 15.1123V15.3632C7.3457 15.7107 7.6277 15.993 7.97547 15.993C8.32335 15.993 8.60524 15.7107 8.60524 15.3632L8.60511 15.1123C8.60511 14.7644 8.32338 14.4824 7.97548 14.4824H7.97547Z" fill="#121212" />
                    <path d="M0.866881 7.35938H0.616199C0.268326 7.35938 -0.0136719 7.64097 -0.0136719 7.98914C-0.0136719 8.3369 0.268326 8.619 0.616199 8.619H0.866881C1.21475 8.619 1.49675 8.33674 1.49675 7.98914C1.49675 7.64099 1.21475 7.35938 0.866881 7.35938Z" fill="#121212" />
                    <path d="M2.51007 3.40508C2.63304 3.52805 2.79437 3.58946 2.95558 3.58946C3.11664 3.58946 3.27784 3.52805 3.40108 3.40521C3.64715 3.15955 3.64715 2.76028 3.40122 2.51421L3.22402 2.33701C2.97835 2.09095 2.5795 2.09081 2.33301 2.33647C2.08694 2.58254 2.08694 2.9814 2.33287 3.22747L2.51007 3.40508Z" fill="#121212" />
                    <path d="M12.7507 2.34666L12.5732 2.52385C12.3272 2.76992 12.3272 3.16836 12.5731 3.41444C12.6961 3.53781 12.8574 3.59923 13.0186 3.59923C13.1797 3.59923 13.3409 3.53795 13.4641 3.41498L13.6413 3.23778C13.8875 2.99172 13.8875 2.59285 13.6417 2.34678C13.3958 2.10057 12.9968 2.10057 12.7507 2.34664V2.34666Z" fill="#121212" />
                    <path d="M13.4545 12.5869C13.2083 12.3408 12.8096 12.3408 12.5635 12.5868C12.3174 12.8324 12.3174 13.2314 12.5631 13.4778L12.7402 13.6548C12.8634 13.7778 13.0247 13.8392 13.1858 13.8392C13.3469 13.8392 13.5081 13.7782 13.631 13.6554C13.8772 13.4093 13.8772 13.0105 13.6314 12.7644L13.4545 12.5869Z" fill="#121212" />
                    <path d="M2.50069 12.577L2.32322 12.7545C2.07715 13.0002 2.07715 13.399 2.32322 13.6451C2.44619 13.768 2.60739 13.8295 2.76845 13.8295C2.92951 13.8295 3.09112 13.768 3.21396 13.6451L3.39143 13.4676C3.6375 13.2217 3.6375 12.8227 3.39143 12.577C3.14563 12.3311 2.74663 12.3311 2.50069 12.577Z" fill="#121212" />
                  </g>
                  <defs>
                    <clipPath id="clip0_893_42601">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

              </> : <></>}

              {props.theme === 'neon' ? <>
                <p className='menu-popup__btn-theme-selector-text'>Neon</p>
                <svg className='menu-popup__btn-theme-selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_893_42612)">
                    <path d="M9.83271 7.9896C9.83271 9.00217 9.01193 9.82295 7.99936 9.82295C6.9868 9.82295 6.16602 9.00217 6.16602 7.9896C6.16602 6.97703 6.9868 6.15625 7.99936 6.15625C9.01193 6.15625 9.83271 6.97703 9.83271 7.9896Z" fill="#6F6FE9" />
                    <path d="M12.0334 3.55273C10.9281 2.55283 9.49056 1.99902 8 1.99902C6.50944 1.99902 5.07195 2.55283 3.96663 3.55273L0.648342 6.53504C0.235577 6.90594 0 7.43468 0 7.98943C0 8.54418 0.23558 9.07292 0.648342 9.44382L3.96663 12.4261C5.07251 13.4252 6.50971 13.9783 8 13.9783C9.49028 13.9783 10.9275 13.4252 12.0334 12.4261L15.3517 9.44396V9.44382C15.7644 9.07292 16 8.54419 16 7.98943C16 7.43468 15.7644 6.90594 15.3517 6.53505L12.0334 3.55273ZM8 11.045C7.18959 11.045 6.41246 10.7231 5.83941 10.15C5.26635 9.57696 4.94442 8.79984 4.94442 7.98943C4.94442 7.17902 5.26635 6.40189 5.83941 5.82884C6.41247 5.25578 7.18959 4.93385 8 4.93385C8.81041 4.93385 9.58754 5.25578 10.1606 5.82884C10.7336 6.4019 11.0556 7.17902 11.0556 7.98943C11.0556 8.79984 10.7337 9.57697 10.1606 10.15C9.58753 10.7231 8.81041 11.045 8 11.045Z" fill="#6F6FE9" />
                  </g>
                  <defs>
                    <clipPath id="clip0_893_42612">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>


              </> : <></>}


            </div>
          </div>
        </div>
        <div className={`menu-popup__background ${props.isMenuPopupOpen ? 'menu-popup__background_active' : ''}`} onClick={handleClose}>

        </div>
      </div>
    </>

  );
}

export default MenuPopup;

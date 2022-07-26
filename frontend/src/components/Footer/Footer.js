// import validator from 'validator'
// import { useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
// import pythonApi from '../../assets/pythonApi';

function Footer({ currentUser, setWarningBetaPopupOpened }) {
    // const [emailValue, setEmailValue] = useState('');
    // const [emailSubmited, setEmailSubmited] = useState(false);
    // const [emailValidity, setEmailValidity] = useState({
    //     errorMassage: '',
    //     validState: false
    // });

    // function handleEmailChange(e) {
    //     let inputValue = e.target.value
    //     setEmailValue(inputValue);
    //     if (!inputValue) {
    //         setEmailValidity({
    //             errorMassage: '',
    //             validState: false
    //         })
    //     }
    //     if (inputValue.length >= 2) {
    //         if (validator.isEmail(inputValue)) {
    //             setEmailValidity({
    //                 errorMassage: '',
    //                 validState: true
    //             })
    //         } else {
    //             setEmailValidity({
    //                 errorMassage: (!e.target.validity.valid ? e.target.validationMessage : 'Enter a valid email'),
    //                 validState: false
    //             })
    //         }
    //     }
    // }

    // function handleEmailSubmit() {
    //     if (emailValue && emailValidity.validState) {
    //         pythonApi.submitEmail({ email: emailValue.toString().trim().toLowerCase() })
    //             .then((res) => {
    //                 setEmailSubmited(true)
    //                 console.log(res)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //             })
    //     }
    // }

    function scrollTop() {
        window.scrollTo(0, 0);
    }

    return (
        <footer className='footer'>
            <div className='footer__container'>
                <div className='footer__first-column'>
                    {/* <div className='footer__input-box'>
                        <p className='footer__input-title'>Join our mailing list to know<br />about latest listings and updates</p>
                        <div className="footer__input-container">
                            <input placeholder='Get up with the news' className="footer__input" name="text" type="email" value={emailValue} onChange={handleEmailChange} maxLength="250"></input>
                            <div className={`footer__input-submit ${emailValidity.validState ? '' : 'footer__input-submit_inactive'}`} onClick={handleEmailSubmit}>
                                <p className="footer__input-submit-text">{emailSubmited? 'Submitted' : 'Submit'}</p>
                            </div>
                        </div>
                    </div> */}
                    <div className='footer__logo-and-promo'>
                        <div className="footer__logo-container">
                            <svg className="footer__logo-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_903_1249)">
                                    <rect className="footer__logo-icon-bg" width="40" height="40" rx="12" fill="white" />
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
                            <p className='footer__logo-text'>Higgs field</p>
                        </div>
                        <p className='footer__promo-text'>One of the largest digital marketplace for crypto collectables and NFTs on <a target="_blank" rel="noreferrer" href="https://near.org/" className='footer__promo-text-span'>Near</a> blockchain</p>
                        <div className='footer__beta-warning' onClick={()=>{
                            setWarningBetaPopupOpened(true)
                        }}>
                            <p className='footer__beta-warning-text'>Higgs Field is in public beta now</p>
                            <p className='footer__beta-warning-question'>?</p>
                        </div>
                    </div>
                </div>

                <div className='footer__second-column'>
                    <div className='footer__socials'>
                        <p className='footer__socials-title'>Join our community</p>
                        <div className='footer__socials-icons'>
                            {/* <a className='footer__socials-icon' target="_blank" rel="noreferrer" href="/#" >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.0023 2.16136C15.2092 2.16136 15.589 2.17542 16.8502 2.23169C18.0223 2.28326 18.6552 2.48017 19.0772 2.64427C19.6351 2.85993 20.0383 3.12248 20.4556 3.53975C20.8775 3.96171 21.1354 4.36023 21.351 4.91815C21.5151 5.34011 21.7121 5.97773 21.7636 7.14515C21.8199 8.41102 21.834 8.79078 21.834 11.993C21.834 15.1998 21.8199 15.5796 21.7636 16.8408C21.7121 18.0129 21.5151 18.6458 21.351 19.0678C21.1354 19.6257 20.8728 20.0289 20.4556 20.4462C20.0336 20.8681 19.6351 21.126 19.0772 21.3417C18.6552 21.5058 18.0176 21.7027 16.8502 21.7542C15.5843 21.8105 15.2045 21.8246 12.0023 21.8246C8.79547 21.8246 8.41571 21.8105 7.15452 21.7542C5.98242 21.7027 5.34948 21.5058 4.92753 21.3417C4.3696 21.126 3.9664 20.8635 3.54913 20.4462C3.12717 20.0242 2.86931 19.6257 2.65364 19.0678C2.48955 18.6458 2.29264 18.0082 2.24106 16.8408C2.1848 15.5749 2.17074 15.1952 2.17074 11.993C2.17074 8.78609 2.1848 8.40633 2.24106 7.14515C2.29264 5.97304 2.48955 5.34011 2.65364 4.91815C2.86931 4.36023 3.13186 3.95702 3.54913 3.53975C3.97109 3.1178 4.3696 2.85993 4.92753 2.64427C5.34948 2.48017 5.98711 2.28326 7.15452 2.23169C8.41571 2.17542 8.79547 2.16136 12.0023 2.16136ZM12.0023 0C8.7439 0 8.336 0.0140652 7.05607 0.0703262C5.78082 0.126587 4.90408 0.332877 4.14456 0.628248C3.35222 0.937683 2.68177 1.34558 2.01602 2.01602C1.34558 2.68177 0.937683 3.35222 0.628248 4.13987C0.332878 4.90408 0.126587 5.77613 0.0703263 7.05138C0.0140653 8.336 0 8.7439 0 12.0023C0 15.2608 0.0140653 15.6687 0.0703263 16.9486C0.126587 18.2239 0.332878 19.1006 0.628248 19.8601C0.937683 20.6525 1.34558 21.3229 2.01602 21.9887C2.68177 22.6544 3.35222 23.067 4.13987 23.3718C4.90408 23.6671 5.77613 23.8734 7.05138 23.9297C8.33132 23.9859 8.73921 24 11.9977 24C15.2561 24 15.664 23.9859 16.9439 23.9297C18.2192 23.8734 19.0959 23.6671 19.8554 23.3718C20.6431 23.067 21.3135 22.6544 21.9793 21.9887C22.6451 21.3229 23.0576 20.6525 23.3624 19.8648C23.6577 19.1006 23.864 18.2286 23.9203 16.9533C23.9766 15.6734 23.9906 15.2655 23.9906 12.007C23.9906 8.74858 23.9766 8.34069 23.9203 7.06075C23.864 5.78551 23.6577 4.90877 23.3624 4.14925C23.067 3.35222 22.6591 2.68177 21.9887 2.01602C21.3229 1.35026 20.6525 0.937683 19.8648 0.632936C19.1006 0.337566 18.2286 0.131276 16.9533 0.0750147C15.6687 0.0140653 15.2608 0 12.0023 0Z" fill="white" />
                                    <path d="M12.0032 5.83691C8.59937 5.83691 5.83789 8.59839 5.83789 12.0022C5.83789 15.406 8.59937 18.1674 12.0032 18.1674C15.4069 18.1674 18.1684 15.406 18.1684 12.0022C18.1684 8.59839 15.4069 5.83691 12.0032 5.83691ZM12.0032 16.0014C9.79491 16.0014 8.00394 14.2104 8.00394 12.0022C8.00394 9.79394 9.79491 8.00296 12.0032 8.00296C14.2114 8.00296 16.0024 9.79394 16.0024 12.0022C16.0024 14.2104 14.2114 16.0014 12.0032 16.0014Z" fill="white" />
                                    <path d="M19.8494 5.59315C19.8494 6.39019 19.2024 7.0325 18.41 7.0325C17.613 7.0325 16.9707 6.3855 16.9707 5.59315C16.9707 4.79612 17.6177 4.15381 18.41 4.15381C19.2024 4.15381 19.8494 4.80081 19.8494 5.59315Z" fill="white" />
                                </svg>
                            </a> */}
                            <a className='footer__socials-icon' target="_blank" rel="noreferrer" href="https://twitter.com/higgsfield_nft" >
                                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0669 29.001C22.1394 29.001 28.7444 18.9966 28.7444 10.3235C28.7444 10.0422 28.7381 9.75471 28.7256 9.47346C30.0105 8.54426 31.1193 7.39332 32 6.07471C30.8034 6.60711 29.5329 6.95482 28.2319 7.10596C29.6017 6.28485 30.6274 4.99494 31.1187 3.47533C29.8301 4.23905 28.4208 4.77779 26.9513 5.06846C25.9611 4.01639 24.652 3.3198 23.2262 3.08638C21.8005 2.85296 20.3376 3.09571 19.0637 3.77711C17.7897 4.4585 16.7757 5.54058 16.1785 6.85606C15.5812 8.17153 15.4339 9.64713 15.7594 11.0547C13.15 10.9238 10.5972 10.2459 8.26664 9.06511C5.93604 7.8843 3.87959 6.22689 2.23062 4.20033C1.39253 5.6453 1.13608 7.35517 1.51337 8.98243C1.89067 10.6097 2.87342 12.0322 4.26188 12.961C3.2195 12.9279 2.19997 12.6472 1.2875 12.1422V12.2235C1.28657 13.7398 1.8108 15.2098 2.77108 16.3833C3.73136 17.5569 5.06843 18.3617 6.555 18.661C5.58941 18.9251 4.57598 18.9636 3.59313 18.7735C4.01261 20.0776 4.82876 21.2182 5.92769 22.0361C7.02662 22.854 8.35349 23.3084 9.72313 23.336C7.3979 25.1625 4.52557 26.1531 1.56875 26.1485C1.04438 26.1477 0.520532 26.1155 0 26.0522C3.00381 27.9793 6.49804 29.0028 10.0669 29.001Z" fill="white" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className='footer__links'>
                        <div className='footer__links_pc'>
                            <div className='footer__links-column'>
                                <p className='footer__links-title'>Marketplace</p>
                                <Link className='footer__link' to='/explore-collections/collectables' onClick={scrollTop}>Explore</Link>
                                <Link className='footer__link' to='/calendar' onClick={scrollTop}>Calendar</Link>
                                <Link className='footer__link' to='/earn/referral/' onClick={scrollTop}>Referral</Link>
                                <Link className='footer__link footer__link_disabled' to='/' onClick={scrollTop}>Launch</Link>
                                <Link className='footer__link footer__link_disabled' to='/' onClick={scrollTop}>Meta Gallery</Link>
                            </div>
                            {currentUser && currentUser !== undefined ?
                                <div className='footer__links-column'>
                                    <p className='footer__links-title'>Account</p>
                                    <Link className='footer__link' to={`/profile/${currentUser.customURL ? currentUser.customURL : currentUser.user_id}/on-sale`} onClick={scrollTop}>Profile</Link>
                                    <Link className='footer__link' to={`/profile/${currentUser.customURL ? currentUser.customURL : currentUser.user_id}/collections`} onClick={scrollTop}>My collections</Link>
                                    <Link className='footer__link' to='/edit-profile' onClick={scrollTop}>Edit profile</Link>
                                </div>
                                : <></>}
                            <div className='footer__links-column'>
                                <p className='footer__links-title'>Resources</p>

                                <Link className='footer__link' to='/faq' onClick={scrollTop}>F.A.Q</Link>
                                <Link className='footer__link' to='/guide' onClick={scrollTop}>Guide</Link>
                                {/* <Link className='footer__link' to='/docs' onClick={scrollTop}>Docs</Link>
                                <Link className='footer__link' to='/how-to-use' onClick={scrollTop}>How to use</Link> */}
                            </div>
                            <div className='footer__links-column'>
                                <p className='footer__links-title'>Company</p>
                                <Link className='footer__link' to='/about' onClick={scrollTop}>About</Link>
                                {/* <Link className='footer__link' to='/careers' onClick={scrollTop}>Careers</Link> */}
                            </div>
                        </div>
                        <div className='footer__links_mobile'>
                            <div className='footer__links-box'>
                                <div className='footer__links-column'>
                                    <p className='footer__links-title'>Marketplace</p>
                                    <Link className='footer__link' to='/explore-collections/collectables' onClick={scrollTop}>Explore</Link>
                                    <Link className='footer__link' to='/calendar' onClick={scrollTop}>Calendar</Link>
                                    <Link className='footer__link' to='/earn/referral/' onClick={scrollTop}>Referral</Link>
                                    <Link className='footer__link footer__link_disabled' to='/' onClick={scrollTop}>Launch</Link>
                                    <Link className='footer__link footer__link_disabled' to='/' onClick={scrollTop}>Meta Gallery</Link>
                                </div>
                                {currentUser && currentUser !== undefined ?
                                    <div className='footer__links-column'>
                                        <p className='footer__links-title'>Account</p>
                                        <Link className='footer__link' to={`/profile/${currentUser.customURL ? currentUser.customURL : currentUser.user_id}/on-sale`} onClick={scrollTop}>Profile</Link>
                                        <Link className='footer__link' to={`/profile/${currentUser.customURL ? currentUser.customURL : currentUser.user_id}/collections`} onClick={scrollTop}>My collections</Link>
                                        <Link className='footer__link' to='/edit-profile' onClick={scrollTop}>Edit profile</Link>
                                    </div>
                                    : <></>}

                            </div>
                            <div className='footer__links-box'>
                                <div className='footer__links-column'>
                                    <p className='footer__links-title'>Resources</p>

                                    <Link className='footer__link' to='/faq' onClick={scrollTop}>F.A.Q</Link>
                                    <Link className='footer__link' to='/guide' onClick={scrollTop}>Guide</Link>
                                    {/* <Link className='footer__link' to='/docs' onClick={scrollTop}>Docs</Link>
                                    <Link className='footer__link' to='/how-to-use' onClick={scrollTop}>How to use</Link> */}
                                </div>
                                <div className='footer__links-column'>
                                    <p className='footer__links-title'>Company</p>
                                    <Link className='footer__link' to='/about' onClick={scrollTop}>About</Link>
                                    {/* <Link className='footer__link' to='/careers' onClick={scrollTop}>Careers</Link> */}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import moment from 'moment-timezone';

import './Releases.css';
import Preloader from '../../Preloader/Preloader';
import { ImageOnLoad } from '../../../assets/ImageOnLoad';
import { API_LINK } from '../../../assets/utilis';



function Releases({ releases, usdExchangeRate }) {
    const [page, setPage] = useState(0);

    const [isPreloaderVisible, setPreloaderVisible] = useState(false);
    const [timerValue, setTimerValue] = useState(0);

    const [timeLeftValue, setTimeLeftValue] = useState({
        days: Math.floor((releases[page].timestamp - moment().format('X')) / (3600 * 24)),
        hours: Math.floor((releases[page].timestamp - moment().format('X')) % (3600 * 24) / 3600),
        minutes: Math.floor((releases[page].timestamp - moment().format('X')) % 3600 / 60),
        seconds: Math.floor((releases[page].timestamp - moment().format('X')) % 60),
    });

    useEffect(() => {

        const timer = setInterval(() => {
            let seconds = releases[page].timestamp - moment().format('X')

            setTimerValue(timerValue + 1)
            setTimeLeftValue({
                days: Math.floor(seconds / (3600 * 24)),
                hours: Math.floor(seconds % (3600 * 24) / 3600),
                minutes: Math.floor(seconds % 3600 / 60),
                seconds: Math.floor(seconds % 60),
            })
            clearInterval(timer)
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerValue, page])

    // useEffect(() => {
    //     console.log(timeLeftValue)

    // }, [timeLeftValue])

    function handleNextPage() {
        if (page + 1 < releases.length) {
            setPreloaderVisible(true)
            setTimeout(() => {
                setPreloaderVisible(false)
            }, 600);
            // let seconds = releases[page + 1].timestamp - moment().format('X')
            // setTimeLeftValue({
            //     days: Math.floor(seconds / (3600 * 24)),
            //     hours: Math.floor(seconds % (3600 * 24) / 3600),
            //     minutes: Math.floor(seconds % 3600 / 60),
            //     seconds: Math.floor(seconds % 60),
            // })
            setPage(page + 1)
        }
    }

    function handlePrevPage() {
        if (page > 0) {
            setPreloaderVisible(true)
            setTimeout(() => {
                setPreloaderVisible(false)
            }, 600);
            // let seconds = releases[page - 1].timestamp - moment().format('X')
            // setTimeLeftValue({
            //     days: Math.floor(seconds / (3600 * 24)),
            //     hours: Math.floor(seconds % (3600 * 24) / 3600),
            //     minutes: Math.floor(seconds % 3600 / 60),
            //     seconds: Math.floor(seconds % 60),
            // })
            setPage(page - 1)
        }
    }

    return (
        <>
            {releases && releases.length > 0 ?
                <section className='releases'>
                    <div className='releases__btns'>
                        {releases.length > 1 ? <div className='releases__selection-btns'>
                            <div className={`releases__selection-btn ${page > 0 ? '' : 'releases__selection-btn_inactive'}`} onClick={handlePrevPage}>
                                <svg className='releases__selection-btn-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='releases__selection-btn-icon-stroke' d="M9.33203 4.00049L6.19627 7.13625C5.71896 7.61355 5.71897 8.38742 6.19627 8.86473L9.33203 12.0005" stroke="white" strokeWidth="2.44444" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className={`releases__selection-btn ${page + 1 < releases.length ? '' : 'releases__selection-btn_inactive'}`} onClick={handleNextPage}>
                                <svg className='releases__selection-btn-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='releases__selection-btn-icon-stroke' d="M6.66797 11.9995L9.80373 8.86375C10.281 8.38645 10.281 7.61258 9.80373 7.13527L6.66797 3.99951" stroke="white" strokeWidth="2.44444" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div> : <></>}
                        <Link className='releases__link' to='/calendar'>
                            <p className='releases__link-text'>Full Calendar</p>
                        </Link>
                    </div>
                    <div className='releases__card'>
                        <div className='releases__card-first-container'>
                            <div className='releases__card-image-container releases__card-image-container_pc'>
                                {!isPreloaderVisible ?
                                    <ImageOnLoad className='releases__card-image' src={`${API_LINK}/calendar/get_file/${releases[page] && releases[page].avatar_url && releases[page].avatar_url.size6 && releases[page].avatar_url.size6}`} alt={''} keyValue={releases[page] && releases[page].avatar_url && releases[page].avatar_url.size6 && releases[page].avatar_url.size6} />

                                    : <></>}

                            </div>

                            {!isPreloaderVisible ?
                                <div className='releases__card-image-container releases__card-image-container_mobile'>
                                    <ImageOnLoad className='releases__card-image' src={`${API_LINK}/calendar/get_file/${releases[page] && releases[page].avatar_url && releases[page].avatar_url.size6 && releases[page].avatar_url.size6}`} alt={''} keyValue={releases[page] && releases[page].avatar_url && releases[page].avatar_url.size6 && releases[page].avatar_url.size6} />
                                </div> : <></>}
                            {!isPreloaderVisible ?
                                <>
                                    {releases[page] && releases[page].socials && (releases[page].socials.facebook || releases[page].socials.twitter || releases[page].socials.instagram || releases[page].socials.reddit || releases[page].socials.discord || releases[page].socials.telegram || releases[page].socials.medium || releases[page].socials.github || releases[page].socials.site) ?

                                        <div className='releases__card-socials'>
                                            {releases[page].socials.facebook ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.facebook}>
                                                    <svg className='releases__card-social-icon' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clipPath="url(#clip0_713_18162)">
                                                            <path className='releases__card-social-icon-fill' d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 23.9859 5.85094 30.6053 13.5 31.8056V20.625H9.4375V16H13.5V12.475C13.5 8.465 15.8888 6.25 19.5434 6.25C21.2934 6.25 23.125 6.5625 23.125 6.5625V10.5H21.1075C19.12 10.5 18.5 11.7334 18.5 13V16H22.9375L22.2281 20.625H18.5V31.8056C26.1491 30.6053 32 23.9859 32 16Z" fill="#E5E1E6" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_713_18162">
                                                                <rect className='releases__card-social-icon-fill' width="32" height="31.8056" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </a>
                                                : <></>}
                                            {releases[page].socials.twitter ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.twitter}>
                                                    <svg className='releases__card-social-icon' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='releases__card-social-icon-fill' d="M10.0669 29.001C22.1394 29.001 28.7444 18.9966 28.7444 10.3235C28.7444 10.0422 28.7381 9.75471 28.7256 9.47346C30.0105 8.54426 31.1193 7.39332 32 6.07471C30.8034 6.60711 29.5329 6.95482 28.2319 7.10596C29.6017 6.28485 30.6274 4.99494 31.1187 3.47533C29.8301 4.23905 28.4208 4.77779 26.9513 5.06846C25.9611 4.01639 24.652 3.3198 23.2262 3.08638C21.8005 2.85296 20.3376 3.09571 19.0637 3.77711C17.7897 4.4585 16.7757 5.54058 16.1785 6.85606C15.5812 8.17153 15.4339 9.64713 15.7594 11.0547C13.15 10.9238 10.5972 10.2459 8.26664 9.06511C5.93604 7.8843 3.87959 6.22689 2.23062 4.20033C1.39253 5.6453 1.13608 7.35517 1.51337 8.98243C1.89067 10.6097 2.87342 12.0322 4.26188 12.961C3.2195 12.9279 2.19997 12.6472 1.2875 12.1422V12.2235C1.28657 13.7398 1.8108 15.2098 2.77108 16.3833C3.73136 17.5569 5.06843 18.3617 6.555 18.661C5.58941 18.9251 4.57598 18.9636 3.59313 18.7735C4.01261 20.0776 4.82876 21.2182 5.92769 22.0361C7.02662 22.854 8.35349 23.3084 9.72313 23.336C7.3979 25.1625 4.52557 26.1531 1.56875 26.1485C1.04438 26.1477 0.520532 26.1155 0 26.0522C3.00381 27.9793 6.49804 29.0028 10.0669 29.001Z" fill="#E5E1E6" />
                                                    </svg>
                                                </a> : <></>}

                                            {releases[page].socials.instagram ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.instagram}>

                                                    <svg className='releases__card-social-icon' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clipPath="url(#clip0_713_18158)">
                                                            <path className='releases__card-social-icon-fill' d="M16 2.88125C20.275 2.88125 20.7813 2.9 22.4625 2.975C24.025 3.04375 24.8688 3.30625 25.4313 3.525C26.175 3.8125 26.7125 4.1625 27.2688 4.71875C27.8313 5.28125 28.175 5.8125 28.4625 6.55625C28.6813 7.11875 28.9438 7.96875 29.0125 9.525C29.0875 11.2125 29.1063 11.7188 29.1063 15.9875C29.1063 20.2625 29.0875 20.7688 29.0125 22.45C28.9438 24.0125 28.6813 24.8563 28.4625 25.4188C28.175 26.1625 27.825 26.7 27.2688 27.2563C26.7063 27.8188 26.175 28.1625 25.4313 28.45C24.8688 28.6688 24.0188 28.9313 22.4625 29C20.775 29.075 20.2688 29.0938 16 29.0938C11.725 29.0938 11.2188 29.075 9.5375 29C7.975 28.9313 7.13125 28.6688 6.56875 28.45C5.825 28.1625 5.2875 27.8125 4.73125 27.2563C4.16875 26.6938 3.825 26.1625 3.5375 25.4188C3.31875 24.8563 3.05625 24.0063 2.9875 22.45C2.9125 20.7625 2.89375 20.2563 2.89375 15.9875C2.89375 11.7125 2.9125 11.2063 2.9875 9.525C3.05625 7.9625 3.31875 7.11875 3.5375 6.55625C3.825 5.8125 4.175 5.275 4.73125 4.71875C5.29375 4.15625 5.825 3.8125 6.56875 3.525C7.13125 3.30625 7.98125 3.04375 9.5375 2.975C11.2188 2.9 11.725 2.88125 16 2.88125ZM16 0C11.6563 0 11.1125 0.01875 9.40625 0.09375C7.70625 0.16875 6.5375 0.44375 5.525 0.8375C4.46875 1.25 3.575 1.79375 2.6875 2.6875C1.79375 3.575 1.25 4.46875 0.8375 5.51875C0.44375 6.5375 0.16875 7.7 0.09375 9.4C0.01875 11.1125 0 11.6562 0 16C0 20.3438 0.01875 20.8875 0.09375 22.5938C0.16875 24.2938 0.44375 25.4625 0.8375 26.475C1.25 27.5313 1.79375 28.425 2.6875 29.3125C3.575 30.2 4.46875 30.75 5.51875 31.1562C6.5375 31.55 7.7 31.825 9.4 31.9C11.1063 31.975 11.65 31.9937 15.9938 31.9937C20.3375 31.9937 20.8813 31.975 22.5875 31.9C24.2875 31.825 25.4563 31.55 26.4688 31.1562C27.5188 30.75 28.4125 30.2 29.3 29.3125C30.1875 28.425 30.7375 27.5313 31.1438 26.4813C31.5375 25.4625 31.8125 24.3 31.8875 22.6C31.9625 20.8938 31.9813 20.35 31.9813 16.0063C31.9813 11.6625 31.9625 11.1188 31.8875 9.4125C31.8125 7.7125 31.5375 6.54375 31.1438 5.53125C30.75 4.46875 30.2063 3.575 29.3125 2.6875C28.425 1.8 27.5313 1.25 26.4813 0.84375C25.4625 0.45 24.3 0.175 22.6 0.1C20.8875 0.01875 20.3438 0 16 0Z" fill="#E5E1E6" />
                                                            <path className='releases__card-social-icon-fill' d="M16 7.78125C11.4625 7.78125 7.78125 11.4625 7.78125 16C7.78125 20.5375 11.4625 24.2188 16 24.2188C20.5375 24.2188 24.2188 20.5375 24.2188 16C24.2188 11.4625 20.5375 7.78125 16 7.78125ZM16 21.3312C13.0563 21.3312 10.6687 18.9438 10.6687 16C10.6687 13.0563 13.0563 10.6687 16 10.6687C18.9438 10.6687 21.3312 13.0563 21.3312 16C21.3312 18.9438 18.9438 21.3312 16 21.3312Z" fill="#E5E1E6" />
                                                            <path className='releases__card-social-icon-fill' d="M26.4625 7.45782C26.4625 8.52032 25.6 9.37657 24.5438 9.37657C23.4813 9.37657 22.625 8.51407 22.625 7.45782C22.625 6.39531 23.4875 5.53906 24.5438 5.53906C25.6 5.53906 26.4625 6.40156 26.4625 7.45782Z" fill="#E5E1E6" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_713_18158">
                                                                <rect className='releases__card-social-icon-fill' width="31.9813" height="31.9937" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>

                                                </a> : <></>}
                                            {releases[page].socials.reddit ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.reddit}>

                                                    <svg className='releases__card-social-icon' width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='releases__card-social-icon-fill' fillRule="evenodd" clipRule="evenodd" d="M32.9805 16C32.9805 24.8366 25.817 32 16.9805 32C8.14391 32 0.980469 24.8366 0.980469 16C0.980469 7.16344 8.14391 0 16.9805 0C25.817 0 32.9805 7.16344 32.9805 16ZM25.308 13.6608C26.5992 13.6608 27.6471 14.7087 27.6471 16C27.6471 16.9544 27.067 17.7777 26.2998 18.152C26.3372 18.3766 26.3559 18.6011 26.3559 18.8444C26.3559 22.4374 22.1828 25.338 17.0179 25.338C11.853 25.338 7.67989 22.4374 7.67989 18.8444C7.67989 18.6011 7.69861 18.3579 7.73603 18.1333C6.91264 17.759 6.35124 16.9544 6.35124 16C6.35124 14.7087 7.39919 13.6608 8.69042 13.6608C9.30796 13.6608 9.88808 13.9228 10.2998 14.3158C11.9091 13.1368 14.136 12.407 16.6249 12.3321L17.8039 6.75552C17.8413 6.64324 17.8974 6.54968 17.991 6.49354C18.0846 6.43739 18.1969 6.41868 18.3091 6.4374L22.1828 7.26079C22.4448 6.69938 23.0062 6.32511 23.6612 6.32511C24.5781 6.32511 25.3267 7.07365 25.3267 7.99061C25.3267 8.90757 24.5781 9.65611 23.6612 9.65611C22.7629 9.65611 22.0331 8.945 21.9957 8.06546L18.5337 7.33564L17.467 12.3321C19.8998 12.4257 22.108 13.1742 23.6986 14.3158C24.1103 13.9041 24.6717 13.6608 25.308 13.6608ZM13.3126 16C12.3957 16 11.6471 16.7485 11.6471 17.6655C11.6471 18.5824 12.3957 19.331 13.3126 19.331C14.2296 19.331 14.9781 18.5824 14.9781 17.6655C14.9781 16.7485 14.2296 16 13.3126 16ZM16.9992 23.2795C17.6354 23.2795 19.8062 23.2046 20.9477 22.0631C21.1161 21.8947 21.1161 21.6327 20.9852 21.4456C20.8167 21.2772 20.536 21.2772 20.3676 21.4456C19.6378 22.1567 18.122 22.4187 17.0179 22.4187C15.9138 22.4187 14.3793 22.1567 13.6682 21.4456C13.4998 21.2772 13.2191 21.2772 13.0507 21.4456C12.8822 21.614 12.8822 21.8947 13.0507 22.0631C14.1735 23.1859 16.3629 23.2795 16.9992 23.2795ZM18.9828 17.6655C18.9828 18.5824 19.7314 19.331 20.6483 19.331C21.5653 19.331 22.3138 18.5824 22.3138 17.6655C22.3138 16.7485 21.5653 16 20.6483 16C19.7314 16 18.9828 16.7485 18.9828 17.6655Z" fill="white" />
                                                    </svg>

                                                </a> : <></>}
                                            {releases[page].socials.discord ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.discord}>
                                                    <svg className='releases__card-social-icon' width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='releases__card-social-icon-fill' d="M27.0894 6.02188C25.0498 5.08604 22.8626 4.39655 20.5759 4.00166C20.5342 3.99404 20.4926 4.01308 20.4712 4.05117C20.1899 4.55146 19.8783 5.20413 19.6601 5.71712C17.2005 5.34889 14.7536 5.34889 12.3444 5.71712C12.1262 5.19272 11.8033 4.55146 11.5208 4.05117C11.4993 4.01435 11.4577 3.99531 11.4161 4.00166C9.13055 4.39529 6.94341 5.08478 4.90258 6.02188C4.88491 6.0295 4.86977 6.04221 4.85972 6.05871C0.711189 12.2565 -0.425267 18.302 0.13224 24.2725C0.134763 24.3017 0.15116 24.3297 0.173864 24.3474C2.91095 26.3575 5.56228 27.5778 8.16437 28.3866C8.20602 28.3993 8.25014 28.3841 8.27664 28.3498C8.89217 27.5092 9.44086 26.6229 9.9113 25.6908C9.93906 25.6363 9.91256 25.5715 9.85582 25.5499C8.98551 25.2198 8.1568 24.8172 7.35964 24.3601C7.29659 24.3233 7.29154 24.2331 7.34954 24.19C7.5173 24.0643 7.68509 23.9335 7.84527 23.8014C7.87425 23.7773 7.91464 23.7722 7.94871 23.7874C13.1857 26.1785 18.8554 26.1785 24.0306 23.7874C24.0647 23.7709 24.1051 23.776 24.1353 23.8001C24.2955 23.9322 24.4633 24.0643 24.6323 24.19C24.6903 24.2331 24.6865 24.3233 24.6235 24.3601C23.8263 24.8261 22.9976 25.2198 22.126 25.5486C22.0693 25.5702 22.044 25.6363 22.0718 25.6908C22.5523 26.6216 23.101 27.5079 23.7052 28.3485C23.7304 28.3841 23.7758 28.3993 23.8175 28.3866C26.4322 27.5778 29.0835 26.3575 31.8206 24.3474C31.8446 24.3297 31.8597 24.303 31.8622 24.2738C32.5294 17.3712 30.7447 11.3753 27.131 6.05997C27.1221 6.04221 27.107 6.0295 27.0894 6.02188ZM10.6934 20.6371C9.11666 20.6371 7.81751 19.1896 7.81751 17.4119C7.81751 15.6341 9.09147 14.1866 10.6934 14.1866C12.3078 14.1866 13.5944 15.6469 13.5692 17.4119C13.5692 19.1896 12.2952 20.6371 10.6934 20.6371ZM21.3263 20.6371C19.7497 20.6371 18.4505 19.1896 18.4505 17.4119C18.4505 15.6341 19.7244 14.1866 21.3263 14.1866C22.9408 14.1866 24.2274 15.6469 24.2022 17.4119C24.2022 19.1896 22.9408 20.6371 21.3263 20.6371Z" fill="white" />
                                                    </svg>

                                                </a> : <></>}
                                            {releases[page].socials.telegram ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.telegram}>

                                                    <svg className='releases__card-social-icon' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='releases__card-social-icon-fill' fillRule="evenodd" clipRule="evenodd" d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM16.5734 11.8117C15.0172 12.459 11.9069 13.7988 7.24254 15.8309C6.48513 16.1321 6.08836 16.4268 6.05224 16.7149C5.9912 17.2018 6.60097 17.3936 7.43132 17.6547C7.54427 17.6902 7.66129 17.727 7.78127 17.766C8.5982 18.0315 9.69712 18.3422 10.2684 18.3545C10.7866 18.3657 11.365 18.1521 12.0035 17.7136C16.3616 14.7718 18.6112 13.2849 18.7524 13.2529C18.8521 13.2302 18.9902 13.2018 19.0837 13.285C19.1773 13.3681 19.1681 13.5256 19.1582 13.5678C19.0977 13.8254 16.7042 16.0506 15.4655 17.2022C15.0794 17.5612 14.8055 17.8159 14.7495 17.874C14.624 18.0043 14.4962 18.1275 14.3733 18.246C13.6144 18.9776 13.0452 19.5263 14.4048 20.4222C15.0582 20.8528 15.581 21.2088 16.1026 21.564C16.6722 21.9519 17.2404 22.3388 17.9755 22.8207C18.1628 22.9435 18.3417 23.071 18.5159 23.1952C19.1788 23.6678 19.7744 24.0924 20.5101 24.0247C20.9377 23.9853 21.3793 23.5833 21.6036 22.3843C22.1336 19.5507 23.1755 13.4111 23.4163 10.8811C23.4374 10.6595 23.4109 10.3758 23.3896 10.2513C23.3682 10.1267 23.3237 9.94931 23.1618 9.81797C22.9701 9.66242 22.6742 9.62962 22.5418 9.63195C21.9401 9.64255 21.0168 9.96359 16.5734 11.8117Z" fill="white" />
                                                    </svg>

                                                </a> : <></>}
                                            {releases[page].socials.medium ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.medium}>
                                                    <svg className='releases__card-social-icon' width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='releases__card-social-icon-fill' d="M18.0499 16.1036C18.0499 21.1312 14.0093 25.2069 9.02511 25.2069C4.04097 25.2069 0 21.1303 0 16.1036C0 11.0769 4.04067 7 9.02511 7C14.0096 7 18.0499 11.076 18.0499 16.1036Z" fill="white" />
                                                        <path className='releases__card-social-icon-fill' d="M28.0759 15.5703C28.0759 20.3028 26.0556 24.1407 23.5633 24.1407C21.0711 24.1407 19.0508 20.3028 19.0508 15.5703C19.0508 10.8379 21.0708 7 23.563 7C26.0553 7 28.0756 10.8367 28.0756 15.5703" fill="white" />
                                                        <path className='releases__card-social-icon-fill' d="M32.2481 14.6777C32.2481 18.9168 31.5376 22.3553 30.661 22.3553C29.7844 22.3553 29.0742 18.9177 29.0742 14.6777C29.0742 10.4377 29.7847 7 30.661 7C31.5373 7 32.2481 10.4373 32.2481 14.6777Z" fill="white" />
                                                    </svg>


                                                </a> : <></>}
                                            {releases[page].socials.github ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.github}>
                                                    <svg className='releases__card-social-icon' width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='releases__card-social-icon-fill' fillRule="evenodd" clipRule="evenodd" d="M16.2443 0C12.446 0.00197076 8.77215 1.34728 5.8798 3.79536C2.98745 6.24345 1.06518 9.63468 0.456704 13.3627C-0.151774 17.0906 0.593213 20.9123 2.55847 24.1442C4.52373 27.3762 7.5811 29.8077 11.1839 31.004C11.9787 31.1515 12.2781 30.6589 12.2781 30.24C12.2781 29.8211 12.2622 28.6067 12.2569 27.279C7.80584 28.2405 6.86529 25.4006 6.86529 25.4006C6.13934 23.5566 5.09016 23.0719 5.09016 23.0719C3.63826 22.0866 5.1988 22.105 5.1988 22.105C6.80701 22.2183 7.65218 23.7463 7.65218 23.7463C9.07759 26.1778 11.3958 25.4744 12.3072 25.0634C12.4503 24.0334 12.8663 23.3327 13.3246 22.9349C9.76908 22.5344 6.03336 21.1698 6.03336 15.0739C6.01132 13.4929 6.60134 11.9641 7.68132 10.8036C7.51706 10.4031 6.96862 8.78564 7.83763 6.58857C7.83763 6.58857 9.18091 6.16181 12.2384 8.21925C14.8609 7.50617 17.6278 7.50617 20.2503 8.21925C23.3051 6.16181 24.6457 6.58857 24.6457 6.58857C25.5174 8.78037 24.969 10.3979 24.8047 10.8036C25.8881 11.9643 26.4793 13.4958 26.4553 15.0792C26.4553 21.1883 22.7116 22.5344 19.1508 22.927C19.723 23.4222 20.2344 24.389 20.2344 25.8748C20.2344 28.0034 20.2158 29.7158 20.2158 30.24C20.2158 30.6641 20.5046 31.1594 21.3154 31.004C24.9186 29.8075 27.9762 27.3756 29.9415 24.1431C31.9067 20.9106 32.6513 17.0884 32.0421 13.3601C31.4329 9.63174 29.5097 6.24047 26.6164 3.79281C23.7231 1.34514 20.0484 0.000721592 16.2496 0H16.2443Z" fill="white" />
                                                    </svg>
                                                </a> : <></>}
                                            {releases[page].socials.site ?
                                                <a className='releases__card-social' target="_blank" rel="noreferrer" href={releases[page].socials.site}>
                                                    <svg className='releases__card-social-icon' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='releases__card-social-icon-fill' d="M16 0C7.17687 0 0 7.17687 0 16C0 24.8231 7.17687 32 16 32C24.8231 32 32 24.8231 32 16C32 7.17687 24.8231 0 16 0ZM14.8571 2.5715V7.2383H11.3807C11.5471 6.80197 11.7164 6.37442 11.9045 5.9883C12.7844 4.18265 13.8276 3.05782 14.8567 2.5715H14.8571ZM17.1429 2.5715C18.1721 3.05752 19.2156 4.18238 20.0952 5.9883C20.2833 6.37441 20.4526 6.80197 20.6189 7.2383H17.1426V2.5715H17.1429ZM10.8334 3.29776C10.4808 3.82018 10.1513 4.38463 9.85708 4.98837C9.51827 5.68381 9.22065 6.43898 8.95224 7.2383H5.45231C6.88435 5.51531 8.7232 4.15367 10.8334 3.29776ZM21.1667 3.29776C23.2769 4.15367 25.1158 5.51531 26.5478 7.2383H23.0479C22.7798 6.43871 22.4819 5.68374 22.1431 4.98837C21.8489 4.38463 21.5197 3.8202 21.1667 3.29776ZM3.90483 9.52381H8.30959C7.9373 11.1753 7.70984 12.9727 7.64287 14.857H2.33328C2.49112 12.9379 3.0409 11.1354 3.90484 9.52381H3.90483ZM10.6666 9.52381H14.8572V14.857H9.92871C10.0039 12.9393 10.2667 11.1352 10.6669 9.52381H10.6666ZM17.1427 9.52381H21.3333C21.7335 11.1354 21.9961 12.9393 22.0716 14.857H17.1431V9.52381H17.1427ZM23.6903 9.52381H28.0951C28.9587 11.1354 29.5088 12.9382 29.6667 14.857H24.3571C24.2901 12.9725 24.0626 11.175 23.6904 9.52381H23.6903ZM2.3332 17.1429H7.64279C7.70922 19.0309 7.93642 20.824 8.30951 22.4761H3.90475C3.04298 20.8652 2.49053 19.0601 2.33318 17.1429H2.3332ZM9.92843 17.1429H14.8569V22.4761H10.6663C10.2672 20.8676 10.0028 19.0585 9.9281 17.1429H9.92843ZM17.1427 17.1429H22.0712C21.9966 19.0588 21.7324 20.8676 21.333 22.4761H17.1424V17.1429H17.1427ZM24.357 17.1429H29.6666C29.5096 19.0604 28.9571 20.8652 28.095 22.4761H23.6903C24.0634 20.8237 24.2906 19.0306 24.357 17.1429H24.357ZM5.44068 24.7619H8.95259C9.22071 25.5597 9.51886 26.305 9.85742 26.9999C10.155 27.6108 10.4877 28.1859 10.8454 28.7141C8.72592 27.8563 6.87639 26.4933 5.44068 24.7616V24.7619ZM11.3811 24.7619H14.8574V29.4403C13.8282 28.9509 12.7847 27.8056 11.9052 25.9999C11.717 25.6138 11.5478 25.1977 11.3814 24.7619H11.3811ZM17.1429 24.7619H20.6193C20.4529 25.1977 20.2836 25.6138 20.0955 25.9999C19.2156 27.8056 18.1724 28.9509 17.1433 29.4403V24.7619H17.1429ZM23.0478 24.7619H26.5597C25.1239 26.4937 23.2744 27.8566 21.155 28.7144C21.5126 28.1862 21.8453 27.6111 22.1429 27.0002C22.4815 26.3053 22.7796 25.5599 23.0478 24.7622V24.7619Z" fill="white" />
                                                    </svg>

                                                </a> : <></>}

                                        </div>

                                        : <></>}
                                </>

                                : <></>}

                        </div>
                        <div className='releases__card-texts-container'>
                            {isPreloaderVisible ?
                                <div className='releases__card-preloader'>
                                    <Preloader />
                                </div>

                                :

                                <>
                                    <div className='releases__card-stats'>
                                        <div className='releases__card-stat'>
                                            <p className='releases__card-stat-name'>Items</p>
                                            <div className='releases__card-stat-line'></div>
                                            <div className='releases__card-stat-value-container'>
                                                <p className='releases__card-stat-value'>{releases[page].items}</p>
                                            </div>

                                        </div>
                                        <div className='releases__card-stat'>
                                            <p className='releases__card-stat-name'>Price</p>
                                            <div className='releases__card-stat-line'></div>
                                            <div className='releases__card-stat-value-container'>
                                                <p className='releases__card-stat-value' title={releases[page].price}>{releases[page].price}</p>
                                                {/* <svg className='releases__card-stat-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className='releases__card-stat-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                                </svg>
                                                <p className='releases__card-stat-value releases__card-stat-value_dollar'>(${Number(Number(releases[page].price * usdExchangeRate).toFixed(0)).toLocaleString('us')})</p> */}
                                            </div>
                                        </div>
                                    </div>
                                    <p className='releases__card-name'>{releases[page].title}</p>
                                    <p className='releases__card-description'>{releases[page].description}</p>
                                    <div className='releases__card-date-btn'>
                                        {timeLeftValue.days > 0 || timeLeftValue.minutes > 0 || timeLeftValue.seconds > 0 ?
                                            <p className='releases__card-date-btn-text'>Sale start in {timeLeftValue.days > 0 ? `${timeLeftValue.days} days, ` : ''}{timeLeftValue.days > 0 || timeLeftValue.hours > 0 ? `${timeLeftValue.hours} hours, ` : ''}{timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 ? `${timeLeftValue.minutes} minutes, ` : ''}{timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 || timeLeftValue.seconds > 0 ? `${timeLeftValue.seconds} seconds` : ''}</p>
                                            :
                                            <p className='releases__card-date-btn-text'>Already minted</p>
                                        }

                                        {/* <p className='releases__card-date-btn-text'>{timeLeftValue.days} {timeLeftValue.hours} {timeLeftValue.minutes} {timeLeftValue.seconds}</p> */}
                                    </div>
                                </>}
                            {/* <Preloader /> */}

                        </div>
                    </div>

                </section>
                :
                <></>}
        </>

    );
}

export default Releases;
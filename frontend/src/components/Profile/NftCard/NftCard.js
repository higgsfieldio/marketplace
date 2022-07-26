
import moment from 'moment-timezone';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOnLoad } from '../../../assets/ImageOnLoad';
import { API_LINK } from '../../../assets/utilis';
import './NftCard.css';


function NftCard({ item, user, toggleLike, loggedIn, currentUser, isCreatingPage, creatingPrice, setLoginPopupOpened, isCreate = false, isExplictAccept, setExplictAccept, isCreateExplictSelected = false, usdExchangeRate }) {

    const [timerValue, setTimerValue] = useState(0);



    const [timeLeftValue, setTimeLeftValue] = useState(item.auction && item.auction.end_date ? {
        days: Math.floor((item.auction.end_date - moment().format('X')) / (3600 * 24)),
        hours: Math.floor((item.auction.end_date - moment().format('X')) % (3600 * 24) / 3600),
        minutes: Math.floor((item.auction.end_date - moment().format('X')) % 3600 / 60),
        seconds: Math.floor((item.auction.end_date - moment().format('X')) % 60),
    } : {});

    useEffect(() => {
        if (item.auction && item.auction.end_date) {
            const timer = setInterval(() => {
                let seconds = item.auction.end_date - moment().format('X')

                setTimerValue(timerValue + 1)
                setTimeLeftValue({
                    days: Math.floor(seconds / (3600 * 24)),
                    hours: Math.floor(seconds % (3600 * 24) / 3600),
                    minutes: Math.floor(seconds % 3600 / 60),
                    seconds: Math.floor(seconds % 60),
                })
                clearInterval(timer)
            }, 500);
        }




    }, [item, timerValue])

    function scrollTop() {
        window.scrollTo(0, 0);
    }



    const [isLiked, setLiked] = useState(0)

    useEffect(() => {

        if (currentUser) {
            setLiked(currentUser ? currentUser.liked && item && currentUser.liked.filter((itm) => {
                if (itm.token_id === item.token_id) return true
                else return false
            }).length > 0 : false)
        }

    }, [currentUser, item])


    const [priceValue, setPriceValue] = useState(0)
    useEffect(() => {

        if (item && item.price) {
            let amount = formatNearAmount(item.price)
            console.log(amount)
            if (`${amount}`.split(',').length > 0) {
                setPriceValue(Number(`${amount}`.split(',').join('')).toFixed(4))
            } else {
                setPriceValue(Number(amount).toFixed(4))
            }
        }




    }, [item])


    // useEffect(() => {
    //     if(currentUser){
    //         setLiked(currentUser ? currentUser.liked && currentUser.liked.filter((itm) => {
    //             if (itm.token_id === item.token_id) return true
    //             else return false
    //         }).length > 0 : false)
    //     }
    // }, [currentUser])

    // useEffect(() => {
    //     console.log(item.token_id, isLiked)
    // }, [isLiked])


    const [likesValue, setLikesValie] = useState(item.likes)
    function handleToggleLike() {
        if (!isCreate) {
            if (loggedIn) {
                if (isLiked) {
                    setLikesValie(likesValue - 1)
                    setLiked(!isLiked)
                } else {
                    setLiked(!isLiked)
                    setLikesValie(likesValue + 1)
                }

                toggleLike({ token_id: item.token_id })
            } else {
                setLoginPopupOpened(true)
            }
        }

    }
    // const [offsetX, setoffsetX] = useState('')
    // const [offsetY, setoffsetY] = useState('')
    // const [friction, setfriction] = useState(1/ 42)
    // const card = useRef(null)
    // const _mouseMove = (e) => {
    //     if (card && card.current) {
    //         console.log(e)
    //         console.log(card)

    //         let followX = (window.innerWidth / 2 - e.clientX);
    //         let followY = (window.innerHeight / 2 - e.clientY);

    //         let x = 0,
    //             y = 0;
    //         x += ((-followX - x) * friction);
    //         y += (followY - y) * friction;
    //         setoffsetY(y)
    //         setoffsetX(x)
    //     }

    // };

    // function onMouseLeave(){
    //     setoffsetY(0)
    //     setoffsetX(0)
    // }

    // useEffect(() => {
    //     document.addEventListener('mousemove', _mouseMove);
    //     return () => {
    //         document.removeEventListener('mousemove', _mouseMove);
    //     }
    // }, [])




    // render() {
    //     let offset = {
    //         transform: `translate(-50%, -50%) perspective(600px)
    //                 rotateY(${this.state.offsetX}deg)
    //                 rotateX(${this.state.offsetY}deg)`
    //     }

    // style={{
    //     transform: `perspective(1000px)
    //                        rotateY(${offsetX}deg)
    //                         rotateX(${offsetY}deg)`
    // }} ref={card} onMouseMove={_mouseMove} onMouseLeave={onMouseLeave}


    function handleExplictAccept() {
        localStorage.setItem('explictAccept', 'yes')
        setExplictAccept(true)
    }

    const [isOpenExplicedCreateClicked, setOpenExplicedCreateClicked] = useState(false)

    useEffect(() => {
        if (isCreateExplictSelected) {
            setOpenExplicedCreateClicked(false)
        }
    }, [isCreateExplictSelected])
    return (
        <div className='nft-card' >
            <div className='nft-card__owner'>
                {user || item.owner ?
                    <Link className='nft-card__owner-link' title={user ? user.user_name ? user.user_name : `@${user.user_id}` : item.owner ? item.owner.user_name ? item.owner.user_name : `@${item.owner.user_id}` : ''} to={`/profile/${user ? user.customURL ? user.customURL : user && user.user_id : item && item.owner && item.owner.user_id}/on-sale`} onClick={() => {
                        scrollTop()
                    }}>
                        <div className='nft-card__owner-avatar'>
                            {(item.owner && item.owner.avatar_url) || (user && user.avatar_url) ?
                                <img className='nft-card__owner-avatar-img' src={user ? `${API_LINK}/users/get_file/${user.avatar_url.size3}` : item.owner && `${API_LINK}/users/get_file/${item.owner.avatar_url}`} key={user ? `${API_LINK}/users/get_file/${user.avatar_url.size2}` : item.owner && `${API_LINK}/users/get_file/${item.owner.avatar_url}`} alt='avatar' />
                                :

                                <svg className='nft-card__owner-avatar-placeholder' width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='nft-card__owner-avatar-placeholder-fill' fillRule="evenodd" clipRule="evenodd" d="M10.2756 0.701852L7.77208 3.91143L9.68152 6.36149C9.96157 6.72083 9.88519 7.23534 9.51179 7.50485C9.13839 7.77436 8.60375 7.70902 8.32369 7.34151C7.43262 6.19815 6.36334 4.83429 5.69291 3.96043C5.35346 3.52759 4.67455 3.52759 4.33509 3.96043L0.940532 8.31337C0.524699 8.86055 0.92356 9.62824 1.61944 9.62824H16.895C17.5908 9.62824 17.9897 8.86055 17.5739 8.32154L11.6334 0.701852C11.2939 0.260841 10.615 0.260841 10.2756 0.701852Z" fill="#1D1D1D" />
                                </svg>}
                            {(item.owner && item.owner.verified) || (user && user.verified) ?
                                <div className='nft-card__owner-avatar-verified' title="Verified Creator">
                                    <svg className='nft-card__owner-avatar-verified-icon' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='nft-card__owner-avatar-verified-icon-fill' d="M4.20536 7.46349C4.14062 7.52857 4.05236 7.56492 3.96063 7.56492C3.86889 7.56492 3.78063 7.52857 3.71589 7.46349L1.76151 5.50876C1.55866 5.30592 1.55866 4.97707 1.76151 4.77457L2.00624 4.52984C2.20909 4.32699 2.53759 4.32699 2.74043 4.52984L3.96063 5.75003L7.25774 2.45292C7.46059 2.25007 7.78943 2.25007 7.99193 2.45292L8.23666 2.69765C8.43951 2.90049 8.43951 3.22934 8.23666 3.43184L4.20536 7.46349Z" fill="white" />
                                    </svg>

                                </div> : <></>}

                        </div>
                        <div className='nft-card__owner-texts'>
                            <p className='nft-card__owner-title'>Owned By</p>
                            <p className='nft-card__owner-name'>{user ? user.user_name ? user.user_name : `@${user.user_id}` : item.owner ? item.owner.user_name ? item.owner.user_name : `@${item.owner.user_id}` : ''}</p>
                        </div>
                    </Link>
                    :
                    <div className='nft-card__owner-link' >
                        <div className='nft-card__owner-avatar nft-card__owner-avatar_noowner'>
                            {/* {(item.owner && item.owner.avatar_url) || (user && user.avatar_url) ?
                                <img className='nft-card__owner-avatar-img' src={user ? `${API_LINK}/users/get_file/${user.avatar_url.size2}` : item.owner && `${API_LINK}/users/get_file/${item.owner.avatar_url}`} key={user ? `${API_LINK}/users/get_file/${user.avatar_url.size2}` : item.owner && `${API_LINK}/users/get_file/${item.owner.avatar_url}`} alt='avatar' />
                                :

                                <svg className='nft-card__owner-avatar-placeholder' width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='nft-card__owner-avatar-placeholder-fill' fillRule="evenodd" clipRule="evenodd" d="M10.2756 0.701852L7.77208 3.91143L9.68152 6.36149C9.96157 6.72083 9.88519 7.23534 9.51179 7.50485C9.13839 7.77436 8.60375 7.70902 8.32369 7.34151C7.43262 6.19815 6.36334 4.83429 5.69291 3.96043C5.35346 3.52759 4.67455 3.52759 4.33509 3.96043L0.940532 8.31337C0.524699 8.86055 0.92356 9.62824 1.61944 9.62824H16.895C17.5908 9.62824 17.9897 8.86055 17.5739 8.32154L11.6334 0.701852C11.2939 0.260841 10.615 0.260841 10.2756 0.701852Z" fill="#1D1D1D" />
                                </svg>} */}


                        </div>
                        {/* <div className='nft-card__owner-texts'>
                            <p className='nft-card__owner-title'>Owned By</p>
                            <p className='nft-card__owner-name'>Unknown user</p>
                        </div> */}
                    </div>
                }
                {isCreate ? <></> :
                    <div className={`nft-card__item-likes `} onClick={() => {

                        handleToggleLike()


                    }}>

                        <svg className='nft-card__item-likes-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* <path className='nft-card__item-likes-icon-fill' d="M14.7145 2.64476C12.9744 0.905106 10.1436 0.905106 8.40393 2.64476L7.99986 3.0486L7.59603 2.64476C5.85637 0.90487 3.02531 0.90487 1.28565 2.64476C-0.418689 4.3491 -0.429756 7.05066 1.25998 8.92901C2.80114 10.6416 7.34643 14.3415 7.53928 14.4981C7.6702 14.6046 7.82773 14.6564 7.98432 14.6564C7.9895 14.6564 7.99468 14.6564 7.99963 14.6561C8.16163 14.6637 8.32481 14.6081 8.45997 14.4981C8.65282 14.3415 13.1986 10.6416 14.7402 8.92877C16.4297 7.05066 16.4186 4.3491 14.7145 2.64476ZM13.69 7.98383C12.4884 9.31871 9.18546 12.0718 7.99963 13.0488C6.8138 12.0721 3.51155 9.31918 2.31018 7.98406C1.13142 6.6739 1.12035 4.80803 2.28452 3.64387C2.87908 3.04954 3.6599 2.75214 4.44072 2.75214C5.22154 2.75214 6.00236 3.0493 6.59693 3.64387L7.48512 4.53206C7.59085 4.63779 7.72412 4.70089 7.86399 4.72303C8.09099 4.77177 8.33729 4.70843 8.51389 4.5323L9.40256 3.64387C10.5919 2.45497 12.5266 2.45521 13.7152 3.64387C14.8794 4.80803 14.8683 6.6739 13.69 7.98383Z" fill="white" /> */}
                            <path className={`nft-card__item-likes-icon-fill ${isLiked ? 'nft-card__item-likes-icon-fill_liked' : ''}`} d="M13.69 7.98383C12.4884 9.31871 9.18546 12.0718 7.99963 13.0488C6.8138 12.0721 3.51155 9.31918 2.31018 7.98406C1.13142 6.6739 1.12035 4.80803 2.28452 3.64387C2.87908 3.04954 3.6599 2.75214 4.44072 2.75214C5.22154 2.75214 6.00236 3.0493 6.59693 3.64387L7.48512 4.53206C7.59085 4.63779 7.72412 4.70089 7.86399 4.72303C8.09099 4.77177 8.33729 4.70843 8.51389 4.5323L9.40256 3.64387C10.5919 2.45497 12.5266 2.45521 13.7152 3.64387C14.8794 4.80803 14.8683 6.6739 13.69 7.98383Z" fill="white" />
                        </svg>


                        <p className='nft-card__item-likes-count'>{likesValue ? likesValue > 9999 ? '+9999' : likesValue : '0'}</p>
                    </div>}

            </div>
            {isCreate ?
                <div className='nft-card__item-preview'>
                    {isCreateExplictSelected && !isOpenExplicedCreateClicked ?
                        <div className='nft-card__explict-warning'>
                            <p className='nft-card__explict-warning-text'>Explicit content</p>
                            <div className='nft-card__explict-warning-btn' onClick={() => { setOpenExplicedCreateClicked(true) }}>
                                <p className='nft-card__explict-warning-btn-text'>Show</p>
                            </div>
                        </div> : <></>}
                    {item.auction && item.auction.end_date ?
                        <div className='nft-card__auction'>
                            <svg className='nft-card__auction-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1203_14522)">
                                    <path className='nft-card__auction-icon-fill' d="M9.49999 0C6.09022 1.96464 6.49999 7.5 6.49999 7.5C6.49999 7.5 5 6.99999 5 4.75001C3.21041 5.78772 2 7.78228 2 10C2 13.3137 4.68629 16 8.00001 16C11.3137 16 14 13.3137 14 10C14 5.12501 9.49999 4.12499 9.49999 0V0ZM8.52704 13.9326C7.32136 14.2332 6.10022 13.4995 5.79955 12.2937C5.49895 11.0881 6.23265 9.86685 7.4384 9.56625C10.3493 8.84049 10.7141 7.20357 10.7141 7.20357C10.7141 7.20357 12.1657 13.0254 8.52704 13.9326Z" fill="#5142FC" />
                                </g>
                            </svg>
                            <p className='nft-card__auction-timer'>{`${timeLeftValue.days > 0 ? `${timeLeftValue.days}   ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 ? `${('0' + timeLeftValue.hours).slice(-2)} : ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 ? `${('0' + timeLeftValue.minutes).slice(-2)} : ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 || timeLeftValue.seconds > 0 ? `${('0' + timeLeftValue.seconds).slice(-2)}` : ''}`}</p>
                        </div>
                        : <></>}

                    {item.fileType && item.fileType === 'video' ?
                        <video className='nft-card__item-preview-img' src={item.preview_url} keyValue={`${item.preview_url}`} alt='item preview' autoPlay loop muted controls={false}></video>
                        :
                        <ImageOnLoad className='nft-card__item-preview-img' src={item.preview_url} keyValue={`${item.preview_url}`} alt='item preview'></ImageOnLoad>
                    }

                </div>
                :
                <>
                    {!isExplictAccept && item.explicitContent ?
                        <div className='nft-card__item-preview'>
                            <div className='nft-card__explict-warning'>
                                <p className='nft-card__explict-warning-text'>Explicit content</p>
                                <div className='nft-card__explict-warning-btn' onClick={handleExplictAccept}>
                                    <p className='nft-card__explict-warning-btn-text'>Show</p>
                                </div>
                            </div>
                            {item.auction && item.auction.end_date ?
                                <div className='nft-card__auction'>
                                    <svg className='nft-card__auction-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1203_14522)">
                                            <path className='nft-card__auction-icon-fill' d="M9.49999 0C6.09022 1.96464 6.49999 7.5 6.49999 7.5C6.49999 7.5 5 6.99999 5 4.75001C3.21041 5.78772 2 7.78228 2 10C2 13.3137 4.68629 16 8.00001 16C11.3137 16 14 13.3137 14 10C14 5.12501 9.49999 4.12499 9.49999 0V0ZM8.52704 13.9326C7.32136 14.2332 6.10022 13.4995 5.79955 12.2937C5.49895 11.0881 6.23265 9.86685 7.4384 9.56625C10.3493 8.84049 10.7141 7.20357 10.7141 7.20357C10.7141 7.20357 12.1657 13.0254 8.52704 13.9326Z" fill="#5142FC" />
                                        </g>
                                    </svg>
                                    <p className='nft-card__auction-timer'>{`${timeLeftValue.days > 0 ? `${timeLeftValue.days}   ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 ? `${('0' + timeLeftValue.hours).slice(-2)} : ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 ? `${('0' + timeLeftValue.minutes).slice(-2)} : ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 || timeLeftValue.seconds > 0 ? `${('0' + timeLeftValue.seconds).slice(-2)}` : ''}`}</p>
                                </div>
                                : <></>}

                            <ImageOnLoad className='nft-card__item-preview-img' src={item.preview_url} keyValue={`${item.preview_url}`} alt='item preview'></ImageOnLoad>
                        </div>
                        :
                        <Link className='nft-card__item-preview' to={`/item/${item && item.token_id}/sale-history`}>

                            {item.auction && item.auction.end_date ?
                                <div className='nft-card__auction'>
                                    <svg className='nft-card__auction-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_1203_14522)">
                                            <path className='nft-card__auction-icon-fill' d="M9.49999 0C6.09022 1.96464 6.49999 7.5 6.49999 7.5C6.49999 7.5 5 6.99999 5 4.75001C3.21041 5.78772 2 7.78228 2 10C2 13.3137 4.68629 16 8.00001 16C11.3137 16 14 13.3137 14 10C14 5.12501 9.49999 4.12499 9.49999 0V0ZM8.52704 13.9326C7.32136 14.2332 6.10022 13.4995 5.79955 12.2937C5.49895 11.0881 6.23265 9.86685 7.4384 9.56625C10.3493 8.84049 10.7141 7.20357 10.7141 7.20357C10.7141 7.20357 12.1657 13.0254 8.52704 13.9326Z" fill="#5142FC" />
                                        </g>
                                    </svg>
                                    <p className='nft-card__auction-timer'>{`${timeLeftValue.days > 0 ? `${timeLeftValue.days}   ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 ? `${('0' + timeLeftValue.hours).slice(-2)} : ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 ? `${('0' + timeLeftValue.minutes).slice(-2)} : ` : ''}${timeLeftValue.days > 0 || timeLeftValue.hours > 0 || timeLeftValue.minutes > 0 || timeLeftValue.seconds > 0 ? `${('0' + timeLeftValue.seconds).slice(-2)}` : ''}`}</p>
                                </div>
                                : <></>}

                            <ImageOnLoad className='nft-card__item-preview-img' src={item.preview_url} keyValue={`${item.preview_url}`} alt='item preview'></ImageOnLoad>
                        </Link>
                    }
                </>

            }
            {isCreate ?
                <div className='nft-card__link'>


                    <p className='nft-card__name'>{item.name}</p>
                    <div className='nft-card__prices'>

                        {item.price ?
                            <div className='nft-card__price'>
                                <p className='nft-card__price-title'>Price</p>
                                <div className='nft-card__price-value'>
                                    <p className='nft-card__price-value-text'>{parseFloat(priceValue)}</p>
                                    <svg className='nft-card__price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='nft-card__price-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            : item.isCreatingPage ?
                                <div className='nft-card__price'>
                                    <p className='nft-card__price-title'>Price</p>
                                    <div className='nft-card__price-value'>
                                        <p className='nft-card__price-value-text'>{item.creatingPrice}</p>
                                        <svg className='nft-card__price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='nft-card__price-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                        </svg>
                                    </div>

                                </div>
                                :
                                <div className='nft-card__price'>
                                    <p className='nft-card__price-title'>Price</p>
                                    <div className='nft-card__price-value'>
                                        <p className='nft-card__price-value-text'>Token is not on sale</p>
                                    </div>
                                </div>}

                        {item.highest_bid ?
                            <div className='nft-card__price'>
                                <p className='nft-card__price-title'>Highest bid</p>
                                <div className='nft-card__price-value'>
                                    <p className='nft-card__price-value-text'>{item.highest_bid.toLocaleString('us')}</p>
                                    <svg className='nft-card__price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='nft-card__price-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            : <></>}

                    </div>

                    {item.rank ? <p className='nft-card__rank'>Rank: {item.rank}</p> : <></>}
                </div>
                :
                <Link className='nft-card__link' to={`/item/${item && item.token_id}/sale-history`}>


                    <p className='nft-card__name'>{item.name}</p>
                    <div className='nft-card__prices'>

                        {item.price ?
                            <div className='nft-card__price' title={`$${parseFloat(Number(parseFloat(priceValue) * usdExchangeRate).toFixed(2)).toLocaleString('us')}`}>
                                <p className='nft-card__price-title'>Price</p>
                                <div className='nft-card__price-value'>
                                    <p className='nft-card__price-value-text'>{parseFloat(priceValue)}</p>
                                    <svg className='nft-card__price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='nft-card__price-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            : item.isCreatingPage ?
                                <div className='nft-card__price'>
                                    <p className='nft-card__price-title'>Price</p>
                                    <div className='nft-card__price-value'>
                                        <p className='nft-card__price-value-text'>{item.creatingPrice}</p>
                                    </div>
                                </div>
                                :
                                <div className='nft-card__price'>
                                    <p className='nft-card__price-title'>Price</p>
                                    <div className='nft-card__price-value'>
                                        <p className='nft-card__price-value-text'>Token is not on sale</p>
                                    </div>
                                </div>}

                        {item.highest_bid ?
                            <div className='nft-card__price'>
                                <p className='nft-card__price-title'>Highest bid</p>
                                <div className='nft-card__price-value'>
                                    <p className='nft-card__price-value-text'>{item.highest_bid.toLocaleString('us')}</p>
                                    <svg className='nft-card__price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='nft-card__price-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </div>
                            </div>
                            : <></>}

                    </div>

                    {item.rank ? <p className='nft-card__rank' title={item.score ? `Score ${parseFloat(Number(item.score.toFixed(2)))}` : ''}>Rank: {item.rank}</p> : <></>}
                </Link>
            }

        </div>
    );
}

export default NftCard;

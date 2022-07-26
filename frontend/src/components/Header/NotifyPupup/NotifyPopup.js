import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ImageOnLoad } from '../../../assets/ImageOnLoad';
import pythonApi from '../../../assets/pythonApi';
import './NotifyPopup.css';

import shibu from '../../../assets/images/not-found/shibu.gif'
import { API_LINK } from '../../../assets/utilis';

import notifyRefLvlicon from '../../../assets/images/notification/level-upgrade-icon.png'


function NotifyPopup({ notifyPopupOpened, notifications, setCurrentUser, setNotifyPopupOpened, currentUser }) {



    useEffect(() => {
        if (notifyPopupOpened && notifications && notifications.length > 0 && notifications.filter((item) => {
            if (item.viewed) return false
            else return true
        }).length > 0) {

            pythonApi.changeNotifyViewProps({
                notifications: notifications.filter((item) => {
                    if (item.viewed) return false
                    else return true
                }).map((item) => {
                    return { notification_id: item._id }
                })
            })
                .then((res) => {
                    console.log(res)
                    setTimeout(() => {
                        setCurrentUser(exampleState => ({
                            ...exampleState, notifications: exampleState.notifications.map((item) => {
                                item.viewed = true
                                return item
                            }), notifications_not_viewed: 0
                        }))
                    }, 400);
                })
                .catch((err) => {
                    console.log(err)
                })


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifyPopupOpened, notifications]);

    function handleClose() {
        setNotifyPopupOpened(false)
        window.scrollTo(0, 0);
        setTimeout(() => {
            var items = document.getElementById("notisications");
            items.scrollTo({ top: 0 });
        }, 300);

    }

    return (
        <div className={`notify-popup ${notifyPopupOpened ? 'notify-popup_active' : ''}`}>
            <svg className="notify-popup__close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => { setNotifyPopupOpened(false) }}>
                <path className="notify-popup__close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
            </svg>
            <p className="notify-popup__title">Notifications</p>
            <Link className="notify-popup__see-all-link" to={`/profile/${currentUser && currentUser.user_id}/activity`} onClick={handleClose}>See all</Link>
            <div className="notify-popup__items" id='notisications'>
                {notifications && notifications.length > 0 ? notifications.map((item, i) => (
                    <div className={`notify-popup__item ${item.viewed ? '' : 'notify-popup__item_not-seen'}`} key={`notify-popup__item${i}`}>
                        {item.type === 'new_referral_level' ?
                            <Link to={`/earn/referral/dashboard`} className="notify-popup__preview-link" onClick={handleClose}>
                                <ImageOnLoad className="notify-popup__preview" src={notifyRefLvlicon} alt='item preview' />
                            </Link>
                            :
                            <Link className="notify-popup__preview-link" to={`/item/${item.token.token_id}/sale-history`} onClick={handleClose}>
                                <ImageOnLoad className="notify-popup__preview" src={`${API_LINK}/tokens/get_file/${item.token.preview_url}`} alt='item preview' />
                            </Link>
                        }

                        {item.type === 'resolve_purchase' ?
                            <div className='notify-popup__data-act'>
                                <p className='notify-popup__data-act-text'>Sold</p>
                                <Link to={`/item/${item.token.token_id}/sale-history`} className='notify-popup__data-act-text-link' onClick={handleClose}>{item.token.name}</Link>
                                <p className='notify-popup__data-act-text'>for</p>
                                <span className='notify-popup__data-act-text-value'>{parseFloat(Number(`${formatNearAmount(item.price)}`.split(',').join('')).toFixed(4))}
                                    <svg className='notify-popup__data-act-text-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='notify-popup__data-act-text-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </span>
                                <p className='notify-popup__data-act-text'>to</p>
                                <Link to={`/profile/${item.buyer.user_id}/on-sale`} className='notify-popup__data-act-text-link' onClick={handleClose}>{item.buyer && item.buyer.user_name ? item.buyer.user_name : `@${item.buyer.user_id}`}</Link>
                            </div>
                            : <></>}

                        {item.type === 'nft_transfer' ?
                            <div className='notify-popup__data-act'>
                                <p className='notify-popup__data-act-text'>Transferred</p>
                                <Link to={`/item/${item.token.token_id}/sale-history`} className='notify-popup__data-act-text-link' onClick={handleClose}>{item.token.name}</Link>
                                <p className='notify-popup__data-act-text'>from</p>
                                <Link to={`/profile/${item.buyer.user_id}/on-sale`} className='notify-popup__data-act-text-link' onClick={handleClose}>{item.buyer && item.buyer.user_name ? item.buyer.user_name : `@${item.buyer.user_id}`}</Link>
                            </div>
                            : <></>}

                        {item.type === 'new_comment' ?
                            <div className='notify-popup__data-act'>
                                <p className='notify-popup__data-act-text'>New comment</p>
                                <Link to={`/item/${item.token.token_id}/sale-history`} className='notify-popup__data-act-text-link' onClick={handleClose}>{item.token.name}</Link>
                                <p className='notify-popup__data-act-text notify-popup__data-act-text_comment'>"{item.text}"</p>

                            </div>
                            : <></>}
                        {item.type === 'new_referral_level' ?
                            <div className='notify-popup__data-act'>
                                <p className='notify-popup__data-act-text'>Congrats! You have reached next referrals lvl! Now it is <Link to={`/earn/referral/dashboard`} className='notify-popup__data-act-text-link notify-popup__data-act-text-nowrap' onClick={handleClose} >"{item.level_name}&nbsp;-&nbsp;{item.new_level + 1}&nbsp;lvl"</Link></p>
                            </div>
                            : <></>}

                    </div>
                )) :
                    <div className='notify-popup__no-data'>
                        <img className='notify-popup__no-data-img' src={shibu} alt='' />
                        <p className='notify-popup__no-data-text'>There are no notifications</p>
                    </div>}

            </div>
        </div>
    );
}

export default NotifyPopup;
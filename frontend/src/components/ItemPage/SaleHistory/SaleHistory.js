import './SaleHistory.css';

import gomer from '../../../assets/images/gif/gomer.gif'
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import { useEffect, useState } from 'react';
import { API_LINK } from '../../../assets/utilis';




function SaleHistory({ sale_history, token_id, usdExchangeRate }) {
    var tz = moment.tz.guess();


    const [timerValue, setTimerValue] = useState(0);

   
    useEffect(() => {

        const timer = setInterval(() => {
            setTimerValue(timerValue + 10)
            clearInterval(timer)
        }, 10000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerValue])

    return (
        <div className='sale-history'>
            <div className={`sale-history__items ${sale_history && sale_history.length > 3 ? '' : 'sale-history__items_hide-scroll'}`} id='comments'>
                {sale_history && sale_history.length > 0 ?
                    sale_history.map((item, i) => (
                        <div className='sale-history__item' key={`sale-history${token_id}__item${i}`}>
                            <Link className='sale-history__item-avatar' to={`/profile/${item.owner.user_id}/on-sale`}>
                                <div className='sale-history__item-avatar-bg'>
                                    {item.owner.avatar_url ?

                                        <img className='sale-history__owner-avatar-img' src={item.owner.avatar_url ? `${API_LINK}/users/get_file/${item.owner.avatar_url}` : ''} alt='avatar' />
                                        :

                                        <svg className='sale-history__owner-avatar-placeholder' width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='sale-history__owner-avatar-placeholder-fill' fillRule="evenodd" clipRule="evenodd" d="M10.2756 0.701852L7.77208 3.91143L9.68152 6.36149C9.96157 6.72083 9.88519 7.23534 9.51179 7.50485C9.13839 7.77436 8.60375 7.70902 8.32369 7.34151C7.43262 6.19815 6.36334 4.83429 5.69291 3.96043C5.35346 3.52759 4.67455 3.52759 4.33509 3.96043L0.940532 8.31337C0.524699 8.86055 0.92356 9.62824 1.61944 9.62824H16.895C17.5908 9.62824 17.9897 8.86055 17.5739 8.32154L11.6334 0.701852C11.2939 0.260841 10.615 0.260841 10.2756 0.701852Z" fill="#1D1D1D" />
                                        </svg>
                                    }
                                </div>
                                {item.owner.verified ?
                                    <div className='sale-history__item-avatar-verified' title="Verified Creator">
                                        <svg className='sale-history__item-avatar-verified-icon' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='sale-history__item-avatar-verified-icon-fill' d="M4.20536 7.46349C4.14062 7.52857 4.05236 7.56492 3.96063 7.56492C3.86889 7.56492 3.78063 7.52857 3.71589 7.46349L1.76151 5.50876C1.55866 5.30592 1.55866 4.97707 1.76151 4.77457L2.00624 4.52984C2.20909 4.32699 2.53759 4.32699 2.74043 4.52984L3.96063 5.75003L7.25774 2.45292C7.46059 2.25007 7.78943 2.25007 7.99193 2.45292L8.23666 2.69765C8.43951 2.90049 8.43951 3.22934 8.23666 3.43184L4.20536 7.46349Z" fill="white" />
                                        </svg>

                                    </div> : <></>}
                            </Link>
                            <div className='sale-history__item-texts sale-history__item-texts_pc'>
                                <div className='sale-history__name-price'>
                                    <Link className='sale-history__name' to={`/profile/${item.owner.user_id}/on-sale`}>
                                        <p className='sale-history__name-value'>{item.owner.user_name ? item.owner.user_name : `@${item.owner.user_id}`}</p>
                                        <p className='sale-history__name-text'>sold item for</p>
                                    </Link>
                                    <div className='sale-history__price'>
                                        <p className='sale-history__price-value'>{item.price && parseFloat(Number(`${formatNearAmount(item.price)}`.split(',').join('')).toFixed(4))}</p>
                                        <svg className='sale-history__near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='sale-history__near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                        </svg>
                                        <p className='sale-history__price-value-dollar'>(${item.price && Number(Number(parseFloat(Number(`${formatNearAmount(item.price)}`.split(',').join('')).toFixed(4)) * usdExchangeRate).toFixed(0)).toLocaleString('us')})</p>
                                    </div>
                                </div>
                                <p className='sale-history__date'>{Number(moment().format('x')) - Number(moment.unix(item.timestamp).format('x')) > 43200000 ? moment.unix(item.timestamp).tz(tz).format('DD.MM.YYYY HH:mm') : moment.unix(item.timestamp).tz(tz).fromNow()}</p>
                            </div>
                            <div className='sale-history__item-texts sale-history__item-texts_mobile'>
                                <div className='sale-history__name-price'>
                                <Link className='sale-history__name' to={`/profile/${item.owner.user_id}/on-sale`}>
                                        <p className='sale-history__name-value'>{item.owner.user_name ? item.owner.user_name : `@${item.owner.user_id}`}</p>
                                        <p className='sale-history__name-text'>sold item for</p>
                                    </Link>
                                </div>
                                <div className='sale-history__price-date'>
                                    <div className='sale-history__price'>
                                        <p className='sale-history__price-value'>{item.price && parseFloat(Number(`${formatNearAmount(item.price)}`.split(',').join('')).toFixed(4))}</p>
                                        <svg className='sale-history__near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='sale-history__near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                        </svg>
                                        <p className='sale-history__price-value-dollar'>(${item.price && Number(Number(parseFloat(Number(`${formatNearAmount(item.price)}`.split(',').join('')).toFixed(4)) * usdExchangeRate).toFixed(0)).toLocaleString('us')})</p>
                                    </div>
                                    <p className='sale-history__date'>{Number(moment().format('x')) - Number(moment.unix(item.timestamp).format('x')) > 43200000 ? moment.unix(item.timestamp).tz(tz).format('DD.MM.YYYY HH:mm') : moment.unix(item.timestamp).tz(tz).fromNow()}</p>
                                </div>
                            </div>
                        </div>
                    )).reverse()

                    :
                    <div className='sale-history__no-item'>
                        <img className='sale-history__no-item-img' src={gomer} alt=''></img>
                        <p className='sale-history__no-item-text'>There have been no sales yet</p>
                    </div>
                }
            </div>

        </div>
    );
}

export default SaleHistory;


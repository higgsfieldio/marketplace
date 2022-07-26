import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import './ActivityCard.css';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

function ActivityCard({ card, user }) {
    var tz = moment.tz.guess();
    return (
        <div className='activity-card'>
            <Link className='activity-card__item-preview' to={`/item/${card.token.token_id}/sale-history`}>
                <img className='activity-card__item-preview-img' src={card.token.preview_url} alt={card.token.name} key={`${card.token.token_id}`} />
            </Link>
            <div className='activity-card__data'>
                <p className='activity-card__data-name'>{card.token.name}</p>
                <div className='activity-card__data-act'>
                    {card.type === 'resolve_purchase' ?
                        <>
                            {card.is_buyer ?
                                <>
                                    <p className='activity-card__data-act-text'>{card.is_buyer ? 'purchased by' : 'sold from'}</p>
                                    {card.buyer ? <Link onClick={() => { window.scrollTo(0, 0); }} to={`/profile/${card.buyer && card.buyer.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.buyer && card.buyer.user_name ? card.buyer.user_name : `@${card.buyer.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                                    <p className='activity-card__data-act-text'>for</p>
                                    <span className='activity-card__data-act-text-value'>{parseFloat(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4))}
                                        <svg className='activity-card__data-act-text-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='activity-card__data-act-text-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                        </svg>
                                    </span>
                                    <p className='activity-card__data-act-text'>from</p>
                                    {card.owner ? <Link to={`/profile/${card.owner.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.owner && card.owner.user_name ? card.owner.user_name : `@${card.owner.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                                </>
                                :
                                <>
                                    <p className='activity-card__data-act-text'>{card.is_buyer ? 'purchased by' : 'sold from'}</p>
                                    {card.owner ? <Link onClick={() => { window.scrollTo(0, 0); }} to={`/profile/${card.owner.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.owner && card.owner.user_name ? card.owner.user_name : `@${card.owner.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                                    <p className='activity-card__data-act-text'>for</p>
                                    <span className='activity-card__data-act-text-value'>{parseFloat(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4))}
                                        <svg className='activity-card__data-act-text-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='activity-card__data-act-text-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                        </svg>
                                    </span>
                                    <p className='activity-card__data-act-text'>to</p>
                                    {card.buyer ?  <Link to={`/profile/${card.buyer && card.buyer.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.buyer && card.buyer.user_name ? card.buyer.user_name : `@${card.buyer.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                                </>
                            }

                        </> : <></>}
                    {card.type === 'update_market_data' || card.type === 'add_market_data' ?
                        <>
                            <p className='activity-card__data-act-text'>{card.type === 'update_market_data' ? 'relisted by' : 'listed by'}</p>
                            {card.owner ? <Link onClick={() => { window.scrollTo(0, 0); }} to={`/profile/${card.owner && card.owner.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.owner && card.owner.user_name ? card.owner.user_name : `@${card.owner.user_id}`}</Link>  : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                            <p className='activity-card__data-act-text'>for</p>
                            <span className='activity-card__data-act-text-value'>{parseFloat(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4))}
                                <svg className='activity-card__data-act-text-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='activity-card__data-act-text-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                </svg>
                            </span>
                        </> : <></>}

                    {card.type === 'delete_market_data' ?
                        <>
                            <p className='activity-card__data-act-text'>revoked by</p>
                            {card.owner ? <Link onClick={() => { window.scrollTo(0, 0); }} to={`/profile/${card.owner && card.owner.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.owner && card.owner.user_name ? card.owner.user_name : `@${card.owner.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                            {/* <p className='activity-card__data-act-text'>for</p>
                            <span className='activity-card__data-act-text-value'>{parseFloat(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4))}
                                <svg className='activity-card__data-act-text-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='activity-card__data-act-text-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                </svg>
                            </span> */}
                        </> : <></>}
                    {card.type === 'nft_transfer' ?
                        <>
                            {card.is_buyer ?
                                <>
                                    <p className='activity-card__data-act-text'>{card.is_buyer ? 'was transfered to' : 'was transfered from'}</p>
                                    {card.buyer ? <Link onClick={() => { window.scrollTo(0, 0); }} to={`/profile/${card.buyer && card.buyer.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.buyer && card.buyer.user_name ? card.buyer.user_name : `@${card.buyer.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}

                                    <p className='activity-card__data-act-text'>from</p>
                                    {card.owner ? <Link to={`/profile/${card.owner.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.owner && card.owner.user_name ? card.owner.user_name : `@${card.owner.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                                </>
                                :
                                <>
                                    <p className='activity-card__data-act-text'>{card.is_buyer ? 'was transfered to' : 'was transfered from'}</p>
                                    {card.owner ? <Link onClick={() => { window.scrollTo(0, 0); }} to={`/profile/${card.owner.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.owner && card.owner.user_name ? card.owner.user_name : `@${card.owner.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}

                                    <p className='activity-card__data-act-text'>to</p>
                                    {card.buyer ? <Link to={`/profile/${card.buyer && card.buyer.user_id}/on-sale`} className='activity-card__data-act-text-link'>{card.buyer && card.buyer.user_name ? card.buyer.user_name : `@${card.buyer.user_id}`}</Link> : <span className='activity-card__data-act-text-link'>Unknown user</span>}
                                </>
                            }

                        </> : <></>}

                    {/* {card.type === 'bid' ?
                        <>
                            <Link onClick={() => { window.scrollTo(0, 0); }} to={`/profile/${user && user.user_id}/on-sale`} className='activity-card__data-act-text-link'>{user && user.username}</Link>
                            <p className='activity-card__data-act-text'>offered</p>
                            <span className='activity-card__data-act-text-value'>{card.value}
                                <svg className='activity-card__data-act-text-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='activity-card__data-act-text-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                </svg>
                            </span>
                        </> : <></>} */}

                </div>
                <div className='activity-card__data-date'>
                    <p className='activity-card__data-date-text'>{moment.unix(card.timestamp).tz(tz).format('DD.MM.YYYY HH:mm')}</p>
                    {card.type === 'resolve_purchase' || card.type === 'update_market_data' || card.type === 'add_market_data' || card.type === 'delete_market_data' || card.type === 'nft_transfer' ?
                        <a className='activity-card__data-date-link' href={`https://explorer.near.org/transactions/${card.transaction_hash}`} target="_blank" rel="noreferrer">
                            <svg className='activity-card__data-date-link-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='activity-card__data-date-link-icon-fill' d="M12 12.6667H4C3.63333 12.6667 3.33333 12.3667 3.33333 12V4C3.33333 3.63333 3.63333 3.33333 4 3.33333H7.33333C7.7 3.33333 8 3.03333 8 2.66667C8 2.3 7.7 2 7.33333 2H3.33333C2.59333 2 2 2.6 2 3.33333V12.6667C2 13.4 2.6 14 3.33333 14H12.6667C13.4 14 14 13.4 14 12.6667V8.66667C14 8.3 13.7 8 13.3333 8C12.9667 8 12.6667 8.3 12.6667 8.66667V12C12.6667 12.3667 12.3667 12.6667 12 12.6667ZM9.33333 2.66667C9.33333 3.03333 9.63333 3.33333 10 3.33333H11.7267L5.64 9.42C5.38 9.68 5.38 10.1 5.64 10.36C5.9 10.62 6.32 10.62 6.58 10.36L12.6667 4.27333V6C12.6667 6.36667 12.9667 6.66667 13.3333 6.66667C13.7 6.66667 14 6.36667 14 6V2H10C9.63333 2 9.33333 2.3 9.33333 2.66667Z" />
                            </svg>
                        </a>


                        : <></>}
                </div>


            </div>
            <div className='activity-card__icon'>
                {card.type === 'resolve_purchase' ?
                    <svg className='activity-card__icon-svg' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='activity-card__icon-svg-fill' fillRule="evenodd" clipRule="evenodd" d="M18.8277 14.9788H22.5182C23.0778 14.9788 23.5174 14.5162 23.5174 13.9583C23.5174 13.3868 23.0778 12.9378 22.5182 12.9378H18.8277C18.2682 12.9378 17.8285 13.3868 17.8285 13.9583C17.8285 14.5162 18.2682 14.9788 18.8277 14.9788ZM26.9014 7.90463C27.7141 7.90463 28.2471 8.19037 28.78 8.81628C29.3129 9.44219 29.4062 10.3402 29.2863 11.1553L28.0206 20.0813C27.7808 21.7972 26.3419 23.0612 24.6499 23.0612H10.1145C8.34258 23.0612 6.87706 21.6747 6.7305 19.8786L5.50479 5.04584L3.49303 4.69206C2.96011 4.59682 2.58707 4.06615 2.68033 3.52188C2.77359 2.96536 3.29318 2.59662 3.83942 2.67962L7.01695 3.1681C7.46993 3.25111 7.803 3.63073 7.84297 4.09337L8.09611 7.14129C8.13607 7.57806 8.48247 7.90463 8.90881 7.90463H26.9014ZM9.90108 25.2118C8.78196 25.2118 7.876 26.137 7.876 27.28C7.876 28.4094 8.78196 29.3346 9.90108 29.3346C11.0069 29.3346 11.9128 28.4094 11.9128 27.28C11.9128 26.137 11.0069 25.2118 9.90108 25.2118ZM24.8894 25.2118C23.7703 25.2118 22.8643 26.137 22.8643 27.28C22.8643 28.4094 23.7703 29.3346 24.8894 29.3346C25.9952 29.3346 26.9012 28.4094 26.9012 27.28C26.9012 26.137 25.9952 25.2118 24.8894 25.2118Z" fill="white" />
                    </svg>

                    : <></>}
                {card.type === 'update_market_data' || card.type === 'add_market_data' || card.type === 'delete_market_data' ?
                    <svg className='activity-card__icon-svg' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='activity-card__icon-svg-fill' d="M16.0007 3.33203C9.01398 3.33203 3.33398 9.01203 3.33398 15.9987C3.33398 22.9854 9.01398 28.6654 16.0007 28.6654C22.9873 28.6654 28.6673 22.9854 28.6673 15.9987C28.6673 9.01203 22.9873 3.33203 16.0007 3.33203ZM17.334 22.6654H14.6673C13.934 22.6654 13.334 22.0654 13.334 21.332C13.334 20.5987 13.934 19.9987 14.6673 19.9987H17.334C18.0673 19.9987 18.6673 20.5987 18.6673 21.332C18.6673 22.0654 18.0673 22.6654 17.334 22.6654ZM19.334 17.332H12.6673C11.934 17.332 11.334 16.732 11.334 15.9987C11.334 15.2654 11.934 14.6654 12.6673 14.6654H19.334C20.0673 14.6654 20.6673 15.2654 20.6673 15.9987C20.6673 16.732 20.0673 17.332 19.334 17.332ZM21.334 11.9987H10.6673C9.93398 11.9987 9.33398 11.3987 9.33398 10.6654C9.33398 9.93203 9.93398 9.33203 10.6673 9.33203H21.334C22.0673 9.33203 22.6673 9.93203 22.6673 10.6654C22.6673 11.3987 22.0673 11.9987 21.334 11.9987Z" fill="white" />
                    </svg>

                    : <></>}
                {card.type === 'nft_transfer' ?
                    <svg className='activity-card__icon-svg' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='activity-card__icon-svg-fill' fillRule="evenodd" clipRule="evenodd" d="M24.4239 21.9093L17.9672 15.5975C17.7958 15.4304 17.5159 15.4305 17.3445 15.5976L15.5669 17.3353C15.3955 17.5029 15.3955 17.7765 15.5669 17.9441L18.26 20.5767L3.44052 20.5765C3.19812 20.5765 3 20.7704 3 21.0072V23.4644C3 23.7014 3.19833 23.895 3.44052 23.895L18.26 23.8952L15.5669 26.5279C15.3955 26.6954 15.3955 26.9691 15.5669 27.1366L17.3445 28.8743C17.5159 29.0419 17.7958 29.0419 17.9672 28.8743L24.4239 22.5626C24.5152 22.4731 24.5563 22.3536 24.5501 22.2359C24.5563 22.1181 24.5154 21.9988 24.4239 21.9093Z" fill="white" />
                        <path className='activity-card__icon-svg-fill' d="M14.0328 16.4025L7.57614 10.0907C7.48461 10.0012 7.44371 9.88194 7.44986 9.76408C7.44371 9.64642 7.48482 9.5269 7.57614 9.43742L14.0328 3.12568C14.2042 2.95811 14.4841 2.95811 14.6555 3.12568L16.4331 4.86336C16.6045 5.03093 16.6045 5.30455 16.4331 5.4721L13.74 8.10476H28.5595C28.8017 8.10476 29 8.29843 29 8.53539V10.9926C29 11.2294 28.8019 11.4233 28.5595 11.4233H13.74L16.4331 14.0559C16.6045 14.2235 16.6045 14.4971 16.4331 14.6647L14.6555 16.4024C14.4841 16.5695 14.2042 16.5696 14.0328 16.4025Z" fill="white" />
                    </svg>


                    : <></>}
                {card.type === 'bid' ?
                    <svg className='activity-card__icon-svg' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='activity-card__icon-svg-fill' d="M22.6673 6H9.33398C6.02732 6 3.33398 8.69333 3.33398 12H28.6673C28.6673 8.69333 25.974 6 22.6673 6ZM3.33398 14.6667V20C3.33398 23.3067 6.02732 26 9.33398 26H22.6673C25.974 26 28.6673 23.3067 28.6673 20V14.6667H3.33398ZM13.334 21.3333H9.33398C8.60065 21.3333 8.00065 20.7333 8.00065 20C8.00065 19.2667 8.60065 18.6667 9.33398 18.6667H13.334C14.0673 18.6667 14.6673 19.2667 14.6673 20C14.6673 20.7333 14.0673 21.3333 13.334 21.3333Z" fill="white" />
                    </svg>


                    : <></>}
            </div>
        </div >
    );
}

export default ActivityCard;

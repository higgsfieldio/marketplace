/* eslint-disable no-unused-vars */
import React, { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pythonApi from '../../../../assets/pythonApi';
import { API_LINK } from '../../../../assets/utilis';
import scrollPageToTop from '../../../../assets/Utils/scrollPageToTop';
import MiniPreloader from '../../../MiniPreloader/MiniPreloader';
import Leaderboard from '../Leaderboard/Leaderboard';
import './Dashboard.css'
import RefferalsList from './RefferalsList/RefferalsList';
const Spline = React.lazy(() => import('@splinetool/react-spline'));


const Dashboard = ({ currentUser, setRefferalPopupOpened, leaders, usdExchangeRate, refferalsList, dashboard, setRefferalsList }) => {


    return (
        <div className='dashboard'>
            <p className='dashboard__title'>Referrals dashboard</p>
            <p className='dashboard__subtitle'>View volume of your referrals and performance of your ads</p>
            {dashboard && dashboard.level && dashboard.total_volume && dashboard.profit ?
                <div className='dashboard__container'>
                    <div className='dashboard__item dashboard__item_level'>
                        <p className='dashboard__level-name'>{dashboard.level.name} - lvl {dashboard.level.level + 1}</p>
                        <p className='dashboard__level-percent'>You receive {dashboard.level.percent / 100}% of our earnings</p>
                        <div className='dashboard__level-hint' onClick={() => {
                            setRefferalPopupOpened(true)
                        }}>
                            <svg className='dashboard__level-hint-icon' width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='dashboard__level-hint-icon-fill' d="M3.99506 1.94059e-05C3.50939 -0.00140394 3.01956 0.0754563 2.54971 0.235129C1.0468 0.746115 0.03832 2.00778 0.000320411 3.42493C-0.00738694 3.72132 0.124494 3.99553 0.337543 4.17002C0.550492 4.34442 0.821867 4.42463 1.08933 4.43008C1.35671 4.43544 1.6318 4.36569 1.85358 4.20001C2.07548 4.03439 2.22715 3.76822 2.23494 3.47183C2.25169 2.84321 2.68833 2.29472 3.35479 2.06816C4.02112 1.8416 4.76294 1.98661 5.25552 2.44176C5.75648 2.90477 5.90132 3.58764 5.61433 4.08941C5.24619 4.73309 4.91382 4.86429 4.38716 5.1004C4.14213 5.21025 3.80598 5.335 3.46542 5.59564C3.07654 5.89338 2.79775 6.36173 2.79775 6.89458V8.75758C2.79775 9.05397 2.93915 9.32448 3.15655 9.49463C3.37398 9.66467 3.64753 9.74077 3.91501 9.74077C4.1825 9.74077 4.45271 9.66467 4.67013 9.49463C4.88765 9.32449 5.03237 9.05397 5.03237 8.75758V7.04695C5.03237 7.03364 5.03256 7.0359 5.03237 7.02426C5.04579 7.01715 5.03903 7.02075 5.05397 7.01321C5.1398 6.97068 5.25664 6.91567 5.39699 6.85271C5.99322 6.58545 6.97955 6.07656 7.60915 4.97582C8.36228 3.65913 7.97797 2.10581 6.87649 1.08791C6.32109 0.574674 5.61364 0.234582 4.8592 0.0857013C4.57642 0.0299387 4.28638 0.000803461 3.99495 4.89847e-05L3.99506 1.94059e-05ZM3.90599 9.97582C3.27591 9.97582 2.75704 10.4353 2.75704 10.9898C2.75704 11.5442 3.27591 12 3.90599 12C4.53608 12 5.05743 11.5441 5.05743 10.9898C5.05743 10.4353 4.53601 9.97582 3.90599 9.97582Z" fill="white" />
                            </svg>

                        </div>
                        <div className='dashboard__level-icon'>
                            <div className='dashboard__level-icon-phone-scroll'></div>
                            {/* ${API_LINK}/referral_levels/get_file/${dashboard.level.image_link} */}
                            <Suspense fallback={<MiniPreloader isLinkColor={true} />}>

                                <Spline className='dashboard__level-spline' scene={`${API_LINK}/referral_levels/get_file/${dashboard.level.image_link}`} />
                            </Suspense>
                        </div>
                        {dashboard.level.level + 1 >= 8 ?
                            <p className='dashboard__level-volume'>Max lvl</p>
                            :
                            <>
                                <p className='dashboard__level-volume'>{Number((parseInt(dashboard.total_volume * 10)) / 10).toLocaleString('us')}N / {Number(dashboard.level.volume_less).toLocaleString('us')}N</p>
                                <p className='dashboard__level-volume-subtitle'>volume to level up</p>
                            </>

                        }


                    </div>
                    <div className='dashboard__item dashboard__item_profit'>
                        <p className='dashboard__profit-in-dollar'>${(Number(dashboard.profit) * usdExchangeRate) < 1000 ? ((parseInt((Number(dashboard.profit) * usdExchangeRate) * 100)) / 100) : (Number(dashboard.profit) * usdExchangeRate) < 10000 ? ((parseInt((Number(dashboard.profit) * usdExchangeRate) * 10)) / 10) : ((parseInt((Number(dashboard.profit) * usdExchangeRate) * 1)) / 1)}</p>
                        <div className='dashboard__profit-value'>
                            <p className='dashboard__profit-value-near'>{Number(dashboard.profit) < 1 ? ((parseInt(Number(dashboard.profit) * 100000)) / 100000) : Number(dashboard.profit) < 10 ? ((parseInt(Number(dashboard.profit) * 10000)) / 10000) : Number(dashboard.profit) < 100 ? ((parseInt(Number(dashboard.profit) * 1000)) / 1000) : Number(dashboard.profit) < 1000 ? ((parseInt(Number(dashboard.profit) * 100)) / 100) : ((parseInt(Number(dashboard.profit) * 10)) / 10)}</p>
                            <svg className='dashboard__profit-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='dashboard__profit-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                            </svg>
                        </div>
                        <p className='dashboard__profit-title'>Your Total Earnings</p>
                    </div>
                    <div className='dashboard__item dashboard__item_refferals'>
                        <p className='dashboard__refferals-number'>{(dashboard.referrals_amount).toLocaleString('us')}</p>
                        <p className='dashboard__refferals-title'>Total Number of Referrals</p>
                    </div>
                    <div className='dashboard__item dashboard__item_leaderboard'>
                        <p className='dashboard__leaderboard-title'>Leaderboard</p>
                        <Leaderboard leaders={leaders} currentUser={currentUser} onDashBoard={true} />
                    </div>
                </div>
                : <></>}

            <div className='dashboard__refferals-list'>
                {refferalsList !== undefined ?
                    <>
                        {refferalsList.length > 0 ?
                            <RefferalsList setRefferalsList={setRefferalsList} refferalsList={refferalsList} />
                            :
                            <>
                                <p className='dashboard__refferals-list-no-title'>To get your first referrals you need to share your referral link with them</p>
                                <Link className='dashboard__refferals-list-no-btn' to='/earn/referral/links' onClick={() => {
                                    scrollPageToTop()
                                }}>

                                    Generate a link
                                </Link>
                            </>}
                    </>
                    :
                    <>

                    </>}
            </div>

        </div>
    )
};

export default Dashboard
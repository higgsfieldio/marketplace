/* eslint-disable no-unused-vars */
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react'
import { MetaTags } from 'react-meta-tags';
import { Link, useParams, useNavigate } from 'react-router-dom';
import pythonApi from '../../../assets/pythonApi';
import ActionForm from './ActionForm/ActionForm';
import Dashboard from './Dashboard/Dashboard';
import Leaderboard from './Leaderboard/Leaderboard';
import './Refferal.css'
import RefLinks from './RefLinks/RefLinks';

const leaders = {
    top_ten: [
        {
            numeral: 1,
            wallet: 'askskskdkr.near',
            volume: 10,
            profit: 2,
        },
        {
            numeral: 2,
            wallet: 'askskskdkr2.near',
            volume: 10,
            profit: 2,
        },
        {
            numeral: 3,
            wallet: 'askskskdkr3.near',
            volume: 10444,
            profit: 2,
        },
        {
            numeral: 4,
            wallet: 'askskskdkr4.near',
            volume: 10,
            profit: 2,
        },
        {
            numeral: 5,
            wallet: 'askskskdkr5.near',
            volume: 10.34,
            profit: 2,
        },
        {
            numeral: 6,
            wallet: 'askskskdkr6.near',
            volume: 100.2354,
            profit: 2545.34,
        },
        {
            numeral: 7,
            wallet: 'higgstest2.near',
            volume: 10,
            profit: 0.2,
        },
        {
            numeral: 8,
            wallet: 'askskskdkr8.near',
            volume: 10,
            profit: 0.99099,
        },
        {
            numeral: 9,
            wallet: 'askskskdkr9.near',
            volume: 10,
            profit: 2,
        },
        {
            numeral: 10,
            wallet: 'huntermaster.near',
            volume: 10,
            profit: 2,
        },
    ]
}


const Refferal = ({ currentUser, setCurrentUser, login, setRefferalPopupOpened, handleReferralDeposit, usdExchangeRate }) => {
    const [leaders, setLeaders] = useState(undefined)
    const navigate = useNavigate()
    const { pageName } = useParams()

    function checkHashes({ page_name }) {
        var tz = moment.tz.guess();
        const urlParams = new URLSearchParams(window.location.search);
        const transactionHashes = urlParams.get('transactionHashes');
        const errorCode = urlParams.get('errorCode');
        if (errorCode) {
            navigate(`/earn/referral${page_name}`)
        }
        if (transactionHashes) {
            // setPreloaderVisible(true)

            pythonApi.checkTransactionsHashes({ transaction_hashes: transactionHashes.split(','), tz: tz })
                .then((res) => {
                    setCurrentUser(res)
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        if (pageName) {
            if (['dashboard', 'links'].indexOf(pageName) === -1) {
                navigate(`/earn/referral/dashboard`)
                checkHashes({ page_name: 'dashboard' })
                setPage('dashboard')
            } else {
                checkHashes({ page_name: pageName })
                setPage(pageName)
            }

        } else {
            navigate(`/earn/referral/dashboard`)
            checkHashes({ page_name: 'dashboard' })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageName])

    useEffect(() => {
        pythonApi.getRefLeaderBoards()
            .then((res) => {
                setLeaders(res)
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                if (err.detail === 'Leaders not found') {
                    setLeaders([])
                }
            })
    }, [])

    const [page, setPage] = useState('dashboard')

    function handleRefStorageDeposit() {
        let colbackURL = window.location.href
        handleReferralDeposit({ colbackURL })
    }

    const [dashboard, setDashboard] = useState(undefined)
    const [refferalsList, setRefferalsList] = useState(undefined)
    const [refLinks, setRefLinks] = useState(undefined)
    useEffect(() => {
        if (currentUser && currentUser.referral_active) {
            pythonApi.getRefDashboard()
                .then((res) => {
                    setDashboard(res)
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
            pythonApi.getChildReferrals({ last_id: null, limit: 20})//limit
                .then((res) => {
                    setRefferalsList(res)
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
            pythonApi.getCreatedRefLinks({ last_id: null, limit: 20})//limit
                .then((res) => {
                    setRefLinks(res)

                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)

                })
        }

    }, [currentUser])

  

    return (
        <div className="refferal-page">
            <MetaTags>
                    <title>Referrals</title>
                    <meta property="og:site_name" content={`Higgs Field`} />
                    <meta property="og:title" content={`Referrals`} />
                    <meta property="og:description" content={'Check out Referral system of Higgs Field'} />
                    <meta property="twitter:title" content={`Referrals`} />
                    <meta property="twitter:description" content={'Check out Referral system of Higgs Field'} />
                    <meta property="vk:title" content={`Referrals`} />
                    <meta property="vk:description" content={'Check out Referral system of Higgs Field'} />
                </MetaTags>
            <div className='refferal-page__container'>
                <p className='refferal-page__title'>Referrals</p>
                {currentUser && currentUser.referral_active ?
                    <div>
                        <div className='refferal-page__pages'>
                            <div className={`refferal-page__pages-link`} onClick={() => {
                                setPage('dashboard')
                                navigate(`/earn/referral/dashboard`)
                            }}>
                                <div className='refferal-page__pages-link-texts'>
                                    <p className={`refferal-page__pages-link-text ${page === 'dashboard' ? 'refferal-page__pages-link-text_active' : ''}`}>Dashboard</p>
                                </div>
                                <div className={`refferal-page__pages-link-line ${page === 'dashboard' ? 'refferal-page__pages-link-line_active' : ''}`}></div>
                            </div>

                            <div className={`refferal-page__pages-link`} onClick={() => {
                                setPage('links')
                                navigate(`/earn/referral/links`)
                            }}>
                                <div className='refferal-page__pages-link-texts'>
                                    <p className={`refferal-page__pages-link-text ${page === 'links' ? 'refferal-page__pages-link-text_active' : ''}`}>Links</p>
                                </div>

                                <div className={`refferal-page__pages-link-line ${page === 'links' ? 'refferal-page__pages-link-line_active' : ''}`}></div>
                            </div>
                        </div>
                        <div className='refferal-page__page'>
                            {page === 'dashboard' ? <Dashboard setRefferalsList={setRefferalsList} dashboard={dashboard} refferalsList={refferalsList} usdExchangeRate={usdExchangeRate} leaders={leaders} setRefferalPopupOpened={setRefferalPopupOpened} currentUser={currentUser} /> : <></>}
                            {page === 'links' ? <RefLinks refLinks={refLinks} setRefLinks={setRefLinks} dashboard={dashboard} /> : <></>}

                        </div>
                    </div>
                    :
                    <div className='refferal-page__action-leader-container'>
                        <ActionForm login={login} currentUser={currentUser} handleRefStorageDeposit={handleRefStorageDeposit} />
                        <Leaderboard leaders={leaders} currentUser={currentUser} />
                    </div>
                }

            </div>
        </div>
    )
};

export default Refferal
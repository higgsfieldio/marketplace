import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './Stats.css';

import tigers from '../../../assets/images/main/stats/tigers.png'

const CustomizedDot = () => {
    return (
        <></>
    );
};


function Stats({ stats }) {

    return (
        <section className='main-stats'>
            <div className='main-stats__heading'>
                <div className='main-stats__heading-texts'>
                    <p className='main-stats__heading-title'>Discover, and collect<br />extraordinary NFTs</p>
                    <p className='main-stats__heading-text'>Marketplace to list your collections on NEAR blockchain</p>
                    <Link className='main-stats__heading-link' to='/explore-collections/collectables'>
                        <p className='main-stats__heading-link-text'>Explore</p>
                    </Link>
                </div>
                <img className='main-stats__heading-img' src={tigers} alt='' />
            </div>
            {stats ?
                <div className='main-stats__stats'>
                    <div className='main-stats__stat'>
                        <p className='main-stats__stat-title'>NEAR blockchain stats</p>
                        <div className='main-stats__stat-charts'>
                            <div className='main-stats__stat-chart'>
                                <div className='main-stats__stat-chart-column'>
                                    <p className='main-stats__stat-chart-value'>{Number(stats.near_accounts_stats.stats[stats.near_accounts_stats.stats.length - 1].value).toLocaleString('us')}</p>
                                    <p className='main-stats__stat-chart-name'>Daily Active Accounts</p>
                                </div>
                                <div className='main-stats__stat-chart-column'>
                                    <p className='main-stats__stat-chart-percent'>{stats.near_accounts_stats.volume_percent > 0 ? `+${Number(stats.near_accounts_stats.volume_percent)}` : ''}{stats.near_accounts_stats.volume_percent < 0 ? `-${Number(stats.near_accounts_stats.volume_percent) * -1}` : ''}{stats.near_accounts_stats.volume_percent === 0 ? `${Number(stats.near_accounts_stats.volume_percent)}` : ''}%</p>
                                    <div className='main-stats__stat-chart-container'>
                                        {stats.near_accounts_stats ?
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart width={400} height={160} data={stats.near_accounts_stats.stats}>
                                                    <Line type="monotone" dataKey="percent" stroke={`#6F6FE9`} strokeLinecap='round' strokeWidth={2} dot={<CustomizedDot />} />
                                                </LineChart>
                                            </ResponsiveContainer> : <></>}
                                    </div>
                                </div>
                            </div>
                            <div className='main-stats__stat-chart'>
                                <div className='main-stats__stat-chart-column'>
                                <p className='main-stats__stat-chart-value'>{Number(stats.near_transactions_stats.stats[stats.near_transactions_stats.stats.length - 1].value).toLocaleString('us')}</p>
                                    <p className='main-stats__stat-chart-name'>Daily Transactions</p>
                                </div>
                                <div className='main-stats__stat-chart-column'>
                                <p className='main-stats__stat-chart-percent'>{stats.near_transactions_stats.volume_percent > 0 ? `+${Number(stats.near_transactions_stats.volume_percent)}` : ''}{stats.near_transactions_stats.volume_percent < 0 ? `-${Number(stats.near_transactions_stats.volume_percent) * -1}` : ''}{stats.near_transactions_stats.volume_percent === 0 ? `${Number(stats.near_transactions_stats.volume_percent)}` : ''}%</p>
                                    <div className='main-stats__stat-chart-container'>
                                        {stats.near_transactions_stats ?
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart width={400} height={160} data={stats.near_transactions_stats.stats}>
                                                    <Line type="monotone" dataKey="percent" stroke={`#6F6FE9`} strokeLinecap='round' strokeWidth={2} dot={<CustomizedDot />} />
                                                </LineChart>
                                            </ResponsiveContainer> : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='main-stats__stat'>
                        <p className='main-stats__stat-title'>Marketplace stats</p>
                        <div className='main-stats__stat-charts'>
                            <div className='main-stats__stat-chart'>
                                <div className='main-stats__stat-chart-column'>
                                <p className='main-stats__stat-chart-value'>{Number(stats.marketplace_purchase_near_stats.stats[stats.marketplace_purchase_near_stats.stats.length - 1].value).toLocaleString('us')}</p>
                                    <p className='main-stats__stat-chart-name'>Daily NEAR Volume</p>
                                </div>
                                <div className='main-stats__stat-chart-column'>
                                <p className='main-stats__stat-chart-percent'>{stats.marketplace_purchase_near_stats.volume_percent > 0 ? `+${Number(stats.marketplace_purchase_near_stats.volume_percent)}` : ''}{stats.marketplace_purchase_near_stats.volume_percent < 0 ? `-${Number(stats.marketplace_purchase_near_stats.volume_percent) * -1}` : ''}{stats.marketplace_purchase_near_stats.volume_percent === 0 ? `${Number(stats.marketplace_purchase_near_stats.volume_percent)}` : ''}%</p>
                                    <div className='main-stats__stat-chart-container'>
                                    {stats.marketplace_purchase_near_stats ?
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart width={400} height={160} data={stats.marketplace_purchase_near_stats.stats}>
                                                    <Line type="monotone" dataKey="percent" stroke={`#6F6FE9`} strokeLinecap='round' strokeWidth={2} dot={<CustomizedDot />} />
                                                </LineChart>
                                            </ResponsiveContainer> : <></>}
                                    </div>
                                </div>
                            </div>
                            <div className='main-stats__stat-chart'>
                                <div className='main-stats__stat-chart-column'>
                                <p className='main-stats__stat-chart-value'>{Number(stats.marketplace_purchase_amount_stats.stats[stats.marketplace_purchase_amount_stats.stats.length - 1].value).toLocaleString('us')}</p>
                                    <p className='main-stats__stat-chart-name'>Daily Transactions</p>
                                </div>
                                <div className='main-stats__stat-chart-column'>
                                <p className='main-stats__stat-chart-percent'>{stats.marketplace_purchase_amount_stats.volume_percent > 0 ? `+${Number(stats.marketplace_purchase_amount_stats.volume_percent)}` : ''}{stats.marketplace_purchase_amount_stats.volume_percent < 0 ? `-${Number(stats.marketplace_purchase_amount_stats.volume_percent) * -1}` : ''}{stats.marketplace_purchase_amount_stats.volume_percent === 0 ? `${Number(stats.marketplace_purchase_amount_stats.volume_percent)}` : ''}%</p>
                                    <div className='main-stats__stat-chart-container'>
                                    {stats.marketplace_purchase_amount_stats ?
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart width={400} height={160} data={stats.marketplace_purchase_amount_stats.stats}>
                                                    <Line type="monotone" dataKey="percent" stroke={`#6F6FE9`} strokeLinecap='round' strokeWidth={2} dot={<CustomizedDot />} />
                                                </LineChart>
                                            </ResponsiveContainer> : <></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <></>}

        </section>
    );
}

export default Stats;

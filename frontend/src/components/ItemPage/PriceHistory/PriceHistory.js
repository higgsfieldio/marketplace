import './PriceHistory.css';

import gomer from '../../../assets/images/gif/gomer.gif'
import moment from 'moment-timezone';
import { useState } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';


function CustomTooltip({ payload, active }) {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="custom-tooltip__label">{`${payload[0].payload.name}`}</p>
                <p className="custom-tooltip__value-name">Price</p>
                <div className="custom-tooltip__value-container">
                    <p className="custom-tooltip__value">{payload[0].payload.value}</p>
                    <svg className='custom-tooltip__near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='custom-tooltip__near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                    </svg>
                </div>
            </div>
        );
    }

    return null;
}

const CustomizedDot = (props) => {
    return (
        <></>
    );
};


function PriceHistory({ price_history, token_id, theme }) {

    const [rangeValue, setRengeValue] = useState('7d')


    return (
        <div className='price-history'>
            {price_history && price_history.week && price_history.week.items && price_history.week.items.length > 0 && price_history.week.brake_points && price_history.week.brake_points.length > 0 ?
                <div className='price-history__range-selector' onClick={() => {
                    if (rangeValue === '30d') {
                        setRengeValue('7d')
                    }
                    if (rangeValue === '7d') {
                        setRengeValue('30d')
                    }
                }}>
                    <p className={`price-history__range-selector-item ${rangeValue === '7d' ? 'price-history__range-selector-item_selected' : ''}`}>7d</p>
                    <p className={`price-history__range-selector-item ${rangeValue === '30d' ? 'price-history__range-selector-item_selected' : ''}`}>30d</p>
                </div>
                : <></>}

            {rangeValue === '7d' ?
                <>
                    {price_history && price_history.week && price_history.week.items && price_history.week.items.length > 0 && price_history.week.brake_points && price_history.week.brake_points.length > 0 ?
                        <div className='price-history__container'>

                            <div className='price-history__brake-points'>
                                {price_history.week.brake_points.map((item, i) => (
                                    <div className='price-history__brake-point' key={`price-history-brake-poin-for${token_id}-${i}`}>
                                        <p className='price-history__brake-point-value'>{parseFloat(Number(item).toFixed(2))}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='price-history__items' style={{ gridTemplateColumns: `${price_history.week.items.map(() => { return '1fr' }).join(' ')}` }}>
                                <div className='price-history__line price-history__line_week'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart width={400} height={160} data={
                                            price_history.week.items.map((item) => {
                                                return {
                                                    name: moment.unix(item.timestamp).format('MMM DD,YYYY'),
                                                    uv: item.percent,
                                                    value: parseFloat(Number(item.value)),
                                                }
                                            })
                                        }>
                                            <Line type="monotone" dataKey="uv" stroke={`${theme === 'neon' ? '#FFFFFF' : '#6F6FE9'}`} strokeLinecap='round' strokeWidth={3} dot={<CustomizedDot />} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </LineChart>
                                    </ResponsiveContainer>

                                </div>

                                {price_history.week.items.map((item, i) => (
                                    <div className='price-history__item' key={`price-history-item-for${token_id}-${i}`} style={{ height: `${item.percent}%` }}>
                                        {price_history.week.items.length > 3 ?
                                            <>
                                                {(price_history.week.items.length - 1) % 2 === 0 ?
                                                    <>
                                                        {i % 2 === 0 ?
                                                            <p className='price-history__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                                            : <></>}
                                                    </>
                                                    :
                                                    <>
                                                        {i % 2 === 1 ?
                                                            <p className='price-history__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                                            : <></>}
                                                    </>
                                                }
                                            </>
                                            :
                                            <p className='price-history__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                        }




                                        <div className='price-history__item-bg'>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                        :
                        <div className='price-history__no-item'>
                            <img className='price-history__no-item-img' src={gomer} alt=''></img>
                            <p className='price-history__no-item-text'>There are no price history</p>
                        </div>
                    }
                </>
                : <></>}

            {rangeValue === '30d' ?
                <>
                    {price_history && price_history.month && price_history.month.items && price_history.month.items.length > 0 && price_history.month.brake_points && price_history.month.brake_points.length > 0 ?
                        <div className='price-history__container'>
                            <div className='price-history__brake-points'>
                                {price_history.month.brake_points.map((item, i) => (
                                    <div className='price-history__brake-point' key={`price-history-brake-poin-for${token_id}-${i}`}>
                                        <p className='price-history__brake-point-value'>{parseFloat(Number(item).toFixed(2))}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='price-history__items' style={{ gridTemplateColumns: `${price_history.month.items.map(() => { return '1fr' }).join(' ')}` }}>
                                <div className='price-history__line price-history__line_month'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart width={400} height={160} data={
                                            price_history.month.items.map((item, i) => {
                                                return {
                                                    name: moment.unix(item.timestamp).format('MMM DD,YYYY'),
                                                    uv: item.percent,
                                                    value: parseFloat(Number(item.value)),
                                                }
                                            })
                                        }>
                                            <Line type="monotone" dataKey="uv" stroke={`${theme === 'neon' ? '#FFFFFF' : '#6F6FE9'}`} strokeLinecap='round' strokeWidth={2} dot={<CustomizedDot />} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </LineChart>
                                    </ResponsiveContainer>

                                </div>
                                {price_history.month.items.map((item, i) => (
                                    <div className='price-history__item' key={`price-history-item-for${token_id}-${i}`} style={{ height: `${item.percent}%` }}>
                                        {i % 4 === 0 ?
                                            <p className='price-history__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                            : <></>}




                                        <div className='price-history__item-bg'>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                        :
                        <div className='price-history__no-item'>
                            <img className='price-history__no-item-img' src={gomer} alt=''></img>
                            <p className='price-history__no-item-text'>There is no price history</p>
                        </div>
                    }
                </>
                : <></>}


        </div>
    );
}

export default PriceHistory;
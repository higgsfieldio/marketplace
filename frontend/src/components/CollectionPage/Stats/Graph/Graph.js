import './Graph.css';


import gomer from '../../../../assets/images/gif/gomer.gif'
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, YAxis } from 'recharts';


function CustomTooltip({ payload, active, usd }) {
    useEffect(() => {
        if (payload && payload[0] && payload[0].payload && payload[0].payload.setValue) {
            if (active) {
                payload[0].payload.setValue(payload[0].payload.value)
                payload[0].payload.setDateValue(moment.unix(payload[0].payload.name).format('MMM DD'))
            }

        }
    }, [payload, active])


    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="custom-tooltip__label">{`${moment.unix(payload[0].payload.name).format('MMM DD,YYYY')}`}</p>
                <p className="custom-tooltip__value-name">{payload[0].payload.toltip_value_name}</p>
                <div className="custom-tooltip__value-container">
                    <p className="custom-tooltip__value">{payload[0].payload.toltip_value_name === 'Floor m. cap.' || payload[0].payload.toltip_value_name === 'Average m. cap.'  ? '$' : ''}{payload[0].payload.toltip_value_name === 'Floor m. cap.' || payload[0].payload.toltip_value_name === 'Average m. cap.' ? parseFloat(Number(payload[0].payload.value)) > 1000 ? `${Number(parseFloat(Number(payload[0].payload.value)).toFixed(0)).toLocaleString('us')}` : `${Number(parseFloat(parseFloat(Number(payload[0].payload.value)).toFixed(2))).toLocaleString('us')}`  : payload[0].payload.value}</p>
                    {payload[0].payload.isPrice ?
                        <svg className='custom-tooltip__near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className='custom-tooltip__near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                        </svg>
                        : <></>}

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

function Graph({ stats, rangeValue, collection_id, graphName, theme, brake_points_visible, dates_visible, brake_lines_visible, toltip_price, toltip_value_name, bars_vivsible, setValue, setDateValue }) {


    return (
        <div className={`graph ${dates_visible ? '' : 'graph_no-dates'}`}>
            {rangeValue === '7d' ?
                <>
                    {stats && stats.week && stats.week.items && stats.week.items.length > 0 && stats.week.brake_points && stats.week.brake_points.length > 0 ?
                        <div className={`graph__container ${brake_points_visible ? '' : 'graph__container_no-brake-points'}`}>

                            {brake_points_visible ? <div className='graph__brake-points'>
                                {stats.week.brake_points.map((item, i) => (
                                    <div className='graph__brake-point' key={`graph-${graphName}-brake-point-for${collection_id}-${i}`}>
                                        <p className='graph__brake-point-value'>{item}</p>
                                    </div>
                                ))}
                            </div> : <></>}
                            {brake_points_visible && brake_lines_visible ?
                                <div className='graph__brake-lines'>
                                    {stats.week.brake_points.map((item, i) => (
                                        <div className='graph__brake-line' key={`graph-${graphName}-brake-line-for${collection_id}-${i}`}>

                                        </div>
                                    ))}
                                </div>
                                : <></>}

                            <div className={`graph__items ${brake_lines_visible || brake_lines_visible ? '' : 'graph__items_nobrake-nolines'}`} style={{ gridTemplateColumns: `${stats.week.items.map(() => { return '1fr' }).join(' ')}` }}>
                                <div className='graph__line graph__line_week'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart width={1} height={1} data={
                                            stats.week.items.map((item) => {
                                                return {
                                                    name: item.timestamp,
                                                    uv: item.percent,
                                                    // pv: 100, amt: 100,
                                                    value: item.value,
                                                    isPrice: toltip_price,
                                                    toltip_value_name,
                                                    setValue: setValue && setValue,
                                                    setDateValue: setDateValue && setDateValue,
                                                }
                                            })
                                        }>
                                            <YAxis tickMargin={0} axisLine={false} tickLine={false} tick={false}  type="number" domain={[0, 100]}/>
                                            <Line type="monotone" dataKey="uv" stroke={`${theme === 'neon' ? '#FFFFFF' : '#6F6FE9'}`} strokeLinecap='round' strokeWidth={3} dot={<CustomizedDot />} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </LineChart>
                                    </ResponsiveContainer>

                                </div>

                                {bars_vivsible && stats.week.items.map((item, i) => (
                                    <div className='graph__item' key={`graph-${graphName}-items-for${collection_id}-${i}`} style={{ height: `${item.percent}%` }}>
                                        {dates_visible ? <>{stats.week.items.length > 3 ?
                                            <>
                                                {(stats.week.items.length - 1) % 2 === 0 ?
                                                    <>
                                                        {i % 2 === 0 ?
                                                            <p className='graph__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                                            : <></>}
                                                    </>
                                                    :
                                                    <>
                                                        {i % 2 === 1 ?
                                                            <p className='graph__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                                            : <></>}
                                                    </>
                                                }
                                            </>
                                            :
                                            <p className='graph__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                        }</> : <></>}




                                        <div className='graph__item-bg'>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                        :
                        <div className='graph__no-item'>
                            <img className='graph__no-item-img' src={gomer} alt=''></img>
                            <p className='graph__no-item-text'>There are no data for statistics</p>
                        </div>
                    }
                </>
                : <></>}

            {rangeValue === '30d' ?
                <>
                    {stats && stats.month && stats.month.items && stats.month.items.length > 0 && stats.month.brake_points && stats.month.brake_points.length > 0 ?
                        <div className={`graph__container ${brake_points_visible ? '' : 'graph__container_no-brake-points'}`}>
                            {brake_points_visible ?
                                <div className='graph__brake-points'>
                                    {stats.month.brake_points.map((item, i) => (
                                        <div className='graph__brake-point' key={`graph-${graphName}-brake-poin-for${collection_id}-${i}`}>
                                            <p className='graph__brake-point-value'>{item}</p>
                                        </div>
                                    ))}
                                </div>
                                : <></>}
                            {brake_points_visible && brake_lines_visible ?
                                <div className='graph__brake-lines'>
                                    {stats.week.brake_points.map((item, i) => (
                                        <div className='graph__brake-line' key={`graph-${graphName}-brake-line-for${collection_id}-${i}`}>

                                        </div>
                                    ))}
                                </div>
                                : <></>}


                            <div className={`graph__items ${brake_lines_visible || brake_lines_visible ? '' : 'graph__items_nobrake-nolines'}`} style={{ gridTemplateColumns: `${stats.month.items.map(() => { return '1fr' }).join(' ')}` }}>
                                <div className='graph__line graph__line_month'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart width={400} height={160} data={
                                            stats.month.items.map((item, i) => {
                                                return {
                                                    name: item.timestamp,
                                                    uv: item.percent,
                                                    // pv: 100, amt: 100,
                                                    value: item.value,
                                                    isPrice: toltip_price,
                                                    toltip_value_name,
                                                    setValue: setValue && setValue,
                                                    setDateValue: setDateValue && setDateValue,
                                                }
                                            })
                                        }>
                                            <YAxis tickMargin={0} axisLine={false} tickLine={false} tick={false}  type="number" domain={[0, 100]}/>
                                            <Line type="monotone" dataKey="uv" stroke={`${theme === 'neon' ? '#FFFFFF' : '#6F6FE9'}`} strokeLinecap='round' strokeWidth={2} dot={<CustomizedDot />} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </LineChart>
                                    </ResponsiveContainer>

                                </div>
                                {bars_vivsible && stats.month.items.map((item, i) => (
                                    <div className='graph__item' key={`graph-${graphName}-item-for${collection_id}-${i}`} style={{ height: `${item.percent}%` }}>
                                        {dates_visible ? <>{i % 4 === 0 ?
                                            <p className='graph__item-date'>{moment.unix(item.timestamp).format('DD/MM')}</p>
                                            : <></>}
                                        </> : <></>}
                                        <div className='graph__item-bg'>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                        :
                        <div className='graph__no-item'>
                            <img className='graph__no-item-img' src={gomer} alt=''></img>
                            <p className='graph__no-item-text'>There are no data for statistics</p>
                        </div>
                    }
                </>
                : <></>}

            {rangeValue === 'All time' ?
                <>
                    {stats && stats.all_time && stats.all_time.items && stats.all_time.items.length > 0 && stats.all_time.brake_points && stats.all_time.brake_points.length > 0 ?
                        <div className={`graph__container ${brake_points_visible ? '' : 'graph__container_no-brake-points'}`}>
                            {brake_points_visible ?
                                <div className='graph__brake-points'>
                                    {stats.all_time.brake_points.map((item, i) => (
                                        <div className='graph__brake-point' key={`graph-${graphName}-brake-poin-for${collection_id}-${i}`}>
                                            <p className='graph__brake-point-value'>{item}</p>
                                        </div>
                                    ))}
                                </div>
                                : <></>}
                            {brake_points_visible && brake_lines_visible ?
                                <div className='graph__brake-lines'>
                                    {stats.week.brake_points.map((item, i) => (
                                        <div className='graph__brake-line' key={`graph-${graphName}-brake-line-for${collection_id}-${i}`}>

                                        </div>
                                    ))}
                                </div>
                                : <></>}


                            <div className={`graph__items ${brake_lines_visible || brake_lines_visible ? '' : 'graph__items_nobrake-nolines'}`} style={{ gridTemplateColumns: `${stats.all_time.items.map(() => { return '1fr' }).join(' ')}` }}>
                                <div className='graph__line graph__line_month'>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart width={400} height={160} data={
                                            stats.all_time.items.map((item, i) => {
                                                return {
                                                    name: item.timestamp,
                                                    uv: item.percent,
                                                    // pv: 100, amt: 100,
                                                    value: item.value,
                                                    isPrice: toltip_price,
                                                    toltip_value_name,
                                                    setValue: setValue && setValue,
                                                    setDateValue: setDateValue && setDateValue,
                                                }
                                            })
                                        }>
                                            <YAxis tickMargin={0} axisLine={false} tickLine={false} tick={false}  type="number" domain={[0, 100]}/>
                                            <Line type="monotone" dataKey="uv" stroke={`${theme === 'neon' ? '#FFFFFF' : '#6F6FE9'}`} strokeLinecap='round' strokeWidth={2} dot={<CustomizedDot />} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </LineChart>
                                    </ResponsiveContainer>

                                </div>
                                {bars_vivsible && stats.all_time.items.map((item, i) => (
                                    <div className='graph__item' key={`graph-${graphName}-item-for${collection_id}-${i}`} style={{ height: `${item.percent}%` }}>
                                        {dates_visible ? <>{i % 6 === 3 ?
                                            <p className='graph__item-date'>{moment.unix(item.timestamp).format('MMM YYYY')}</p>
                                            : <></>}
                                        </> : <></>}
                                        <div className='graph__item-bg'>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                        :
                        <div className='graph__no-item'>
                            <img className='graph__no-item-img' src={gomer} alt=''></img>
                            <p className='graph__no-item-text'>There are no data for statistics</p>
                        </div>
                    }
                </>
                : <></>}
        </div>
    );
}

export default Graph;

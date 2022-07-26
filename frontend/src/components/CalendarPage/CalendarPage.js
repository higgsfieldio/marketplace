import './CalendarPage.css';
import bgimage from '../../assets/images/main/bg.png'
// import bgTripimage from '../../assets/images/main/bg-trip.png'
import FeaturedCard from './FeaturedCard/FeaturedCard';
import { useEffect, useState } from 'react';
import CalendarTable from './CalendarTable/CalendarTable';
import pythonApi from '../../assets/pythonApi';
import moment from 'moment-timezone';
import PreloaderOnPage from '../PreloaderOnPage/PreloaderOnPage';
import incredible from '../../assets/images/not-found/incredible.webp'
import { MetaTags } from 'react-meta-tags';

function CalendarPage({ usdExchangeRate, theme }) {
    const yearNow = moment().utc().format('YYYY')
    const [timerValue, setTimerValue] = useState(0);
    const [rangeValue, setRengeValue] = useState('Upcoming')
    const [isPreloaderVisible, setPreloaderVisible] = useState(true)


    useEffect(() => {

        const timer = setInterval(() => {
            // let seconds = item.auction.end_date - moment().format('X')

            setTimerValue(timerValue + 1)
            // setTimeLeftValue({
            //     days: Math.floor(seconds / (3600 * 24)),
            //     hours: Math.floor(seconds % (3600 * 24) / 3600),
            //     minutes: Math.floor(seconds % 3600 / 60),
            //     seconds: Math.floor(seconds % 60),
            // })
            clearInterval(timer)
        }, 1000);





    }, [timerValue])

    const [featured, setFeatured] = useState([])
    const [upcomingItems, setUpcomingItems] = useState([])
    const [pastItems, setPastItems] = useState([])

    useEffect(() => {

        pythonApi.getCalendar()
            .then((res) => {
                setTimeout(() => {
                    setPreloaderVisible(false)
                }, 600);

                setFeatured(res.featured)
                setUpcomingItems(res.upcoming)
                setPastItems(res.past)
                console.log(res)
            })
            .catch((err) => {
                setTimeout(() => {
                    setPreloaderVisible(false)
                }, 600);
                console.log(err)
            })

    }, [])

    return (
        <div className='calendar-page'>
             <MetaTags>
                <title>{'Launch calendar'}</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={'Launch calendar'} />
                <meta property="og:description" content={'Launch calendar'} />
                <meta property="twitter:title" content={'Launch calendar'} />
                <meta property="twitter:description" content={'Launch calendar'} />

                <meta property="vk:title" content={'Launch calendar'} />
                <meta property="vk:description" content={'Launch calendar'} />

            </MetaTags>
            <img className='calendar-page__bg-image' src={bgimage} alt='' />
            {/* {theme === 'neon' ?
                <img className='calendar-page__bg-trip-image' src={bgTripimage} alt='' />
                : <></>} */}
            <div className='calendar-page__container'>
                {featured && (featured[0] || featured[1]) ?
                    <div className='calendar-page__featured'>
                        {featured && featured[0] ?
                            <FeaturedCard usdExchangeRate={usdExchangeRate} timerValue={timerValue} card={featured[0]} />
                            : <></>}

                        {featured && featured[1] ?
                            <FeaturedCard usdExchangeRate={usdExchangeRate} timerValue={timerValue} card={featured[1]} />
                            : <></>}

                    </div>
                    : <></>}

                <h2 className='calendar-page__title'>Launches</h2>
                <p className='calendar-page__subtitle'>Discover past and upcoming sales<br/>Want to list your drop on our Calendar? <a className='calendar-page__subtitle calendar-page__subtitle_link' target="_blank" rel="noreferrer" href='https://druhk0gh9fz.typeform.com/to/HuzYjtLY'>Fill&nbsp;out&nbsp;this&nbsp;form!</a></p>
                <div className='calendar-page__range-selector'>
                    <p className={`calendar-page__range-selector-item ${rangeValue === 'Upcoming' ? 'calendar-page__range-selector-item_selected' : ''}`} onClick={() => {
                        if (rangeValue !== 'Upcoming') {
                            setPreloaderVisible(true)
                            setRengeValue('Upcoming')
                            setTimeout(() => {
                                setPreloaderVisible(false)
                            }, 400);
                        }
                    }}>Upcoming</p>
                    <p className={`calendar-page__range-selector-item ${rangeValue === 'Past' ? 'calendar-page__range-selector-item_selected' : ''}`} onClick={() => {
                        if (rangeValue !== 'Past') {
                            setPreloaderVisible(true)
                            setRengeValue('Past')
                            setTimeout(() => {
                                setPreloaderVisible(false)
                            }, 400);
                        }
                    }}>Past</p>

                </div>
                <div className='calendar-page__items-by-dates'>

                    {isPreloaderVisible ?
                        <PreloaderOnPage />
                        :
                        <>
                            {rangeValue === 'Upcoming' ?
                                <>
                                    {upcomingItems && upcomingItems.length > 0 ?
                                        upcomingItems.map((item, i) => (
                                            <div className='calendar-page__item-by-date' key={`upcoming-item-by-date-${item.date}-${i}`}>
                                                <p className='calendar-page__item-by-date-title'>{yearNow !== moment.unix(item.date).utc().format('YYYY')? moment.unix(item.date).utc().format('D MMMM YYYY')  : moment.unix(item.date).utc().format('D MMMM')}</p>
                                                <div className='calendar-page__item-by-date-table-container'>
                                                    <CalendarTable timerValue={timerValue} usdExchangeRate={usdExchangeRate} items={item.items} />
                                                </div>
                                            </div>
                                        ))

                                        :
                                        <div className='calendar-page__no-items'>
                                            <img className='calendar-page__no-items-img' src={incredible} alt='not-found' />
                                            <p className='calendar-page__no-items-text'>No upcoming events😭</p>

                                        </div>}
                                </>
                                : <></>}

                            {rangeValue === 'Past' ?
                                <>
                                    {pastItems && pastItems.length > 0 ?
                                        pastItems.map((item, i) => (
                                            <div className='calendar-page__item-by-date' key={`past-item-by-date-${item.date}-${i}`}>
                                                <p className='calendar-page__item-by-date-title'>{yearNow !== moment.unix(item.date).utc().format('YYYY')? moment.unix(item.date).utc().format('D MMMM YYYY')  : moment.unix(item.date).utc().format('D MMMM')}</p>
                                                <div className='calendar-page__item-by-date-table-container'>
                                                    <CalendarTable type={'past'} timerValue={timerValue} usdExchangeRate={usdExchangeRate} items={item.items} />
                                                </div>
                                            </div>
                                        ))

                                        : <div className='calendar-page__no-items'>
                                            <img className='calendar-page__no-items-img' src={incredible} alt='not-found' />
                                            <p className='calendar-page__no-items-text'>No past events😭</p>
                                        </div>}
                                </>
                                : <></>}
                        </>
                    }




                </div>
            </div>
        </div>
    );
}

export default CalendarPage;


import './StatisticsPage.css';

import bgimage from '../../assets/images/main/bg.png'
// import bgTripimage from '../../assets/images/main/bg-trip.png'
import { useEffect, useRef, useState } from 'react';
import Table from './Table/Table';
import pythonApi from '../../assets/pythonApi';
import PreloaderOnPage from '../PreloaderOnPage/PreloaderOnPage';
import { MetaTags } from 'react-meta-tags';


function StatisticsPage(props) {
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    const [rangeValue, setRangeValue] = useState('hours_24')

    const [selectedSort, setSelectedSort] = useState({
        name: 'market_cap_average',
        order: -1,
    })

    const [items, setItems] = useState([])
    useEffect(() => {
        setPreloaderVisible(true)
        pythonApi.getCollectonsStats({ from_index: 0, limit: 10, range: 'hours_24', sort_name: 'market_cap_average', sort_order: -1 })
            .then((res) => {
                setTimeout(() => {
                    setPreloaderVisible(false)
                }, 400);
                setItems(res)
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [])


    const listInnerRef = useRef();


    const [prevScrollPosition, setPrevScrollPosition] = useState(-1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollTraking, setScrollTraking] = useState(true);
    const handleScroll = () => {
        const position = window.pageYOffset;

        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const [pageValue, setPageValue] = useState(0);
    useEffect(() => {
        // console.log(scrollPosition, prevScrollPosition)

        if (listInnerRef.current && scrollTraking && scrollPosition > prevScrollPosition && items && items.length > 0) {
            // console.log(listInnerRef.current)
            setPrevScrollPosition(scrollPosition)
            const { scrollHeight } = listInnerRef.current;
            if (scrollHeight < scrollPosition + 300) {
                setScrollTraking(false)
                setPageValue(pageValue + 1)
                setTimeout(() => {
                    setScrollTraking(true)
                }, 500);
            }
        }
    }, [scrollPosition, scrollTraking, prevScrollPosition, pageValue, items]);

    useEffect(() => {
        console.log(pageValue)
        if (pageValue > 0) {
            if (items && items.length === 10 * pageValue) {
                pythonApi.getCollectonsStats({ from_index: 10 * pageValue, limit: 10, range: rangeValue, sort_name: selectedSort.name, sort_order: selectedSort.order })
                    .then((res) => {
                        setItems(prev => prev.concat(res))

                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageValue, items])

    function handleRangeChange(range) {
        setPreloaderVisible(true)
        setPageValue(0)
        setPrevScrollPosition(-1)
        setScrollPosition(0)
        setRangeValue(range)
        pythonApi.getCollectonsStats({ from_index: 0, limit: 10, range: range, sort_name: selectedSort.name, sort_order: selectedSort.order })
            .then((res) => {
                setTimeout(() => {
                    setPreloaderVisible(false)
                }, 400);
                setItems(res)
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }



    function handleSortChange({ name }) {
        setPageValue(0)
        setPrevScrollPosition(-1)
        setScrollPosition(0)
        if (name === selectedSort.name) {
            if (selectedSort.order === -1) {
                setSelectedSort({
                    name: name,
                    order: 1,
                })
                pythonApi.getCollectonsStats({ from_index: 0, limit: 10, range: rangeValue, sort_name: name, sort_order: 1 })
                    .then((res) => {
                        setItems(res)

                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                setSelectedSort({
                    name: name,
                    order: -1,
                })
                pythonApi.getCollectonsStats({ from_index: 0, limit: 10, range: rangeValue, sort_name: name, sort_order: -1 })
                    .then((res) => {
                        setItems(res)

                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        } else {
            setSelectedSort({
                name: name,
                order: -1,
            })
            pythonApi.getCollectonsStats({ from_index: 0, limit: 10, range: rangeValue, sort_name: name, sort_order: -1 })
                .then((res) => {
                    setItems(res)

                })
                .catch((err) => {
                    console.log(err)
                })
        }


    }

    return (
        <div className='statistics-page'>
            <MetaTags>
                <title>{'Collections stats'}</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={'Collections stats'} />
                <meta property="og:description" content={'Collections stats'} />
                <meta property="twitter:title" content={'Collections stats'} />
                <meta property="twitter:description" content={'Collections stats'} />

                <meta property="vk:title" content={'Collections stats'} />
                <meta property="vk:description" content={'Collections stats'} />

            </MetaTags>
            <img className='statistics-page__bg-image' src={bgimage} alt='' />
            {/* {props.theme === 'neon' ?
                <img className='statistics-page__bg-trip-image' src={bgTripimage} alt='' />
                : <></>} */}

            <div className='statistics-page__container'>
                <p className='statistics-page__title'>Statistics of all collections</p>
                <p className='statistics-page__subtitle'>The top collections on marketplace, ranked by volume, floor price and other statistics.</p>
                <div className='statistics-page__range-selector'>
                    <p className={`statistics-page__range-selector-item ${rangeValue === 'hours_24' ? 'statistics-page__range-selector-item_selected' : ''}`} onClick={() => {
                        if (rangeValue !== 'hours_24') {
                            handleRangeChange('hours_24')
                            // setRengeValue('hours_24')
                        }
                    }}>24h</p>
                    <p className={`statistics-page__range-selector-item ${rangeValue === 'days_7' ? 'statistics-page__range-selector-item_selected' : ''}`} onClick={() => {
                        if (rangeValue !== 'days_7') {
                            handleRangeChange('days_7')
                        }
                    }}>7d</p>
                    <p className={`statistics-page__range-selector-item ${rangeValue === 'days_30' ? 'statistics-page__range-selector-item_selected' : ''}`} onClick={() => {
                        if (rangeValue !== 'days_30') {
                            handleRangeChange('days_30')
                        }
                    }}>30d</p>
                </div>
                {isPreloaderVisible ?
                    <PreloaderOnPage />
                    :
                    <div ref={listInnerRef}>
                        <Table handleSortChange={handleSortChange} selectedSort={selectedSort} items={items} rangeValue={rangeValue} />
                    </div>
                }


            </div>
        </div>
    );
}

export default StatisticsPage;

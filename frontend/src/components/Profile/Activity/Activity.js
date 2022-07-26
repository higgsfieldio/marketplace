

import './Activity.css'



import gomer from '../../../assets/images/gif/gomer.gif'
import { Link } from 'react-router-dom'
import ActivityCard from './ActivityCard/ActivityCard'
import { useEffect, useRef, useState } from 'react'


import Preloader from '../../Preloader/Preloader'

function Activity({ cards, user }) {
    const [filteredCards, setFilteredCards] = useState(cards)
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    const [isFiltersPopupVisible, setFiltersPopupVisible] = useState(false)
    const [filters, setFilters] = useState({
        purchase: false,
        list: false,
        bid: false,
        transfer: false,
    })
    const [searchValue, setSearchValue] = useState('')
    function handleSearchChange(e) {
        let inputValue = e.target.value
        setSearchValue(inputValue)
    }

    useEffect(() => {
        if (cards) {
            setPreloaderVisible(true)
            let filtered = cards.filter((card) => {
                if (searchValue) {
                    if (card.token.name.toLowerCase().includes(`${searchValue.toLowerCase()}`)) return true
                    // if (card.buyer && !card.is_buyer && cards.bayer.user_name && cards.bayer.user_name.toLowerCase().includes(`${searchValue.toLowerCase()}`)) return true
                    // if (card.item.prew_owner && card.item.prew_owner.user_id.toLowerCase().includes(`${searchValue.toLowerCase()}`)) return true
                    // if (card.item.date.includes(`${searchValue.toLowerCase()}`)) return true
                    else return false
                }
                else if (!searchValue) return true
                else return false
            })
            // eslint-disable-next-line array-callback-return
            filtered = filtered.filter((card) => {
                if (!filters.purchase && !filters.bid && !filters.list && !filters.transfer) return true
                else {
                    if (filters.purchase) {
                        if (card.type === 'resolve_purchase') return true

                    }
                    if (filters.bid) {
                        if (card.type === 'bid') return true

                    }
                    if (filters.list) {
                        if (card.type === 'update_market_data' || card.type === 'add_market_data' || card.type === 'delete_market_data') return true

                    }
                    if (filters.transfer) {
                        if (card.type === 'nft_transfer') return true

                    }
                    else return false
                }

            })
            setFilteredCards(filtered)
            setTimeout(() => {
                setPreloaderVisible(false)
            }, 600);
        }


    }, [filters, searchValue, cards])


    function handleFiltersReset() {
        setFilters({
            purchase: false,
            list: false,
            bid: false,
            transfer: false,
        })
        setSearchValue('')
        setFiltersPopupVisible(false)
    }

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

        if (listInnerRef.current && scrollTraking && scrollPosition > prevScrollPosition) {
            // console.log(listInnerRef.current)
            setPrevScrollPosition(scrollPosition)
            const { scrollHeight } = listInnerRef.current;
            if (scrollHeight < scrollPosition) {
                setScrollTraking(false)
                setPageValue(pageValue + 1)
                setTimeout(() => {
                    setScrollTraking(true)
                }, 500);
            }
        }
    }, [scrollPosition, scrollTraking, prevScrollPosition, pageValue]);

    return (
        <>
            {cards && cards.length > 0 ?
                <div className="activity">
                    <div className={`activity__filters-popup ${isFiltersPopupVisible ? 'activity__filters-popup_active' : ''}`}>
                        <svg className="activity__filters-popup-close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                            setFiltersPopupVisible(false)
                        }}>
                            <path className="activity__filters-popup-close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                        </svg>
                        <div className="activity__filters-selectors">
                            <div className="activity__filters-selectors-row">
                                <div className={`activity__filters-selector ${filters.list ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                    setFilters({
                                        ...filters,
                                        list: !filters.list
                                    })
                                }}>
                                    <svg className="activity__filters-selector-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`activity__filters-selector-icon-fill ${filters.list ? 'activity__filters-selector-icon-fill_active' : ''}`} d="M9.9987 2.08203C5.63203 2.08203 2.08203 5.63203 2.08203 9.9987C2.08203 14.3654 5.63203 17.9154 9.9987 17.9154C14.3654 17.9154 17.9154 14.3654 17.9154 9.9987C17.9154 5.63203 14.3654 2.08203 9.9987 2.08203ZM10.832 14.1654H9.16536C8.70703 14.1654 8.33203 13.7904 8.33203 13.332C8.33203 12.8737 8.70703 12.4987 9.16536 12.4987H10.832C11.2904 12.4987 11.6654 12.8737 11.6654 13.332C11.6654 13.7904 11.2904 14.1654 10.832 14.1654ZM12.082 10.832H7.91536C7.45703 10.832 7.08203 10.457 7.08203 9.9987C7.08203 9.54036 7.45703 9.16536 7.91536 9.16536H12.082C12.5404 9.16536 12.9154 9.54036 12.9154 9.9987C12.9154 10.457 12.5404 10.832 12.082 10.832ZM13.332 7.4987H6.66536C6.20703 7.4987 5.83203 7.1237 5.83203 6.66536C5.83203 6.20703 6.20703 5.83203 6.66536 5.83203H13.332C13.7904 5.83203 14.1654 6.20703 14.1654 6.66536C14.1654 7.1237 13.7904 7.4987 13.332 7.4987Z" fill="#6F6FE9" />
                                    </svg>
                                    <p className={`activity__filters-selector-text ${filters.list ? 'activity__filters-selector-text_active' : ''}`}>Listings</p>
                                </div>
                                <div className={`activity__filters-selector ${filters.bid ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                    setFilters({
                                        ...filters,
                                        bid: !filters.bid
                                    })
                                }}>
                                    <svg className="activity__filters-selector-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`activity__filters-selector-icon-fill ${filters.bid ? 'activity__filters-selector-icon-fill_active' : ''}`} d="M14.1654 3.75H5.83203C3.76536 3.75 2.08203 5.43333 2.08203 7.5H17.9154C17.9154 5.43333 16.232 3.75 14.1654 3.75ZM2.08203 9.16667V12.5C2.08203 14.5667 3.76536 16.25 5.83203 16.25H14.1654C16.232 16.25 17.9154 14.5667 17.9154 12.5V9.16667H2.08203ZM8.33203 13.3333H5.83203C5.3737 13.3333 4.9987 12.9583 4.9987 12.5C4.9987 12.0417 5.3737 11.6667 5.83203 11.6667H8.33203C8.79037 11.6667 9.16536 12.0417 9.16536 12.5C9.16536 12.9583 8.79037 13.3333 8.33203 13.3333Z" fill="#6F6FE9" />
                                    </svg>

                                    <p className={`activity__filters-selector-text ${filters.bid ? 'activity__filters-selector-text_active' : ''}`}>Bids</p>
                                </div>
                            </div>
                            <div className="activity__filters-selectors-row">
                                <div className={`activity__filters-selector ${filters.purchase ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                    setFilters({
                                        ...filters,
                                        purchase: !filters.purchase
                                    })
                                }}>
                                    <svg className="activity__filters-selector-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`activity__filters-selector-icon-fill ${filters.purchase ? 'activity__filters-selector-icon-fill_active' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M11.769 9.36224H14.0756C14.4253 9.36224 14.7001 9.07309 14.7001 8.72442C14.7001 8.36724 14.4253 8.0866 14.0756 8.0866H11.769C11.4193 8.0866 11.1445 8.36724 11.1445 8.72442C11.1445 9.07309 11.4193 9.36224 11.769 9.36224ZM16.8151 4.94088C17.3231 4.94088 17.6561 5.11947 17.9892 5.51066C18.3223 5.90186 18.3806 6.46314 18.3056 6.97254L17.5146 12.5513C17.3647 13.6237 16.4654 14.4138 15.4079 14.4138H6.32329C5.21582 14.4138 4.29987 13.5472 4.20827 12.4246L3.4422 3.15414L2.18485 2.93303C1.85178 2.8735 1.61863 2.54183 1.67691 2.20166C1.7352 1.85384 2.05995 1.62337 2.40135 1.67525L4.3873 1.98055C4.67041 2.03243 4.87858 2.2697 4.90357 2.55884L5.06178 4.46379C5.08676 4.73678 5.30325 4.94088 5.56971 4.94088H16.8151ZM6.18989 15.7578C5.49043 15.7578 4.92421 16.3361 4.92421 17.0505C4.92421 17.7563 5.49043 18.3346 6.18989 18.3346C6.88101 18.3346 7.44724 17.7563 7.44724 17.0505C7.44724 16.3361 6.88101 15.7578 6.18989 15.7578ZM15.5576 15.7578C14.8581 15.7578 14.2919 16.3361 14.2919 17.0505C14.2919 17.7563 14.8581 18.3346 15.5576 18.3346C16.2487 18.3346 16.815 17.7563 16.815 17.0505C16.815 16.3361 16.2487 15.7578 15.5576 15.7578Z" fill="#6F6FE9" />
                                    </svg>

                                    <p className={`activity__filters-selector-text ${filters.purchase ? 'activity__filters-selector-text_active' : ''}`}>Purchases</p>
                                </div>
                                <div className={`activity__filters-selector ${filters.transfer ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                    setFilters({
                                        ...filters,
                                        transfer: !filters.transfer
                                    })
                                }}>

                                    <svg className="activity__filters-selector-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`activity__filters-selector-icon-fill ${filters.transfer ? 'activity__filters-selector-icon-fill_active' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M24.4239 21.9093L17.9672 15.5975C17.7958 15.4304 17.5159 15.4305 17.3445 15.5976L15.5669 17.3353C15.3955 17.5029 15.3955 17.7765 15.5669 17.9441L18.26 20.5767L3.44052 20.5765C3.19812 20.5765 3 20.7704 3 21.0072V23.4644C3 23.7014 3.19833 23.895 3.44052 23.895L18.26 23.8952L15.5669 26.5279C15.3955 26.6954 15.3955 26.9691 15.5669 27.1366L17.3445 28.8743C17.5159 29.0419 17.7958 29.0419 17.9672 28.8743L24.4239 22.5626C24.5152 22.4731 24.5563 22.3536 24.5501 22.2359C24.5563 22.1181 24.5154 21.9988 24.4239 21.9093Z" fill="white" />
                                        <path className={`activity__filters-selector-icon-fill ${filters.transfer ? 'activity__filters-selector-icon-fill_active' : ''}`} d="M14.0328 16.4025L7.57614 10.0907C7.48461 10.0012 7.44371 9.88194 7.44986 9.76408C7.44371 9.64642 7.48482 9.5269 7.57614 9.43742L14.0328 3.12568C14.2042 2.95811 14.4841 2.95811 14.6555 3.12568L16.4331 4.86336C16.6045 5.03093 16.6045 5.30455 16.4331 5.4721L13.74 8.10476H28.5595C28.8017 8.10476 29 8.29843 29 8.53539V10.9926C29 11.2294 28.8019 11.4233 28.5595 11.4233H13.74L16.4331 14.0559C16.6045 14.2235 16.6045 14.4971 16.4331 14.6647L14.6555 16.4024C14.4841 16.5695 14.2042 16.5696 14.0328 16.4025Z" fill="white" />
                                    </svg>

                                    <p className={`activity__filters-selector-text ${filters.transfer ? 'activity__filters-selector-text_active' : ''}`}>Transfers</p>
                                </div>
                            </div>

                        </div>
                        <p className="activity__filters-reset" onClick={handleFiltersReset}>Clear All Filters</p>
                    </div>
                    <div className="activity__row">
                        <div className="activity__cards" ref={listInnerRef}>
                            {isPreloaderVisible ?
                                <div className="activity__cards-preloader">
                                    <Preloader />
                                </div> :
                                <>
                                    {filteredCards && filteredCards.length > 0 ? filteredCards.map((item, i) => (
                                        <ActivityCard card={item} key={`ActivityCard-${i}`} user={user} />
                                    )).reverse().slice(0, 10 * pageValue + 10) :
                                        <>
                                            <img className='activity__no-cards-with-filters-gif' src={gomer} alt='gomer'></img>
                                            <p className='activity__no-cards-with-filters'>Nothing was found for these filters</p>
                                        </>
                                    }
                                </>}


                        </div>
                        <div className="activity__filters activity__filters_pc">
                            <div className="activity__filters-input-container">
                                <svg className="activity__filters-input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="activity__filters-input-icon-fill" fillRule="evenodd" clipRule="evenodd" d="M7.39293 3C4.96678 3 3 4.96678 3 7.39293C3 9.81907 4.96678 11.7859 7.39293 11.7859C9.81907 11.7859 11.7859 9.81907 11.7859 7.39293C11.7859 4.96678 9.81907 3 7.39293 3ZM2 7.39293C2 4.4145 4.4145 2 7.39293 2C10.3714 2 12.7859 4.4145 12.7859 7.39293C12.7859 8.8033 12.2445 10.0872 11.3581 11.0482L12.9667 12.8726C13.1493 13.0797 13.1295 13.3957 12.9223 13.5783C12.7152 13.7609 12.3992 13.7411 12.2166 13.534L10.6153 11.7177C9.71624 12.3887 8.60097 12.7859 7.39293 12.7859C4.4145 12.7859 2 10.3714 2 7.39293Z" fill="white" />
                                </svg>
                                <input className='activity__filters-input' placeholder="Search for activity" name="search" type="text" required value={searchValue} onChange={handleSearchChange} minLength="0" maxLength="300"></input>
                            </div>
                            <div className="activity__filters-selectors">
                                <div className="activity__filters-selectors-row">
                                    <div className={`activity__filters-selector ${filters.list ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                        setFilters({
                                            ...filters,
                                            list: !filters.list
                                        })
                                    }}>
                                        <svg className="activity__filters-selector-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={`activity__filters-selector-icon-fill ${filters.list ? 'activity__filters-selector-icon-fill_active' : ''}`} d="M9.9987 2.08203C5.63203 2.08203 2.08203 5.63203 2.08203 9.9987C2.08203 14.3654 5.63203 17.9154 9.9987 17.9154C14.3654 17.9154 17.9154 14.3654 17.9154 9.9987C17.9154 5.63203 14.3654 2.08203 9.9987 2.08203ZM10.832 14.1654H9.16536C8.70703 14.1654 8.33203 13.7904 8.33203 13.332C8.33203 12.8737 8.70703 12.4987 9.16536 12.4987H10.832C11.2904 12.4987 11.6654 12.8737 11.6654 13.332C11.6654 13.7904 11.2904 14.1654 10.832 14.1654ZM12.082 10.832H7.91536C7.45703 10.832 7.08203 10.457 7.08203 9.9987C7.08203 9.54036 7.45703 9.16536 7.91536 9.16536H12.082C12.5404 9.16536 12.9154 9.54036 12.9154 9.9987C12.9154 10.457 12.5404 10.832 12.082 10.832ZM13.332 7.4987H6.66536C6.20703 7.4987 5.83203 7.1237 5.83203 6.66536C5.83203 6.20703 6.20703 5.83203 6.66536 5.83203H13.332C13.7904 5.83203 14.1654 6.20703 14.1654 6.66536C14.1654 7.1237 13.7904 7.4987 13.332 7.4987Z" fill="#6F6FE9" />
                                        </svg>
                                        <p className={`activity__filters-selector-text ${filters.list ? 'activity__filters-selector-text_active' : ''}`}>Listings</p>
                                    </div>

                                </div>
                                <div className="activity__filters-selectors-row">
                                    <div className={`activity__filters-selector ${filters.bid ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                        setFilters({
                                            ...filters,
                                            bid: !filters.bid
                                        })
                                    }}>
                                        <svg className="activity__filters-selector-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={`activity__filters-selector-icon-fill ${filters.bid ? 'activity__filters-selector-icon-fill_active' : ''}`} d="M14.1654 3.75H5.83203C3.76536 3.75 2.08203 5.43333 2.08203 7.5H17.9154C17.9154 5.43333 16.232 3.75 14.1654 3.75ZM2.08203 9.16667V12.5C2.08203 14.5667 3.76536 16.25 5.83203 16.25H14.1654C16.232 16.25 17.9154 14.5667 17.9154 12.5V9.16667H2.08203ZM8.33203 13.3333H5.83203C5.3737 13.3333 4.9987 12.9583 4.9987 12.5C4.9987 12.0417 5.3737 11.6667 5.83203 11.6667H8.33203C8.79037 11.6667 9.16536 12.0417 9.16536 12.5C9.16536 12.9583 8.79037 13.3333 8.33203 13.3333Z" fill="#6F6FE9" />
                                        </svg>

                                        <p className={`activity__filters-selector-text ${filters.bid ? 'activity__filters-selector-text_active' : ''}`}>Bids</p>
                                    </div>
                                </div>

                                <div className="activity__filters-selectors-row">
                                    <div className={`activity__filters-selector ${filters.purchase ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                        setFilters({
                                            ...filters,
                                            purchase: !filters.purchase
                                        })
                                    }}>
                                        <svg className="activity__filters-selector-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={`activity__filters-selector-icon-fill ${filters.purchase ? 'activity__filters-selector-icon-fill_active' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M11.769 9.36224H14.0756C14.4253 9.36224 14.7001 9.07309 14.7001 8.72442C14.7001 8.36724 14.4253 8.0866 14.0756 8.0866H11.769C11.4193 8.0866 11.1445 8.36724 11.1445 8.72442C11.1445 9.07309 11.4193 9.36224 11.769 9.36224ZM16.8151 4.94088C17.3231 4.94088 17.6561 5.11947 17.9892 5.51066C18.3223 5.90186 18.3806 6.46314 18.3056 6.97254L17.5146 12.5513C17.3647 13.6237 16.4654 14.4138 15.4079 14.4138H6.32329C5.21582 14.4138 4.29987 13.5472 4.20827 12.4246L3.4422 3.15414L2.18485 2.93303C1.85178 2.8735 1.61863 2.54183 1.67691 2.20166C1.7352 1.85384 2.05995 1.62337 2.40135 1.67525L4.3873 1.98055C4.67041 2.03243 4.87858 2.2697 4.90357 2.55884L5.06178 4.46379C5.08676 4.73678 5.30325 4.94088 5.56971 4.94088H16.8151ZM6.18989 15.7578C5.49043 15.7578 4.92421 16.3361 4.92421 17.0505C4.92421 17.7563 5.49043 18.3346 6.18989 18.3346C6.88101 18.3346 7.44724 17.7563 7.44724 17.0505C7.44724 16.3361 6.88101 15.7578 6.18989 15.7578ZM15.5576 15.7578C14.8581 15.7578 14.2919 16.3361 14.2919 17.0505C14.2919 17.7563 14.8581 18.3346 15.5576 18.3346C16.2487 18.3346 16.815 17.7563 16.815 17.0505C16.815 16.3361 16.2487 15.7578 15.5576 15.7578Z" fill="#6F6FE9" />
                                        </svg>

                                        <p className={`activity__filters-selector-text ${filters.purchase ? 'activity__filters-selector-text_active' : ''}`}>Purchases</p>
                                    </div>

                                </div>
                                <div className="activity__filters-selectors-row">
                                    <div className={`activity__filters-selector ${filters.transfer ? 'activity__filters-selector_active' : ''}`} onClick={() => {
                                        setFilters({
                                            ...filters,
                                            transfer: !filters.transfer
                                        })
                                    }}>
                                        <svg className="activity__filters-selector-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={`activity__filters-selector-icon-fill ${filters.transfer ? 'activity__filters-selector-icon-fill_active' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M24.4239 21.9093L17.9672 15.5975C17.7958 15.4304 17.5159 15.4305 17.3445 15.5976L15.5669 17.3353C15.3955 17.5029 15.3955 17.7765 15.5669 17.9441L18.26 20.5767L3.44052 20.5765C3.19812 20.5765 3 20.7704 3 21.0072V23.4644C3 23.7014 3.19833 23.895 3.44052 23.895L18.26 23.8952L15.5669 26.5279C15.3955 26.6954 15.3955 26.9691 15.5669 27.1366L17.3445 28.8743C17.5159 29.0419 17.7958 29.0419 17.9672 28.8743L24.4239 22.5626C24.5152 22.4731 24.5563 22.3536 24.5501 22.2359C24.5563 22.1181 24.5154 21.9988 24.4239 21.9093Z" fill="white" />
                                            <path className={`activity__filters-selector-icon-fill ${filters.transfer ? 'activity__filters-selector-icon-fill_active' : ''}`} d="M14.0328 16.4025L7.57614 10.0907C7.48461 10.0012 7.44371 9.88194 7.44986 9.76408C7.44371 9.64642 7.48482 9.5269 7.57614 9.43742L14.0328 3.12568C14.2042 2.95811 14.4841 2.95811 14.6555 3.12568L16.4331 4.86336C16.6045 5.03093 16.6045 5.30455 16.4331 5.4721L13.74 8.10476H28.5595C28.8017 8.10476 29 8.29843 29 8.53539V10.9926C29 11.2294 28.8019 11.4233 28.5595 11.4233H13.74L16.4331 14.0559C16.6045 14.2235 16.6045 14.4971 16.4331 14.6647L14.6555 16.4024C14.4841 16.5695 14.2042 16.5696 14.0328 16.4025Z" fill="white" />
                                        </svg>

                                        <p className={`activity__filters-selector-text ${filters.transfer ? 'activity__filters-selector-text_active' : ''}`}>Transfers</p>
                                    </div>
                                </div>
                            </div>
                            <p className="activity__filters-reset" onClick={handleFiltersReset}>Clear All Filters</p>
                        </div>
                        <div className="activity__filters activity__filters_mobile">
                            <div className="activity__filters-input-container">
                                <svg className="activity__filters-input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="activity__filters-input-icon-fill" fillRule="evenodd" clipRule="evenodd" d="M7.39293 3C4.96678 3 3 4.96678 3 7.39293C3 9.81907 4.96678 11.7859 7.39293 11.7859C9.81907 11.7859 11.7859 9.81907 11.7859 7.39293C11.7859 4.96678 9.81907 3 7.39293 3ZM2 7.39293C2 4.4145 4.4145 2 7.39293 2C10.3714 2 12.7859 4.4145 12.7859 7.39293C12.7859 8.8033 12.2445 10.0872 11.3581 11.0482L12.9667 12.8726C13.1493 13.0797 13.1295 13.3957 12.9223 13.5783C12.7152 13.7609 12.3992 13.7411 12.2166 13.534L10.6153 11.7177C9.71624 12.3887 8.60097 12.7859 7.39293 12.7859C4.4145 12.7859 2 10.3714 2 7.39293Z" fill="white" />
                                </svg>
                                <input className='activity__filters-input' placeholder="Search for activity" name="search" type="text" required value={searchValue} onChange={handleSearchChange} minLength="0" maxLength="300"></input>
                            </div>
                            <div className="activity__filters-popup-btn" onClick={() => {
                                setFiltersPopupVisible(!isFiltersPopupVisible)
                            }}>
                                <p className="activity__filters-popup-btn-text">All filters</p>
                            </div>
                        </div>
                    </div>

                </div>
                :
                <div className="activity__no-cards">
                    <img className='activity__no-cards-gif' src={gomer} alt='gomer'></img>
                    <p className='activity__no-cards-title'>Nothing to see here</p>
                    <p className='activity__no-cards-text'>Come back soon! Or try to browse something for yourself on our marketplace</p>
                    <Link className='activity__no-cards-link' to='/explore-collections/collectables'>
                        <p className='activity__no-cards-link-text'>Explore collections</p>
                    </Link>
                </div>
            }

        </>

    )
};

export default Activity
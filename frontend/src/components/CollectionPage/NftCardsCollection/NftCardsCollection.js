
import NftCardCollection from '../NftCardCollection/NftCardCollection'
import './NftCardsCollection.css'

import gomer from '../../../assets/images/gif/gomer.gif'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Preloader from '../../Preloader/Preloader'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

function NftCardsCollection({ cards, usdExchangeRate, isCurrentUser, setRefreshPopupOpened, user, toggleLike, loggedIn, currentUser, setLoginPopupOpened, isExplictAccept, setExplictAccept }) {
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    const [filteredCards, setFilteredCards] = useState(undefined)
    const [catPopupOpen, setCatPopupOpen] = useState(false)
    const [pricePopupOpen, setPricePopupOpen] = useState(false)
    const [sortValue, setSortValue] = useState('Price: Low to High')
    const [sortPopupOpen, setSortPopupOpen] = useState(false)
    const [isOnlyOnSale, setOnlyOnSale] = useState(false)


    const [priceMinValue, setPriceMinValue] = useState('')
    const [priceMaxValue, setPriceMaxValue] = useState('')

    function handlePriceMinValueChange(e) {
        let inputValue = e.target.value.replace(/\D/g, '')
        setPriceMinValue(inputValue)
    }
    function handlePriceMaxValueChange(e) {
        let inputValue = e.target.value.replace(/\D/g, '')
        setPriceMaxValue(inputValue)
    }

    const [categoriesFilter, setCategoriesFilter] = useState({
        art: false,
        collectables: false,
        games: false,
        metaverses: false,
    })

    const [selectedFiat, setSelectedFiat] = useState('near')

    const [categoryBtnText, setCategoryBtnText] = useState('All')

    useEffect(() => {

        if (cards) {
            // if(!isLikeClick){
            //     setPreloaderVisible(true)
            // }
            let categoryArray = []


            // eslint-disable-next-line array-callback-return
            let filtered = cards.filter((card) => {
                if (!categoriesFilter.art && !categoriesFilter.collectables && !categoriesFilter.metaverses && !categoriesFilter.games) {
                    return true
                }
                else {
                    if (categoriesFilter.art) {
                        if (card.category === 'art') return true
                        categoryArray.push('Art')

                    }
                    if (categoriesFilter.collectables) {
                        if (card.category === 'collectables') return true
                        categoryArray.push('Collectables')

                    }
                    if (categoriesFilter.metaverses) {
                        if (card.category === 'metaverses') return true
                        categoryArray.push('Metaverses')

                    }
                    if (categoriesFilter.games) {
                        if (card.category === 'games') return true
                        categoryArray.push('Games')
                    }
                    else return false
                }

            })
            setCategoryBtnText(categoryArray.join(', '))

            setTimeout(() => {
                setFilteredCards(filtered)
                setPreloaderVisible(false)
            }, 600);



        }


    }, [categoriesFilter, cards])


    useEffect(() => {
        setPreloaderVisible(true)
        let categoryArray = []
        // eslint-disable-next-line array-callback-return

        if (!categoriesFilter.art && !categoriesFilter.collectables && !categoriesFilter.metaverses && !categoriesFilter.games) {
            setCategoryBtnText('All')
        }
        else {
            if (categoriesFilter.art) {
                categoryArray.push('Art')

            }
            if (categoriesFilter.collectables) {
                categoryArray.push('Collectables')

            }
            if (categoriesFilter.games) {

                categoryArray.push('Games')
            }
            if (categoriesFilter.metaverses) {
                categoryArray.push('Metaverses')

            }
            setCategoryBtnText(categoryArray.join(', '))
        }






    }, [categoriesFilter])

    // useEffect(() => {
    //  console.log(cards)


    // }, [currentUser, cards])


    function handlePricePopupReset() {
        setPriceMinValue('')
        setPriceMaxValue('')
        setSelectedFiat('near')
        setPricePopupOpen(false)
        setPreloaderVisible(true)
        setPriceRangeBtnValue('Any')
        // eslint-disable-next-line array-callback-return
        let filtered = cards.filter((card) => {
            if (!categoriesFilter.art && !categoriesFilter.collectables && !categoriesFilter.metaverses && !categoriesFilter.games) return true
            else {
                if (categoriesFilter.art) {
                    if (card.category === 'art') return true

                }
                if (categoriesFilter.collectables) {
                    if (card.category === 'collectables') return true

                }
                if (categoriesFilter.metaverses) {
                    if (card.category === 'metaverses') return true

                }
                if (categoriesFilter.games) {
                    if (card.category === 'games') return true

                }
                else return false
            }

        })
        setFilteredCards(filtered)
        setTimeout(() => {
            setPreloaderVisible(false)
        }, 600);
    }

    const [pricePriceRangeBtnValue, setPriceRangeBtnValue] = useState('Any')

    function handlePricePopupApply() {
        setPreloaderVisible(true)
        setPricePopupOpen(false)
        // eslint-disable-next-line array-callback-return
        let filtered = cards.filter((card) => {
            if (!categoriesFilter.art && !categoriesFilter.collectables && !categoriesFilter.metaverses && !categoriesFilter.games) return true
            else {
                if (categoriesFilter.art) {
                    if (card.category === 'art') return true

                }
                if (categoriesFilter.collectables) {
                    if (card.category === 'collectables') return true

                }
                if (categoriesFilter.metaverses) {
                    if (card.category === 'metaverses') return true

                }
                if (categoriesFilter.games) {
                    if (card.category === 'games') return true

                }
                else return false
            }

        })
        if (priceMinValue && priceMaxValue && Number(priceMinValue) > Number(priceMaxValue)) {
            let priceMin = priceMaxValue
            let priceMax = priceMinValue
            setPriceMinValue(priceMin)
            setPriceMaxValue(priceMax)
            if (selectedFiat === 'near') {
                if (priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`${priceMinValue} - ${priceMaxValue} Near`)
                } else if (priceMinValue && !priceMaxValue) {
                    setPriceRangeBtnValue(`From ${priceMinValue} Near`)
                } else if (!priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`Up to ${priceMaxValue} Near`)
                } else {
                    setPriceRangeBtnValue('Any')
                }
            } else {
                if (priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`$${priceMinValue} - $${priceMaxValue}`)
                } else if (priceMinValue && !priceMaxValue) {
                    setPriceRangeBtnValue(`From $${priceMinValue}`)
                } else if (!priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`Up to $${priceMaxValue}`)
                } else {
                    setPriceRangeBtnValue('Any')
                }
            }
            filtered = filtered.filter((card) => {

                if (card.price) {
                    if (selectedFiat === 'near') {
                        if (priceMin && priceMax) {

                            if (Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) >= priceMin && Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) <= priceMax) return true
                            else return false
                        } else if (priceMin && !priceMax) {

                            if (Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) >= priceMin) return true
                            else return false
                        } else if (!priceMin && priceMax) {

                            if (Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) <= priceMax) return true
                            else return false
                        } else {

                            return true
                        }

                    } else {
                        if (priceMin && priceMax) {

                            if (Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate >= priceMin && Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate <= priceMax) return true
                            else return false
                        } else if (priceMin && !priceMax) {

                            if (Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate >= priceMin) return true
                            else return false
                        } else if (!priceMin && priceMax) {

                            if (Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate <= priceMax) return true
                            else return false
                        } else {

                            return true
                        }
                    }
                }
                else return false

            })

        } else {
            if (selectedFiat === 'near') {
                if (priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`${priceMinValue} - ${priceMaxValue} Near`)
                } else if (priceMinValue && !priceMaxValue) {
                    setPriceRangeBtnValue(`From ${priceMinValue} Near`)
                } else if (!priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`Up to ${priceMaxValue} Near`)
                } else {
                    setPriceRangeBtnValue('Any')
                }
            } else {
                if (priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`$${priceMinValue} - $${priceMaxValue}`)
                } else if (priceMinValue && !priceMaxValue) {
                    setPriceRangeBtnValue(`From $${priceMinValue}`)
                } else if (!priceMinValue && priceMaxValue) {
                    setPriceRangeBtnValue(`Up to $${priceMaxValue}`)
                } else {
                    setPriceRangeBtnValue('Any')
                }
            }
            filtered = filtered.filter((card) => {
                if (card.price) {

                    if (selectedFiat === 'near') {
                        if (priceMinValue && priceMaxValue) {

                            if (Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) >= priceMinValue && Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) <= priceMaxValue) return true
                            else return false
                        } else if (priceMinValue && !priceMaxValue) {

                            if (Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) >= priceMinValue) return true
                            else return false
                        } else if (!priceMinValue && priceMaxValue) {

                            if (Number(Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4)) <= priceMaxValue) return true
                            else return false
                        } else {

                            return true
                        }

                    } else {
                        if (priceMinValue && priceMaxValue) {

                            if (Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate >= priceMinValue && Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate <= priceMaxValue) return true
                            else return false
                        } else if (priceMinValue && !priceMaxValue) {

                            if (Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate >= priceMinValue) return true
                            else return false
                        } else if (!priceMinValue && priceMaxValue) {

                            if (Number(`${formatNearAmount(card.price)}`.split(',').join('')).toFixed(4) * usdExchangeRate <= priceMaxValue) return true
                            else return false
                        } else {

                            return true
                        }
                    }
                } else return false


            })
        }

        setFilteredCards(filtered)
        // filtered = filtered.sort(function (a, b) {

        //     if (a.search_points < b.search_points) return 1;
        //     if (b.search_points < a.search_points) return -1;

        //     return 0;
        //   })
        setTimeout(() => {
            setPreloaderVisible(false)
        }, 600);
    }

    function handlePreloader() {
        setPreloaderVisible(true)
        setTimeout(() => {
            setPreloaderVisible(false)
        }, 600);
    }

    function handleRefresh() {
        setRefreshPopupOpened(true)
    }

    // function handleScroll(e) {
    //     const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    //     console.log(e.target.scrollHeight)
    //     if (bottom) { 
    //         console.log('bottom')
    //      }
    //   }

    const listInnerRef = useRef();

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    function handleResize() {
        setScreenWidth(window.innerWidth)
        window.removeEventListener('resize', handleResize);
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

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

    // useEffect(() => {
    //     console.log(pageValue)

    // }, [pageValue]);


    const categoryRef = useRef(null);
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (categoryRef.current && !categoryRef.current.contains(event.target) && catPopupOpen) {
                setCatPopupOpen(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [categoryRef, catPopupOpen])


    const priceRef = useRef(null);
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (priceRef.current && !priceRef.current.contains(event.target) && pricePopupOpen) {
                setPricePopupOpen(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [priceRef, pricePopupOpen])

    const sortRef = useRef(null);
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (sortRef.current && !sortRef.current.contains(event.target) && sortPopupOpen) {
                setSortPopupOpen(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sortRef, sortPopupOpen])


    return (
        <>
            {cards && cards.length > 0 ?
                <div className="nft-cards-collection">
                    <div className="nft-cards-collection__filters">
                        <div className="nft-cards-collection__category-and-price">
                            <div className="nft-cards-collection__btn-box">
                                <div className="nft-cards-collection__btn" onClick={() => {
                                    setCatPopupOpen(!catPopupOpen)
                                    setPricePopupOpen(false)
                                    setSortPopupOpen(false)
                                }}>
                                    <p className="nft-cards-collection__btn-sort-by-text">Category</p>
                                    <svg className="nft-cards-collection__btn-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="nft-cards-collection__btn-icon-stroke" d="M5.73605 1H3.03202C1.91201 1 1 1.92001 1 3.04882V5.77605C1 6.91206 1.91201 7.82407 3.03202 7.82407H5.73605C6.86406 7.82407 7.76807 6.91206 7.76807 5.77605V3.04882C7.76807 1.92001 6.86406 1 5.73605 1" stroke="white" />
                                        <path className="nft-cards-collection__btn-icon-stroke" d="M5.73605 10.1758H3.03202C1.91201 10.1758 1 11.0886 1 12.2246V14.9518C1 16.0798 1.91201 16.9999 3.03202 16.9999H5.73605C6.86406 16.9999 7.76807 16.0798 7.76807 14.9518V12.2246C7.76807 11.0886 6.86406 10.1758 5.73605 10.1758" stroke="white" />
                                        <path className="nft-cards-collection__btn-icon-stroke" d="M14.9685 1H12.2644C11.1364 1 10.2324 1.92001 10.2324 3.04882V5.77605C10.2324 6.91206 11.1364 7.82407 12.2644 7.82407H14.9685C16.0885 7.82407 17.0005 6.91206 17.0005 5.77605V3.04882C17.0005 1.92001 16.0885 1 14.9685 1" stroke="white" strokeOpacity="0.4" />
                                        <path className="nft-cards-collection__btn-icon-stroke" d="M14.9685 10.1758H12.2644C11.1364 10.1758 10.2324 11.0886 10.2324 12.2246V14.9518C10.2324 16.0798 11.1364 16.9999 12.2644 16.9999H14.9685C16.0885 16.9999 17.0005 16.0798 17.0005 14.9518V12.2246C17.0005 11.0886 16.0885 10.1758 14.9685 10.1758" stroke="white" />
                                    </svg>
                                    <p className="nft-cards-collection__btn-text">{categoryBtnText ? categoryBtnText : 'All'}</p>

                                </div>
                                <div ref={categoryRef} className={`nft-cards-collection__cetegory_popup ${catPopupOpen ? 'nft-cards-collection__cetegory_popup_active' : ''}`}>
                                    <svg className="nft-cards-collection__cetegory_popup-close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                                        setCatPopupOpen(false)
                                    }}>
                                        <path className="nft-cards-collection__cetegory_popup-close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                                    </svg>
                                    <div className='nft-cards-collection__cetegory_popup__selectors'>
                                        <div className='nft-cards-collection__cetegory_popup__selector' onClick={() => {
                                            setCategoriesFilter({
                                                ...categoriesFilter,
                                                art: !categoriesFilter.art
                                            })
                                        }}>
                                            <svg className='nft-cards-collection__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                            </svg>
                                            <p className='nft-cards-collection__cetegory_popup__selector-name'>Art</p>
                                            <svg className={`nft-cards-collection__cetegory_popup__selector-tick ${categoriesFilter.art ? 'nft-cards-collection__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>

                                        <div className='nft-cards-collection__cetegory_popup__selector' onClick={() => {
                                            setCategoriesFilter({
                                                ...categoriesFilter,
                                                collectables: !categoriesFilter.collectables
                                            })
                                        }}>
                                            <svg className='nft-cards-collection__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                            </svg>
                                            <p className='nft-cards-collection__cetegory_popup__selector-name'>Collectables</p>
                                            <svg className={`nft-cards-collection__cetegory_popup__selector-tick ${categoriesFilter.collectables ? 'nft-cards-collection__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>
                                        <div className='nft-cards-collection__cetegory_popup__selector' onClick={() => {
                                            setCategoriesFilter({
                                                ...categoriesFilter,
                                                games: !categoriesFilter.games
                                            })
                                        }}>
                                            <svg className='nft-cards-collection__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                            </svg>
                                            <p className='nft-cards-collection__cetegory_popup__selector-name'>Games</p>
                                            <svg className={`nft-cards-collection__cetegory_popup__selector-tick ${categoriesFilter.games ? 'nft-cards-collection__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>
                                        <div className='nft-cards-collection__cetegory_popup__selector' onClick={() => {
                                            setCategoriesFilter({
                                                ...categoriesFilter,
                                                metaverses: !categoriesFilter.metaverses
                                            })
                                        }}>
                                            <svg className='nft-cards-collection__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                                <path className='nft-cards-collection__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                            </svg>
                                            <p className='nft-cards-collection__cetegory_popup__selector-name'>Metaverses</p>
                                            <svg className={`nft-cards-collection__cetegory_popup__selector-tick ${categoriesFilter.metaverses ? 'nft-cards-collection__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="nft-cards-collection__btn-box">
                                <div className="nft-cards-collection__btn" onClick={() => {
                                    setPricePopupOpen(!pricePopupOpen)
                                    setCatPopupOpen(false)
                                    setSortPopupOpen(false)
                                }}>
                                    <p className="nft-cards-collection__btn-sort-by-text">Price range</p>
                                    <svg className="nft-cards-collection__btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="nft-cards-collection__btn-icon-fill" d="M11.0228 8.02143C10.6186 7.76158 10.1794 7.56049 9.71859 7.42396C9.45126 7.34136 9.12801 7.25599 8.77791 7.15721C8.48131 7.07462 8.16045 6.99724 7.66088 6.89047L7.66069 6.89065C7.12828 6.7783 6.60556 6.62391 6.09735 6.42934C5.80448 6.31773 5.54442 6.13432 5.34102 5.89605C5.16653 5.66707 5.08022 5.38319 5.09774 5.096V5.01862C5.1134 4.76657 5.2068 4.52533 5.36507 4.32795C5.59884 4.04856 5.90478 3.83838 6.24963 3.72004C6.77402 3.53775 7.32733 3.45181 7.88251 3.46669C8.29618 3.46632 8.70799 3.52194 9.10653 3.63206C9.39474 3.71223 9.66619 3.84319 9.90834 4.0186C10.0717 4.13653 10.2113 4.28385 10.32 4.45331L10.7528 5.12536L12.108 4.26673L11.6751 3.59468H11.6749C11.4579 3.25651 11.1785 2.96244 10.8519 2.72806C10.4611 2.44383 10.0232 2.23087 9.55829 2.09858C9.25554 2.0119 8.94628 1.9494 8.63364 1.91201V0H7.03002V1.90944C6.58615 1.95836 6.14899 2.0549 5.72582 2.19739C5.10073 2.41056 4.54632 2.79058 4.12239 3.29596L4.10095 3.32256V3.32275C3.72326 3.79951 3.50888 4.38471 3.48894 4.99204C3.44699 5.66152 3.64702 6.32391 4.05284 6.85867L4.0795 6.89067C4.45999 7.3544 4.95457 7.71191 5.51475 7.92805C6.10013 8.15276 6.70246 8.33114 7.31595 8.46134C7.77567 8.56272 8.07228 8.6347 8.36364 8.72808C8.70833 8.81347 8.99708 8.89066 9.25102 8.96804H9.25083C9.56532 9.06068 9.86489 9.19703 10.1408 9.37336C10.3218 9.48999 10.475 9.64476 10.5899 9.82668C10.7148 10.0573 10.7774 10.3166 10.7716 10.5787V10.6161C10.7802 10.9346 10.6866 11.2476 10.5043 11.5094C10.2599 11.8393 9.9247 12.0914 9.53957 12.2348C8.98965 12.4511 8.40111 12.5527 7.81034 12.5333H7.75963C7.1135 12.5551 6.47166 12.4206 5.8889 12.1414C5.57664 11.9751 5.30896 11.7365 5.10852 11.4454L4.6516 10.7893L3.33398 11.7013L3.7909 12.3574C4.1425 12.8659 4.6119 13.2822 5.15925 13.5707C5.82815 13.8962 6.5546 14.0875 7.29733 14.1334V16H8.90095L8.90076 14.056C9.32077 13.9918 9.73221 13.8808 10.1276 13.7253C10.7998 13.4708 11.3839 13.027 11.8086 12.4479C12.1949 11.9032 12.3936 11.2483 12.3751 10.5813C12.3956 10.0733 12.2814 9.56881 12.0438 9.11886C11.8063 8.66889 11.4542 8.28942 11.0228 8.01861L11.0228 8.02143Z" fill="white" />
                                    </svg>

                                    <p className="nft-cards-collection__btn-text">{pricePriceRangeBtnValue}</p>
                                </div>
                                <div ref={priceRef} className={`nft-cards-collection__price_popup ${pricePopupOpen ? 'nft-cards-collection__price_popup_active' : ''}`}>
                                    <svg className="nft-cards-collection__price_popup-close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                                        setPricePopupOpen(false)
                                    }}>
                                        <path className="nft-cards-collection__price_popup-close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                                    </svg>
                                    <p className="nft-cards-collection__price_popup-title">Price Range</p>
                                    <div className="nft-cards-collection__price_popup-fiat-selectors">
                                        <div className="nft-cards-collection__price_popup-fiat-selector" onClick={() => {
                                            setSelectedFiat('near')
                                        }}>
                                            <div className="nft-cards-collection__price_popup-fiat-icon-container">
                                                <svg className="nft-cards-collection__price_popup-fiat-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="nft-cards-collection__price_popup-fiat-icon-fill" d="M12.8422 0.812222L9.49778 5.77778C9.45014 5.84929 9.43002 5.93563 9.44112 6.02083C9.45222 6.10604 9.49381 6.18434 9.55818 6.24125C9.62254 6.29817 9.70535 6.32985 9.79127 6.33044C9.87719 6.33102 9.96041 6.30048 10.0256 6.24444L13.3178 3.38889C13.3371 3.37163 13.361 3.36036 13.3866 3.35645C13.4122 3.35255 13.4383 3.35618 13.4619 3.3669C13.4855 3.37762 13.5054 3.39497 13.5193 3.41683C13.5331 3.43869 13.5403 3.46411 13.54 3.49V12.43C13.54 12.4574 13.5316 12.4841 13.5158 12.5065C13.5001 12.5289 13.4779 12.5459 13.4522 12.5553C13.4265 12.5646 13.3985 12.5658 13.3721 12.5587C13.3456 12.5516 13.322 12.5365 13.3044 12.5156L3.35333 0.603333C3.19327 0.414328 2.99397 0.26245 2.76928 0.158259C2.54458 0.054068 2.2999 6.34381e-05 2.05222 5.88875e-08H1.70444C1.2524 5.88875e-08 0.818865 0.179575 0.49922 0.49922C0.179575 0.818865 0 1.2524 0 1.70444V14.2956C0 14.7476 0.179575 15.1811 0.49922 15.5008C0.818865 15.8204 1.2524 16 1.70444 16C1.99591 16.0001 2.28253 15.9255 2.53695 15.7833C2.79137 15.6411 3.00512 15.4361 3.15778 15.1878L6.50222 10.2222C6.54986 10.1507 6.56998 10.0644 6.55888 9.97917C6.54778 9.89396 6.50619 9.81566 6.44182 9.75875C6.37746 9.70183 6.29465 9.67015 6.20873 9.66956C6.12281 9.66898 6.03958 9.69952 5.97444 9.75556L2.68222 12.6111C2.66293 12.6284 2.63903 12.6396 2.61343 12.6435C2.58784 12.6475 2.56167 12.6438 2.5381 12.6331C2.51454 12.6224 2.49461 12.605 2.48074 12.5832C2.46687 12.5613 2.45966 12.5359 2.46 12.51V3.56778C2.46001 3.54041 2.46844 3.51371 2.48415 3.49129C2.49986 3.46888 2.52209 3.45185 2.54782 3.4425C2.57354 3.43316 2.60152 3.43196 2.62795 3.43907C2.65438 3.44617 2.67798 3.46124 2.69556 3.48222L12.6456 15.3967C12.8056 15.5857 13.0049 15.7375 13.2296 15.8417C13.4543 15.9459 13.699 15.9999 13.9467 16H14.2944C14.5184 16.0001 14.7401 15.9562 14.947 15.8706C15.154 15.785 15.342 15.6595 15.5004 15.5012C15.6588 15.3429 15.7844 15.1549 15.8702 14.9481C15.9559 14.7412 16 14.5195 16 14.2956V1.70444C16 1.2524 15.8204 0.818865 15.5008 0.49922C15.1811 0.179575 14.7476 5.88875e-08 14.2956 5.88875e-08C14.0041 -7.65219e-05 13.7175 0.0745408 13.463 0.216731C13.2086 0.358921 12.9949 0.563939 12.8422 0.812222Z" fill="white" />
                                                </svg>
                                            </div>
                                            <p className="nft-cards-collection__price_popup-fiat-name">Near</p>
                                            <svg className={`nft-cards-collection__cetegory_popup__selector-tick ${selectedFiat === 'near' ? 'nft-cards-collection__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>
                                        </div>
                                        <div className="nft-cards-collection__price_popup-fiat-selector" onClick={() => {
                                            setSelectedFiat('dollars')
                                        }}>
                                            <div className="nft-cards-collection__price_popup-fiat-icon-container">
                                                <svg className="nft-cards-collection__price_popup-fiat-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className="nft-cards-collection__price_popup-fiat-icon-fill" d="M11.0228 8.02143C10.6186 7.76158 10.1794 7.56049 9.71859 7.42396C9.45126 7.34136 9.12801 7.25599 8.77791 7.15721C8.48131 7.07462 8.16045 6.99724 7.66088 6.89047L7.66069 6.89065C7.12828 6.7783 6.60556 6.62391 6.09735 6.42934C5.80448 6.31773 5.54442 6.13432 5.34102 5.89605C5.16653 5.66707 5.08022 5.38319 5.09774 5.096V5.01862C5.1134 4.76657 5.2068 4.52533 5.36507 4.32795C5.59884 4.04856 5.90478 3.83838 6.24963 3.72004C6.77402 3.53775 7.32733 3.45181 7.88251 3.46669C8.29618 3.46632 8.70799 3.52194 9.10653 3.63206C9.39474 3.71223 9.66619 3.84319 9.90834 4.0186C10.0717 4.13653 10.2113 4.28385 10.32 4.45331L10.7528 5.12536L12.108 4.26673L11.6751 3.59468H11.6749C11.4579 3.25651 11.1785 2.96244 10.8519 2.72806C10.4611 2.44383 10.0232 2.23087 9.55829 2.09858C9.25554 2.0119 8.94628 1.9494 8.63364 1.91201V0H7.03002V1.90944C6.58615 1.95836 6.14899 2.0549 5.72582 2.19739C5.10073 2.41056 4.54632 2.79058 4.12239 3.29596L4.10095 3.32256V3.32275C3.72326 3.79951 3.50888 4.38471 3.48894 4.99204C3.44699 5.66152 3.64702 6.32391 4.05284 6.85867L4.0795 6.89067C4.45999 7.3544 4.95457 7.71191 5.51475 7.92805C6.10013 8.15276 6.70246 8.33114 7.31595 8.46134C7.77567 8.56272 8.07228 8.6347 8.36364 8.72808C8.70833 8.81347 8.99708 8.89066 9.25102 8.96804H9.25083C9.56532 9.06068 9.86489 9.19703 10.1408 9.37336C10.3218 9.48999 10.475 9.64476 10.5899 9.82668C10.7148 10.0573 10.7774 10.3166 10.7716 10.5787V10.6161C10.7802 10.9346 10.6866 11.2476 10.5043 11.5094C10.2599 11.8393 9.9247 12.0914 9.53957 12.2348C8.98965 12.4511 8.40111 12.5527 7.81034 12.5333H7.75963C7.1135 12.5551 6.47166 12.4206 5.8889 12.1414C5.57664 11.9751 5.30896 11.7365 5.10852 11.4454L4.6516 10.7893L3.33398 11.7013L3.7909 12.3574C4.1425 12.8659 4.6119 13.2822 5.15925 13.5707C5.82815 13.8962 6.5546 14.0875 7.29733 14.1334V16H8.90095L8.90076 14.056C9.32077 13.9918 9.73221 13.8808 10.1276 13.7253C10.7998 13.4708 11.3839 13.027 11.8086 12.4479C12.1949 11.9032 12.3936 11.2483 12.3751 10.5813C12.3956 10.0733 12.2814 9.56881 12.0438 9.11886C11.8063 8.66889 11.4542 8.28942 11.0228 8.01861L11.0228 8.02143Z" fill="white" />
                                                </svg>
                                            </div>
                                            <p className="nft-cards-collection__price_popup-fiat-name">Dollars</p>
                                            <svg className={`nft-cards-collection__cetegory_popup__selector-tick ${selectedFiat === 'dollars' ? 'nft-cards-collection__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards-collection__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="nft-cards-collection__price_popup-fiat-inputs">
                                        <div className="nft-cards-collection__price_popup-fiat-input-container">
                                            <input className='nft-cards-collection__price_popup-fiat-input' placeholder="Min" name="minvalue" type="text" required value={priceMinValue} onChange={handlePriceMinValueChange} minLength="0" maxLength="300"></input>
                                        </div>
                                        <p className="nft-cards-collection__price_popup-fiat-input-separetor">to</p>
                                        <div className="nft-cards-collection__price_popup-fiat-input-container">
                                            <input className='nft-cards-collection__price_popup-fiat-input' placeholder="Max" name="maxvalue" type="text" required value={priceMaxValue} onChange={handlePriceMaxValueChange} minLength="0" maxLength="300"></input>
                                        </div>
                                    </div>
                                    <div className="nft-cards-collection__price_popup-fiat-btns">
                                        <div className="nft-cards-collection__price_popup-fiat-btn nft-cards-collection__price_popup-fiat-btn_reset" onClick={handlePricePopupReset}>
                                            <p className="nft-cards-collection__price_popup-fiat-btn-text">Clear</p>
                                        </div>
                                        <div className="nft-cards-collection__price_popup-fiat-btn nft-cards-collection__price_popup-fiat-btn_apply" onClick={handlePricePopupApply}>
                                            <p className="nft-cards-collection__price_popup-fiat-btn-text nft-cards-collection__price_popup-fiat-btn-text_apply">Apply</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="nft-cards__category-and-price">
                            <div className="nft-cards__btn-box nft-cards__btn-box_for-sale nft-cards__btn-box_for-sale_pc">
                                <div className="nft-cards__btn nft-cards__btn_for-sale" onClick={() => {
                                    handlePreloader()
                                    setOnlyOnSale(!isOnlyOnSale)
                                    // setSortPopupOpen(false)
                                }}>
                                    <div className={`nft-cards__selector ${isOnlyOnSale ? 'nft-cards__selector_selected' : ''}`} onClick={() => { }}>
                                        <svg className='nft-cards__selector-tick' width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className={`nft-cards__selector-tick-fill ${isOnlyOnSale ? 'nft-cards__selector-tick-fill_selected' : ''}`} d="M4.97797 10.7881C4.85384 10.9241 4.68458 11 4.50868 11C4.33278 11 4.16352 10.9241 4.03939 10.7881L0.291728 6.70344C-0.0972428 6.27957 -0.0972428 5.59241 0.291728 5.16926L0.761016 4.65787C1.14999 4.234 1.77991 4.234 2.16888 4.65787L4.50868 7.20759L10.8311 0.317902C11.2201 -0.105967 11.8507 -0.105967 12.239 0.317902L12.7083 0.829295C13.0972 1.25316 13.0972 1.94033 12.7083 2.36347L4.97797 10.7881Z" fill="white" />
                                        </svg>
                                    </div>
                                    <p className='nft-cards__cetegory_popup__selector-name nft-cards__cetegory_popup__selector-name_for-sale'>For sale only</p>

                                </div>
                            </div>
                            <div className="nft-cards__btn-box">
                                <div className="nft-cards__btn nft-cards__btn_sort" onClick={() => {
                                    setSortPopupOpen(!sortPopupOpen)
                                    setPricePopupOpen(false)
                                    setCatPopupOpen(false)
                                }}>
                                    <p className="nft-cards__btn-sort-by-text">Sort by</p>
                                    <svg className="nft-cards__btn-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="nft-cards__btn-icon-stroke" d="M1.59961 4H14.3996" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        <path className="nft-cards__btn-icon-stroke" d="M3.19922 8H12.7992" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        <path className="nft-cards__btn-icon-stroke" d="M4.80078 12H11.2008" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <p className="nft-cards__btn-text">{sortValue}</p>
                                </div>
                                <div ref={sortRef} className={`nft-cards__cetegory_popup nft-cards__cetegory_popup_sort ${sortPopupOpen ? 'nft-cards__cetegory_popup_active' : ''}`}>
                                    <svg className="nft-cards__cetegory_popup-close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                                        setSortPopupOpen(false)
                                    }}>
                                        <path className="nft-cards__cetegory_popup-close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                                    </svg>
                                    <div className='nft-cards__cetegory_popup__selectors'>
                                        {/* <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                        setSortValue('Volume: High to Low')
                                        setSortPopupOpen(false)
                                    }}>

                                        <p className='nft-cards__cetegory_popup__selector-name'>Volume: High to Low</p>
                                        <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Volume: High to Low' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div>
                                    <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                        setSortValue('Volume: Low to High')
                                        setSortPopupOpen(false)
                                    }}>

                                        <p className='nft-cards__cetegory_popup__selector-name'>Volume: Low to High</p>
                                        <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Volume: Low to High' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div> */}

                                        <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                            handlePreloader()
                                            setSortValue('Price: Low to High')
                                            setSortPopupOpen(false)
                                        }}>

                                            <p className='nft-cards__cetegory_popup__selector-name'>Price: Low to High</p>
                                            <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Price: Low to High' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>
                                        <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                            setSortValue('Price: High to Low')
                                            setSortPopupOpen(false)
                                            handlePreloader()
                                        }}>

                                            <p className='nft-cards__cetegory_popup__selector-name'>Price: High to Low</p>
                                            <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Price: High to Low' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>

                                        <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                            handlePreloader()
                                            setSortValue('Rank: Low to High')
                                            setSortPopupOpen(false)
                                        }}>

                                            <p className='nft-cards__cetegory_popup__selector-name'>Rank: Low to High</p>
                                            <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Rank: Low to High' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>
                                        <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                            handlePreloader()
                                            setSortValue('Rank: High to Low')
                                            setSortPopupOpen(false)
                                        }}>

                                            <p className='nft-cards__cetegory_popup__selector-name'>Rank: High to Low</p>
                                            <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Rank: High to Low' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                            </svg>

                                        </div>
                                        {/* <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                        handlePreloader()
                                        setSortValue('Likes: High to Low')
                                        setSortPopupOpen(false)
                                    }}>

                                        <p className='nft-cards__cetegory_popup__selector-name'>Likes: High to Low</p>
                                        <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Likes: High to Low' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div>
                                    <div className='nft-cards__cetegory_popup__selector' onClick={() => {
                                        handlePreloader()
                                        setSortValue('Likes: Low to High')
                                        setSortPopupOpen(false)
                                    }}>

                                        <p className='nft-cards__cetegory_popup__selector-name'>Likes: Low to High</p>
                                        <svg className={`nft-cards__cetegory_popup__selector-tick ${sortValue === 'Likes: Low to High' ? 'nft-cards__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='nft-cards__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="nft-cards__sort-mobile-btn" onClick={() => {
                            setSortPopupOpen(!sortPopupOpen)
                            setPricePopupOpen(false)
                            setCatPopupOpen(false)
                        }}>
                            <svg className="nft-cards__sort-mobile-btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="nft-cards__sort-mobile-btn-icon-fill" d="M2.63033 3.68044L8.25537 11.0879V16.5046C8.25537 16.6667 8.34789 16.8056 8.46367 16.8981L11.3109 18.6806C11.3803 18.7269 11.473 18.75 11.5655 18.75C11.6349 18.75 11.7276 18.7269 11.7971 18.6806C11.9359 18.588 12.0286 18.449 12.0286 18.2871L12.0288 11.0879L17.6538 3.68048L17.6769 3.65739C17.8158 3.42585 17.839 3.12502 17.7 2.8935C17.5611 2.66195 17.3065 2.5 17.0518 2.5H3.23229C2.95456 2.5 2.69992 2.63887 2.58414 2.8935C2.46837 3.14814 2.46837 3.42587 2.60723 3.65739L2.63032 3.68048L2.63033 3.68044ZM16.6582 3.4258L11.1952 10.6712C11.1258 10.7407 11.1027 10.8564 11.1027 10.949V17.4536L9.18137 16.2499L9.18121 10.9489C9.18121 10.8564 9.15812 10.7406 9.08869 10.6712L3.60254 3.42576L16.6582 3.4258Z" fill="white" />
                            </svg>

                        </div>
                    </div>
                    <div className='nfr-cards__filters nfr-cards__filters_mobile'>
                        <div className="nft-cards__btn-box nft-cards__btn-box_for-sale">
                            <div className="nft-cards__btn nft-cards__btn_for-sale" onClick={() => {
                                handlePreloader()
                                setOnlyOnSale(!isOnlyOnSale)
                                // setSortPopupOpen(false)
                            }}>
                                <div className={`nft-cards__selector ${isOnlyOnSale ? 'nft-cards__selector_selected' : ''}`} onClick={() => { }}>
                                    <svg className='nft-cards__selector-tick' width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`nft-cards__selector-tick-fill ${isOnlyOnSale ? 'nft-cards__selector-tick-fill_selected' : ''}`} d="M4.97797 10.7881C4.85384 10.9241 4.68458 11 4.50868 11C4.33278 11 4.16352 10.9241 4.03939 10.7881L0.291728 6.70344C-0.0972428 6.27957 -0.0972428 5.59241 0.291728 5.16926L0.761016 4.65787C1.14999 4.234 1.77991 4.234 2.16888 4.65787L4.50868 7.20759L10.8311 0.317902C11.2201 -0.105967 11.8507 -0.105967 12.239 0.317902L12.7083 0.829295C13.0972 1.25316 13.0972 1.94033 12.7083 2.36347L4.97797 10.7881Z" fill="white" />
                                    </svg>
                                </div>
                                <p className='nft-cards__btn-text'>For sale only</p>

                            </div>
                        </div>
                    </div>
                    {isPreloaderVisible ?
                        <div className="nft-cards-collection__cards-preloader">
                            <Preloader />
                        </div> :
                        <>
                            {filteredCards && filteredCards.length > 0 && filteredCards.filter((item) => {
                                if (isOnlyOnSale) {
                                    if (item.price && item.price > 0) return true
                                    else return false
                                }
                                else {
                                    return true
                                }
                            }).length > 0 ?
                                <div className="nft-cards-collection__cards"
                                    ref={listInnerRef}>
                                    {filteredCards.sort(function (a, b) {
                                        if (sortValue === 'Price: High to Low') {

                                            if (a.price && b.price) {
                                                if (Number(Number(`${formatNearAmount(a.price)}`.split(',').join('')).toFixed(4)) < Number(Number(`${formatNearAmount(b.price)}`.split(',').join('')).toFixed(4))) return 1;
                                                else if (Number(Number(`${formatNearAmount(b.price)}`.split(',').join('')).toFixed(4)) < Number(Number(`${formatNearAmount(a.price)}`.split(',').join('')).toFixed(4))) return -1;
                                                else return 0;
                                            } else if (!a.price && b.price) {
                                                return 1;
                                            } else if (a.price && !b.price) {
                                                return -1;
                                            }
                                            else {
                                                return 0;
                                            }

                                        } else if (sortValue === 'Price: Low to High') {
                                            if (a.price && b.price) {
                                                if (Number(Number(`${formatNearAmount(a.price)}`.split(',').join('')).toFixed(4)) < Number(Number(`${formatNearAmount(b.price)}`.split(',').join('')).toFixed(4))) return -1;
                                                else if (Number(Number(`${formatNearAmount(b.price)}`.split(',').join('')).toFixed(4)) < Number(Number(`${formatNearAmount(a.price)}`.split(',').join('')).toFixed(4))) return 1;
                                                else return 0;
                                            } else if (!a.price && b.price) {
                                                return 1;
                                            } else if (a.price && !b.price) {
                                                return -1;
                                            }
                                            else {
                                                return 0;
                                            }
                                        } else if (sortValue === 'Rank: High to Low') {
                                            if (a.rank && b.rank) {
                                                if (a.rank < b.rank) return 1;
                                                else if (b.rank < a.rank) return -1;
                                                else return 0;
                                            } else if (!a.rank && b.rank) {
                                                return 1;
                                            } else if (a.rank && !b.rank) {
                                                return -1;
                                            }
                                            else {
                                                return 0;
                                            }
                                        } else if (sortValue === 'Rank: Low to High') {
                                            if (a.rank && b.rank) {
                                                if (a.rank < b.rank) return -1;
                                                else if (b.rank < a.rank) return 1;
                                                else return 0;
                                            } else if (!a.rank && b.rank) {
                                                return 1;
                                            } else if (a.rank && !b.rank) {
                                                return -1;
                                            }
                                            else {
                                                return 0;
                                            }
                                        } else if (sortValue === 'Likes: High to Low') {
                                            if (a.likes < b.likes) return 1;
                                            else if (b.likes < a.likes) return -1;
                                            else return 0;
                                        } else if (sortValue === 'Likes: Low to High') {
                                            if (a.likes < b.likes) return -1;
                                            else if (b.likes < a.likes) return 1;
                                            else return 0;
                                        }
                                        else return 0


                                    }).filter((item) => {
                                        if (isOnlyOnSale) {
                                            if (item.price && Number(Number(`${formatNearAmount(item.price)}`.split(',').join('')).toFixed(4)) && Number(Number(`${formatNearAmount(item.price)}`.split(',').join('')).toFixed(4)) > 0) return true
                                            else return false
                                        }
                                        else {
                                            return true
                                        }
                                    }).slice(0, screenWidth > 910 ? screenWidth > 1380 ? 8 * pageValue + 8 : 6 * pageValue + 6 : 3 * pageValue + 3).map((card, i) => (
                                        <NftCardCollection usdExchangeRate={usdExchangeRate} setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} setLoginPopupOpened={setLoginPopupOpened} item={card} key={`nft-card${i}`} user={user} toggleLike={toggleLike} loggedIn={loggedIn} currentUser={currentUser} />
                                    ))}
                                </div>
                                :
                                <div className="nft-cards-collection__no-cards">
                                    <img className='nft-cards-collection__no-cards-gif' src={gomer} alt='gomer'></img>
                                    <p className='nft-cards-collection__no-cards-title'>Nothing was found for these filters</p>


                                </div>
                            }
                        </>}

                </div>
                :
                <div className="nft-cards-collection__no-cards">
                    <img className='nft-cards-collection__no-cards-gif' src={gomer} alt='gomer'></img>
                    <p className='nft-cards-collection__no-cards-title'>Nothing to see here</p>
                    <p className='nft-cards-collection__no-cards-text'>{isCurrentUser ? "Try to refresh metadata or explore collections. While there are no tokens here, other users don't see this collection in your profile" : 'Come back soon! Or try to browse something for yourself on our marketplace'}</p>
                    <div className='nft-cards-collection__no-cards-btns'>
                        <Link className='nft-cards-collection__no-cards-link' to='/explore-collections/collectables'>
                            <p className='nft-cards-collection__no-cards-link-text'>Explore collections</p>
                        </Link>
                        {isCurrentUser ?
                            <div className='nft-cards-collection__no-cards-update-btn' onClick={handleRefresh}>
                                <svg className='nft-cards-collection__no-cards-update-btn-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='nft-cards-collection__no-cards-update-btn-icon-fill' d="M9.16223 7.23138L11.8065 4.58921C10.8148 3.48842 9.39404 2.87252 7.9125 2.90112C6.43114 2.92973 5.03513 3.60003 4.08664 4.73815C3.13804 5.87628 2.73038 7.37019 2.96922 8.83239C3.20806 10.2947 4.06986 11.5812 5.33125 12.3583C6.59267 13.1356 8.1294 13.3268 9.54273 12.8827C10.9562 12.4384 12.1071 11.4024 12.6971 10.0434H15.0504C15.0167 10.1659 14.9784 10.2871 14.9353 10.4069L14.9354 10.407C14.4101 11.9229 13.4025 13.2249 12.0667 14.1135C10.7309 15.0021 9.14072 15.4284 7.53956 15.3272C5.93826 15.2258 4.41448 14.6025 3.20147 13.5526C1.98839 12.5027 1.1528 11.084 0.822809 9.51387C0.492943 7.94389 0.686693 6.3089 1.37447 4.85943C2.06223 3.40989 3.20627 2.22584 4.63114 1.48862C6.05615 0.751263 7.68335 0.501424 9.26394 0.777163C10.8444 1.05292 12.2909 1.83907 13.382 3.01536L15.1839 1.21343V7.23106L9.16223 7.23138Z" fill="white" />
                                </svg>

                                <p className='nft-cards-collection__no-cards-update-btn-text'>Refresh metadata</p>
                            </div>
                            : <></>}
                    </div>
                </div>
            }

        </>

    )
};

export default NftCardsCollection
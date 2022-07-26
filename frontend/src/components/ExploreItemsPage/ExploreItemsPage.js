import './ExploreItemsPage.css';

import bgimage from '../../assets/images/main/bg.png'
import { useEffect, useRef, useState } from 'react';

import pythonApi from '../../assets/pythonApi';

import ExploreItemsNftCards from './ExploreItemsNftCards/ExploreItemsNftCards';
import { useNavigate, useParams } from 'react-router';
import { MetaTags } from 'react-meta-tags';

const possibleCategories = ['art', 'collectables', 'metaverses', 'games', 'image']

function ExploreItemsPage(props) {
    const { name } = useParams()
    const navigator = useNavigate()

    const [selectedCategory, setSelectedCategory] = useState(name && possibleCategories.indexOf(name.toLowerCase()) !== -1 ? name.toLowerCase() : 'art')

    const [categoryBtnText, setCategoryBtnText] = useState(name && possibleCategories.indexOf(name.toLowerCase()) !== -1 ? `${name.substring(0, 1).toUpperCase()}${name.substring(1).toLowerCase()}` : 'Art')

    const [catPopupOpen, setCatPopupOpen] = useState(false)

    const [isOnlyOnSale, setOnlyOnSale] = useState(false)

    const [pageValue, setPageValue] = useState(0);
    const [prevScrollPosition, setPrevScrollPosition] = useState(-1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    const [cards, setCards] = useState([])

    useEffect(() => {
        setPreloaderVisible(true)
        pythonApi.getExploreItems({ next_id: null, limit: 12, name: name && possibleCategories.indexOf(name.toLowerCase()) !== -1 ? name.toLowerCase() : 'art', is_only_on_sale: isOnlyOnSale })
            .then((res) => {
                console.log(res)
                setTimeout(() => {
                    setPreloaderVisible(false)
                }, 600);
                setCards(res)
            })
            .catch((err) => {
                console.log(err)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect(() => {
    //     setPageValue(0)
    //     setPrevScrollPosition(-1)
    //     setScrollPosition(0)
    //     setPreloaderVisible(true)


    // }, [])

    const listInnerRef = useRef();



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
    // const [pageValue, setPageValue] = useState(0);
    useEffect(() => {
        // console.log(scrollPosition, prevScrollPosition)

        if (listInnerRef.current && scrollTraking && scrollPosition > prevScrollPosition && cards && cards.length > 0) {
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
    }, [scrollPosition, scrollTraking, prevScrollPosition, pageValue, cards]);

    useEffect(() => {

        if (pageValue > 0 && cards && cards.length === 12 * pageValue && name && possibleCategories.indexOf(name.toLowerCase()) !== -1) {
            let prevCardId = cards[cards.length - 1].token_id
            console.log(prevCardId)
            console.log('ss')
            pythonApi.getExploreItems({ next_id: prevCardId, limit: 12, name: name, is_only_on_sale: isOnlyOnSale})
                .then((res) => {
                    console.log(res)

                    setCards(prewCards => prewCards.concat(res))
                })
                .catch((err) => {
                    console.log(err)
                })
        }


    }, [pageValue, cards, name, isOnlyOnSale])

    function handleCatChange(catName) {
        setCatPopupOpen(false)
        setPageValue(0)
        setPrevScrollPosition(-1)
        setScrollPosition(0)
        setSelectedCategory(catName)
        navigator(`/explore-items/${catName}`)
        setPreloaderVisible(true)
        pythonApi.getExploreItems({ next_id: null, limit: 12, name: catName, is_only_on_sale:  isOnlyOnSale })
            .then((res) => {
                console.log(res)
                setTimeout(() => {
                    setPreloaderVisible(false)
                }, 600);
                setCards(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleOnSaleChange({is_on_sale}) {
        setPageValue(0)
        setPrevScrollPosition(-1)
        setScrollPosition(0)
        setPreloaderVisible(true)
        pythonApi.getExploreItems({ next_id: null, limit: 12, name: selectedCategory, is_only_on_sale:  is_on_sale})
            .then((res) => {
                console.log(res)
                setTimeout(() => {
                    setPreloaderVisible(false)
                }, 600);
                setCards(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function toggleLike({ token_id }) {
        // console.log(token_id)
        pythonApi.toggleLike({ tokenId: token_id })
            .then((response) => {
                console.log(response)
                let curUser = props.currentUser
                curUser.liked = response.liked
                props.setCurrentUser(curUser)
                let newTokens = cards.map((itm) => {
                    if (itm.token_id === token_id) return {
                        ...itm,
                        likes: response.token.likes
                    }
                    else return itm
                })
                setCards(newTokens)

            })
            .catch((err) => {
                console.log(err)
            })
    }


    const catRef = useRef(null);
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (catRef.current && !catRef.current.contains(event.target) && catPopupOpen) {
                setCatPopupOpen(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [catRef, catPopupOpen])


    return (
        <div className='explore-items-page'>
            <MetaTags>
                <title>{'Explore NFTs'}</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={'Explore NFTs'} />
                <meta property="og:description" content={'Explore NFTs'} />
                <meta property="twitter:title" content={'Explore NFTs'} />
                <meta property="twitter:description" content={'Explore NFTs'} />

                <meta property="vk:title" content={'Explore NFTs'} />
                <meta property="vk:description" content={'Explore NFTs'} />

            </MetaTags>
            <img className='explore-items-page__bg-image' src={bgimage} alt='' />


            <div className='explore-items-page__container'>
                <h2 className='explore-items-page__title'>Explore NFTs</h2>
                <div className="explore-items-page__filters">
                    <div className="explore-items-page__category-and-price">
                        <div className="explore-items-page__btn-box">
                            <div className="explore-items-page__btn" onClick={() => {
                                setCatPopupOpen(!catPopupOpen)


                            }}>
                                <p className="explore-items-page__btn-sort-by-text">Category</p>
                                <svg className="explore-items-page__btn-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="explore-items-page__btn-icon-stroke" d="M5.73605 1H3.03202C1.91201 1 1 1.92001 1 3.04882V5.77605C1 6.91206 1.91201 7.82407 3.03202 7.82407H5.73605C6.86406 7.82407 7.76807 6.91206 7.76807 5.77605V3.04882C7.76807 1.92001 6.86406 1 5.73605 1" stroke="white" />
                                    <path className="explore-items-page__btn-icon-stroke" d="M5.73605 10.1758H3.03202C1.91201 10.1758 1 11.0886 1 12.2246V14.9518C1 16.0798 1.91201 16.9999 3.03202 16.9999H5.73605C6.86406 16.9999 7.76807 16.0798 7.76807 14.9518V12.2246C7.76807 11.0886 6.86406 10.1758 5.73605 10.1758" stroke="white" />
                                    <path className="explore-items-page__btn-icon-stroke" d="M14.9685 1H12.2644C11.1364 1 10.2324 1.92001 10.2324 3.04882V5.77605C10.2324 6.91206 11.1364 7.82407 12.2644 7.82407H14.9685C16.0885 7.82407 17.0005 6.91206 17.0005 5.77605V3.04882C17.0005 1.92001 16.0885 1 14.9685 1" stroke="white" strokeOpacity="0.4" />
                                    <path className="explore-items-page__btn-icon-stroke" d="M14.9685 10.1758H12.2644C11.1364 10.1758 10.2324 11.0886 10.2324 12.2246V14.9518C10.2324 16.0798 11.1364 16.9999 12.2644 16.9999H14.9685C16.0885 16.9999 17.0005 16.0798 17.0005 14.9518V12.2246C17.0005 11.0886 16.0885 10.1758 14.9685 10.1758" stroke="white" />
                                </svg>
                                <p className="explore-items-page__btn-text">{categoryBtnText}</p>

                            </div>
                            <div ref={catRef} className={`explore-items-page__cetegory_popup ${catPopupOpen ? 'explore-items-page__cetegory_popup_active' : ''}`}>
                                <svg className="explore-items-page__cetegory_popup-close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                                    setCatPopupOpen(false)
                                }}>
                                    <path className="explore-items-page__cetegory_popup-close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                                </svg>
                                <div className='explore-items-page__cetegory_popup__selectors'>
                                    <div className='explore-items-page__cetegory_popup__selector' onClick={() => {
                                        if (selectedCategory !== 'art') {
                                            handleCatChange('art')
                                            setCategoryBtnText('Art')
                                        }
                                    }}>
                                        <svg className='explore-items-page__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                        </svg>
                                        <p className='explore-items-page__cetegory_popup__selector-name'>Art</p>
                                        <svg className={`explore-items-page__cetegory_popup__selector-tick ${selectedCategory === 'art' ? 'explore-items-page__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div>

                                    <div className='explore-items-page__cetegory_popup__selector' onClick={() => {
                                        if (selectedCategory !== 'collectables') {
                                            handleCatChange('collectables')
                                            setCategoryBtnText('Collectables')
                                        }
                                    }}>
                                        <svg className='explore-items-page__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                        </svg>
                                        <p className='explore-items-page__cetegory_popup__selector-name'>Collectables</p>
                                        <svg className={`explore-items-page__cetegory_popup__selector-tick ${selectedCategory === 'collectables' ? 'explore-items-page__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div>
                                    <div className='explore-items-page__cetegory_popup__selector' onClick={() => {
                                        if (selectedCategory !== 'games') {
                                            handleCatChange('games')
                                            setCategoryBtnText('Games')
                                        }

                                    }}>
                                        <svg className='explore-items-page__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                        </svg>
                                        <p className='explore-items-page__cetegory_popup__selector-name'>Games</p>
                                        <svg className={`explore-items-page__cetegory_popup__selector-tick ${selectedCategory === 'games' ? 'explore-items-page__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div>
                                    <div className='explore-items-page__cetegory_popup__selector' onClick={() => {

                                        if (selectedCategory !== 'metaverses') {
                                            handleCatChange('metaverses')
                                            setCategoryBtnText('Metaverses')
                                        }

                                    }}>
                                        <svg className='explore-items-page__cetegory_popup__selector-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.92001 0 2.04882V4.77605C0 5.91206 0.91201 6.82407 2.03202 6.82407H4.73605C5.86406 6.82407 6.76807 5.91206 6.76807 4.77605V2.04882C6.76807 0.92001 5.86406 0 4.73605 0Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86406 15.9999 6.76807 15.0798 6.76807 13.9518V11.2246C6.76807 10.0886 5.86406 9.17578 4.73605 9.17578Z" fill="white" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 0H11.2644C10.1364 0 9.23242 0.92001 9.23242 2.04882V4.77605C9.23242 5.91206 10.1364 6.82407 11.2644 6.82407H13.9685C15.0885 6.82407 16.0005 5.91206 16.0005 4.77605V2.04882C16.0005 0.92001 15.0885 0 13.9685 0Z" fill="white" fillOpacity="0.4" />
                                            <path className='explore-items-page__cetegory_popup__selector-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                                        </svg>
                                        <p className='explore-items-page__cetegory_popup__selector-name'>Metaverses</p>
                                        <svg className={`explore-items-page__cetegory_popup__selector-tick ${selectedCategory === 'metaverses' ? 'explore-items-page__cetegory_popup__selector-tick_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='explore-items-page__cetegory_popup__selector-tick-fill' d="M10.978 16.7881C10.8538 16.9241 10.6846 17 10.5087 17C10.3328 17 10.1635 16.9241 10.0394 16.7881L6.29173 12.7034C5.90276 12.2796 5.90276 11.5924 6.29173 11.1693L6.76102 10.6579C7.14999 10.234 7.77991 10.234 8.16888 10.6579L10.5087 13.2076L16.8311 6.3179C17.2201 5.89403 17.8507 5.89403 18.239 6.3179L18.7083 6.82929C19.0972 7.25316 19.0972 7.94033 18.7083 8.36347L10.978 16.7881Z" fill="#6F6FE9" />
                                        </svg>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="nft-cards__btn-box nft-cards__btn-box_for-sale">
                            <div className="nft-cards__btn nft-cards__btn_for-sale" onClick={() => {
                                // handlePreloader()
                                if(isOnlyOnSale){
                                    setOnlyOnSale(false)
                                    handleOnSaleChange({is_on_sale: false})
                                } else {
                                    setOnlyOnSale(true)
                                    handleOnSaleChange({is_on_sale: true})
                                }
                               
                              
                     
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

                    </div>



                </div>

                <div ref={listInnerRef}>
                    {<ExploreItemsNftCards isExplictAccept={props.isExplictAccept} setExplictAccept={props.setExplictAccept} currentUser={props.currentUser} toggleLike={toggleLike} loggedIn={props.loggedIn} cards={cards} isPreloaderVisible={isPreloaderVisible} setLoginPopupOpened={props.setLoginPopupOpened} />}
                    {/* <ExploreCollections cards={cards} /> */}
                </div>




            </div>
        </div>
    );
}

export default ExploreItemsPage;

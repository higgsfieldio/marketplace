

import { useEffect, useRef, useState } from 'react';
import { MetaTags } from 'react-meta-tags';
import { useNavigate, useParams } from 'react-router';
import pythonApi from '../../assets/pythonApi';
import MiniPreloader from '../MiniPreloader/MiniPreloader';
import PreloaderOnPage from '../PreloaderOnPage/PreloaderOnPage';
import './Search.css';
import SearchCollections from './SearchCollections/SearchCollections';
import SearchNftCards from './SearchNftCards/SearchNftCards';



function Search({ setLoginPopupOpened, setCurrentUser, loggedIn, setRefreshPopupOpened, usdExchangeRate, currentUser, setExplictAccept, isExplictAccept }) {
    const [prevScrollPosition, setPrevScrollPosition] = useState(-1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [pageValue, setPageValue] = useState(0);

    const { value } = useParams()
    const [page, setPage] = useState('collections')

    const [searchValue, setSearchValue] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)

    const [collecctionsTotal, setCollectionsTotal] = useState(0)
    const [tokensTotal, setTokensTotal] = useState(0)

    const navigate = useNavigate()


    const [searchTokens, setSearchTokens] = useState([])
    const [searchCollections, setSearchCollections] = useState([])
    const [isSerachPreloasderVisible, setSerachPreloasderVisible] = useState(false);

    function handleSearchChange(e) {
        let inputValue = e.target.value
        if (inputValue) {
            setSerachPreloasderVisible(true)


        }
        setSearchValue(inputValue)
    }

    function handleSearchReset() {
        if (searchValue) {
            setSearchValue('')
        } else return
    }

    function handleEnter(e) {

        if (e.key === 'Enter') {
            e.preventDefault()


        }
        if (e.keyCode === 8 && e.target.value.length === 1) {
            navigate('/search/')
        }
    }


    useEffect(() => {
        if (!searchValue && !value) {
            setTimeout(() => {
                setSearchTokens([])
                setSearchCollections([])
                setSerachPreloasderVisible(false)
            }, 100);
        }
        const delayDebounceFn = setTimeout(() => {
            if (searchValue) {
                setPageValue(0)
                setPrevScrollPosition(-1)
                setScrollPosition(0)
                pythonApi.search({ text: searchValue.toString(), from_index: 0, limit: 12 })
                    .then((res) => {
                        console.log(res)
                        setSearchTokens(res.tokens)
                        setSearchCollections(res.collections)
                        if (res.collections.length === 0 && res.tokens.length > 0) {
                            setPage('items')
                        } else if (res.collections.length > 0 && res.tokens.length === 0) {
                            setPage('collections')
                        }
                        setCollectionsTotal(res.collections_total)
                        setTokensTotal(res.tokens_total)
                        setTimeout(() => {
                            setSerachPreloasderVisible(false)
                        }, 100);

                    })
                    .catch((err) => {
                        console.log(err)
                        setTimeout(() => {
                            setSerachPreloasderVisible(false)
                        }, 100);
                    })
            }
            // Send Axios request here
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchValue, value])

    useEffect(() => {

        return () => setSearchValue('')
    }, [])


    useEffect(() => {
        if (value && !searchValue) {
            setPageValue(0)
            setPrevScrollPosition(-1)
            setScrollPosition(0)
            setSearchValue('')
            setSerachPreloasderVisible(true)
            pythonApi.search({ text: value.toString(), from_index: 0, limit: 12 })
                .then((res) => {
                    console.log(res)
                    setSearchTokens(res.tokens)
                    setSearchCollections(res.collections)
                    if (res.collections.length === 0 && res.tokens.length > 0) {
                        setPage('items')
                    } else if (res.collections.length > 0 && res.tokens.length === 0) {
                        setPage('collections')
                    }
                    setCollectionsTotal(res.collections_total)
                    setTokensTotal(res.tokens_total)
                    setTimeout(() => {
                        setSerachPreloasderVisible(false)
                    }, 100);

                })
                .catch((err) => {
                    console.log(err)
                    setTimeout(() => {
                        setSerachPreloasderVisible(false)
                    }, 100);
                })
        }
    }, [value, searchValue])

    function toggleLike({ token_id }) {
        // console.log(token_id)
        pythonApi.toggleLike({ tokenId: token_id })
            .then((response) => {
                let curUser = currentUser
                curUser.liked = response.liked

                let owned = currentUser.items_owned.map((itm) => {
                    if (itm.token_id === token_id) return {
                        ...itm, likes: response.token.likes
                    }
                    else return itm
                })
                curUser.items_owned = owned
                let created = currentUser.items_created.map((itm) => {
                    if (itm.token_id === token_id) return {
                        ...itm, likes: response.token.likes
                    }
                    else return itm
                })
                curUser.items_created = created
                let onSale = currentUser.items_on_sale.map((itm) => {
                    if (itm.token_id === token_id) return {
                        ...itm, likes: response.token.likes
                    }
                    else return itm
                })
                let tokens = searchTokens.map((itm) => {
                    if (itm._id === token_id) return {
                        ...itm, likes: response.token.likes
                    }
                    else return itm
                })
                setSearchTokens(tokens)
                curUser.items_on_sale = onSale
                setCurrentUser(curUser)
            })
            .catch((err) => {
                console.log(err)
            })
    }


    // function handleDelite(e) {

    //     // if (e.keyCode === 8 && e.target.value.replace(/\D/g, '').length < 11) {

    //     // }

    // }



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

    useEffect(() => {
        // console.log(scrollPosition, prevScrollPosition)

        if (listInnerRef.current && scrollTraking && scrollPosition > prevScrollPosition && (searchTokens || searchCollections)) {
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
    }, [scrollPosition, scrollTraking, prevScrollPosition, pageValue, searchTokens, searchCollections]);

    useEffect(() => {
        if (!searchValue && value) {
            if (pageValue > 0) {
                if (searchTokens && searchTokens.length === 12 * pageValue && page === 'items') {
                    console.log('____')
                    console.log(pageValue)
                    console.log('____')
                    pythonApi.search({ text: value.toString(), from_index: 12 * pageValue, limit: 12 })
                        .then((res) => {
                            console.log(res)
                            if (res.tokens) {

                                setSearchTokens(prevcards => prevcards.concat(res.tokens))
                            }

                            // setSearchTokens(res.tokens)
                            // setSearchCollections(res.collections)
                            // setCollectionsTotal(res.collections_total)
                            // setTokensTotal(res.tokens_total)
                            // setTimeout(() => {
                            //     setSerachPreloasderVisible(false)
                            // }, 100);

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                } else if (searchCollections && searchCollections.length === 12 * pageValue && page === 'collections') {
                    console.log('____')
                    console.log(pageValue)
                    console.log('____')
                    pythonApi.search({ text: value.toString(), from_index: 12 * pageValue, limit: 12 })
                        .then((res) => {
                            console.log(res)

                            if (res.collections) {
                                setSearchCollections(prevcards => prevcards.concat(res.collections))
                            }
                            // setSearchTokens(res.tokens)
                            // setSearchCollections(res.collections)
                            // setCollectionsTotal(res.collections_total)
                            // setTokensTotal(res.tokens_total)
                            // setTimeout(() => {
                            //     setSerachPreloasderVisible(false)
                            // }, 100);

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                }

            }
        } else if (searchValue && (!value || value)) {
            if (pageValue > 0) {
                if (searchTokens && searchTokens.length === 12 * pageValue && page === 'items') {
                    console.log('____')
                    console.log(pageValue)
                    console.log('____')
                    pythonApi.search({ text: searchValue.toString(), from_index: 12 * pageValue, limit: 12 })
                        .then((res) => {
                            console.log(res)
                            if (res.tokens) {

                                setSearchTokens(prevcards => prevcards.concat(res.tokens))
                            }

                            // setSearchTokens(res.tokens)
                            // setSearchCollections(res.collections)
                            // setCollectionsTotal(res.collections_total)
                            // setTokensTotal(res.tokens_total)
                            // setTimeout(() => {
                            //     setSerachPreloasderVisible(false)
                            // }, 100);

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                } else if (searchCollections && searchCollections.length === 12 * pageValue && page === 'collections') {
                    console.log('____')
                    console.log(pageValue)
                    console.log('____')
                    pythonApi.search({ text: searchValue.toString(), from_index: 12 * pageValue, limit: 12 })
                        .then((res) => {
                            console.log(res)

                            if (res.collections) {
                                setSearchCollections(prevcards => prevcards.concat(res.collections))
                            }
                            // setSearchTokens(res.tokens)
                            // setSearchCollections(res.collections)
                            // setCollectionsTotal(res.collections_total)
                            // setTokensTotal(res.tokens_total)
                            // setTimeout(() => {
                            //     setSerachPreloasderVisible(false)
                            // }, 100);

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                }

            }
        }



    }, [pageValue, searchTokens, searchCollections, searchValue, page, value])

    return (
        <div className='search-page'>
            <MetaTags>
                <title>{searchValue ? `Search: ${searchValue}` : 'Search'}</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={searchValue ? `Search: ${searchValue}` : 'Search'} />
                <meta property="og:description" content={searchValue ? `Search: ${searchValue}` : 'Search'} />
                <meta property="twitter:title" content={searchValue ? `Search: ${searchValue}` : 'Search'} />
                <meta property="twitter:description" content={searchValue ? `Search: ${searchValue}` : 'Search'} />

                <meta property="vk:title" content={searchValue ? `Search: ${searchValue}` : 'Search'} />
                <meta property="vk:description" content={searchValue ? `Search: ${searchValue}` : 'Search'} />

            </MetaTags>
            <div className='search-page__container'>
                <p className='search-page__title'>Search&nbsp;result&nbsp;for <span className='search-page__title-span'>{searchValue ? searchValue : value}</span></p>
                <div className={`search-page__input-container ${searchFocused || searchValue ? 'search-page__input-container_focus' : ''}`}>
                    <svg className={`search-page__input-search ${searchValue ? 'search-page__input-search_active' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='search-page__input-svg-fill' fillRule="evenodd" clipRule="evenodd" d="M7.39293 3C4.96678 3 3 4.96678 3 7.39293C3 9.81907 4.96678 11.7859 7.39293 11.7859C9.81907 11.7859 11.7859 9.81907 11.7859 7.39293C11.7859 4.96678 9.81907 3 7.39293 3ZM2 7.39293C2 4.4145 4.4145 2 7.39293 2C10.3714 2 12.7859 4.4145 12.7859 7.39293C12.7859 8.8033 12.2445 10.0872 11.3581 11.0482L12.9667 12.8726C13.1493 13.0797 13.1295 13.3957 12.9223 13.5783C12.7152 13.7609 12.3992 13.7411 12.2166 13.534L10.6153 11.7177C9.71624 12.3887 8.60097 12.7859 7.39293 12.7859C4.4145 12.7859 2 10.3714 2 7.39293Z" fill="white" />
                    </svg>
                    <input onKeyDown={handleEnter} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} className='search-page__input' placeholder="Search for item, collection" name="search" type="text" required value={searchValue} onChange={handleSearchChange} minLength="0" maxLength="300" autoComplete='off' autoFocus></input>
                    <svg onClick={handleSearchReset} className={`search-page__input-reset ${searchValue ? 'search-page__input-reset_visible' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='search-page__input-svg-fill' d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                    </svg>
                </div>
                <div className='search-page__pages'>
                    <div className={`search-page__pages-link`} onClick={() => {
                        setPageValue(0)
                        setPrevScrollPosition(-1)
                        setScrollPosition(0)
                        setPage('collections')
                    }}>
                        <div className='search-page__pages-link-texts'>
                            <p className={`search-page__pages-link-text ${page === 'collections' ? 'search-page__pages-link-text_active' : ''}`}>Collections</p>
                            {searchValue || (!searchValue && value) ?
                                <div className={`search-page__pages-link-count ${page === 'collections' ? 'search-page__pages-link-count_active' : ''}`}>
                                    {isSerachPreloasderVisible ? <MiniPreloader /> : <p className={`search-page__pages-link-count-text ${page === 'collections' ? 'search-page__pages-link-count-text_active' : ''}`}>{collecctionsTotal}</p>}
                                </div>
                                : <></>}

                        </div>

                        <div className={`search-page__pages-link-line ${page === 'collections' ? 'search-page__pages-link-line_active' : ''}`}></div>
                    </div>

                    <div className={`search-page__pages-link`} onClick={() => {
                        setPageValue(0)
                        setPrevScrollPosition(-1)
                        setScrollPosition(0)
                        setPage('items')
                    }}>
                        <div className='search-page__pages-link-texts'>

                            <p className={`search-page__pages-link-text ${page === 'items' ? 'search-page__pages-link-text_active' : ''}`}>Items</p>
                            {searchValue || (!searchValue && value) ?
                                <div className={`search-page__pages-link-count ${page === 'items' ? 'search-page__pages-link-count_active' : ''}`}>
                                    {isSerachPreloasderVisible ? <MiniPreloader /> : <p className={`search-page__pages-link-count-text ${page === 'items' ? 'search-page__pages-link-count-text_active' : ''}`}>{tokensTotal}</p>}
                                </div>
                                : <></>}

                        </div>

                        <div className={`search-page__pages-link-line ${page === 'items' ? 'search-page__pages-link-line_active' : ''}`}></div>
                    </div>


                </div>
                <div className='search-page__items'>
                    {
                        isSerachPreloasderVisible ?
                            <div className='search-page__preloader'>
                                <PreloaderOnPage />
                            </div>
                            :

                            <div ref={listInnerRef}>
                                {page === 'collections' ? <SearchCollections searchValue={searchValue ? searchValue : value} cards={searchCollections} /> : <></>}
                                {page === 'items' ? <SearchNftCards usdExchangeRate={usdExchangeRate} setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} searchValue={searchValue ? searchValue : value} setLoginPopupOpened={setLoginPopupOpened} toggleLike={toggleLike} cards={searchTokens} loggedIn={loggedIn} currentUser={currentUser} /> : <></>}
                            </div>
                    }


                </div>
            </div>
        </div>

    );
}

export default Search;


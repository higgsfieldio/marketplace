import './CollectionAddItems.css';

import gomer from '../../assets/images/gif/gomer.gif'
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PreloaderOnPage from '../PreloaderOnPage/PreloaderOnPage';
import pythonApi from '../../assets/pythonApi';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import MiniPreloader from '../MiniPreloader/MiniPreloader';
import { MetaTags } from 'react-meta-tags';




function CollectionAddItems({ usdExchangeRate }) {
    let navigate = useNavigate()
    const { id } = useParams()
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    // const [walletCopied, setWalletCopied] = useState(false)

    const [collection, setCollection] = useState('')
    const [tokens, setTokens] = useState([])
    const [filteredTokens, setFilteredTokens] = useState([])



    useEffect(() => {
        if (id) {
            setPreloaderVisible(true)
            pythonApi.getCollectionPossibleItems({ collection_id: id })
                .then((res) => {
                    setCollection(res.collection_name)


                    console.log(res)
                    setTokens(res.tokens)
                    setFilteredTokens(res.tokens)
                    setTimeout(() => {
                        setPreloaderVisible(false)
                    }, 600);
                })
                .catch((err) => {
                    setCollection('null')
                    navigate('/')

                    console.log(err)
                    setTimeout(() => {
                        setPreloaderVisible(false)
                    }, 600);
                })
        } else {
            navigate('/')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])


    const [searchValue, setSearchValue] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)

    const [itemsSelected, setItemsSelected] = useState([])

    const [allSelected, setAllSelected] = useState(false)

    function handleSearchChange(e) {
        let inputValue = e.target.value
        setSearchValue(inputValue)
    }
    function handleSearchReset() {
        if (searchValue) {
            setSearchValue('')
        } else return
    }

    useEffect(() => {
        if (searchValue) {
            let filtered = tokens.filter((token) => {
                if (searchValue) {
                    if (token.name.toLowerCase().includes(`${searchValue.toLowerCase()}`)) return true
                    // if (card.buyer && !card.is_buyer && cards.bayer.user_name && cards.bayer.user_name.toLowerCase().includes(`${searchValue.toLowerCase()}`)) return true
                    // if (card.item.prew_owner && card.item.prew_owner.user_id.toLowerCase().includes(`${searchValue.toLowerCase()}`)) return true
                    // if (card.item.date.includes(`${searchValue.toLowerCase()}`)) return true
                    else return false
                }
                else if (!searchValue) return true
                else return false
            })
            setFilteredTokens(filtered)
        } else {
            setFilteredTokens(tokens)
        }


    }, [searchValue, tokens])

    function handleSelect(token_id) {
        if (allSelected) {
            setAllSelected(false)
        }
        let updSelectedItems
        if (itemsSelected && itemsSelected.length > 0 && itemsSelected.filter((item) => {
            if (item.token_id === token_id) return true
            else return false
        }).length > 0) {
            updSelectedItems = itemsSelected.filter((item) => {
                if (item.token_id === token_id) return false
                else return true
            })
        } else {
            if (itemsSelected && itemsSelected.length > 0) {
                updSelectedItems = [...itemsSelected, {
                    token_id: token_id
                }]
            } else {
                updSelectedItems = [{
                    token_id: token_id
                }]
            }


        }

        setItemsSelected(updSelectedItems)
    }

    function handleSelectAll() {
        if (allSelected) {
            setAllSelected(false)
        } else {
            setAllSelected(true)
        }

    }
    const [isSubmitPreloaderVisible, setSubmitPreloaderVisible] = useState(false)
    const [submitError, serSubmitError] = useState('')

    function handleSubmit() {
        let tokensToSubmit
        if (tokens.length > 0 && (allSelected || itemsSelected.length > 0)) {
            setSubmitPreloaderVisible(true)
            if (allSelected) {
                tokensToSubmit = tokens.map((item) => {
                    return { token_id: item.token_id }
                })
            } else {
                tokensToSubmit = itemsSelected
            }
            pythonApi.addItemsToCollection({ collection_id: id, tokens: tokensToSubmit })
                .then((res) => {
                    setTimeout(() => {
                        navigate(`/collections/${id}/items`)
                        setSubmitPreloaderVisible(false)
                    }, 500);
                    console.log(res)
                })
                .catch((err) => {

                    setTimeout(() => {
                        serSubmitError('Something went wrong, try again later')
                        setTimeout(() => {
                            serSubmitError('')
                        }, 8000);
                        setSubmitPreloaderVisible(false)
                    }, 500);
                    console.log(err)
                })
            console.log(tokensToSubmit)
        } return
    }


    // const [timerValue, setTimerValue] = useState(0);



    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         if(timerValue > 30){
    //             setTimerValue(0)
    //         } else {
    //             setTimerValue(timerValue + 1)
    //         }

    //         clearInterval(timer)
    //     }, 200);




    // }, [timerValue])

    return (
        <div className='collection-add-items'>
            <MetaTags>
                <title>Collection add items</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={`Collection add items`} />
                <meta property="twitter:title" content={`Collection add items`} />
                <meta property="vk:title" content={`Collection add items`} />
            </MetaTags>
            {isPreloaderVisible ?
                <div className='collection-add-items__preloader'>
                    <PreloaderOnPage />
                </div> :
                <>
                    <h2 className='collection-add-items__title'>Select items to add to <Link to={`/collections/${id}/items`} className='collection-add-items__title-name'>{collection}</Link> collection</h2>
                    <p className='collection-add-items__subtitle'>You can select items in bulk to add to the collection</p>
                    <div className='collection-add-items__handlers'>
                        <div className={`collection-add-items__input-container ${searchFocused || searchValue ? 'collection-add-items__input-container_focus' : ''}`}>
                            <svg className={`collection-add-items__input-search ${searchValue ? 'collection-add-items__input-search_active' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='collection-add-items__input-svg-fill' fillRule="evenodd" clipRule="evenodd" d="M7.39293 3C4.96678 3 3 4.96678 3 7.39293C3 9.81907 4.96678 11.7859 7.39293 11.7859C9.81907 11.7859 11.7859 9.81907 11.7859 7.39293C11.7859 4.96678 9.81907 3 7.39293 3ZM2 7.39293C2 4.4145 4.4145 2 7.39293 2C10.3714 2 12.7859 4.4145 12.7859 7.39293C12.7859 8.8033 12.2445 10.0872 11.3581 11.0482L12.9667 12.8726C13.1493 13.0797 13.1295 13.3957 12.9223 13.5783C12.7152 13.7609 12.3992 13.7411 12.2166 13.534L10.6153 11.7177C9.71624 12.3887 8.60097 12.7859 7.39293 12.7859C4.4145 12.7859 2 10.3714 2 7.39293Z" fill="white" />
                            </svg>
                            <input onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} className='collection-add-items__input' placeholder="Search for NFT" name="search" type="text" required value={searchValue} onChange={handleSearchChange} minLength="0" maxLength="300"></input>
                            <svg onClick={handleSearchReset} className={`collection-add-items__input-reset ${searchValue ? 'collection-add-items__input-reset_visible' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='collection-add-items__input-svg-fill' d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                            </svg>
                        </div>
                        <Link className='collection-add-items__create-link' to='/create-item'>Create item</Link>
                    </div>
                    <div className='collection-add-items__items-container'>
                        {submitError ? <p className='collection-add-items__submit-err'>{submitError}</p> : <></>}
                        <div className='collection-add-items__items-handlers'>
                            <p className='collection-add-items__slected-length'>{allSelected ? tokens.length > 0 ? `${tokens.length} ${tokens.length === 1 ? 'item' : 'items'} selected` : 'Nothing selected yet' : itemsSelected.length > 0 ? `${itemsSelected.length} ${itemsSelected.length === 1 ? 'item' : 'items'} selected` : 'Nothing selected yet'}</p>
                            <div className={`collection-add-items__submit ${tokens.length > 0 && (allSelected || itemsSelected.length > 0) ? 'collection-add-items__submit_active' : ''}`} onClick={handleSubmit}>
                                {isSubmitPreloaderVisible ? <MiniPreloader /> : <p className='collection-add-items__submit-text'>Approve</p>}
                            </div>

                        </div>
                        <div className='collection-add-items__table-heading'>
                            <div className='collection-add-items__selector-container collection-add-items__selector_heading'>
                                <div className={`collection-add-items__selector ${allSelected ? 'collection-add-items__selector_selected' : ''}`} onClick={handleSelectAll}>
                                    <svg className='collection-add-items__selector-tick' width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`collection-add-items__selector-tick-fill ${allSelected ? 'collection-add-items__selector-tick-fill_selected' : ''}`} d="M4.97797 10.7881C4.85384 10.9241 4.68458 11 4.50868 11C4.33278 11 4.16352 10.9241 4.03939 10.7881L0.291728 6.70344C-0.0972428 6.27957 -0.0972428 5.59241 0.291728 5.16926L0.761016 4.65787C1.14999 4.234 1.77991 4.234 2.16888 4.65787L4.50868 7.20759L10.8311 0.317902C11.2201 -0.105967 11.8507 -0.105967 12.239 0.317902L12.7083 0.829295C13.0972 1.25316 13.0972 1.94033 12.7083 2.36347L4.97797 10.7881Z" fill="white" />
                                    </svg>
                                </div>
                                <p className='collection-add-items__heading-text'>Name</p>
                            </div>

                           {tokens.length > 0 ? <p className='collection-add-items__heading-text collection-add-items__heading-text_price'>Current price</p>: <></>} 
                           {tokens.length > 0 ? <p className='collection-add-items__heading-text collection-add-items__heading-text_more'>Details</p>: <></>}
                        </div>
                        <div className='collection-add-items__table'>
                            {tokens && tokens.length > 0 ?
                                filteredTokens && filteredTokens.length ?
                                    filteredTokens.sort(function (a, b) {
                                        if (a.price < b.price) return 1;
                                        else if (b.price < a.price) return -1;
                                        else return 0;
                                    }).map((token, i) => (
                                        <div className='collection-add-items__table-item' key={`collection-add-items__table-item${i}`}>
                                            <div className='collection-add-items__selector-container' >
                                                <div className={`collection-add-items__selector ${allSelected || (itemsSelected && itemsSelected.length > 0 && itemsSelected.filter((item) => {
                                                    if (item.token_id === token.token_id) return true
                                                    else return false
                                                }).length > 0) ? 'collection-add-items__selector_selected' : ''}`} onClick={() => { handleSelect(token.token_id) }}>
                                                    <svg className='collection-add-items__selector-tick' width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className={`collection-add-items__selector-tick-fill ${allSelected || (itemsSelected && itemsSelected.length > 0 && itemsSelected.filter((item) => {
                                                            if (item.token_id === token.token_id) return true
                                                            else return false
                                                        }).length > 0) ? 'collection-add-items__selector-tick-fill_selected' : ''}`} d="M4.97797 10.7881C4.85384 10.9241 4.68458 11 4.50868 11C4.33278 11 4.16352 10.9241 4.03939 10.7881L0.291728 6.70344C-0.0972428 6.27957 -0.0972428 5.59241 0.291728 5.16926L0.761016 4.65787C1.14999 4.234 1.77991 4.234 2.16888 4.65787L4.50868 7.20759L10.8311 0.317902C11.2201 -0.105967 11.8507 -0.105967 12.239 0.317902L12.7083 0.829295C13.0972 1.25316 13.0972 1.94033 12.7083 2.36347L4.97797 10.7881Z" fill="white" />
                                                    </svg>
                                                </div>
                                                <Link className='collection-add-items__item-link' to={`/item/${token.token_id}/sale-history`}>
                                                    <img className='collection-add-items__item-preview' src={token.preview_url} alt={token.name}></img>
                                                    <p className='collection-add-items__item-name'>{token.name}</p>
                                                </Link>
                                            </div>
                                            <div className='collection-add-items__item-price'>
                                                <p className='collection-add-items__item-price-value'>{token.price ? parseFloat(Number(`${formatNearAmount(token.price)}`.split(',').join('')).toFixed(4)) : 'Not on sale'}</p>
                                                {token.price ? <svg className='collection-add-items__item-price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className='collection-add-items__item-price-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                                </svg> : <></>}
                                                {token.price ? <p className='collection-add-items__item-price-value collection-add-items__item-price-value_dollars'>(${Number(Number(parseFloat(Number(`${formatNearAmount(token.price)}`.split(',').join('')).toFixed(4)) * usdExchangeRate).toFixed(0)).toLocaleString('us')})</p> : <></>}
                                            </div>

                                            <Link className='collection-add-items__item-more' to={`/item/${token.token_id}/sale-history`}>More</Link>
                                        </div>
                                    ))
                                    : <div className='collection-add-items__no-items'>
                                        <img className='collection-add-items__no-items-img' src={gomer} alt='' />
                                        <p className='collection-add-items__no-items-text'>No tokens with that name were found</p>
                                    </div> : <div className='collection-add-items__no-items'>
                                    <img className='collection-add-items__no-items-img' src={gomer} alt='' />
                                    <p className='collection-add-items__no-items-text'>You don't have any tokens available for adding, first you need to create or upload them</p>
                                </div>}



                        </div>
                    </div>
                </>
            }

        </div>
    );
}

export default CollectionAddItems;
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ImageOnLoad } from '../../assets/ImageOnLoad';
import pythonApi from '../../assets/pythonApi';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import './ItemPage.css';
import MetaTags from 'react-meta-tags';
import gomer from '../../assets/images/gif/gomer.gif'
import { Link } from 'react-router-dom';
import PreloaderOnPage from '../PreloaderOnPage/PreloaderOnPage';
import Comments from './Comments/Comments';
import Attributes from './Attributes/Attributes';
import Details from './Details/Details';
import PriceHistory from './PriceHistory/PriceHistory';
import SaleHistory from './SaleHistory/SaleHistory';
import BidHistory from './BidHistory/BidHistory';
import moment from 'moment-timezone';
import rpcNearApi from '../../assets/rpcNearApi';
import { API_LINK } from '../../assets/utilis';



// const STORAGE_ADD_MARKET_FEE = process.env.STORAGE_ADD_MARKET_FEE
// const GAS_FEE = process.env.GAS_FEE
// const STORAGE_APPROVE_FEE = process.env.STORAGE_APPROVE_FEE



function ItemPage({ currentUser, setCurrentUser, usdExchangeRate, handleListPopupOpen, handleBuyFromMarketplace, setLoginPopupOpened, login, theme, handleTransferPopupOpen, handleExplictWarningOpen }) {
    const navigate = useNavigate()
    const { selected, id, transactionHashes } = useParams()
    const [pageDropOpen, setPageDropOpen] = useState(false)
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    const [page, setPage] = useState(selected ? selected : 'sale-history')
    const [token, setToken] = useState(undefined)
    const [isTokenExist, setTokenExist] = useState(false)

    const [isOwnerUser, setIsOwnerUser] = useState(undefined)

    const [coments, setComents] = useState([])

    const [isTransferAvailible, setTransferAvailible] = useState(undefined)
    const [isApproveAvailible, setApproveAvailible] = useState(undefined)

    function testTokenContract(token) {
        if (token) {
            console.log(token.token.contract_id)
            rpcNearApi.checkMethodAvailability({ accountId: token.token.contract_id, methodName: 'nft_transfer', testArgs: 'eyJyZWNlaXZlcl9pZCI6ImxvbC50ZXN0bmV0IiwidG9rZW5faWQiOiIxIn0=' })
                .then((res) => {
                    console.log('transfer')
                    console.log(res)
                    setTransferAvailible(res.methodAvailible)
                })
                .catch((err) => {
                    setTransferAvailible(false)
                    console.log(err)
                })
            rpcNearApi.checkMethodAvailability({ accountId: token.token.contract_id, methodName: 'nft_approve', testArgs: 'eyAidG9rZW5faWQiOiAiMSIsImFjY291bnRfaWQiOiAibG9sLnRlc3RuZXQiLCJtc2ciOiAie1wicHJpY2VcIjpcIjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwXCIsXCJtYXJrZXRfdHlwZVwiOlwic2FsZVwiLFwiZnRfdG9rZW5faWRcIjpcIm5lYXJcIn0ifQ==' })
                .then((res) => {
                    console.log('aprove')
                    console.log(res)
                    setApproveAvailible(res.methodAvailible)
                })
                .catch((err) => {
                    console.log(err)
                    setApproveAvailible(false)
                })
        }

    }

    useEffect(() => {
        var tz = moment.tz.guess();



        console.log(selected, id)
        if (selected) {
            if (['sale-history', 'bid-history', 'price-history', 'attributes', 'details', 'comments'].indexOf(selected) === -1) {
                navigate(`/item/${id}/sale-history`)
                setPage(selected)
            } else {
                setPage(selected)
            }
        } else {
            navigate(`/item/${id}/sale-history`)
        }
        const urlParams = new URLSearchParams(window.location.search);
        const transactionHashes = urlParams.get('transactionHashes');
        const errorCode = urlParams.get('errorCode');
        if (errorCode) {
            navigate(`/item/${id}/sale-history`)
        }
        if (transactionHashes) {
            setPreloaderVisible(true)

            pythonApi.checkTransactionsHashes({ transaction_hashes: transactionHashes.split(','), tz: tz })
                .then((res) => {
                    setTimeout(() => {
                        navigate(`/item/${id}/sale-history`)
                        setToken(res)
                        testTokenContract({ token: res })
                        setComents(res.comments)
                        setTokenExist(true)
                        console.log('______')
                        console.log(res)
                        console.log('______')
                        setTimeout(() => {
                            setPreloaderVisible(false)
                        }, 600)
                        // pythonApi.getToken({ tokenId: id })
                        //     .then((res) => {
                        //         console.log(res)
                        //         setToken(res)
                        //         setTokenExist(true)
                        //         setTimeout(() => {
                        //             setPreloaderVisible(false)
                        //         }, 600)
                        //     })
                        //     .catch((err) => {
                        //         setToken(null)

                        //         setTokenExist(false)
                        //         console.log(err)
                        //     })
                    }, 100);
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                    pythonApi.getToken({ tokenId: id, tz: tz })
                        .then((res) => {
                            console.log(res)
                            setToken(res)
                            setComents(res.comments)
                            testTokenContract({ token: res })
                            setTokenExist(true)
                            setTimeout(() => {
                                setPreloaderVisible(false)
                            }, 600);
                        })
                        .catch((err) => {
                            setToken(null)
                            setTimeout(() => {
                                setPreloaderVisible(false)
                            }, 600);
                            setTokenExist(false)
                            console.log(err)
                        })
                })

        }




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, id])

    const [metaData, setMetaData] = useState(undefined)
    useEffect(() => {
        if (id) {
            pythonApi.getTokenMeta({ id: id })
                .then((res) => {
                    console.log('getTokenMeta')
                    console.log(res)
                    setMetaData(res)
                })
                .catch((err) => {
                    console.log(err)
                })
            setPreloaderVisible(true)
            var tz = moment.tz.guess();
            pythonApi.getToken({ tokenId: id, tz: tz })
                .then((res) => {

                    console.log(res)
                    setToken(res)
                    setComents(res.comments)
                    testTokenContract({ token: res })
                    setTokenExist(true)
                    setTimeout(() => {
                        setPreloaderVisible(false)
                    }, 600);
                })
                .catch((err) => {
                    setToken(null)
                    setTimeout(() => {
                        setPreloaderVisible(false)
                    }, 600);
                    setTokenExist(false)
                    console.log(err)
                })
        } else {

            setTokenExist(false)
        }


    }, [id])


    // useEffect(() => {
    //     console.log(transactionHashes)
    //     if(transactionHashes){
    //         console.log(transactionHashes)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [transactionHashes])


    // useEffect(() => {

    // }, [id])
    const [isLiked, setLiked] = useState(false)
    const [likesValue, setLikesValie] = useState(0)
    const [priceValue, setPriceValue] = useState(0)
    useEffect(() => {
        if (token && currentUser && token.owner && (token.owner.user_id === currentUser.user_id || token.owner.user_id === currentUser.customURL)) {
            setIsOwnerUser(true)
            console.log('owner')
        } else {
            console.log('nonowner')
            setIsOwnerUser(false)
        }
        if (currentUser) {
            setLiked(currentUser ? currentUser.liked && token && currentUser.liked.filter((itm) => {
                if (itm.token_id === token.token_id) return true
                else return false
            }).length > 0 : false)
        }
        if (token) {
            if (token.explicitContent) {
                handleExplictWarningOpen()
            }
            setLikesValie(token.likes)
            if (token.price) {
                let amount = formatNearAmount(token.price)
                console.log(amount)
                if (`${amount}`.split(',').length > 0) {
                    setPriceValue(Number(`${amount}`.split(',').join('')).toFixed(4))
                } else {
                    setPriceValue(Number(amount).toFixed(4))
                }

                console.log(amount)


            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, token])



    function handleToggleLike() {
        if (currentUser) {
            if (isLiked) {
                setLikesValie(likesValue - 1)
                setLiked(!isLiked)
            } else {
                setLiked(!isLiked)
                setLikesValie(likesValue + 1)
            }

            pythonApi.toggleLike({ tokenId: id })
                .then((res) => {
                    let user = currentUser
                    let newToken = token
                    newToken.likes = res.token.likes
                    user.liked = res.liked
                    setCurrentUser(user)
                    setToken(newToken)

                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            setLoginPopupOpened(true)
        }

    }

    // function handleToggleLike() {
    //     if (id && isTokenExist) {
    //         pythonApi.toggleLike({ tokenId: id })
    //             .then((res) => {
    //                 handleChangeLike()
    //                 console.log(res)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //             })
    //     }

    // }

    const [isCopied, setCopied] = useState(false)
    function handleShare() {
        let text = window.location.href
        if (navigator.share === undefined) {
            var textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = 0;
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = `${token.name} - ${text}`;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
                setCopied(true)
                setTimeout(() => {
                    setCopied(false)
                }, 1500);
            } catch (err) {
                console.log('Oops, unable to copy');
            }

            document.body.removeChild(textArea);
        } else {
            navigator.share({ text: `${token.name} - ${text}`, url: text });
        }

    }


    function handleBuy() {
        if (currentUser) {
            let colbackURL = window.location.href
            handleBuyFromMarketplace({ token, colbackURL })
        } else {
            setLoginPopupOpened(true)
        }

    }



    // function handleUpdList() {

    // }



    function handleList() {

        if (currentUser) {
            let colbackURL = window.location.href
            handleListPopupOpen({ token, colbackURL })
        } else {
            setLoginPopupOpened(true)
        }
    }

    function handleSendComment({ text }) {
        var tz = moment.tz.guess();
        pythonApi.sendComment({ token_id: token.token_id, text: text, tz: tz })
            .then((res) => {
                console.log(res)
                // setToken(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // function handleAddCommentFromWs({ comment }) {
    //     console.log('from itempage main component')
    //     console.log(comment)
    //     let comentes = coments
    //     let comments_to_upd = comentes.push(comment)
    //     console.log('token itempage main component updted')
    //     console.log(comentes)
    //     setComents(comentes)

    // }

    function handleTransfer() {
        let colbackURL = window.location.href
        handleTransferPopupOpen({ token, colbackURL })
    }

    return (
        <div className='item-page'>
            {metaData && metaData !== undefined ?
                <MetaTags>
                    <title>NFT - {metaData.name}</title>
                    <meta property="og:site_name" content={`Higgs Field`} />
                    <meta property="og:title" content={`Check out this NFT on Higgs Field - ${metaData.name}`} />
                    <meta property="og:description" content={metaData.name} />
                    <meta property="og:image" content={metaData.image} />
                    <meta property="twitter:title" content={`Check out this NFT on Higgs Field - ${metaData.name}`} />
                    <meta property="twitter:description" content={metaData.name} />
                    <meta property="twitter:image" content={metaData.image} />
                    <meta property="vk:title" content={`Check out this NFT on Higgs Field - ${metaData.name}`} />
                    <meta property="vk:description" content={metaData.name} />
                    <meta property="vk:image" content={metaData.image} />
                </MetaTags>
                : <></>}
            {isPreloaderVisible ?
                <div className='item-page__preloader-container'>
                    <PreloaderOnPage />
                </div>
                :
                <>
                    {token !== undefined ?

                        isTokenExist && token ?
                            <div className='item-page__container'>

                                <div className='item-page__preview'>
                                    <ImageOnLoad className='item-page__preview-img' src={token.preview_url} keyValue={`tokenPage${id}`} alt='item preview'></ImageOnLoad>
                                </div>
                                <div className='item-page__data'>
                                    <h2 className='item-page__name'>{token.name}</h2>
                                    <div className='item-page__handlers'>
                                        <div className='item-page__views-likes'>
                                            <div className='item-page__views-likes-btn'>
                                                <svg className='item-page__views-likes-btn-icon' width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path className='item-page__views-btn-icon-fill' fillRule="evenodd" clipRule="evenodd" d="M7.99913 4.20312C6.93512 4.20312 6.07031 5.00933 6.07031 6.00033C6.07031 6.99058 6.93512 7.79605 7.99913 7.79605C9.06314 7.79605 9.92874 6.99058 9.92874 6.00033C9.92874 5.00933 9.06314 4.20312 7.99913 4.20312ZM7.99992 8.91419C6.2743 8.91419 4.87109 7.60727 4.87109 6.00081C4.87109 4.39361 6.2743 3.08594 7.99992 3.08594C9.72553 3.08594 11.1295 4.39361 11.1295 6.00081C11.1295 7.60727 9.72553 8.91419 7.99992 8.91419Z" fill="white" />
                                                    <path className='item-page__views-btn-icon-fill' fillRule="evenodd" clipRule="evenodd" d="M1.25586 5.99915C2.74387 9.06081 5.25029 10.8811 7.99991 10.8819C10.7495 10.8811 13.2559 9.06081 14.744 5.99915C13.2559 2.93824 10.7495 1.11793 7.99991 1.11719C5.25109 1.11793 2.74387 2.93824 1.25586 5.99915ZM8.00146 12.0006H7.99826H7.99746C4.68864 11.9983 1.71741 9.83825 0.0486004 6.22074C-0.0162001 6.07991 -0.0162001 5.92046 0.0486004 5.77963C1.71741 2.16287 4.68944 0.00279416 7.99746 0.000558833C7.99906 -0.000186278 7.99906 -0.000186278 7.99986 0.000558833C8.00146 -0.000186278 8.00146 -0.000186278 8.00226 0.000558833C11.3111 0.00279416 14.2823 2.16287 15.9511 5.77963C16.0167 5.92046 16.0167 6.07991 15.9511 6.22074C14.2831 9.83825 11.3111 11.9983 8.00226 12.0006H8.00146Z" fill="white" />
                                                </svg>
                                                <p className='item-page__views-likes-btn-value'>{token.views}</p>
                                            </div>
                                            <div className={`item-page__views-likes-btn item-page__views-likes-btn_pointer`} onClick={handleToggleLike}>
                                                {/* <svg className='item-page__views-likes-btn-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className='item-page__views-likes-btn-icon-fill' d="M14.7145 2.64867C12.9744 0.909012 10.1436 0.909012 8.40393 2.64867L7.99986 3.0525L7.59603 2.64867C5.85637 0.908777 3.02531 0.908777 1.28565 2.64867C-0.418689 4.35301 -0.429756 7.05456 1.25998 8.93291C2.80114 10.6455 7.34643 14.3454 7.53928 14.502C7.6702 14.6085 7.82773 14.6603 7.98432 14.6603C7.9895 14.6603 7.99468 14.6603 7.99963 14.66C8.16163 14.6676 8.32481 14.612 8.45997 14.502C8.65282 14.3454 13.1986 10.6455 14.7402 8.93268C16.4297 7.05456 16.4186 4.35301 14.7145 2.64867ZM13.69 7.98773C12.4884 9.32262 9.18546 12.0757 7.99963 13.0527C6.8138 12.076 3.51155 9.32309 2.31018 7.98797C1.13142 6.67781 1.12035 4.81194 2.28452 3.64777C2.87908 3.05344 3.6599 2.75604 4.44072 2.75604C5.22154 2.75604 6.00236 3.05321 6.59693 3.64777L7.48512 4.53597C7.59085 4.64169 7.72412 4.7048 7.86399 4.72693C8.09099 4.77568 8.33729 4.71234 8.51389 4.5362L9.40256 3.64777C10.5919 2.45888 12.5266 2.45912 13.7152 3.64777C14.8794 4.81194 14.8683 6.67781 13.69 7.98773Z" fill="white" />
                        </svg> */}
                                                <svg className='item-page__views-likes-btn-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    {/* <path className='nft-card__item-likes-icon-fill' d="M14.7145 2.64476C12.9744 0.905106 10.1436 0.905106 8.40393 2.64476L7.99986 3.0486L7.59603 2.64476C5.85637 0.90487 3.02531 0.90487 1.28565 2.64476C-0.418689 4.3491 -0.429756 7.05066 1.25998 8.92901C2.80114 10.6416 7.34643 14.3415 7.53928 14.4981C7.6702 14.6046 7.82773 14.6564 7.98432 14.6564C7.9895 14.6564 7.99468 14.6564 7.99963 14.6561C8.16163 14.6637 8.32481 14.6081 8.45997 14.4981C8.65282 14.3415 13.1986 10.6416 14.7402 8.92877C16.4297 7.05066 16.4186 4.3491 14.7145 2.64476ZM13.69 7.98383C12.4884 9.31871 9.18546 12.0718 7.99963 13.0488C6.8138 12.0721 3.51155 9.31918 2.31018 7.98406C1.13142 6.6739 1.12035 4.80803 2.28452 3.64387C2.87908 3.04954 3.6599 2.75214 4.44072 2.75214C5.22154 2.75214 6.00236 3.0493 6.59693 3.64387L7.48512 4.53206C7.59085 4.63779 7.72412 4.70089 7.86399 4.72303C8.09099 4.77177 8.33729 4.70843 8.51389 4.5323L9.40256 3.64387C10.5919 2.45497 12.5266 2.45521 13.7152 3.64387C14.8794 4.80803 14.8683 6.6739 13.69 7.98383Z" fill="white" /> */}
                                                    <path className={`item-page__views-likes-btn-icon-fill ${isLiked ? 'item-page__views-likes-btn-icon-fill_liked' : ''}`} d="M13.69 7.98383C12.4884 9.31871 9.18546 12.0718 7.99963 13.0488C6.8138 12.0721 3.51155 9.31918 2.31018 7.98406C1.13142 6.6739 1.12035 4.80803 2.28452 3.64387C2.87908 3.04954 3.6599 2.75214 4.44072 2.75214C5.22154 2.75214 6.00236 3.0493 6.59693 3.64387L7.48512 4.53206C7.59085 4.63779 7.72412 4.70089 7.86399 4.72303C8.09099 4.77177 8.33729 4.70843 8.51389 4.5323L9.40256 3.64387C10.5919 2.45497 12.5266 2.45521 13.7152 3.64387C14.8794 4.80803 14.8683 6.6739 13.69 7.98383Z" fill="white" />
                                                </svg>
                                                <p className='item-page__views-likes-btn-value'>{likesValue}</p>
                                            </div>
                                        </div>
                                        <div className='item-page__handler-options' onClick={handleShare}>
                                            {/* <svg className='item-page__handler-options-icon' width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle className='item-page__handler-options-icon-fill' cx="2" cy="2" r="2" fill="white" />
                                                <circle className='item-page__handler-options-icon-fill' cx="8" cy="2" r="2" fill="white" />
                                                <circle className='item-page__handler-options-icon-fill' cx="14" cy="2" r="2" fill="white" />
                                            </svg> */}
                                            {/* <svg className='item-page__transfer-btn-icon' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='item-page__transfer-btn-icon-fill' d="M11.2137 10.5823C10.5267 10.5823 9.9179 10.9159 9.53727 11.4269L5.38169 8.94723C5.44201 8.75308 5.47498 8.54737 5.47498 8.33363C5.47498 8.11989 5.44249 7.9142 5.38169 7.72003L9.53727 5.24041C9.9178 5.75137 10.5266 6.08498 11.2137 6.08498C12.3641 6.08498 13.3008 5.15399 13.3008 4.00929C13.3008 2.86458 12.3647 1.93359 11.2137 1.93359C10.0633 1.93359 9.12658 2.86458 9.12658 4.00929C9.12658 4.22243 9.15907 4.42872 9.21987 4.62289L5.06429 7.103C4.68366 6.59145 4.07493 6.25786 3.38788 6.25786C2.23746 6.25786 1.30078 7.18885 1.30078 8.33356C1.30078 9.47826 2.23689 10.4093 3.38788 10.4093C4.07486 10.4093 4.68366 10.0756 5.06429 9.56468L9.21987 12.0443C9.15965 12.2384 9.12658 12.4441 9.12658 12.6579C9.12658 13.8026 10.0627 14.7336 11.2137 14.7336C12.3641 14.7336 13.3008 13.8026 13.3008 12.6579C13.3008 11.5132 12.3641 10.5822 11.2137 10.5822V10.5823ZM11.2137 2.6264C11.9807 2.6264 12.6051 3.24683 12.6051 4.0102C12.6051 4.77357 11.9812 5.39401 11.2137 5.39401C10.4461 5.39401 9.82227 4.77357 9.82227 4.0102C9.82227 3.24683 10.4467 2.6264 11.2137 2.6264ZM3.38786 9.71763C2.62087 9.71763 1.99645 9.0972 1.99645 8.33383C1.99645 7.57046 2.6203 6.95002 3.38786 6.95002C4.15485 6.95002 4.77927 7.57046 4.77927 8.33383C4.77927 9.0972 4.15485 9.71763 3.38786 9.71763ZM11.2137 14.0414C10.4467 14.0414 9.82227 13.4209 9.82227 12.6576C9.82227 11.8942 10.4461 11.2737 11.2137 11.2737C11.9812 11.2737 12.6051 11.8942 12.6051 12.6576C12.6051 13.4209 11.9807 14.0414 11.2137 14.0414Z" fill="#E5E1E6" />
                                            </svg> */}
                                            {isCopied ? <p className='item-page__btn-copied'>Copied!</p> : <></>}
                                            <svg className='item-page__share-icon' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='item-page__share-icon-fill' d="M13.3911 12.8109C12.5324 12.8109 11.7714 13.2279 11.2956 13.8666L6.10114 10.767C6.17654 10.5244 6.21775 10.2672 6.21775 10C6.21775 9.73287 6.17714 9.47575 6.10114 9.23305L11.2956 6.13352C11.7713 6.77222 12.5323 7.18924 13.3911 7.18924C14.8292 7.18924 16 6.0255 16 4.59462C16 3.16374 14.8299 2 13.3911 2C11.9531 2 10.7822 3.16374 10.7822 4.59462C10.7822 4.86105 10.8229 5.11891 10.8989 5.36162L5.70438 8.46176C5.2286 7.82232 4.46769 7.40534 3.60888 7.40534C2.17084 7.40534 1 8.56907 1 9.99995C1 11.4308 2.17013 12.5946 3.60888 12.5946C4.4676 12.5946 5.2286 12.1776 5.70438 11.5389L10.8989 14.6384C10.8236 14.8811 10.7822 15.1381 10.7822 15.4054C10.7822 16.8363 11.9524 18 13.3911 18C14.8292 18 16 16.8363 16 15.4054C16 13.9745 14.8292 12.8108 13.3911 12.8108V12.8109ZM13.3911 2.866C14.3499 2.866 15.1304 3.64155 15.1304 4.59576C15.1304 5.54997 14.3506 6.32552 13.3911 6.32552C12.4317 6.32552 11.6519 5.54997 11.6519 4.59576C11.6519 3.64155 12.4324 2.866 13.3911 2.866ZM3.60885 11.7301C2.65011 11.7301 1.86959 10.9545 1.86959 10.0003C1.86959 9.04608 2.6494 8.27054 3.60885 8.27054C4.56759 8.27054 5.34811 9.04608 5.34811 10.0003C5.34811 10.9545 4.56759 11.7301 3.60885 11.7301ZM13.3911 17.1347C12.4324 17.1347 11.6519 16.3592 11.6519 15.405C11.6519 14.4507 12.4317 13.6752 13.3911 13.6752C14.3506 13.6752 15.1304 14.4507 15.1304 15.405C15.1304 16.3592 14.3499 17.1347 13.3911 17.1347Z" fill="white" />
                                            </svg>


                                        </div>
                                    </div>
                                    <div className='item-page__owner-creator'>
                                        {token.owner ? <Link className='item-page__owner-creator-item' to={`/profile/${token.owner.user_id}/on-sale`} title={token.owner.user_name ? token.owner.user_name : `@${token.owner.user_id}`}>
                                            <div className='item-page__owner-avatar'>
                                                {token.owner.avatar_url ?
                                                    <img className='item-page__owner-avatar-img' src={`${API_LINK}/users/get_file/${token.owner.avatar_url}`} key={`tokenOwnerAvatar${id}`} alt='avatar' />
                                                    :

                                                    <svg className='item-page__owner-avatar-placeholder' width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path className='item-page__owner-avatar-placeholder-fill' fillRule="evenodd" clipRule="evenodd" d="M10.2756 0.701852L7.77208 3.91143L9.68152 6.36149C9.96157 6.72083 9.88519 7.23534 9.51179 7.50485C9.13839 7.77436 8.60375 7.70902 8.32369 7.34151C7.43262 6.19815 6.36334 4.83429 5.69291 3.96043C5.35346 3.52759 4.67455 3.52759 4.33509 3.96043L0.940532 8.31337C0.524699 8.86055 0.92356 9.62824 1.61944 9.62824H16.895C17.5908 9.62824 17.9897 8.86055 17.5739 8.32154L11.6334 0.701852C11.2939 0.260841 10.615 0.260841 10.2756 0.701852Z" fill="#1D1D1D" />
                                                    </svg>}
                                                {token.owner.verified ?
                                                    <div className='item-page__owner-avatar-verified' title="Verified Creator">
                                                        <svg className='item-page__owner-avatar-verified-icon' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path className='item-page__owner-avatar-verified-icon-fill' d="M4.20536 7.46349C4.14062 7.52857 4.05236 7.56492 3.96063 7.56492C3.86889 7.56492 3.78063 7.52857 3.71589 7.46349L1.76151 5.50876C1.55866 5.30592 1.55866 4.97707 1.76151 4.77457L2.00624 4.52984C2.20909 4.32699 2.53759 4.32699 2.74043 4.52984L3.96063 5.75003L7.25774 2.45292C7.46059 2.25007 7.78943 2.25007 7.99193 2.45292L8.23666 2.69765C8.43951 2.90049 8.43951 3.22934 8.23666 3.43184L4.20536 7.46349Z" fill="white" />
                                                        </svg>

                                                    </div> : <></>}
                                            </div>
                                            <div className='item-page__owner-creator-text'>
                                                <p className='item-page__owner-creator-text-name'>Owned by</p>
                                                <p className='item-page__owner-creator-text-value'>{token.owner.user_name ? token.owner.user_name : `@${token.owner.user_id}`}</p>
                                            </div>
                                        </Link> : <></>}
                                        {token.collection ? <Link className='item-page__owner-creator-item' to={`/collections/${token.collection._id}/items`} title={token.collection.name}>
                                            <div className='item-page__owner-avatar'>
                                                {token.collection.avatar_url ?
                                                    <img className='item-page__owner-avatar-img' src={`${API_LINK}/collections/get_file/${token.collection.avatar_url.size4}`} key={`tokenColectionAvatar${id}`} alt='avatar' />
                                                    :
                                                    <></>}
                                            </div>
                                            <div className='item-page__owner-creator-text'>
                                                <p className='item-page__owner-creator-text-name'>In the collection</p>
                                                <p className='item-page__owner-creator-text-value'>{token.collection.name}</p>
                                            </div>
                                        </Link> : <></>}
                                    </div>
                                    {token.description ? <p className='item-page__description'>{token.description}</p> : <></>}
                                    <div className='item-page__price'>
                                        <p className='item-page__price-title'>{token.price ? 'Current Price' : 'This token is not on sale'}</p>
                                        <div className='item-page__price-value' title={`1 Near = $${usdExchangeRate}`}>
                                            <p className='item-page__price-value-near'>{token.price ? parseFloat(priceValue) : ''}</p>
                                            {token.price ? <svg className='item-page__price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='item-page__price-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                            </svg> : <></>}

                                            {token.price ? <p className='item-page__price-value-dollar'>(${Number(Number(priceValue * usdExchangeRate).toFixed(0)).toLocaleString('us')})</p> : <></>}
                                        </div>
                                    </div>
                                    {
                                        (!isOwnerUser && token.is_on_sale) || isOwnerUser ?
                                            <div className={`item-page__transfer-buy-btns ${isOwnerUser && ((isApproveAvailible !== undefined && !isApproveAvailible) || (isTransferAvailible !== undefined && !isTransferAvailible)) ? 'item-page__transfer-buy-btns_error' : ''}`}>

                                                {!isOwnerUser && token.is_on_sale ?
                                                    <div className='item-page__buy-btn' onClick={handleBuy}>
                                                        <p className='item-page__buy-btn-text'>Buy now</p>
                                                    </div>
                                                    : <></>}

                                                {isOwnerUser && !token.is_on_sale ?
                                                    <div className={`item-page__buy-btn ${isApproveAvailible !== undefined ? isApproveAvailible ? '' : 'item-page__buy-btn_blocked' : ''} ${!token.can_be_listed ? 'item-page__buy-btn_blocked' : ''}`} onClick={() => {
                                                        if (isApproveAvailible !== undefined && isApproveAvailible && token.can_be_listed) {
                                                            handleList()
                                                        }
                                                    }}>
                                                        {isApproveAvailible !== undefined ?
                                                            <>
                                                                {
                                                                    !isApproveAvailible || !token.can_be_listed ?
                                                                        <div className='item-page__transfer-btn-text-block-container'>
                                                                            <svg className='item-page__transfer-btn-text-block-icon' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.79729 1.87103C9.19951 0.886739 7.81811 0.886739 7.22033 1.87103L0.746995 12.5456C0.0872191 13.6174 0.829396 15.0392 2.02513 15.0392H14.9718C16.1881 15.0392 16.9097 13.6175 16.2499 12.5456L9.79729 1.87103ZM9.15824 12.1956C9.15824 12.458 9.01386 12.5892 8.78723 12.5892H8.41622C8.16888 12.5892 8.04522 12.458 8.04522 12.1956V11.8675C8.04522 11.6051 8.16889 11.4739 8.41622 11.4739H8.78723C9.03458 11.4739 9.15824 11.6271 9.15824 11.8675V12.1956ZM9.09641 10.2269C9.09641 10.4893 8.95203 10.6205 8.7254 10.6205H8.45735C8.23057 10.6205 8.08634 10.4893 8.08634 10.2269L8.00394 6.18015C8.00394 5.91771 8.12761 5.7645 8.37495 5.7645H8.80795C9.0553 5.7645 9.17896 5.91769 9.17896 6.18015L9.09641 10.2269Z" fill="white" />
                                                                            </svg>

                                                                            <p className='item-page__transfer-btn-text_blocked'>item cannot be listed</p>
                                                                        </div>
                                                                        :
                                                                        <p className='item-page__buy-btn-text'>List item</p>

                                                                }
                                                            </>
                                                            : <></>}

                                                    </div>
                                                    : <></>}

                                                {isOwnerUser && token.is_on_sale ?
                                                    <div className={`item-page__buy-btn ${isApproveAvailible !== undefined ? isApproveAvailible ? '' : 'item-page__buy-btn_blocked' : ''} ${!token.can_be_listed ? 'item-page__buy-btn_blocked' : ''}`} onClick={() => {
                                                        if (isApproveAvailible !== undefined && isApproveAvailible && token.can_be_listed) {
                                                            handleList()
                                                        }
                                                    }}>
                                                        {isApproveAvailible !== undefined ?
                                                            <>
                                                                {
                                                                    isApproveAvailible || token.can_be_listed ?
                                                                        <p className='item-page__buy-btn-text'>Update listing</p>
                                                                        :
                                                                        <div className='item-page__transfer-btn-text-block-container'>
                                                                            <svg className='item-page__transfer-btn-text-block-icon' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.79729 1.87103C9.19951 0.886739 7.81811 0.886739 7.22033 1.87103L0.746995 12.5456C0.0872191 13.6174 0.829396 15.0392 2.02513 15.0392H14.9718C16.1881 15.0392 16.9097 13.6175 16.2499 12.5456L9.79729 1.87103ZM9.15824 12.1956C9.15824 12.458 9.01386 12.5892 8.78723 12.5892H8.41622C8.16888 12.5892 8.04522 12.458 8.04522 12.1956V11.8675C8.04522 11.6051 8.16889 11.4739 8.41622 11.4739H8.78723C9.03458 11.4739 9.15824 11.6271 9.15824 11.8675V12.1956ZM9.09641 10.2269C9.09641 10.4893 8.95203 10.6205 8.7254 10.6205H8.45735C8.23057 10.6205 8.08634 10.4893 8.08634 10.2269L8.00394 6.18015C8.00394 5.91771 8.12761 5.7645 8.37495 5.7645H8.80795C9.0553 5.7645 9.17896 5.91769 9.17896 6.18015L9.09641 10.2269Z" fill="white" />
                                                                            </svg>

                                                                            <p className='item-page__transfer-btn-text_blocked'>item cannot be listed</p>
                                                                        </div>
                                                                }
                                                            </>
                                                            : <></>}

                                                    </div>
                                                    : <></>}
                                                {isOwnerUser ?
                                                    <div className={`item-page__transfer-btn ${isTransferAvailible !== undefined ? isTransferAvailible ? '' : 'item-page__transfer-btn_blocked' : ''}`} onClick={() => {
                                                        if (isTransferAvailible !== undefined && isTransferAvailible) {
                                                            handleTransfer()
                                                        }
                                                    }}>
                                                        {isTransferAvailible !== undefined ?
                                                            <>
                                                                {
                                                                    isTransferAvailible ?
                                                                        <p className='item-page__transfer-btn-text'>Transfer</p>
                                                                        :
                                                                        <div className='item-page__transfer-btn-text-block-container'>
                                                                            <svg className='item-page__transfer-btn-text-block-icon' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.79729 1.87103C9.19951 0.886739 7.81811 0.886739 7.22033 1.87103L0.746995 12.5456C0.0872191 13.6174 0.829396 15.0392 2.02513 15.0392H14.9718C16.1881 15.0392 16.9097 13.6175 16.2499 12.5456L9.79729 1.87103ZM9.15824 12.1956C9.15824 12.458 9.01386 12.5892 8.78723 12.5892H8.41622C8.16888 12.5892 8.04522 12.458 8.04522 12.1956V11.8675C8.04522 11.6051 8.16889 11.4739 8.41622 11.4739H8.78723C9.03458 11.4739 9.15824 11.6271 9.15824 11.8675V12.1956ZM9.09641 10.2269C9.09641 10.4893 8.95203 10.6205 8.7254 10.6205H8.45735C8.23057 10.6205 8.08634 10.4893 8.08634 10.2269L8.00394 6.18015C8.00394 5.91771 8.12761 5.7645 8.37495 5.7645H8.80795C9.0553 5.7645 9.17896 5.91769 9.17896 6.18015L9.09641 10.2269Z" fill="white" />
                                                                            </svg>

                                                                            <p className='item-page__transfer-btn-text_blocked'>item cannot be transferred</p>
                                                                        </div>
                                                                }
                                                            </>
                                                            : <></>}

                                                    </div>

                                                    : <></>}
                                            </div>
                                            :
                                            <></>
                                    }

                                    {isOwnerUser && ((isApproveAvailible !== undefined && !isApproveAvailible) || (isTransferAvailible !== undefined && !isTransferAvailible) || (!token.can_be_listed)) ?
                                        <div className='item-page__error-description'>
                                            <ul className='item-page__error-description-ul'>
                                                {((isApproveAvailible !== undefined && !isApproveAvailible) && (isTransferAvailible !== undefined && !isTransferAvailible)) ?
                                                    <li className='item-page__error-description-li'>You smart contract does not support nft_approve and nft_transfer methods</li>
                                                    : <></>}
                                                {((isApproveAvailible !== undefined && !isApproveAvailible) && (isTransferAvailible !== undefined && isTransferAvailible)) ?
                                                    <li className='item-page__error-description-li'>You smart contract does not support nft_approve method</li>
                                                    : <></>}
                                                {(!token.can_be_listed) ?
                                                    <li className='item-page__error-description-li'>Your token smart contract {token.contract_id ? `"${token.contract_id}"` : ''} is not approved. If this is your collection <a className='item-page__error-description-li item-page__error-description-li_link' target="_blank" rel="noreferrer" href='https://druhk0gh9fz.typeform.com/to/HXoES14C'>Apply&nbsp;for&nbsp;listing</a>
                                                    </li>
                                                    : <></>}
                                                {((isApproveAvailible !== undefined && isApproveAvailible) && (isTransferAvailible !== undefined && !isTransferAvailible)) ?
                                                    <li className='item-page__error-description-li'>You smart contract does not support nft_transfer method</li>
                                                    : <></>}

                                                {/* <li className='item-page__error-description-li'>Your NFT was blocked for violating marketplace rules</li> */}
                                            </ul>
                                        </div>
                                        : <></>}

                                    <div className='item-page__pages'>
                                        <Link className={`item-page__pages-link`} to={`/item/${id}/sale-history`} onClick={() => setPage('sale-history')}>
                                            <div className='item-page__pages-link-texts'>
                                                <p className={`item-page__pages-link-text ${page === 'sale-history' ? 'item-page__pages-link-text_active' : ''}`}>Sale History</p>
                                            </div>

                                            <div className={`item-page__pages-link-line ${page === 'sale-history' ? 'item-page__pages-link-line_active' : ''}`}></div>
                                        </Link>
                                        <Link className={`item-page__pages-link`} to={`/item/${id}/bid-history`} onClick={() => setPage('bid-history')}>
                                            <div className='item-page__pages-link-texts'>
                                                <p className={`item-page__pages-link-text ${page === 'bid-history' ? 'item-page__pages-link-text_active' : ''}`}>Bid History</p>
                                            </div>

                                            <div className={`item-page__pages-link-line ${page === 'bid-history' ? 'item-page__pages-link-line_active' : ''}`}></div>
                                        </Link>
                                        <Link className={`item-page__pages-link`} to={`/item/${id}/price-history`} onClick={() => setPage('price-history')}>
                                            <div className='item-page__pages-link-texts'>
                                                <p className={`item-page__pages-link-text ${page === 'price-history' ? 'item-page__pages-link-text_active' : ''}`}>Price History</p>
                                            </div>

                                            <div className={`item-page__pages-link-line ${page === 'price-history' ? 'item-page__pages-link-line_active' : ''}`}></div>
                                        </Link>
                                        <Link className={`item-page__pages-link`} to={`/item/${id}/attributes`} onClick={() => setPage('attributes')}>
                                            <div className='item-page__pages-link-texts'>
                                                <p className={`item-page__pages-link-text ${page === 'attributes' ? 'item-page__pages-link-text_active' : ''}`}>Attributes</p>
                                            </div>

                                            <div className={`item-page__pages-link-line ${page === 'attributes' ? 'item-page__pages-link-line_active' : ''}`}></div>
                                        </Link>
                                        <Link className={`item-page__pages-link`} to={`/item/${id}/details`} onClick={() => setPage('detailse')}>
                                            <div className='item-page__pages-link-texts'>
                                                <p className={`item-page__pages-link-text ${page === 'details' ? 'item-page__pages-link-text_active' : ''}`}>Details</p>
                                            </div>

                                            <div className={`item-page__pages-link-line ${page === 'details' ? 'item-page__pages-link-line_active' : ''}`}></div>
                                        </Link>
                                        <Link className={`item-page__pages-link`} to={`/item/${id}/comments`} onClick={() => setPage('comments')}>
                                            <div className='item-page__pages-link-texts'>
                                                <p className={`item-page__pages-link-text ${page === 'comments' ? 'item-page__pages-link-text_active' : ''}`}>Comments</p>
                                            </div>

                                            <div className={`item-page__pages-link-line ${page === 'comments' ? 'item-page__pages-link-line_active' : ''}`}></div>
                                        </Link>
                                    </div>
                                    <div className={`item-page__pages-dropdown ${pageDropOpen ? 'item-page__pages-dropdown_active' : ''}`}>
                                        <div className='item-page__pages-dropdown-selected' onClick={() => setPageDropOpen(!pageDropOpen)}>

                                            {page === 'sale-history' ?
                                                <div className='item-page__pages-dropdown-selected-texts'>
                                                    <p className='item-page__pages-dropdown-selected-text'>Sale History</p>
                                                </div>
                                                : <></>}
                                            {page === 'bid-history' ?
                                                <div className='item-page__pages-dropdown-selected-texts'>
                                                    <p className='item-page__pages-dropdown-selected-text'>Bid History</p>
                                                </div>
                                                : <></>}
                                            {page === 'price-history' ?
                                                <div className='item-page__pages-dropdown-selected-texts'>
                                                    <p className='item-page__pages-dropdown-selected-text'>Price History</p>
                                                </div>
                                                : <></>}
                                            {page === 'attributes' ?
                                                <div className='item-page__pages-dropdown-selected-texts'>
                                                    <p className='item-page__pages-dropdown-selected-text'>Attributes</p>
                                                </div>
                                                : <></>}
                                            {page === 'details' ?
                                                <div className='item-page__pages-dropdown-selected-texts'>
                                                    <p className='item-page__pages-dropdown-selected-text'>Details</p>
                                                </div>
                                                : <></>}
                                            {page === 'comments' ?
                                                <div className='item-page__pages-dropdown-selected-texts'>
                                                    <p className='item-page__pages-dropdown-selected-text'>Comments</p>
                                                </div>
                                                : <></>}



                                            <svg className={`item-page__pages-dropdown-selected-arrow ${pageDropOpen ? 'item-page__pages-dropdown-selected-arrow_active' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='item-page__pages-dropdown-selected-arrow-stroke' d="M4 6.66797L7.29289 9.96086C7.68342 10.3514 8.31658 10.3514 8.70711 9.96086L12 6.66797" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </div>

                                        {pageDropOpen ?
                                            <div className='item-page__pages-dropdown-items'>

                                                {page === 'sale-history' ? <></> :
                                                    <Link className='item-page__pages-dropdown-item' to={`/item/${id}/sale-history`} onClick={() => setPageDropOpen(!pageDropOpen)}>
                                                        <p className='item-page__pages-dropdown-selected-text'>Sale History</p>

                                                    </Link>
                                                }
                                                {page === 'bid-history' ? <></> :
                                                    <Link className='item-page__pages-dropdown-item' to={`/item/${id}/bid-history`} onClick={() => setPageDropOpen(!pageDropOpen)}>
                                                        <p className='item-page__pages-dropdown-selected-text'>Bid History</p>

                                                    </Link>
                                                }
                                                {page === 'price-history' ? <></> :
                                                    <Link className='item-page__pages-dropdown-item' to={`/item/${id}/price-history`} onClick={() => setPageDropOpen(!pageDropOpen)}>
                                                        <p className='item-page__pages-dropdown-selected-text'>Price History</p>

                                                    </Link>
                                                }
                                                {page === 'attributes' ? <></> :
                                                    <Link className='item-page__pages-dropdown-item' to={`/item/${id}/attributes`} onClick={() => setPageDropOpen(!pageDropOpen)}>
                                                        <p className='item-page__pages-dropdown-selected-text'>Attributes</p>

                                                    </Link>
                                                }
                                                {page === 'details' ? <></> :
                                                    <Link className='item-page__pages-dropdown-item' to={`/item/${id}/details`} onClick={() => setPageDropOpen(!pageDropOpen)}>
                                                        <p className='item-page__pages-dropdown-selected-text'>Details</p>

                                                    </Link>
                                                }
                                                {page === 'comments' ? <></> :
                                                    <Link className='item-page__pages-dropdown-item' to={`/item/${id}/comments`} onClick={() => setPageDropOpen(!pageDropOpen)}>
                                                        <p className='item-page__pages-dropdown-selected-text'>Comments</p>

                                                    </Link>
                                                }




                                            </div>
                                            : <></>}

                                    </div>
                                    <div className='item-page__page-contents'>
                                        {
                                            page === 'comments' ? <Comments setComents={setComents} login={login} token_id={token.token_id} comments={coments} currentUser={currentUser} handleSendComment={handleSendComment} /> : <></>
                                        }
                                        {
                                            page === 'attributes' ? <Attributes token_id={token.token_id} attributes={token.attributes} /> : <></>
                                        }
                                        {
                                            page === 'details' ? <Details token={token} /> : <></>
                                        }

                                        {
                                            page === 'price-history' ? <PriceHistory theme={theme} token_id={token.token_id} price_history={token.price_history} /> : <></>
                                        }

                                        {
                                            page === 'sale-history' ? <SaleHistory usdExchangeRate={usdExchangeRate} token_id={token.token_id} sale_history={token.sale_history} /> : <></>
                                        }

                                        {
                                            page === 'bid-history' ? <BidHistory usdExchangeRate={usdExchangeRate} token_id={token.token_id} bid_history={token.bid_history} /> : <></>
                                        }
                                    </div>

                                </div>
                            </div>
                            :
                            <div className='profile__container'>
                                <MetaTags>
                                    <title>NFT not found</title>
                                    <meta property="og:site_name" content={`Higgs Field`} />
                                    <meta property="og:title" content={`NFT not found`} />


                                    <meta property="twitter:title" content={`NFT not found`} />


                                    <meta property="vk:title" content={`NFT not found`} />


                                </MetaTags>
                                <img className='profile__no-user-gif' src={gomer} alt='gomer'></img>
                                <p className='profile__no-user-text'>There are no items with such id<br />[{id}]</p>
                            </div>
                        : <></>}
                </>
            }

        </div>
    );
}

export default ItemPage;

/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './CreateItem.css';

import TextareaAutosize from "@mui/material/TextareaAutosize";
import validator from 'validator'
import NftCard from '../Profile/NftCard/NftCard';
import { Link } from 'react-router-dom';
import { API_LINK, market_commission, wordsBlackList } from '../../assets/utilis';
import pythonApi from '../../assets/pythonApi';
import MiniPreloader from '../MiniPreloader/MiniPreloader';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router'
import PreloaderOnCreate from '../PreloaderOnCreate/PreloaderOnCreate';
import { MetaTags } from 'react-meta-tags';




function CreateItem({ currentUser, usdExchangeRate, onNftCreate , setExplictAccept}) {
    const navigate = useNavigate()
    const [isTransactionPreloaderVisible, setTransactionPreloaderVisible] = useState(false)
    const [transactionError, setTransactionError] = useState('')
    useEffect(() => {
        var tz = moment.tz.guess();
        const urlParams = new URLSearchParams(window.location.search);
        const transactionHashes = urlParams.get('transactionHashes');
        const errorCode = urlParams.get('errorCode');
        if (errorCode) {
            navigate(`/create-item`)
            setTransactionError('SOMTH_GOES_WRONG')
            setTimeout(() => {
                setTransactionError('')
            }, 6000);
        }
        if (transactionHashes && currentUser) {
            setTransactionPreloaderVisible(true)

            pythonApi.checkTransactionsHashes({ transaction_hashes: transactionHashes.split(','), tz: tz })
                .then((res) => {
                    setTimeout(() => {
                        navigate(`/profile/${currentUser.user_id}/owned`)


                        console.log('______')
                        console.log(res)
                        console.log('______')
                        setTimeout(() => {
                            setTransactionPreloaderVisible(false)
                        }, 600)
                        // pythonApi.getToken({ tokenId: id })
                        //     .then((res) => {
                        //         console.log(res)
                        //         setToken(res)
                        //         setTokenExist(true)
                        //         setTimeout(() => {
                        //             setTransactionPreloaderVisible(false)
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
                    setTransactionError('SOMTH_GOES_WRONG')

                    setTimeout(() => {
                        navigate(`/create-item`)

                        setTimeout(() => {

                            setTransactionPreloaderVisible(false)
                            setTimeout(() => {
                                setTransactionError('')
                            }, 6000);
                        }, 3000);
                    }, 600)
                })

        }




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])


    const [isPreloaderVisible, setPreloaderVisible] = useState(false)

    const [fileValue, setFileValue] = useState(undefined);
    const [fileUrlValue, setFileUrlValue] = useState('');
    const [fileValidity, setFileValidity] = useState({});
    const [fileType, setFileType] = useState('')

    function handleFileChange(file) {
        console.log(file)
        setFileValidity({
            errorMassage: '',
            validState: false
        });
        if (file) {
            if (file.type === 'video/mp4' || file.type === 'video/webm') {
                setFileType('video')
            }
            else {
                setFileType('image')
            }
            if ((file.size && file.size / 1024 / 1024) > 20) {
                setFileValidity({
                    errorMassage: 'File is too big ',
                    validState: false
                });
            } else {
                var reader = new FileReader();
                var url = reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    setFileUrlValue(reader.result)
                }
                setFileValidity({
                    errorMassage: '',
                    validState: true
                });
                setFileValue(file)
            }
        }
    }


    const [nameValue, setNameValue] = useState('')
    const [nameValidity, setNameValidity] = useState({});

    function handleNameChange(e) {
        let inputValue = e.target.value.replace(/\./g, '')
        if (e.target.value.includes('.')) {
            setNameValue(inputValue + ' ')
        } else {
            if (wordsBlackList.filter((i) => {
                if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                    return true
                }
                else return false
            }).length > 0) {
                console.log(inputValue.replace(/\s/g, ''))
                setNameValidity({
                    errorMassage: `Contains an invalid value ${wordsBlackList.filter((i) => {
                        if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                            return true
                        }
                        else return false
                    })[0]}`,
                    validState: false
                });
            } else {
                setNameValidity({
                    errorMassage: ``,
                    validState: true
                });
            }

            setNameValue(inputValue)
        }
    }


    // const [linkValue, setLinkValue] = useState(``)
    // const [linkValidity, setLinkValidity] = useState({});
    // function handleLinkeChange(e) {
    //     let inputValue = e.target.value
    //     setLinkValue(inputValue)
    //     if (!inputValue) {
    //         setLinkValidity({
    //             errorMassage: (''),
    //             validState: false
    //         })
    //     } else {
    //         if (validator.isURL(inputValue)) {
    //             setLinkValidity({
    //                 errorMassage: '',
    //                 validState: true
    //             })
    //         } else {
    //             setLinkValidity({
    //                 errorMassage: ('Not valid URL'),
    //                 validState: false
    //             })
    //         }
    //     }


    // }


    const [descriptionValue, setDescriptionValue] = useState('')
    const [descriptionValidity, setDescriptionValidity] = useState({});

    function handleDescriptionChange(e) {
        let inputValue = e.target.value
       
            if (wordsBlackList.filter((i) => {
                if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                    return true
                }
                else return false
            }).length > 0) {
                console.log(inputValue.replace(/\s/g, ''))
                setDescriptionValidity({
                    errorMassage: `Contains an invalid value ${wordsBlackList.filter((i) => {
                        if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                            return true
                        }
                        else return false
                    })[0]}`,
                    validState: false
                });
            } else {
                setDescriptionValidity({
                    errorMassage: ``,
                    validState: true
                });
            }

            setDescriptionValue(inputValue)
        
    }

    const [priceValue, setPriceValue] = useState('')
    const [priceValidity, setPriceValidity] = useState({})
    function handlePriceChange(e) {
        let { value, max } = e.target;
        if (!value) {
            setPriceValidity({
                errorMassage: '',
                validState: false
            })
        }
        if (value.length <= 9) {
            if (Number(value) < max || Number(value) > 0.0001) {

                if (value.toString() === '0,0000' || value.toString() === '0.0000') {
                    setPriceValidity({
                        errorMassage: 'cant be zero',
                        validState: false
                    })
                } else if (value.toString() === '00' || value.toString() === '01' || value.toString() === '02' || value.toString() === '03' || value.toString() === '04' || value.toString() === '05' || value.toString() === '06' || value.toString() === '07' || value.toString() === '08' || value.toString() === '09' || value.toString() === ',0' || value.toString() === '.0' || value.toString() === ',1' || value.toString() === '.1' || value.toString() === ',2' || value.toString() === '.2' || value.toString() === ',3' || value.toString() === '.3' || value.toString() === ',4' || value.toString() === '.4' || value.toString() === ',5' || value.toString() === '.5' || value.toString() === ',6' || value.toString() === '.6' || value.toString() === ',7' || value.toString() === '.7' || value.toString() === ',8' || value.toString() === '.8' || value.toString() === ',9' || value.toString() === '.9') {
                    if (value.toString() === '.' || value.toString() === ',' || value.toString() === '.0' || value.toString() === ',1' || value.toString() === '.1' || value.toString() === ',2' || value.toString() === '.2' || value.toString() === ',3' || value.toString() === '.3' || value.toString() === ',4' || value.toString() === '.4' || value.toString() === ',5' || value.toString() === '.5' || value.toString() === ',6' || value.toString() === '.6' || value.toString() === ',7' || value.toString() === '.7' || value.toString() === ',8' || value.toString() === '.8' || value.toString() === ',9' || value.toString() === '.9') {
                        setPriceValue(`0.${value.toString().substring(1, 5)}`)
                    } else {
                        setPriceValue(`${value.toString().substring(0, 1)}.${value.toString().substring(1, 5)}`)
                    }

                    setPriceValidity({
                        errorMassage: '',
                        validState: true
                    })
                }
                else {
                    setPriceValue(value.toString().split(".").map((el, i) => i ? el.split("").slice(0, 4).join("") : el).join("."))
                    setPriceValidity({
                        errorMassage: '',
                        validState: true
                    })
                }
            }
        }




    }

    function handlePriceDelite(e) {
        if (e.key === 'e' || e.key === 'E') e.preventDefault()
        if (e.key === '+') e.preventDefault()
        if (e.key === '-') e.preventDefault()

    }


    const [explicitContentSelected, setExplicitContentSelected] = useState(false);


    const [propsCount, setPropsCount] = useState(1);
    const [propsArrayValue, setPropsArrayValue] = useState([
        {
            name: '',
            value: '',
            nameValidState: false,
            valueValidState: false,
            nameErrorMassage: '',
            valueErrorMassage: '',
        }
    ]);

    // useEffect(() => {



    // }, [propsCount])

    function handleAddProp() {
        let propsArray = [...propsArrayValue, {
            name: '',
            value: '',
            nameValidState: false,
            valueValidState: false,
            nameErrorMassage: '',
            valueErrorMassage: '',
        }]
        console.log(propsArray)
        setPropsArrayValue(propsArray)

    }

    function handlePropsNameChange(e, i) {
        let inputValue = e.target.value.replace(/\./g, '')
        let array = propsArrayValue.slice()
        if (!inputValue) {
            array[i].nameValidState = false
            array[i].nameErrorMassage = "Can't be empty"
        } else {
            if (e.target.value.includes('.')) {
                array[i].name = inputValue + ' '
            } else {
                if (wordsBlackList.filter((i) => {
                    if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                        return true
                    }
                    else return false
                }).length > 0) {

                    console.log(inputValue.replace(/\s/g, ''))
                    array[i].nameValidState = false
                    array[i].nameErrorMassage = "invalid"
                } else {
                    if (propsArrayValue && propsArrayValue.length > 1 && propsArrayValue.filter((item) => {
                        if (item.name.toLowerCase().trim() === inputValue.toString().toLowerCase().trim()) return true
                        else return false
                    }).length > 0) {

                        array[i].nameValidState = false
                        array[i].nameErrorMassage = "invalid"
                    } else {

                        array[i].nameValidState = true
                        array[i].nameErrorMassage = ""
                    }

                }

                array[i].name = inputValue;
            }
        }


        array[i].name = inputValue;
        setPropsArrayValue(array)

    }
    function handlePropsValueChange(e, i) {

        let inputValue = e.target.value.replace(/\./g, '')
        let array = propsArrayValue.slice()
        if (!inputValue) {
            array[i].valueValidState = false
            array[i].valueErrorMassage = "Can't be empty"
        } else {
            if (e.target.value.includes('.')) {
                array[i].value = inputValue + ' '
            } else {
                if (wordsBlackList.filter((i) => {
                    if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                        return true
                    }
                    else return false
                }).length > 0) {
                    console.log(inputValue.replace(/\s/g, ''))
                    array[i].valueValidState = false
                    array[i].valueErrorMassage = "invalid"
                } else {
                    array[i].valueValidState = true
                    array[i].valueErrorMassage = ""
                }

                array[i].value = inputValue;
            }
        }


        array[i].value = inputValue;
        setPropsArrayValue(array)
    }

    function handlePropDelete(i) {
        let array = propsArrayValue.filter((item, index) => {
            if (index !== i) return true
            else return false
        })

        setPropsArrayValue(array)
    }

    const [royalValue, setRoyalValue] = useState('')
    const [royalValidity, setRoyalValidity] = useState({})
    function handleRoyalChange(e) {
        let inputValue = e.target.value.replace(/\D|\./g, '')
        let formattedInputValue = '';
        // if (inputValue[0] === '0') {
        //     formattedInputValue += inputValue.substring(0, 1) + '.'
        //     if (inputValue.length > 1) {
        //         console.log(inputValue)
        //         formattedInputValue += inputValue.substring(1)
        //     }



        // } else {


        // }
        if (inputValue[0] === '0') {
            formattedInputValue += inputValue.substring(0, 1)



        } else {
            formattedInputValue = inputValue
            if (inputValue <= 50) {
                formattedInputValue = inputValue
                setRoyalValidity({
                    errorMassage: '',
                    validState: true
                })
            } else {
                setRoyalValidity({
                    errorMassage: '"Royalties" must be less than or equal to 50',
                    validState: false
                })
            }
        }

        setRoyalValue(formattedInputValue)
    }

    function handleRoyalDelite(e) {
        if (e.keyCode === 8 && e.target.value.replace(/\D/g, '').length === 1) {
            setRoyalValue('')
        }
        // if (e.keyCode === 8 && e.target.value.replace(/\D/g, '').length < 11) {

        // }

    }

    const [colectionsOpened, setColectionsOpened] = useState(false)
    const [colectionsSelected, setColectionsSelected] = useState('')
    const [collectionObj, setCollectionObj] = useState(null)

    const [categoryOpened, setCategoryOpened] = useState(false)
    const [categorySelected, setCategorySelected] = useState('art')

    const [listImidiatly, setListImidiatly] = useState(false)

    const [submitBtnActive, setSubmitBtnActive] = useState(false)


    const [formData, setFormData] = useState(new FormData())

    useEffect(() => {
        var data = new FormData();

        if (fileValue) {
            data.append("image", fileValue);
        }

        if (nameValue && nameValidity.validState) {
            data.append("name", nameValue);
        }

        // if (linkValue && linkValidity.validState) {
        //     data.append("link", linkValue);
        // }

        // if (priceValue && priceValidity.validState) {
        //     data.append("price", priceValue);
        // }

        if (descriptionValue && descriptionValidity.validState) {
            data.append("description", descriptionValue);
        }

        if (propsArrayValue && propsArrayValue.length > 0 && propsArrayValue.filter((item) => {
            if (!item.nameValidState || !item.valueValidState) return true
            else return false
        }).length === 0) {
            data.append("attributes", JSON.stringify(propsArrayValue.map((item) => {
                return {
                    trait_type: item.name,
                    value: item.value,
                }
            })));
        }

        if (collectionObj) {
            data.append("collection_id", collectionObj._id)
        }

        if (categorySelected) {
            data.append("category_name", categorySelected.toLowerCase())
        }

        if (royalValue) {
            if (royalValidity.validState) {
                data.append("royalty", royalValue)
            }
        } else {
            data.append("royalty", 0)
        }

        if (explicitContentSelected) {
            data.append("explicitContent", true)
        } else {
            data.append("explicitContent", false)
        }




        console.log('__________')
        for (var pair of data.entries()) {
            console.log(pair[0], pair[1]);
        }
        console.log('__________')

        if ((fileValue) &&
            (nameValue && nameValidity.validState) &&
            (!listImidiatly || (priceValue && priceValidity.validState)) &&
            (descriptionValue && descriptionValidity.validState) &&
            ((propsArrayValue && propsArrayValue.length > 0 && propsArrayValue.filter((item) => {
                if (!item.nameValidState || !item.valueValidState) return true
                else return false
            }).length === 0) || (propsArrayValue.filter((item) => {
                if (!item.name && !item.value) return false
                else return true
            }).length === 0)) &&
            (categorySelected) &&
            (!royalValue || (royalValue && royalValidity.validState))) {
            setSubmitBtnActive(true)
        }
        else {
            setSubmitBtnActive(false)
        }
        setFormData(data)


    }, [fileValue, nameValue, nameValidity, descriptionValue, descriptionValidity, propsArrayValue, priceValue, priceValidity, listImidiatly, collectionObj, categorySelected, royalValue, royalValidity, explicitContentSelected])


    function handleSubmit() {
        console.log('__________')
        for (var pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        console.log('__________')
        if (submitBtnActive) {
            setPreloaderVisible(true)
            pythonApi.createItem({ data: formData })
                .then((res) => {
                    let colbackURL = window.location.href
                    onNftCreate({ img: res.img, json: res.json, price: (priceValue && priceValidity.validState ? priceValue : null), title: nameValue, colbackURL, royalty: Number(royalValue) * 100 })
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const [timerValue, setTimerValue] = useState(0);
    const [timerIterationsValue, setTimerIterationsValue] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {
            if (timerValue >= 3) {
                setTimerValue(0)
                setTimerIterationsValue(timerIterationsValue + 1)
            } else {
                setTimerValue(timerValue + 1)
            }

            clearInterval(timer)
        }, 600);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerValue])

    return (
        <>
            {isTransactionPreloaderVisible ?
                <div className='create-item__preloader'>

                    <p className="create-item__preloader-text">{[...Array(timerValue)].map((elementInArray, i) => (
                        <span className="create-item__preloader-text_transparent" key={i}>.</span>
                    )
                    )}Minting your NFT{timerIterationsValue > 10 ? ', please give us some more time' : ''}{[...Array(timerValue)].map((elementInArray, i) => (
                        <span className="" key={i}>.</span>
                    )
                    )}</p>
                    <PreloaderOnCreate />
                </div>
                :
                // transactionError && transactionError === 'SOMTH_GOES_WRONG'
                <div className='create-item'>
                    <MetaTags>
                        <title>Create NFT</title>
                        <meta property="og:site_name" content={`Higgs Field`} />
                        <meta property="og:title" content={`Create NFT`} />
                        <meta property="twitter:title" content={`Create NFT`} />
                        <meta property="vk:title" content={`Create NFT`} />
                    </MetaTags>
                    <h2 className='create-item__title'>Create a new Item</h2>
                    {transactionError && transactionError === 'SOMTH_GOES_WRONG' ? <h2 className='create-item__title-error'>The information hasn't been updated in the blockchain yet. Try to refresh metadata in 15 minutes</h2> : <></>}
                    <div className='create-item__container'>
                        <div className='create-item__inputs'>
                            <div className='create-item__input'>
                                <h3 className='create-item__input-title'>Upload file*</h3>
                                <p className='create-item__input-subtitle'>File types supported: JPG, PNG, GIF, SVG, MP4, WEBM. Max size: 20 MB</p>
                                <div className='create-item__input-file-container'>
                                    <div className={`create-item__file-box ${fileValidity.errorMassage ? 'create-item__file-box_error' : ''}`}>
                                        {fileUrlValue ?
                                            <>
                                                {fileType && fileType === 'video' ?
                                                <video className='create-item__file-box-img' src={fileUrlValue} key={fileUrlValue} alt='' autoPlay loop muted controls={false}></video>
                                                :
                                                <img className='create-item__file-box-img' src={fileUrlValue} key={fileUrlValue} alt=''></img>
                                                }
                                            </>

                                            :
                                            <svg className='create-item__file-box-icon' width="58" height="33" viewBox="0 0 58 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className={`create-item__file-box-icon-fill ${fileValidity.errorMassage ? 'create-item__file-box-icon-fill_error' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M32.4803 1.17909L23.9246 12.6206L30.4501 21.3547C31.4072 22.6356 31.1462 24.4698 29.8701 25.4305C28.594 26.3913 26.7668 26.1584 25.8097 24.8483C22.7645 20.7724 19.1102 15.9105 16.819 12.7953C15.6589 11.2523 13.3387 11.2523 12.1787 12.7953L0.577723 28.3128C-0.843391 30.2633 0.519718 33 2.89791 33H55.1021C57.4803 33 58.8434 30.2633 57.4223 28.3419L37.1207 1.17909C35.9606 -0.393031 33.6404 -0.393031 32.4803 1.17909Z" fill="white" />
                                            </svg>}
                                    </div>
                                    {fileValidity.errorMassage ? <p className='create-item__file-error'>{fileValidity.errorMassage}</p> : <></>}
                                    <form className='create-item__file-form' encType="multipart/form-data">
                                        <label className={`create-item__custom-input-file `} htmlFor="file-upload">
                                            <input className="create-item__input-file" id="file-upload" name="file" accept="image/*, video/webm, video/mp4" type="file" onChange={(e) => handleFileChange(e.target.files[0])}></input>
                                            <p className='create-item__custom-input-file-text'>Choose File</p>
                                        </label>
                                    </form>
                                </div>
                            </div>
                            <div className='create-item__input create-item__input_type_name'>
                                <p className='create-item__input-title'>Name*</p>
                                <input autoComplete="off" className={`create-item__input-elem ${nameValidity.errorMassage ? 'create-item__input-elem_error' : ''}`} placeholder="name your item" name="item name" type="text" value={nameValue} onChange={handleNameChange} minLength="0" maxLength="20"></input>
                                <div className='create-item__input-bottom'>
                                    <p className={`create-item__input-lenght create-collection__input-lenght_with-error ${nameValidity.errorMassage ? 'create-collection__input-lenght_error' : ''}`}>{nameValue.length}/20</p>
                                    {nameValidity.errorMassage ? <p className='create-item__inpot-error'>{nameValidity.errorMassage}</p> : <></>}
                                </div>
                            </div>
                            {/* <div className='create-item__input create-item__input_type_link'>
                        <p className='create-item__input-title'>External link</p>
                        <input autoComplete="off" className={`create-item__input-elem ${linkValidity.errorMassage ? 'create-item__input-elem_error' : ''}`} placeholder="https://yoursite.io/item/123" name="link" type="text" value={linkValue} onChange={handleLinkeChange} minLength="0" maxLength="300"></input>
                        <div className='create-item__input-bottom'>
                            
                            {linkValidity.errorMassage ? <p className='create-item__inpot-error'>{linkValidity.errorMassage}</p> : <></>}
                        </div>
                    </div> */}
                            <div className='create-item__list-selector'>
                                <p className='create-item__list-selector-text'>Do you want to list this NFT immediately?</p>
                                <div className={`create-item__list-selector-handler ${listImidiatly ? 'create-item__list-selector-handler_active' : ''}`} onClick={() => {
                                    setListImidiatly(!listImidiatly)
                                }}>
                                    <div className={`create-item__list-selector-handler-circle ${listImidiatly ? 'create-item__list-selector-handler-circle_active' : ''}`}></div>
                                </div>
                            </div>
                            {listImidiatly ?
                                <div className='create-item__input create-item__input_type_price'>
                                    <p className='create-item__input-title'>Price*</p>
                                    <p className='create-item__input-subtitle'>Service fee: <span className='create-item__input-subtitle_span'>{market_commission}%</span></p>
                                    <input autoComplete="off" onWheel={(e) => e.target.blur()} onKeyDown={handlePriceDelite} className={`create-item__input-elem ${priceValidity.errorMassage ? 'create-item__input-elem_error' : ''}`} placeholder="your item price" name="item price" type="number" value={priceValue} onChange={handlePriceChange} min="0,0001" max="999999999"></input>
                                    <p className='create-item__input-lenght'>~ {parseFloat((priceValue ? (Number(priceValue) * usdExchangeRate).toFixed(2) : '0'))}{ } $</p>
                                </div>

                                : <></>}

                            <div className='create-item__input create-item__input_type_description'>
                                <p className='create-item__input-title'>Description*</p>
                                <TextareaAutosize className={`create-item__textarea ${descriptionValidity.errorMassage ? 'create-item__input-elem_error' : ''}`} placeholder="Provide a detailed description of your item." name="item description" type="text" value={descriptionValue} onChange={handleDescriptionChange} minLength="0" maxLength="350" ></TextareaAutosize>
                                <div className='create-item__input-bottom'>
                                    <p className={`create-item__input-lenght create-collection__input-lenght_with-error ${descriptionValidity.errorMassage ? 'create-collection__input-lenght_error' : ''}`}>{descriptionValue.length}/350</p>
                                    {descriptionValidity.errorMassage ? <p className='create-item__inpot-error'>{descriptionValidity.errorMassage}</p> : <></>}
                                </div>
                            </div>
                            <div className='create-item__input create-item__input_type_description'>
                                <p className='create-item__input-title'>Collection</p>
                                <div className='create-item__collection' onClick={() => setColectionsOpened(!colectionsOpened)}>
                                    <p className='create-item__collection-name'>{colectionsSelected ? colectionsSelected : 'Select collection'}</p>

                                    <svg className={`create-item__collection-arrow ${colectionsOpened ? 'create-item__collection-arrow_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='create-item__collection-arrow-fill' d="M10.9393 17.3238C11.5251 17.9096 12.4749 17.9096 13.0607 17.3238L22.6066 7.77788C23.1924 7.19209 23.1924 6.24234 22.6066 5.65656C22.0208 5.07077 21.0711 5.07077 20.4853 5.65656L12 14.1418L3.51472 5.65656C2.92893 5.07077 1.97918 5.07077 1.3934 5.65656C0.807612 6.24234 0.807612 7.19209 1.3934 7.77788L10.9393 17.3238ZM10.5 15V16.2632H13.5V15H10.5Z" fill="white" fillOpacity="0.12" />
                                    </svg>

                                </div>
                                {colectionsOpened ?
                                    <div className='create-item__collection-drop'>
                                        {currentUser ? currentUser.collections.length > 0 ?
                                            currentUser.collections.map((item, i) => (
                                                <div className={`create-item__collection-drop-item ${colectionsSelected === item.name ? 'create-item__collection-drop-item_selected' : ''}`} key={`create-item__collection-drop-item${i}`} onClick={() => {
                                                    if (colectionsSelected === item.name) {
                                                        setColectionsSelected('')
                                                        setCollectionObj(null)
                                                    } else {
                                                        setColectionsSelected(item.name)
                                                        setColectionsOpened(false)
                                                        setCollectionObj(item)
                                                    }

                                                }}>
                                                    <img className='create-item__collection-drop-img' src={`${API_LINK}/collections/get_file/${item.avatar_url.size4}`} alt='collection' />
                                                    <p className='create-item__collection-drop-name' >{item.name}</p>
                                                </div>
                                            ))
                                            : <div className='create-item__collection-drop-item'>
                                                <p className='create-item__collection-drop-no-items'>No results</p>
                                            </div> : <></>}
                                        <Link className='create-item__collection-create' to='/create-collection'>
                                            <p className='create-item__collection-create-text'>Create a new collection</p>
                                        </Link>
                                    </div>
                                    : <></>}
                            </div>

                            {/* <div className='create-item__input create-item__input_type_description'>
                                <p className='create-item__input-title'>Category*</p>
                                <div className='create-item__collection' onClick={() => setCategoryOpened(!categoryOpened)}>
                                    <p className='create-item__collection-name'>{categorySelected ? `${categorySelected.toString().substring(0, 1).toUpperCase()}${categorySelected.toString().substring(1).toLowerCase()}` : 'Select category'}</p>

                                    <svg className={`create-item__collection-arrow ${categoryOpened ? 'create-item__collection-arrow_active' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='create-item__collection-arrow-fill' d="M10.9393 17.3238C11.5251 17.9096 12.4749 17.9096 13.0607 17.3238L22.6066 7.77788C23.1924 7.19209 23.1924 6.24234 22.6066 5.65656C22.0208 5.07077 21.0711 5.07077 20.4853 5.65656L12 14.1418L3.51472 5.65656C2.92893 5.07077 1.97918 5.07077 1.3934 5.65656C0.807612 6.24234 0.807612 7.19209 1.3934 7.77788L10.9393 17.3238ZM10.5 15V16.2632H13.5V15H10.5Z" fill="white" fillOpacity="0.12" />
                                    </svg>

                                </div>
                                {categoryOpened ?
                                    <div className='create-item__collection-drop'>
                                        <div className={`create-item__collection-drop-item ${categorySelected === 'art' ? 'create-item__collection-drop-item_selected' : ''}`} onClick={() => {
                                            if (categorySelected === 'art') {
                                                setCategorySelected('')
                                            } else {
                                                setCategorySelected('art')
                                                setCategoryOpened(!categoryOpened)
                                            }

                                        }}>
                                            <svg className='create-item__collection-drop-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='create-item__collection-drop-icon-fill' d="M4.68808 14.6245H0.274973C0.179423 14.6243 0.0907639 14.5744 0.0407729 14.493C-0.00921813 14.4115 -0.0135303 14.3099 0.0294448 14.2246L3.89091 6.50166C3.93819 6.40956 4.03288 6.35156 4.13644 6.35156C4.24 6.35156 4.33469 6.40956 4.38197 6.50166L6.67681 11.0885H6.67669C6.71991 11.1695 6.71991 11.2667 6.67669 11.3478L4.92806 14.4838C4.8793 14.5705 4.78757 14.6243 4.68807 14.6245L4.68808 14.6245ZM0.721958 14.0729H4.52542L6.11963 11.2071L4.13657 7.2438L0.721958 14.0729Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M15.721 14.6131H4.68825C4.59085 14.6131 4.50072 14.5617 4.45109 14.4779C4.40172 14.3925 4.40172 14.2874 4.45109 14.202L9.96747 4.27257C10.0164 4.18625 10.1081 4.13281 10.2073 4.13281C10.3067 4.13281 10.3983 4.18625 10.4473 4.27257L15.9637 14.202C16.013 14.2874 16.013 14.3925 15.9637 14.4779C15.9131 14.5634 15.8204 14.615 15.721 14.6131H15.721ZM5.1573 14.0614H15.2523L10.2049 4.9758L5.1573 14.0614Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M5.78968 3.30983C5.3507 3.30983 4.92985 3.13547 4.61942 2.82517C4.30912 2.51475 4.13477 2.09389 4.13477 1.65491C4.13477 1.21594 4.30912 0.795083 4.61942 0.484653C4.92984 0.174355 5.3507 0 5.78968 0C6.22866 0 6.64951 0.174355 6.95994 0.484653C7.27024 0.795074 7.44459 1.21594 7.44459 1.65491C7.44459 2.09389 7.27024 2.51474 6.95994 2.82517C6.64952 3.13547 6.22866 3.30983 5.78968 3.30983ZM5.78968 0.551638C5.49712 0.551638 5.21648 0.667876 5.00951 0.87474C4.80264 1.08173 4.6864 1.36236 4.6864 1.65491C4.6864 1.94747 4.80264 2.22811 5.00951 2.43509C5.21649 2.64195 5.49712 2.75819 5.78968 2.75819C6.08224 2.75819 6.36288 2.64195 6.56985 2.43509C6.77672 2.2281 6.89295 1.94747 6.89295 1.65491C6.89295 1.36236 6.77672 1.08171 6.56985 0.87474C6.36286 0.667876 6.08224 0.551638 5.78968 0.551638Z" fill="white" />
                                            </svg>
                                            <p className='create-item__collection-drop-name' >Art</p>
                                        </div>
                                        <div className={`create-item__collection-drop-item ${categorySelected === 'collectables' ? 'create-item__collection-drop-item_selected' : ''}`} onClick={() => {
                                            if (categorySelected === 'collectables') {
                                                setCategorySelected('')
                                            } else {
                                                setCategorySelected('collectables')
                                                setCategoryOpened(!categoryOpened)
                                            }

                                        }}>
                                            <svg className='create-item__collection-drop-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='create-item__collection-drop-icon-fill' d="M14.6014 4.83067H12.7119V3.19533C12.7119 2.69505 12.3049 2.28828 11.8047 2.28828H10.1696V0.907168C10.1696 0.406887 9.76256 0.000120201 9.26231 0.000120201L0.907263 0C0.406982 0 0 0.407013 0 0.907048V9.2624C0 9.76268 0.407013 10.1694 0.907263 10.1694H2.54236V11.5506C2.54236 12.0508 2.94937 12.4576 3.44963 12.4576H5.33905V14.093C5.33905 14.5932 5.74606 15 6.24631 15H14.6017C15.1019 15 15.5089 14.593 15.5089 14.093V5.7376C15.5088 5.23757 15.1018 4.83055 14.6015 4.83055L14.6014 4.83067ZM2.54236 3.19533V9.40684H0.907263C0.827448 9.40684 0.762662 9.34205 0.762662 9.26248V0.906817C0.762662 0.827245 0.827451 0.762456 0.907263 0.762456H9.26262C9.34243 0.762456 9.40722 0.827245 9.40722 0.906817V2.28793H3.44957C2.94929 2.28793 2.54231 2.69494 2.54231 3.19507L2.54236 3.19533ZM5.3392 5.73769V11.695L3.44966 11.6951C3.36984 11.6951 3.30506 11.6304 3.30506 11.5508V3.19513C3.30506 3.11556 3.36984 3.05077 3.44966 3.05077H11.805C11.8848 3.05077 11.9496 3.11556 11.9496 3.19513V4.83047H6.24644C5.74616 4.83047 5.33939 5.23749 5.33939 5.73752L5.3392 5.73769ZM14.746 14.0933C14.746 14.1729 14.6812 14.2377 14.6014 14.2377H6.24606C6.16624 14.2377 6.10146 14.1729 6.10146 14.0933V5.73769C6.10146 5.65812 6.16625 5.59333 6.24606 5.59333H14.6014C14.6812 5.59333 14.746 5.65812 14.746 5.73769V14.0933Z" fill="white" />
                                            </svg>

                                            <p className='create-item__collection-drop-name' >Collectables</p>
                                        </div>
                                        <div className={`create-item__collection-drop-item ${categorySelected === 'metaverses' ? 'create-item__collection-drop-item_selected' : ''}`} onClick={() => {
                                            if (categorySelected === 'metaverses') {
                                                setCategorySelected('')
                                            } else {
                                                setCategorySelected('metaverses')
                                                setCategoryOpened(!categoryOpened)
                                            }

                                        }}>

                                            <svg className='create-item__collection-drop-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='create-item__collection-drop-icon-fill' d="M15.1886 4.48774C15.1391 4.38716 15.088 4.28759 15.0348 4.18906C13.6323 1.60526 10.9362 0 7.99905 0C7.03264 0 6.08642 0.171097 5.18661 0.508464L5.13973 0.526464C5.04404 0.563031 4.94676 0.60256 4.85085 0.644196C3.26396 1.32274 1.91578 2.52416 1.05475 4.02647C0.364824 5.22977 0 6.60372 0 7.99988C0 9.46267 0.397734 10.8927 1.14976 12.1343L1.18126 12.1868C1.35345 12.4669 1.54836 12.7429 1.76058 13.0071C2.09618 13.4253 2.47602 13.8115 2.88932 14.1547C4.32028 15.3448 6.13496 16 7.99918 16C10.2228 16 12.2886 15.1092 13.8155 13.4917C14.1054 13.1853 14.3741 12.8519 14.6141 12.5003L14.6318 12.4747C15.5263 11.1512 15.9991 9.60398 15.9991 7.99974C15.9989 6.76831 15.7263 5.58668 15.1886 4.48784L15.1886 4.48774ZM1.24378 11.0326C1.27425 11.1891 1.30325 11.3414 1.31042 11.4948C0.748926 10.4219 0.453538 9.2235 0.453538 7.99998C0.453538 6.68312 0.797336 5.38702 1.44808 4.2523C1.45646 4.23761 1.46574 4.22325 1.47434 4.20873C2.1023 4.06178 2.58423 3.78985 3.33521 3.36534C3.74501 3.13387 4.25508 2.84565 4.91407 2.5092C5.66751 2.1248 6.4524 1.9218 7.18452 1.9218C8.09824 1.9218 8.88353 2.22783 9.4557 2.80665C10.1005 3.4591 10.4338 4.4294 10.42 5.61296C10.405 6.84708 10.0305 7.0883 9.38889 7.08859H9.38855C9.10547 7.08859 8.77226 7.03818 8.38632 6.98026C7.88225 6.90416 7.31089 6.81821 6.67477 6.81821C5.47444 6.81821 4.3893 7.13877 3.35738 7.79824C0.917637 9.35698 1.09101 10.2473 1.24382 11.0325L1.24378 11.0326ZM1.56908 11.9519L1.53843 11.9007C1.52829 11.8842 1.51918 11.8672 1.50921 11.8506C1.57221 11.5446 1.51969 11.263 1.46632 10.9894C1.32057 10.24 1.16974 9.46521 3.47956 7.98929C4.47393 7.35375 5.51905 7.04492 6.67476 7.04492C7.29384 7.04492 7.85618 7.12962 8.35234 7.20451C8.74729 7.26398 9.08812 7.31547 9.38835 7.31547H9.38869C10.2675 7.31547 10.6319 6.8229 10.6464 5.61573C10.6613 4.37028 10.3053 3.34382 9.6167 2.64727C9.00098 2.02437 8.16006 1.69503 7.18425 1.69503C6.41646 1.69503 5.59562 1.90676 4.81071 2.30727C4.14738 2.64584 3.63503 2.93541 3.22339 3.16796C2.58455 3.52897 2.14534 3.7765 1.64671 3.92733C2.46036 2.66207 3.64843 1.65192 5.02987 1.06108C5.13518 1.0154 5.2409 0.972742 5.34393 0.934409L5.38978 0.916923C5.50945 0.873008 5.6302 0.83291 5.7513 0.795146C6.2899 0.778001 7.22867 0.808075 8.86542 0.975021C11.6738 1.2613 11.9492 2.67287 12.2678 4.30728C12.4001 4.98583 12.5371 5.68767 12.8634 6.35129C13.3787 7.39887 13.4643 8.19743 13.1037 8.60002C12.7422 9.00385 11.9315 9.00453 10.8213 8.60264C8.4317 7.73773 4.16813 8.85142 2.73013 10.3143C1.88886 11.1703 1.9641 11.6517 2.02446 12.0383C2.05368 12.2255 2.07801 12.3842 1.99439 12.5699C1.84043 12.3674 1.6973 12.1601 1.56908 11.9517L1.56908 11.9519ZM2.14874 12.764C2.32178 12.4735 2.28538 12.235 2.24916 12.0032C2.19106 11.6319 2.1312 11.248 2.89256 10.4735C4.28695 9.05474 8.42412 7.97553 10.7446 8.81585C11.9655 9.25768 12.8396 9.2353 13.2734 8.75126C13.7061 8.26814 13.6349 7.40357 13.0678 6.25101C12.7544 5.61445 12.6206 4.92787 12.4911 4.26358C12.1689 2.6121 11.8648 1.05248 8.88907 0.749191C7.99181 0.65766 7.2424 0.600127 6.64093 0.576155C7.08673 0.49499 7.54046 0.453696 7.9991 0.453696C10.7698 0.453696 13.3131 1.96796 14.6359 4.40494C14.6814 4.48929 14.7252 4.57501 14.7677 4.66107C14.6515 4.77971 14.49 4.92285 14.2828 5.08991C13.5573 5.67379 13.8212 6.47399 14.1005 7.32085C14.3507 8.07952 14.6342 8.93951 14.2506 9.78377C13.8159 10.7407 13.2856 10.6128 12.1241 10.333C11.2343 10.1188 10.0163 9.82575 8.28671 9.90834C4.41712 10.0945 3.79275 11.5737 3.69491 13.1444C3.65447 13.7899 3.53514 13.9797 3.47164 14.0357C3.37259 13.9613 3.27462 13.8851 3.17911 13.8058C2.80284 13.4933 2.45694 13.1425 2.1488 12.7638L2.14874 12.764ZM13.4855 13.1804C12.0451 14.7062 10.0967 15.5465 7.99905 15.5465C7.1343 15.5465 6.28093 15.3964 5.47619 15.1107L5.48616 15.1056C5.4795 15.0928 4.82773 13.8286 5.29335 12.8868C5.54568 12.3762 6.08615 12.0467 6.89948 11.9072C9.77404 11.4152 10.0627 11.5039 11.9388 12.0831L12.1175 12.138C13.0917 12.4381 13.6758 12.5317 14.0263 12.5389C13.8572 12.763 13.6767 12.9782 13.4856 13.1805L13.4855 13.1804ZM14.2719 12.1968L14.2549 12.2217C14.2352 12.2507 14.214 12.2789 14.1937 12.3077C13.9519 12.3291 13.3951 12.2941 12.1841 11.921L12.0057 11.8663C10.084 11.2733 9.78874 11.1821 6.86125 11.6838C5.97236 11.836 5.37644 12.2067 5.08991 12.7863C4.68853 13.5983 5.01171 14.5795 5.18896 15.0022C4.64952 14.7858 4.1349 14.5072 3.65662 14.1706C3.80186 14.0066 3.88901 13.6734 3.92119 13.159C3.98277 12.1729 4.09742 10.3376 8.29748 10.1356C9.99474 10.0535 11.1943 10.3431 12.0707 10.5541C13.2397 10.8355 13.9448 11.0056 14.4571 9.87839C14.8773 8.95343 14.579 8.04872 14.3159 7.2504C14.0399 6.41351 13.8221 5.75261 14.425 5.26705C14.6069 5.12044 14.7533 4.99269 14.869 4.8807C15.3159 5.86181 15.5451 6.90955 15.5451 8.00037C15.5452 9.50327 15.1051 10.9538 14.2719 12.1967L14.2719 12.1968Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M9.42623 12.5234C8.95535 12.5234 7.80581 12.5717 7.30377 13.0202C7.19128 13.1206 7.08819 13.21 6.9946 13.2907C6.39426 13.8104 6.12024 14.0472 6.54002 14.627C6.73965 14.9025 6.9381 15.0151 7.22489 15.0151C7.40494 15.0151 7.61858 14.9706 7.88908 14.9143C8.10188 14.8699 8.34298 14.8197 8.64201 14.7735C9.66755 14.6155 11.6985 14.0062 11.9244 13.4058C11.9696 13.2854 11.9487 13.1687 11.8637 13.0676C11.5636 12.7103 10.4103 12.5234 9.42628 12.5234L9.42623 12.5234ZM11.712 13.3257C11.5591 13.7329 9.83334 14.3602 8.60763 14.5491C8.30285 14.5962 8.04774 14.6492 7.84297 14.6921C7.58523 14.7456 7.38172 14.7882 7.22497 14.7882C7.04265 14.7882 6.90213 14.74 6.72386 14.4937C6.43445 14.0941 6.52827 13.9943 7.14313 13.4622C7.23745 13.3805 7.34157 13.2906 7.45475 13.1893C7.76272 12.9142 8.4997 12.7499 9.42614 12.7499C10.4599 12.7499 11.4754 12.9578 11.69 13.2133C11.7216 13.251 11.728 13.2835 11.712 13.3257L11.712 13.3257Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M8.60736 13.3906C8.51548 13.3906 8.42748 13.398 8.35293 13.4116C8.07053 13.464 7.62102 13.7719 7.64129 14.0244C7.64778 14.104 7.70218 14.2389 7.99494 14.2456C8.02627 14.2462 8.05725 14.2466 8.0875 14.2466C8.67366 14.2466 9.08524 14.1154 9.27804 13.8672C9.35852 13.7635 9.3342 13.6735 9.3125 13.6293C9.20143 13.4022 8.70555 13.3906 8.60736 13.3906V13.3906ZM9.09891 13.7282C8.94455 13.9269 8.54915 14.0303 8.00007 14.0186C7.91925 14.0169 7.88285 14.0043 7.86884 13.9975C7.8914 13.9101 8.16686 13.6769 8.39395 13.6349C8.45535 13.6237 8.52888 13.6176 8.60726 13.6176C8.87605 13.6176 9.06286 13.682 9.10314 13.7222C9.10223 13.7239 9.10063 13.7257 9.09892 13.7282L9.09891 13.7282Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M3.72854 6.91616C4.30297 6.62323 4.89687 6.32055 5.44126 6.25021L5.51997 6.24007C6.87028 6.06611 8.5507 5.84984 8.81564 4.94631C9.0928 4.00075 8.75509 3.70992 7.30516 2.97011C7.04954 2.83956 6.74731 2.77344 6.40647 2.77344C4.87967 2.77344 2.99795 4.06912 2.61388 4.38992C2.34846 4.6116 2.34846 4.6116 2.32009 4.63718C2.29207 4.66218 2.23631 4.71242 1.8629 5.03087C1.43365 5.39746 1.20184 5.92062 1.24296 6.43068C1.27588 6.83872 1.47814 7.17557 1.81306 7.37903C1.92259 7.44567 2.05314 7.47944 2.20099 7.47944C2.62328 7.47962 3.16028 7.20599 3.72853 6.91618L3.72854 6.91616ZM1.46873 6.4126C1.43359 5.97499 1.63602 5.52302 2.00994 5.20349C2.38667 4.8819 2.44317 4.83133 2.47137 4.80591C2.49916 4.78108 2.49916 4.78108 2.75918 4.56407C3.25909 4.14639 5.05208 3.00037 6.40639 3.00037C6.71101 3.00037 6.97877 3.05813 7.20182 3.17204C8.65185 3.91198 8.82122 4.11988 8.59774 4.88242C8.37464 5.64373 6.70786 5.85829 5.49091 6.01504L5.41219 6.02518C4.829 6.10042 4.21709 6.41221 3.62569 6.71385C3.08236 6.99084 2.569 7.25262 2.20088 7.25262C2.09363 7.25262 2.00529 7.23057 1.93073 7.18524C1.65945 7.0208 1.49551 6.74627 1.46874 6.4126L1.46873 6.4126Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M4.32855 5.77114C4.50615 5.77114 4.72959 5.72409 4.96615 5.67419C5.12152 5.6415 5.28215 5.60772 5.4447 5.58323C6.26183 5.4606 6.71202 5.29645 6.90561 4.73951C6.94918 4.61403 6.98802 4.45416 6.90002 4.33044C6.80046 4.19043 6.59541 4.16406 6.25172 4.16406C6.13029 4.16406 5.98909 4.16754 5.82704 4.17158L5.46188 4.17978C4.59806 4.19658 4.12229 4.2057 3.90635 5.08792C3.84512 5.33814 3.85913 5.5089 3.95078 5.62578C4.02762 5.72358 4.15116 5.77114 4.32858 5.77114L4.32855 5.77114ZM4.12663 5.14192C4.30127 4.42926 4.59472 4.42362 5.46623 4.40665L5.83282 4.39844C5.99258 4.3944 6.13185 4.39093 6.25169 4.39093C6.36475 4.39093 6.66447 4.39093 6.71504 4.46195C6.72678 4.47841 6.73919 4.52671 6.69106 4.66513C6.5502 5.07072 6.25117 5.23294 5.41093 5.35911C5.24171 5.38446 5.07777 5.41897 4.91926 5.45235C4.69462 5.4998 4.48233 5.5444 4.32854 5.5444C4.22551 5.5444 4.16041 5.52514 4.12942 5.48596C4.09912 5.44728 4.07411 5.35649 4.12663 5.14193L4.12663 5.14192Z" fill="white" />
                                            </svg>

                                            <p className='create-item__collection-drop-name' >Metaverses</p>
                                        </div>
                                        <div className={`create-item__collection-drop-item ${categorySelected === 'games' ? 'create-item__collection-drop-item_selected' : ''}`} onClick={() => {
                                            if (categorySelected === 'games') {
                                                setCategorySelected('')
                                            } else {
                                                setCategorySelected('games')
                                                setCategoryOpened(!categoryOpened)
                                            }

                                        }}>

                                            <svg className='create-item__collection-drop-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='create-item__collection-drop-icon-fill' d="M12.9162 6.31816H7.82992V6.03675C7.82992 5.86285 7.96322 5.7214 8.12664 5.7214H9.7855C9.84657 5.7214 9.90332 5.70476 9.95375 5.67747C10.3773 5.55415 10.6905 5.16074 10.6905 4.69028C10.6905 4.12179 10.2362 3.65917 9.67798 3.65917H6.3232C6.15911 3.65917 6.02597 3.51771 6.02597 3.34381C6.02597 3.16991 6.15927 3.02845 6.3232 3.02845H8.11302C8.67132 3.02845 9.12551 2.56583 9.12551 1.99734V1.35779C9.12551 1.16009 8.96525 1 8.76772 1C8.57018 1 8.40992 1.16009 8.40992 1.35779V1.99734C8.40992 2.17125 8.27662 2.3127 8.1132 2.3127L6.78835 2.31253H6.32287C5.7644 2.31253 5.30991 2.77516 5.30991 3.34364C5.30991 3.91213 5.7644 4.37475 6.32287 4.37475H9.67766C9.84124 4.37475 9.97437 4.51621 9.97437 4.69011C9.97437 4.86402 9.84107 5.0053 9.67766 5.0053H8.01897C7.95789 5.0053 7.90115 5.02194 7.85072 5.04923C7.42719 5.17255 7.11399 5.56596 7.11399 6.03642V6.31816H3.08387C1.3836 6.31816 0 7.7016 0 9.40204V11.641C0 13.3413 1.38343 14.7249 3.08387 14.7249H12.9161C14.6164 14.7249 16 13.3415 16 11.641V9.40204C15.9997 7.70177 14.6164 6.31816 12.9161 6.31816H12.9162ZM15.2842 11.6409C15.2842 12.9466 14.2218 14.009 12.9161 14.009H3.08382C1.77814 14.009 0.715715 12.9466 0.715715 11.6409V9.40195C0.715715 8.09627 1.77814 7.03385 3.08382 7.03385H12.9161C14.2218 7.03385 15.2842 8.09627 15.2842 9.40195V11.6409Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M5.71694 9.54683H5.39276V9.22315C5.39276 8.70361 4.97023 8.28125 4.45116 8.28125C3.93162 8.28125 3.50909 8.70378 3.50909 9.22315V9.54683H3.18574C2.66638 9.54683 2.24414 9.96937 2.24414 10.4884C2.24414 11.008 2.66667 11.4303 3.18574 11.4303H3.50909V11.7539C3.50909 12.2734 3.93162 12.6959 4.45116 12.6959C4.97053 12.6959 5.39276 12.2734 5.39276 11.7539V11.4303H5.71694C6.23631 11.4303 6.65854 11.0078 6.65854 10.4884C6.65854 9.96937 6.23634 9.54683 5.71694 9.54683ZM5.71694 10.7149H4.67701V11.7542C4.67701 11.879 4.57567 11.9805 4.45102 11.9805C4.32621 11.9805 4.22469 11.8789 4.22469 11.7542V10.7149H3.18574C3.06126 10.7149 2.95975 10.6136 2.95975 10.4888C2.95975 10.3643 3.0611 10.2628 3.18574 10.2628H4.22469V9.22334C4.22469 9.09853 4.32637 8.99718 4.45102 8.99718C4.5755 8.99718 4.67701 9.09853 4.67701 9.22334V10.2628H5.71694C5.84142 10.2628 5.94294 10.3641 5.94294 10.4888C5.94277 10.6134 5.84142 10.7149 5.71694 10.7149Z" fill="white" />
                                                <path className='create-item__collection-drop-icon-fill' d="M11.6116 8.33594C10.429 8.33594 9.4668 9.29782 9.4668 10.4806C9.4668 11.6631 10.429 12.6253 11.6116 12.6253C12.7941 12.6253 13.7564 11.6631 13.7564 10.4806C13.7564 9.29782 12.7941 8.33594 11.6116 8.33594ZM11.6116 11.9097C10.8236 11.9097 10.1826 11.2684 10.1826 10.4807C10.1826 9.69292 10.8239 9.05187 11.6116 9.05187C12.3994 9.05187 13.0406 9.69292 13.0406 10.4807C13.0406 11.2684 12.3996 11.9097 11.6116 11.9097Z" fill="white" />
                                            </svg>

                                            <p className='create-item__collection-drop-name' >Games</p>
                                        </div>
                                    </div>
                                    : <></>}
                            </div> */}

                            <div className='create-item__input create-item__input_type_properties'>
                                <p className='create-item__input-title'>Properties</p>
                                {propsArrayValue.map((item, i) => (
                                    <div className='create-item__double-inputs-box' key={`create-item__double-inputs-box${i}`}>
                                        <div className='create-item__double-inputs'>
                                            <input className={`create-item__input-elem ${propsArrayValue[i].nameErrorMassage ? 'create-item__input-elem_error' : ''}`} placeholder="e.g. Background" name={`props name ${i}`} type="text" value={propsArrayValue[i].name} onChange={(e) => handlePropsNameChange(e, i)} minLength="0" maxLength="32"></input>
                                            <input className={`create-item__input-elem ${propsArrayValue[i].valueErrorMassage ? 'create-item__input-elem_error' : ''}`} placeholder="e.g. Blue" name={`props value ${i}`} type="text" value={propsArrayValue[i].value} onChange={(e) => handlePropsValueChange(e, i)} minLength="0" maxLength="32"></input>
                                        </div>
                                        {i > 0 ? <p className='create-item__double-inputs-delite' onClick={() => handlePropDelete(i)}>delete</p> : <p className='create-item__double-inputs-delite'>&nbsp;</p>}

                                    </div>

                                ))}
                                <div className='create-item__add-props-btn' onClick={handleAddProp}>
                                    <p className='create-item__add-props-btn-text'>Add more</p>
                                </div>
                            </div>
                            <div className='create-item__input create-item__input_type_royalties'>
                                <p className='create-item__input-title'>Royalties</p>
                                <p className='create-item__input-subtitle'>The amount you will receive when the NFT is resold by other users</p>
                                <div className='create-item__input-relative-box'>
                                    <p className='create-item__input-percent-text'>%</p>
                                    <input onKeyDown={handleRoyalDelite} className='create-item__input-elem' placeholder="e. g. 10%" name="royalties" type="text" value={royalValue} onChange={handleRoyalChange} minLength="0" maxLength="2"></input>
                                </div>

                                <div className='create-item__input-bottom'>

                                    {royalValidity.errorMassage ? <p className='create-item__inpot-error'>{royalValidity.errorMassage}</p> : <p className='create-item__inpot-hint'>Suggested amount: 10%, 20%, 30%, Maximum is 50%. If this field is empty, the value will be 0%</p>}
                                </div>

                            </div>
                            <div className='create-item__content-warning'>
                                <div className='create-item__content-warning-heading'>
                                    <svg className='create-item__content-warning-heading-icon' width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='create-item__content-warning-heading-icon-fill' d="M15 0C6.7501 0 0 6.75009 0 15C0 23.2499 6.7501 30 15 30C23.2499 30 30 23.2499 30 15C30 6.75009 23.2499 0 15 0ZM15 27.0004C8.39969 27.0004 2.99961 21.6003 2.99961 15C2.99961 8.39969 8.39969 2.99961 15 2.99961C21.6003 2.99961 27.0004 8.39969 27.0004 15C27.0004 21.6003 21.6003 27.0004 15 27.0004Z" fill="white" />
                                        <path className='create-item__content-warning-heading-icon-fill' d="M14.9999 21C14.0999 21 13.5 21.7501 13.5 22.4999C13.5 23.3999 14.2501 23.9999 14.9999 23.9999C15.75 23.9999 16.4999 23.2498 16.4999 22.4999C16.4999 21.6002 15.8999 21 14.9999 21Z" fill="white" />
                                        <path className='create-item__content-warning-heading-icon-fill' d="M16.5001 17.9982V7.49761C16.5001 5.54767 13.5 5.54767 13.5 7.49761V17.9975C13.5003 19.9477 16.5001 19.9477 16.5001 17.9978V17.9982Z" fill="white" />
                                    </svg>
                                    <p className='create-item__content-warning-heading-text'>Explicit &amp; Sensitive Content</p>
                                </div>
                                <div className='create-item__content-warning-selector'>
                                    <p className='create-item__content-warning-selector-text'>Set this item as explicit and sensitive content</p>
                                    <div className={`create-item__content-warning-selector-handler ${explicitContentSelected ? 'create-item__content-warning-selector-handler_active' : ''}`} onClick={() => {
                                        setExplicitContentSelected(!explicitContentSelected)
                                    }}>
                                        <div className={`create-item__content-warning-selector-handler-circle ${explicitContentSelected ? 'create-item__content-warning-selector-handler-circle_active' : ''}`}></div>
                                    </div>
                                </div>
                                <div className={`create-item__submit ${submitBtnActive ? 'create-item__submit_active' : ''}`} onClick={() => {
                                    if (submitBtnActive && !isPreloaderVisible) {
                                        handleSubmit()
                                    }
                                }}>
                                    {isPreloaderVisible ? <MiniPreloader /> : <p className='create-item__submit-text'>Create item</p>}

                                </div>
                            </div>
                        </div>
                        <div className='create-item__preview'>
                            <div className='create-item__preview-container'>
                                <p className='create-item__preview-title'>Preview</p>
                                <div className='create-item__preview-card'>
                                    <NftCard usdExchangeRate={usdExchangeRate} item={currentUser.avatar_url ? {
                                        owner: {
                                            user_name: currentUser.user_name ? currentUser.user_name : `@${currentUser.user_id}`,
                                            avatar_url: currentUser.avatar_url.size3,
                                            user_id: currentUser.user_id,
                                            verified: currentUser.verified
                                        },
                                        fileType: fileType,
                                        preview_url: fileUrlValue ? fileUrlValue : `https://i.ibb.co/s2wQzM8/image.png`,
                                        likes: 0,
                                        name: nameValue ? nameValue : 'name your item',
                                        isCreatingPage: true,
                                        creatingPrice: listImidiatly? priceValue ? priceValue : 'Your item price' : 'This token is not on sale',
                                        rank: 0,

                                        category: 'collectables',
                                    } : {
                                        owner: {
                                            user_name: currentUser.user_name ? currentUser.user_name : `@${currentUser.user_id}`,
                                            user_id: currentUser.user_id,
                                        },
                                        preview_url: fileUrlValue ? fileUrlValue : `https://i.ibb.co/s2wQzM8/image.png`,
                                        likes: 0,
                                        name: nameValue ? nameValue : 'name your item',
                                        isCreatingPage: true,
                                        creatingPrice: listImidiatly? priceValue ? priceValue : 'Your item price' : 'This token is not on sale',
                                        rank: 0,

                                        category: 'collectables',
                                    }} isCreate={true} isCreateExplictSelected={explicitContentSelected} setExplictAccept={setExplictAccept} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >}
        </>

    );
}

export default CreateItem;
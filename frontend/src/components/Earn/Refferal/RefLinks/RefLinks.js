/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import pythonApi from '../../../../assets/pythonApi';
import { wordsBlackList } from '../../../../assets/utilis';
import Preloader from '../../../Preloader/Preloader';
import PreloaderOnPage from '../../../PreloaderOnPage/PreloaderOnPage';
import './RefLinks.css'
import RefLinksList from './RefLinksList/RefLinksList';



const RefLinks = ({ dashboard, refLinks, setRefLinks }) => {
    const level = dashboard && dashboard.level && dashboard.level.level ? dashboard.level.level + 1 : 1

    // const [isLoading, setIsLoading] = useState(true)


    const [timerValue, setTimerValue] = useState(5);


    useEffect(() => {
        if (timerValue <= 5) {
            const timer = setInterval(() => {
                setTimerValue(timerValue + 1)
                clearInterval(timer)
            }, 1000);
        }




    }, [timerValue])


    const [nameValue, setNameValue] = useState('')
    const [nameValidity, setNameValidity] = useState({})
    function handleNameChange(e) {
        if (e.target.value.replace(/[A-Za-z0-9]/g, '').length > 0) {
            setNameValidity(prevState => ({
                ...prevState,
                errorMassage: 'Only A-Za-z0-9',
            }))
        } else {
            let inputValue = e.target.value.replace(/[^A-Za-z0-9]/g, '')
            if (!inputValue) {
                setNameValidity({
                    errorMassage: '',
                    validState: false
                })
            }
            else if (inputValue.length <= 1) {
                setNameValidity({
                    errorMassage: 'Min 2 symbols',
                    validState: false
                })
            } else if (inputValue.length <= 7) {
                setNameValidity({
                    errorMassage: '',
                    validState: true
                })
            } else {
                setNameValidity({
                    errorMassage: 'Max 7 symbols',
                    validState: false
                })
            }

            setNameValue(inputValue)
        }
    }

    const [tag1Value, setTag1Value] = useState('')
    const [tag1Validity, setTag1Validity] = useState({})
    function handleTag1Change(e) {
        if (e.target.value.replace(/[A-Za-z0-9]/g, '').length > 0) {
            setTag1Validity(prevState => ({
                ...prevState,
                errorMassage: 'Only A-Za-z0-9',
            }))
        } else {
            let inputValue = e.target.value.replace(/[^A-Za-z0-9]/g, '')
            if (!inputValue) {
                setTag1Validity({
                    errorMassage: '',
                    validState: true
                })
            }
            else if (inputValue.length <= 7) {
                setTag1Validity({
                    errorMassage: '',
                    validState: true
                })
            } else {

                setTag1Validity({
                    errorMassage: 'Max 7 symbols',
                    validState: false
                })
            }

            setTag1Value(inputValue)
        }
    }

    const [tag2Value, setTag2Value] = useState('')
    const [tag2Validity, setTag2Validity] = useState({})
    function handleTag2Change(e) {
        if (e.target.value.replace(/[A-Za-z0-9]/g, '').length > 0) {
            setTag2Validity(prevState => ({
                ...prevState,
                errorMassage: 'Only A-Za-z0-9',
            }))
        } else {
            let inputValue = e.target.value.replace(/[^A-Za-z0-9]/g, '')
            if (!inputValue) {
                setTag2Validity({
                    errorMassage: '',
                    validState: true
                })
            }
            else if (inputValue.length <= 7) {
                setTag2Validity({
                    errorMassage: '',
                    validState: true
                })
            } else {

                setTag2Validity({
                    errorMassage: 'Max 7 symbols',
                    validState: false
                })
            }

            setTag2Value(inputValue)
        }
    }

    const [customLinkValue, setCustomLinkValue] = useState('')
    const [customLinkValidity, setCustomLinkValidity] = useState({
        errorMassage: '',
        validState: true
    })
    function handleCustomLinkChange(e) {
        if (e.target.value.replace(/[A-Za-z0-9]/g, '').length > 0) {
            setCustomLinkValidity(prevState => ({
                ...prevState,
                errorMassage: 'Only A-Za-z0-9',
            }))
        } else {
            let inputValue = e.target.value.replace(/[^A-Za-z0-9]/g, '')
            if (!inputValue) {
                setCustomLinkValidity({
                    errorMassage: '',
                    validState: true
                })
            }
            else if (inputValue.length <= 4) {
                setCustomLinkValidity({
                    errorMassage: 'Min 5 symbols',
                    validState: false
                })
            } else {
                if (wordsBlackList.filter((i) => {
                    if (`${inputValue}`.trim().toLowerCase().includes(i)) {
                        return true
                    }
                    else return false
                }).length > 0) {
                    setCustomLinkValidity({
                        errorMassage: 'Invalid value',
                        validState: false
                    })
                }
                else {
                    if (inputValue.length <= 7) {
                        pythonApi.checkCustomLinkAvailability({ code: inputValue })
                            .then((res) => {
                                console.log(res)
                                setCustomLinkValidity({
                                    errorMassage: "",
                                    validState: true
                                })
                            })
                            .catch((err) => {
                                setCustomLinkValidity({
                                    errorMassage: "This link isn't free",
                                    validState: false
                                })
                                console.log(err)
                            })
                    } else {
                        setCustomLinkValidity({
                            errorMassage: "Max 7 symbols",
                            validState: false
                        })
                    }


                }

            }

            setCustomLinkValue(inputValue)
        }
    }
    const [btnActive, setBtnActive] = useState(false)

    useEffect(() => {
        if (nameValue && nameValue.length >= 2 && nameValidity.validState && ((tag1Value && tag1Validity.validState) || !tag1Value) && ((tag2Value && tag2Validity.validState) || !tag2Value)) {
            if (level >= 3) {
                if (customLinkValidity.validState) {
                    setBtnActive(true)
                } else {
                    setBtnActive(false)
                }
            } else {
                setBtnActive(true)
            }

        } else {
            setBtnActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level, nameValue, nameValidity, customLinkValue, customLinkValidity, tag1Value, tag1Validity, tag2Value, tag2Validity])


    const [createError, setCreateError] = useState('')
    function handleLinkCreate() {

        pythonApi.createRefLink({
            link_name: nameValue,
            tag_1: tag1Value,
            tag_2: tag2Value,
            customName: customLinkValue,
        })
            .then((res) => {
                setTimerValue(0)
                setBtnActive(false)
                setCustomLinkValue('')
                setCustomLinkValidity({
                    errorMassage: '',
                    validState: true
                })
                setNameValue('')
                setNameValidity({
                    errorMassage: '',
                    validState: false
                })
                setTag1Value('')
                setTag1Validity({
                    errorMassage: '',
                    validState: true
                })
                setTag2Value('')
                setTag2Validity({
                    errorMassage: '',
                    validState: true
                })
                setRefLinks(prevArray => [{ ...res, new: true }, ...prevArray])
                console.log(res)
            })
            .catch((err) => {
                if (err.detail) {
                    setCreateError(err.detail)
                    setTimeout(() => {
                        setCreateError('')
                    }, (3000));
                } else if (err.message) {
                    setCreateError(err.message)
                    setTimeout(() => {
                        setCreateError('')
                    }, (3000));
                } else {
                    setCreateError('Something went wrong')
                    setTimeout(() => {
                        setCreateError('')
                    }, (3000));
                }
                setTimerValue(0)
                console.log(err)
            })
    }

    useEffect(() => {
        if (refLinks && refLinks.length > 0) {
            if (refLinks.filter((item) => {
                if (item.new) return true
                else return false
            }).length > 0) {
                setTimeout(() => {
                    let mapedLinks = refLinks.map((item) => {
                        return {
                            ...item,
                            new: false,
                        }
                    })
                    setRefLinks(mapedLinks)
                }, 3000);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refLinks])

    return (
        <div className='ref-links'>
            <p className='ref-links__title'>Create new referral link</p>
            <div className='ref-links__create'>
                <div className='ref-links__create-input-and-error'>
                    <input className={`ref-links__create-input ${nameValidity.errorMassage ? 'ref-links__create-input_error' : ''}`} placeholder="Link name" name="link name" type="text" value={nameValue} onChange={handleNameChange} minLength="0" maxLength="10"></input>
                    {nameValidity.errorMassage ? <p className={`ref-links__create-input-error`}>{nameValidity.errorMassage}</p> : <></>}
                </div>
                <div className='ref-links__create-input-and-error'>
                    <input className={`ref-links__create-input ${tag1Validity.errorMassage ? 'ref-links__create-input_error' : ''}`} placeholder="Tag 1" name="tag 1" type="text" value={tag1Value} onChange={handleTag1Change} minLength="0" maxLength="10"></input>
                    {tag1Validity.errorMassage ? <p className={`ref-links__create-input-error`}>{tag1Validity.errorMassage}</p> : <></>}
                </div>
                <div className='ref-links__create-input-and-error'>
                    <input className={`ref-links__create-input ${tag2Validity.errorMassage ? 'ref-links__create-input_error' : ''}`} placeholder="Tag 2" name="tag 2" type="text" value={tag2Value} onChange={handleTag2Change} minLength="0" maxLength="10"></input>
                    {tag2Validity.errorMassage ? <p className={`ref-links__create-input-error`}>{tag2Validity.errorMassage}</p> : <></>}
                </div>
                <div className='ref-links__create-input-and-error'>
                    <input disabled={level >= 3 ? false : true} className={`ref-links__create-input ${level < 3 ? 'ref-links__create-input_blocked' : ''} ${customLinkValidity.errorMassage ? 'ref-links__create-input_error' : ''}`} placeholder={level >= 3 ? 'Custom Link' : 'Opens at lvl 3'} name="Custom Link" type="text" value={customLinkValue} onChange={handleCustomLinkChange} minLength="0" maxLength="10"></input>
                    {customLinkValidity.errorMassage ? <p className={`ref-links__create-input-error`}>{customLinkValidity.errorMassage}</p> : <></>}
                </div>
                <div className={`ref-links__create-btn ${btnActive && 5 - timerValue <= 0 ? 'ref-links__create-btn_active' : ''}`} onClick={() => {
                    if (btnActive && 5 - timerValue <= 0) {
                        handleLinkCreate()
                    }
                }}>
                    <svg className='ref-links__create-btn-plus' width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect className='ref-links__create-btn-plus-fill' x="9.5" width="3" height="22" rx="1.5" fill="white" />
                        <rect className='ref-links__create-btn-plus-fill' x="22" y="9.5" width="3" height="22" rx="1.5" transform="rotate(90 22 9.5)" fill="white" />
                    </svg>

                </div>

                {level >= 3 && !customLinkValidity.errorMassage && customLinkValue ?
                    <div className='ref-links__create-preview'>
                        <p className='ref-links__create-preview-title'>link preview</p>
                        <p className='ref-links__create-preview-text'><span className='ref-links__create-preview-text-span'>{window.location.host}/r/</span>{customLinkValue}</p>
                    </div> :
                    <></>}

            </div>

            {5 - timerValue <= 0 ? createError ? <p className='ref-links__create-timer'>{createError}. Try again in {5 - timerValue}sec.</p> : <div className='ref-links__create-timer-holder'></div> : <p className='ref-links__create-timer'>Create new link will be available in {5 - timerValue}sec.</p>}
            <div className='ref-links__links'>
                {refLinks !== undefined ?
                    <>
                        {refLinks.length > 0 ?
                            <RefLinksList setRefLinks={setRefLinks} links={refLinks} />
                            :
                            <>
                                <p className='ref-links__links-no-title'>You do not have referral links yet, generate one using the input fields above. As a level 3 Referrer, you will be able to create custom links.</p>
                            </>}
                    </>
                    :
                    <div className='ref-links__preloader'>
                        <Preloader />

                    </div>}
            </div>
        </div>
    )
};

export default RefLinks
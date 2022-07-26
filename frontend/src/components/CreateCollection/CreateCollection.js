/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './CreateCollection.css';

import TextareaAutosize from "@mui/material/TextareaAutosize";
import validator from 'validator'
import { wordsBlackList } from '../../assets/utilis';
import MiniPreloader from '../MiniPreloader/MiniPreloader';
import pythonApi from '../../assets/pythonApi';
import { useNavigate } from 'react-router';
import { MetaTags } from 'react-meta-tags';




function CreateCollection({ currentUser, loggedIn, setCurrentUser }) {
    const navigate = useNavigate()
    const [coverFileValue, setCoverFileValue] = useState(undefined);
    const [coverFileUrlValue, setCoverFileUrlValue] = useState('');
    const [coverFileValidity, setCoverFileValidity] = useState({});

    function handleCoverChange(file) {
        setCoverFileValue(undefined)
        setCoverFileUrlValue('')
        setCoverFileValidity({
            errorMassage: '',
            validState: false
        });
        if (file) {
            if ((file.size && file.size / 1024 / 1024) > 15) {
                setCoverFileValidity({
                    errorMassage: 'File is too big ',
                    validState: false
                });
            } else {
                var reader = new FileReader();
                var url = reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    setCoverFileUrlValue(reader.result)
                }

                setCoverFileValidity({
                    errorMassage: '',
                    validState: true
                });
                setCoverFileValue(file)
            }
        }
    }

    const [avatarFileValue, setAvatarFileValue] = useState(undefined);
    const [avatarFileUrlValue, setAvatarFileUrlValue] = useState('');
    const [avatarFileValidity, setAvatarFileValidity] = useState({});

    function handleAvatarChange(file) {
        setAvatarFileValue(undefined)
        setAvatarFileUrlValue('')
        setAvatarFileValidity({
            errorMassage: '',
            validState: false
        });
        if (file) {
            if ((file.size && file.size / 1024 / 1024) > 15) {
                setAvatarFileValidity({
                    errorMassage: 'File is too big ',
                    validState: false
                });
            } else {
                var reader = new FileReader();
                var url = reader.readAsDataURL(file);
                reader.onloadend = function (e) {
                    setAvatarFileUrlValue(reader.result)
                }
                setAvatarFileValidity({
                    errorMassage: '',
                    validState: true
                });
                setAvatarFileValue(file)
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
    const [bioValue, setbBioValue] = useState('')
    const [bioValidity, setbBioValidity] = useState({});

    function handleBioChange(e) {
        let inputValue = e.target.value
        
            if (wordsBlackList.filter((i) => {
                if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                    return true
                }
                else return false
            }).length > 0) {
                console.log(inputValue.replace(/\s/g, ''))
                setbBioValidity({
                    errorMassage: `Contains an invalid value ${wordsBlackList.filter((i) => {
                        if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i) || inputValue.replace(/[^a-z ]/ig, "").toString().trim().toLowerCase().includes(i)) {
                            return true
                        }
                        else return false
                    })[0]}`,
                    validState: false
                });
            } else {
                setbBioValidity({
                    errorMassage: ``,
                    validState: true
                });
            }

            setbBioValue(inputValue)
        

    }

    const [explicitContentSelected, setExplicitContentSelected] = useState(false);


    const [submitBtnActive, setSubmitBtnActive] = useState(false)

    const [categoryOpened, setCategoryOpened] = useState(false)
    const [categorySelected, setCategorySelected] = useState('art')


    const [formData, setFormData] = useState(new FormData())

    useEffect(() => {
        var data = new FormData();

        if (coverFileValue) {
            data.append("cover", coverFileValue);
        }
        if (avatarFileValue) {
            data.append("avatar", avatarFileValue);
        }

        if (categorySelected) {
            data.append("category_name", categorySelected.toLowerCase())
        }

        if (nameValue && nameValidity.validState) {
            data.append("name", nameValue);
        }

        if (bioValue && bioValidity.validState) {
            data.append("bio", bioValue);
        }

        data.append("explicitContent", explicitContentSelected)

        console.log('__________')
        for (var pair of data.entries()) {
            console.log(pair[0], pair[1]);
        }
        console.log('__________')

        if ((coverFileValue) && (avatarFileValue) && (nameValue && nameValidity.validState) && (bioValue && bioValidity.validState)) {
            setSubmitBtnActive(true)
        }
        else {
            setSubmitBtnActive(false)
        }
        setFormData(data)


    }, [coverFileValue, avatarFileValue, nameValue, nameValidity, bioValue, bioValidity, explicitContentSelected, categorySelected])

    const [submitError, setSubmitError] = useState('')
    const [submitFine, setSubmitFine] = useState(false)
    const [submitPreloader, setSubmitPreloader] = useState(false)
    function handleSubmit() {
        // setSubmitError('')
        if (submitBtnActive) {
            setSubmitPreloader(true)
            console.log('__________')
            for (var pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
            console.log('__________')
            pythonApi.createCollection({ data: formData })
                .then((res) => {
                    setTimeout(() => {
                        let curUser = currentUser
                        curUser.collections.push(res)
                        setCurrentUser(curUser)
                        setSubmitPreloader(false)
                        setSubmitFine(true)
                        setTimeout(() => {
                            setSubmitFine(false)
                        }, 10000);
                        console.log(res)
                        navigate(`/collections/${res.customURLorID}/items`)
                    }, 1500);
                })
                .catch((err) => {
                    setTimeout(() => {
                        setSubmitPreloader(false)
                        if (err.detail === 'Such collection name is already in use by the current user') {
                            setSubmitError('Such collection name is already in use by the current user')
                        } else {
                            setSubmitError('Something went wrong, try again later')
                        }

                        setTimeout(() => {
                            setSubmitError('')
                        }, 10000);
                    }, 1500);
                    console.log(err)
                })
        }

        // pythonApi.updateProfile({ data: formData })
        //     .then((res) => {
        //         setTimeout(() => {
        //             setSubmitPreloader(false)
        //             setSubmitFine(true)
        //             setTimeout(() => {
        //                 setSubmitFine(false)
        //             }, 10000);
        //             console.log(res)
        //             setCurrentUser(res)
        //         }, 1500);


        //     })
        //     .catch((err) => {
        //         setTimeout(() => {
        //             setSubmitPreloader(false)
        //             setSubmitError('Something went wrong, try again later')
        //             setTimeout(() => {
        //                 setSubmitError('')
        //             }, 10000);
        //         }, 1500);

        //         console.log(err)
        //     })
    }


    return (
        <div className='create-collection'>
            <MetaTags>
                <title>Create collection</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={`Create collection`} />


                <meta property="twitter:title" content={`Create collection`} />


                <meta property="vk:title" content={`Create collection`} />


            </MetaTags>
            <div className='create-collection__container'>
                <h2 className='create-collection__title'>Create a new collection</h2>
                <div className='create-collection__cover'>
                    <p className='create-collection__input-title'>Collection cover</p>
                    <p className='create-collection__cover-subtitle'>Upload new cover for your profile page. JPG, PNG, GIF, We recommend to upload images in 1520x320 resolution. Max 15mb.</p>
                    <div className={`create-collection__cover-box ${coverFileValidity.errorMassage ? 'create-collection__cover-box_error' : ''}`}>
                        {coverFileUrlValue ?
                            <img className='create-collection__cover-box-img' src={coverFileUrlValue} alt='' key={coverFileUrlValue}></img>
                            :
                            <svg className='create-collection__cover-box-icon' width="58" height="33" viewBox="0 0 58 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className={`create-collection__cover-box-icon-fill ${coverFileValidity.errorMassage ? 'create-collection__cover-box-icon-fill_error' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M32.4803 1.17909L23.9246 12.6206L30.4501 21.3547C31.4072 22.6356 31.1462 24.4698 29.8701 25.4305C28.594 26.3913 26.7668 26.1584 25.8097 24.8483C22.7645 20.7724 19.1102 15.9105 16.819 12.7953C15.6589 11.2523 13.3387 11.2523 12.1787 12.7953L0.577723 28.3128C-0.843391 30.2633 0.519718 33 2.89791 33H55.1021C57.4803 33 58.8434 30.2633 57.4223 28.3419L37.1207 1.17909C35.9606 -0.393031 33.6404 -0.393031 32.4803 1.17909Z" fill="white" />
                            </svg>}
                    </div>
                    {coverFileValidity.errorMassage ? <p className='create-collection__file-error'>{coverFileValidity.errorMassage}</p> : <></>}
                    <form className='create-collection__file-form' encType="multipart/form-data">
                        <label className={`create-collection__custom-input-file `} htmlFor="cover-file-upload">
                            <input className="create-collection__input-file" id="cover-file-upload" name="file" accept="image/png, image/jpg, image/jpeg, image/gif" type="file" onChange={(e) => handleCoverChange(e.target.files[0])}></input>
                            <p className='create-collection__custom-input-file-text'>Choose File</p>
                        </label>
                    </form>
                </div>

                <div className='create-collection__avatar'>
                    <p className='create-collection__input-title'>Collection avatar</p>
                    <p className='create-collection__cover-subtitle'>File types supported: JPG, PNG, GIF, Max 15mb.</p>
                    <div className={`create-collection__avatar-box ${avatarFileValidity.errorMassage ? 'create-collection__avatar-box_error' : ''}`}>
                        {avatarFileUrlValue ?
                            <img className='create-collection__avatar-box-img' src={avatarFileUrlValue} key={avatarFileUrlValue} alt=''></img>
                            :
                            <svg className='create-collection__cover-box-icon' width="58" height="33" viewBox="0 0 58 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className={`create-collection__cover-box-icon-fill ${avatarFileValidity.errorMassage ? 'create-collection__cover-box-icon-fill_error' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M32.4803 1.17909L23.9246 12.6206L30.4501 21.3547C31.4072 22.6356 31.1462 24.4698 29.8701 25.4305C28.594 26.3913 26.7668 26.1584 25.8097 24.8483C22.7645 20.7724 19.1102 15.9105 16.819 12.7953C15.6589 11.2523 13.3387 11.2523 12.1787 12.7953L0.577723 28.3128C-0.843391 30.2633 0.519718 33 2.89791 33H55.1021C57.4803 33 58.8434 30.2633 57.4223 28.3419L37.1207 1.17909C35.9606 -0.393031 33.6404 -0.393031 32.4803 1.17909Z" fill="white" />
                            </svg>}
                    </div>
                    {avatarFileValidity.errorMassage ? <p className='create-collection__file-error'>{avatarFileValidity.errorMassage}</p> : <></>}
                    <form className='create-collection__file-form' encType="multipart/form-data">
                        <label className={`create-collection__custom-input-file `} htmlFor="avatar-file-upload">
                            <input className="create-collection__input-file" id="avatar-file-upload" name="file" accept="image/png, image/jpg, image/jpeg, image/gif" type="file" onChange={(e) => handleAvatarChange(e.target.files[0])}></input>
                            <p className='create-collection__custom-input-file-text'>Choose File</p>
                        </label>
                    </form>
                </div>

                <div className='create-collection__text-inputs'>
                    <div className='create-collection__name-input-box'>
                        <p className='create-collection__input-title'>Name your collection</p>
                        <input className='create-collection__input' placeholder="name your collection" name="name" type="text" value={nameValue} onChange={handleNameChange} minLength="0" maxLength="20"></input>
                        <div className='create-collection__input-bottom'>
                            <p className={`create-collection__input-lenght create-collection__input-lenght_with-error ${nameValidity.errorMassage ? 'create-collection__input-lenght_error' : ''}`}>{nameValue.length}/20</p>
                            {nameValidity.errorMassage ? <p className='create-collection__inpot-error'>{nameValidity.errorMassage}</p> : <></>}
                        </div>
                    </div>
                    <div className='create-collection__bio-input-box'>
                        <p className='create-collection__input-title'>Description</p>
                        <TextareaAutosize className='create-collection__textarea' placeholder="Provide a detailed description of your collection." name="description" type="text" value={bioValue} onChange={handleBioChange} minLength="0" maxLength="350" ></TextareaAutosize>
                        <div className='create-collection__input-bottom'>
                            <p className={`create-collection__input-lenght create-collection__input-lenght_with-error ${bioValidity.errorMassage ? 'create-collection__input-lenght_error' : ''}`}>{bioValue.length}/350</p>
                            {bioValidity.errorMassage ? <p className='create-collection__inpot-error'>{bioValidity.errorMassage}</p> : <></>}
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
                    </div>

                    <div className={`create-collection__submit-btn ${submitBtnActive ? 'create-collection__submit-btn_active' : ''}`} onClick={() => {
                        if (submitBtnActive) {
                            handleSubmit()
                        }
                    }}>
                        {submitPreloader ? <MiniPreloader /> : <p className='create-collection__submit-btn-text'>{submitFine ? 'Successfully updated' : 'Create collection'}</p>}

                    </div>
                    {submitError ? <p className='create-collection__submit-error'>{submitError}</p> : <></>}
                </div>
            </div>
        </div>
    );
}

export default CreateCollection;
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './EditProfile.css';

import TextareaAutosize from "@mui/material/TextareaAutosize";
import validator from 'validator'
import pythonApi from '../../assets/pythonApi';
import { ImageOnLoad } from '../../assets/ImageOnLoad';
import MiniPreloader from '../MiniPreloader/MiniPreloader';
import { API_LINK, wordsBlackList } from '../../assets/utilis';
import { MetaTags } from 'react-meta-tags';
import { useNavigate } from 'react-router';




function EditProfile({ currentUser, loggedIn, setCurrentUser }) {
    const [coverFileValue, setCoverFileValue] = useState(undefined);
    const [coverFileUrlValue, setCoverFileUrlValue] = useState('');
    const [coverFileValidity, setCoverFileValidity] = useState({});

    const navigate = useNavigate()
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


    const [nameValue, setNameValue] = useState(currentUser ? currentUser.user_name ? currentUser.user_name : '' : '')
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

    const [bioValue, setbBioValue] = useState(currentUser ? currentUser.bio ? currentUser.bio : '' : '')
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


    const [urlValue, setUrlValue] = useState(``)
    const [urlValidity, setUrlValidity] = useState({});
    function handleUrlChange(e) {
        let inputValue = e.target.value.replace(/\s/g, '')
        setUrlValue(inputValue)
        if (!inputValue) {
            setUrlValidity({
                errorMassage: '',
                validState: true,
            })
        } else if (!/^[a-z][a-z0-9]*$/igm.test(inputValue)) {
            setUrlValidity({
                errorMassage: `Only Latin letters and numbers Not: '${inputValue.replace(/[A-Za-z0-9]+/i, '')}'`,
                validState: false
            });
        }
        else {
            if (inputValue.length >= 3) {
                if (wordsBlackList.filter((i) => {
                    if (`${inputValue}`.trim().toLowerCase().includes(i)) {
                        return true
                    }
                    else return false
                }).length > 0) {
                    setUrlValidity({
                        errorMassage: `Contains an invalid value ${wordsBlackList.filter((i) => {
                            if (`${inputValue}`.trim().toLowerCase().includes(i)) {
                                return true
                            }
                            else return false
                        })[0]}`,
                        validState: false
                    });
                }
                else if (inputValue.replace(/id[\d\d*][\D*\d*]*/gm, '').length === 0) {
                    setUrlValidity({
                        errorMassage: `Custom url can not start with '${inputValue}'`,
                        validState: false
                    });
                } else {
                    pythonApi.checkUserNameAvailability({ customURL: inputValue })
                        .then((res) => {
                            // console.log(res.available)
                            if (res.available) {
                                setUrlValidity({
                                    errorMassage: '',
                                    validState: true
                                });
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                            if (inputValue !== currentUser.customURL) {
                                setUrlValidity({
                                    errorMassage: 'This custom url is already taken',
                                    validState: false
                                });
                            } else {
                                setUrlValidity({
                                    errorMassage: '',
                                    validState: false
                                });
                            }

                        })

                }

            }
            else {
                if (!inputValue) {
                    setUrlValidity({
                        errorMassage: '',
                        validState: true,
                    });
                } else {
                    setUrlValidity({
                        errorMassage: 'Minimum length 3 characters',
                        validState: false
                    });
                }

            }
        }


    }

    const [siteValue, setSiteValue] = useState(currentUser ? currentUser.personal ? currentUser.personal : '' : '')
    const [siteValidity, setSiteValidity] = useState({});
    function handleSiteChange(e) {
        let inputValue = e.target.value.replace(/\s/g, '')
        setSiteValue(inputValue)
        if (!inputValue) {
            setSiteValidity({
                errorMassage: (''),
                validState: false
            })
        } else {
            if (validator.isURL(inputValue)) {
                setSiteValidity({
                    errorMassage: '',
                    validState: true
                })
            } else {
                setSiteValidity({
                    errorMassage: ('Not valid URL'),
                    validState: false
                })
            }
        }


    }

    const [emailValue, setEmailValue] = useState(currentUser ? currentUser.email ? currentUser.email : '' : '')
    const [emailValidity, setEmailValidity] = useState({});
    function handleEmailChange(e) {
        let inputValue = e.target.value.replace(/\s/g, '')
        setEmailValue(inputValue)
        if (!inputValue) {
            setEmailValidity({
                errorMassage: (''),
                validState: false
            })
        } else {
            if (inputValue.length > 5) {
                if (validator.isEmail(inputValue)) {
                    setEmailValidity({
                        errorMassage: '',
                        validState: true
                    })
                } else {
                    setEmailValidity({
                        errorMassage: ('Not valid Email'),
                        validState: false
                    })
                }
            }

        }


    }

    const [submitBtnActive, setSubmitBtnActive] = useState(false)


    const [formData, setFormData] = useState(new FormData())

    useEffect(() => {
        var data = new FormData();

        if (coverFileValue) {
            data.append("cover", coverFileValue);
        }
        if (avatarFileValue) {
            data.append("avatar", avatarFileValue);
        }

        if (nameValue && nameValue !== currentUser.user_name) {
            data.append("user_name", nameValue);
        } else {
            data.append("user_name", currentUser.user_name);
        }

        if (bioValue && bioValue !== currentUser.bio) {
            data.append("bio", bioValue);
        } else {
            data.append("bio", currentUser.bio);
        }

        if (urlValue && urlValue !== currentUser.user_id && urlValue !== currentUser.customURL && urlValidity.validState) {
            data.append("customURL", urlValue);
        } else {
            data.append("customURL", null);
        }


        if (siteValue && siteValue !== currentUser.personal && siteValidity.validState) {
            data.append("personal", siteValue);
        } else {
            data.append("personal", null);
        }

        if (emailValue && emailValue !== currentUser.email && emailValidity.validState) {
            data.append("email", emailValue);
        } else {
            data.append("email", null);
        }

        if ((coverFileValue) || (avatarFileValue) || (nameValue && nameValue !== currentUser.user_name) || (bioValue && bioValue !== currentUser.bio) || (urlValue && urlValue !== currentUser.user_id && urlValue !== currentUser.customURL && urlValidity.validState) || (siteValue && siteValue !== currentUser.personal && siteValidity.validState) || (emailValue && emailValue !== currentUser.email && emailValidity.validState)) {
            setSubmitBtnActive(true)
        }
        else {
            setSubmitBtnActive(false)
        }
        setFormData(data)


    }, [coverFileValue, avatarFileValue, nameValue, bioValue, urlValue, urlValidity.validState, siteValue, siteValidity.validState, emailValue, emailValidity.validState, currentUser])

    const [submitError, setSubmitError] = useState('')
    const [submitFine, setSubmitFine] = useState(false)
    const [submitPreloader, setSubmitPreloader] = useState(false)

    function handleSubmit() {
        // setSubmitError('')
        setSubmitPreloader(true)
        console.log('__________')
        for (var pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        console.log('__________')
        pythonApi.updateProfile({ data: formData })
            .then((res) => {
                setTimeout(() => {
                    setSubmitPreloader(false)
                    setSubmitFine(true)
                    setTimeout(() => {
                        navigate(`/profile/${res.user_id}/on-sale`)
                    }, 500);
                    setTimeout(() => {
                        setSubmitFine(false)
                    }, 10000);
                    console.log(res)
                    setCurrentUser(res)
                }, 1500);


            })
            .catch((err) => {
                setTimeout(() => {
                    setSubmitPreloader(false)
                    setSubmitError('Something went wrong, try again later')
                    setTimeout(() => {
                        setSubmitError('')
                    }, 10000);
                }, 1500);

                console.log(err)
            })
    }




    return (
        <div className='edit-profile'>
            <MetaTags>
                <title>Edit profile</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={`Edit profile`} />
                <meta property="twitter:title" content={`Edit profile`} />
                <meta property="vk:title" content={`Edit profile`} />
            </MetaTags>
            <div className='edit-profile__container'>
                <h2 className='edit-profile__title'>Edit profile</h2>
                <p className='edit-profile__subtitle'>You can set preferred display name, create your branded profile URL and manage other personal settings</p>
                <div className='edit-profile__cover'>
                    <p className='edit-profile__input-title'>Cover</p>
                    <p className='edit-profile__cover-subtitle'>Upload new cover for your profile page. JPG, PNG, GIF, We recommend to upload images in 1520x320 resolution. Max 15mb.</p>
                    <div className={`edit-profile__cover-box ${coverFileValidity.errorMassage ? 'edit-profile__cover-box_error' : ''}`}>
                        {currentUser && currentUser.cover_url && !coverFileUrlValue && !coverFileValidity.errorMassage ?
                            <ImageOnLoad className='edit-profile__avatar-box-img' src={`${API_LINK}/users/get_file/${currentUser.cover_url.size0}`} alt='' keyValue={`${API_LINK}/users/get_file/${currentUser.cover_url.size0}`} />
                            :
                            <>
                                {coverFileUrlValue ?
                                    <img className='edit-profile__cover-box-img' src={coverFileUrlValue} alt=''></img>
                                    :
                                    <svg className='edit-profile__cover-box-icon' width="58" height="33" viewBox="0 0 58 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`edit-profile__cover-box-icon-fill ${coverFileValidity.errorMassage ? 'edit-profile__cover-box-icon-fill_error' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M32.4803 1.17909L23.9246 12.6206L30.4501 21.3547C31.4072 22.6356 31.1462 24.4698 29.8701 25.4305C28.594 26.3913 26.7668 26.1584 25.8097 24.8483C22.7645 20.7724 19.1102 15.9105 16.819 12.7953C15.6589 11.2523 13.3387 11.2523 12.1787 12.7953L0.577723 28.3128C-0.843391 30.2633 0.519718 33 2.89791 33H55.1021C57.4803 33 58.8434 30.2633 57.4223 28.3419L37.1207 1.17909C35.9606 -0.393031 33.6404 -0.393031 32.4803 1.17909Z" fill="white" />
                                    </svg>}
                            </>}


                    </div>
                    {coverFileValidity.errorMassage ? <p className='edit-profile__file-error'>{coverFileValidity.errorMassage}</p> : <></>}
                    <form className='edit-profile__file-form' encType="multipart/form-data">
                        <label className={`edit-profile__custom-input-file `} htmlFor="cover-file-upload">
                            <input className="edit-profile__input-file" id="cover-file-upload" name="file" accept="image/png, image/jpg, image/jpeg, image/gif" type="file" onChange={(e) => handleCoverChange(e.target.files[0])}></input>
                            <p className='edit-profile__custom-input-file-text'>Choose File</p>
                        </label>
                    </form>
                </div>

                <div className='edit-profile__avatar'>
                    <p className='edit-profile__input-title'>Avatar</p>
                    <p className='edit-profile__cover-subtitle'>File types supported: JPG, PNG, GIF, Max 15mb.</p>
                    <div className={`edit-profile__avatar-box ${avatarFileValidity.errorMassage ? 'edit-profile__avatar-box_error' : ''}`}>
                        {currentUser && currentUser.avatar_url && !avatarFileUrlValue && !avatarFileValidity.errorMassage ?
                            <ImageOnLoad className='edit-profile__avatar-box-img' src={`${API_LINK}/users/get_file/${currentUser.avatar_url.size6}`} alt='' keyValue={`${API_LINK}/users/get_file/${currentUser.avatar_url.size6}`} />
                            :
                            <>
                                {avatarFileUrlValue ?
                                    <img className='edit-profile__avatar-box-img' src={avatarFileUrlValue} alt=''></img>
                                    :
                                    <svg className='edit-profile__cover-box-icon' width="58" height="33" viewBox="0 0 58 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`edit-profile__cover-box-icon-fill ${avatarFileValidity.errorMassage ? 'edit-profile__cover-box-icon-fill_error' : ''}`} fillRule="evenodd" clipRule="evenodd" d="M32.4803 1.17909L23.9246 12.6206L30.4501 21.3547C31.4072 22.6356 31.1462 24.4698 29.8701 25.4305C28.594 26.3913 26.7668 26.1584 25.8097 24.8483C22.7645 20.7724 19.1102 15.9105 16.819 12.7953C15.6589 11.2523 13.3387 11.2523 12.1787 12.7953L0.577723 28.3128C-0.843391 30.2633 0.519718 33 2.89791 33H55.1021C57.4803 33 58.8434 30.2633 57.4223 28.3419L37.1207 1.17909C35.9606 -0.393031 33.6404 -0.393031 32.4803 1.17909Z" fill="white" />
                                    </svg>}
                            </>}


                    </div>
                    {avatarFileValidity.errorMassage ? <p className='edit-profile__file-error'>{avatarFileValidity.errorMassage}</p> : <></>}
                    <form className='edit-profile__file-form' encType="multipart/form-data">
                        <label className={`edit-profile__custom-input-file `} htmlFor="avatar-file-upload">
                            <input className="edit-profile__input-file" id="avatar-file-upload" name="file" accept="image/png, image/jpg, image/jpeg, image/gif" type="file" onChange={(e) => handleAvatarChange(e.target.files[0])}></input>
                            <p className='edit-profile__custom-input-file-text'>Choose File</p>
                        </label>
                    </form>
                </div>

                <div className='edit-profile__text-inputs'>
                    <div className='edit-profile__name-input-box'>
                        <p className='edit-profile__input-title'>Display name</p>
                        <input className={`edit-profile__input ${nameValidity.errorMassage ? 'edit-profile__input_error' : ''}`} placeholder="user name" name="user name" type="text" value={nameValue} onChange={handleNameChange} minLength="0" maxLength="20"></input>
                        <div className='edit-profile__input-bottom'>
                            <p className={`edit-profile__input-lenght edit-profile__input-lenght_with-error ${nameValidity.errorMassage ? 'edit-profile__input-lenght_error' : ''}`}>{nameValue.length}/20</p>
                            {nameValidity.errorMassage ? <p className='edit-profile__inpot-error'>{nameValidity.errorMassage}</p> : <></>}
                        </div>
                    </div>
                    <div className='edit-profile__bio-input-box'>
                        <p className='edit-profile__input-title'>Bio</p>
                        <TextareaAutosize className={`edit-profile__textarea ${bioValidity.errorMassage ? 'edit-profile__input_error' : ''}`} placeholder="user bio" name="user bio" type="text" value={bioValue} onChange={handleBioChange} minLength="0" maxLength="350" ></TextareaAutosize>
                        <div className='edit-profile__input-bottom'>
                            <p className={`edit-profile__input-lenght edit-profile__input-lenght_with-error ${bioValidity.errorMassage ? 'edit-profile__input-lenght_error' : ''}`}>{bioValue.length}/350</p>
                            {bioValidity.errorMassage ? <p className='edit-profile__inpot-error'>{bioValidity.errorMassage}</p> : <></>}
                        </div>
                    </div>
                    <div className='edit-profile__custom-url-input-box'>
                        <p className='edit-profile__input-title'>Custom URL</p>
                        <input className={`edit-profile__input ${urlValidity.errorMassage ? 'edit-profile__input_error' : ''}`} placeholder={`${currentUser && currentUser.customURL ? currentUser.customURL : ''}${currentUser && currentUser.user_id && !currentUser.customURL ? currentUser.user_id : ''}`} name="Custom URL" type="text" value={urlValue} onChange={handleUrlChange} minLength="0" maxLength="16"></input>
                        <div className='edit-profile__input-bottom'>
                            <p className={`edit-profile__input-lenght edit-profile__input-lenght_with-error ${urlValidity.errorMassage ? 'edit-profile__input-lenght_error' : ''}`}>{urlValue.length}/16</p>
                            {urlValidity.errorMassage ? <p className='edit-profile__inpot-error'>{urlValidity.errorMassage}</p> : <></>}
                        </div>
                    </div>
                    <div className='edit-profile__site-url-input-box'>
                        <p className='edit-profile__input-title'>Personal site or portfolio</p>
                        <input className={`edit-profile__input ${siteValidity.errorMassage ? 'edit-profile__input_error' : ''}`} placeholder="link" name="link" type="text" value={siteValue} onChange={handleSiteChange} minLength="0" maxLength="300"></input>
                        <div className='edit-profile__input-bottom'>
                            {siteValidity.errorMassage ? <p className='edit-profile__inpot-error'>{siteValidity.errorMassage}</p> : <></>}
                        </div>
                    </div>
                    <div className='edit-profile__email-input-box'>
                        <p className='edit-profile__input-title'>Email for notifications</p>
                        <input className={`edit-profile__input ${emailValidity.errorMassage ? 'edit-profile__input_error' : ''}`} placeholder="email" name="email" type="text" value={emailValue} onChange={handleEmailChange} minLength="0" maxLength="300"></input>
                        <div className='edit-profile__input-bottom'>
                            {emailValidity.errorMassage ? <p className='edit-profile__inpot-error'>{emailValidity.errorMassage}</p> : <></>}
                        </div>
                    </div>
                    <div className={`edit-profile__submit-btn ${submitBtnActive ? 'edit-profile__submit-btn_active' : ''}`} onClick={() => {
                        if (submitBtnActive) {
                            handleSubmit()
                        }
                    }}>
                        {submitPreloader ? <MiniPreloader /> : <p className='edit-profile__submit-btn-text'>{submitFine ? 'Successfully updated' : 'Update profile'}</p>}

                    </div>
                    {submitError ? <p className='edit-profile__submit-error'>{submitError}</p> : <></>}
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
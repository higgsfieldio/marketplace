// import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import './WarningPopup.css';



function WarningPopup(props) {

    let navigate = useNavigate()


    function handleClose() {
        props.setWarningPopupOpened(false)
    }

    function handleOpen() {
        handleClose()
        localStorage.setItem('explictAccept', 'yes')
        props.setExplictAccept(true)
    }


    function handleReturn() {
        handleClose()
        navigate(-1)
    }

    return (




        <div className={`warning-popup ${props.warningPopupOpened ? 'warning-popup_active' : ''}`}>
            <div className={`warning-popup__container ${props.warningPopupOpened ? 'warning-popup__container_active' : ''}`}>
                {/* <svg className={`warning-popup__close`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path className="warning-popup__close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                </svg> */}
                <p className="warning-popup__text">Explicit &amp; Sensitive Content</p>
                <div className="warning-popup__btns">
                    <div className={`warning-popup__btn warning-popup__btn_disagree `} onClick={handleReturn}>
                        <p className="warning-popup__btn-text warning-popup__btn-text_disagree">Return</p>
                    </div>
                    <div className={`warning-popup__btn warning-popup__btn_agree`} onClick={handleOpen}>
                        <p className="warning-popup__btn-text warning-popup__btn-text_agree">Open</p>
                    </div>
                </div>
            </div>
            <div className={`warning-popup__background ${props.warningPopupOpened ? 'warning-popup__background_active' : ''}`} onClick={handleReturn}>
            </div>
        </div>

    );
}

export default WarningPopup;


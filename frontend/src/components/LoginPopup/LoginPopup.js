// import { useState } from 'react';
// import pythonApi from '../../assets/pythonApi';
// import MiniPreloader from '../MiniPreloader/MiniPreloader';
import { useEffect, useState } from 'react';
import MiniPreloader from '../MiniPreloader/MiniPreloader';
import './LoginPopup.css';



function LoginPopup(props) {
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                props.setLoginPopupOpened(false)
            }
        };
        if (props.loginPopupOpened) {

            window.addEventListener('keydown', handleEsc);
        } else {
            window.removeEventListener('keydown', handleEsc);
        }


        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.loginPopupOpened]);

    function handleLogin() {
        setPreloaderVisible(true)
        setTimeout(() => {
            setPreloaderVisible(false)
            props.setLoginPopupOpened(false)
        }, 4000);
        props.login()
       
    }

    return (




        <div className={`login-popup ${props.loginPopupOpened ? 'login-popup_active' : ''}`}>
            <div className={`login-popup__container ${props.loginPopupOpened ? 'login-popup__container_active' : ''}`}>
                <svg className={`login-popup__close`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                    props.setLoginPopupOpened(false)
                }}>
                    <path className="login-popup__close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                </svg>
                <p className="login-popup__title">You must enter with Near<br />to perform this action</p>
                <p className="login-popup__subtitle">Start your digital art journey</p>
                <div className="login-popup__login-btn" onClick={handleLogin}>
                    {isPreloaderVisible ? <MiniPreloader /> : <p className="login-popup__login-btn-text">Log in</p>}

                </div>
            </div>
            <div className={`login-popup__background ${props.loginPopupOpened ? 'login-popup__background_active' : ''}`} onClick={() => {
                props.setLoginPopupOpened(false)
            }}>

            </div>
        </div>

    );
}

export default LoginPopup;


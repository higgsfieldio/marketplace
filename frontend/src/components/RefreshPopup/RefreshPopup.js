import { useEffect, useState } from 'react';
import pythonApi from '../../assets/pythonApi';
import MiniPreloader from '../MiniPreloader/MiniPreloader';
import './RefreshPopup.css';



function RefreshPopup(props) {

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                props.setRefreshPopupOpened(false)
                setTimeout(() => {
                    setStage(0)
                }, 350);
            }
        };
        if (props.refreshPopupOpened) {

            window.addEventListener('keydown', handleEsc);
        } else {
            window.removeEventListener('keydown', handleEsc);
        }


        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.refreshPopupOpened]);

    const [stage, setStage] = useState(0)

    function handleRefresh() {
        if (stage === 0) {
            setStage(1)
            pythonApi.refreshMetadata()
                .then((res) => {
                    setTimeout(() => {
                        setStage(2)
                        props.setCurrentUser(res)
                    }, 1000);

                    console.log(res)
                })
                .catch((err) => {
                    setTimeout(() => {
                        setStage(4)
                    }, 1000);

                    console.log(err)
                })
        }
    }

    return (




        <div className={`refresh-popup ${props.refreshPopupOpened ? 'refresh-popup_active' : ''} ${stage === 1 ? 'refresh-popup_wait' : ''}`}>
            <div className={`refresh-popup__container ${props.refreshPopupOpened ? 'refresh-popup__container_active' : ''}`}>
                {stage === 0 || stage === 2 ? <svg className={`refresh-popup__close ${stage === 1 ? 'refresh-popup__close_wait' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                    if (stage !== 1) {

                        props.setRefreshPopupOpened(false)
                        setTimeout(() => {
                            setStage(0)
                        }, 350);
                    }
                }}>
                    <path className="refresh-popup__close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                </svg>
                    : <></>}
                {stage === 0 ? <p className="refresh-popup__text">Are you sure you want to update your profile metadata</p> : <></>}
                {stage === 1 ? <p className="refresh-popup__text_stage1">Metadata updating, please wait</p> : <></>}
                {stage === 2 ? <p className="refresh-popup__text">Metadata was updated successfully</p> : <></>}
                {stage === 4 ? <p className="refresh-popup__text_stage1">Metadata is already up to date<br />Try again in 10 minutes</p> : <></>}
                <div className="refresh-popup__btns">


                    {stage === 0 || stage === 2 || stage === 4 ?
                        <div className={`refresh-popup__btn refresh-popup__btn_disagree ${stage === 1 ? 'refresh-popup__btn_wait' : ''}`} onClick={() => {
                            if (stage !== 1) {
                                props.setRefreshPopupOpened(false)
                                setTimeout(() => {
                                    setStage(0)
                                }, 350);
                            }
                        }}>
                            <p className="refresh-popup__btn-text refresh-popup__btn-text_disagree">Return</p>
                        </div>
                        :
                        <></>
                    }

                    {stage === 0 || stage === 1 ?
                        <div className={`refresh-popup__btn refresh-popup__btn_agree ${stage === 1 ? 'refresh-popup__btn_wait' : ''}`} onClick={handleRefresh}>
                            {stage === 0 ? <p className="refresh-popup__btn-text refresh-popup__btn-text_agree">Update</p> : <></>}
                            {stage === 1 ? <MiniPreloader /> : <></>}
                        </div>

                        : <></>}

                </div>

            </div>
            <div className={`refresh-popup__background ${props.refreshPopupOpened ? 'refresh-popup__background_active' : ''}`} onClick={() => {
                if (stage !== 1) {
                    props.setRefreshPopupOpened(false)
                    setTimeout(() => {
                        setStage(0)
                    }, 350);
                }
            }}>

            </div>
        </div>

    );
}

export default RefreshPopup;


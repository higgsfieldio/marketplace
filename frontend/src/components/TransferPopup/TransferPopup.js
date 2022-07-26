
import { useEffect, useState } from 'react';
import pythonApi from '../../assets/pythonApi';
import rpcNearApi from '../../assets/rpcNearApi';
import MiniPreloader from '../MiniPreloader/MiniPreloader';

import './TransferPopup.css';

const walletMinLength = 7



function TransferPopup(props) {

    const [isPreloaderVisible, setPreloaderVisible] = useState(false)

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                props.setTransferPopupOpened(false)
                props.setSelectedTokenForTransfer(undefined)
                setTimeout(() => {
                    setWalletValue('')
                    setErrorType('')
                }, 400);
            }
        };
        if (props.transferPopupOpened) {

            window.addEventListener('keydown', handleEsc);
        } else {
            window.removeEventListener('keydown', handleEsc);
        }


        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.transferPopupOpened]);

    // console.log(props.tokenListValue)
    const [walletValue, setWalletValue] = useState('')
    const [errorType, setErrorType] = useState('')

    function handleWalletChange(e) {
        let inputValue = e.target.value
        setWalletValue(inputValue)
        setErrorType('')
    }

    function handleTransfer() {
        setPreloaderVisible(true)
        if (walletValue && walletValue.length >= walletMinLength && props.selectedTokenForTransfer) {
            if (walletValue.toLowerCase() === props.currentUser.user_wallet) {
                setTimeout(() => {
                    setErrorType('NOT_USER_WALLET')
                    setPreloaderVisible(false)
                    setTimeout(() => {
                        setErrorType('')
                    }, 4000);
                }, 400);


            } else {
                rpcNearApi.viewAccount({ accountId: walletValue.trim() })
                    .then(() => {
                        // console.log(res)
                        pythonApi.getProfileByWallet({ user_wallet: walletValue })
                            .then(() => {
                                setTimeout(() => {
                                   
                                    props.onTransfer({ token: props.selectedTokenForTransfer, colbackURL: props.transferColbackURL, wallet: walletValue })
                                    setTimeout(() => {
                                        setPreloaderVisible(false)
                                    }, 3000);
                                }, 400);
                               
                                // console.log(res)
                            })
                            .catch(() => {
                                // console.log(err)

                                setTimeout(() => {
                                    setErrorType('USER_NOT_EXISTS')
                                    setPreloaderVisible(false)
                                    setTimeout(() => {
                                        setErrorType('')
                                    }, 4000);
                                }, 400);
                            })
                    })
                    .catch(() => {

                        setTimeout(() => {
                            setErrorType('WALLET_NOT_EXISTS')
                            setPreloaderVisible(false)

                            setTimeout(() => {
                                setErrorType('')
                            }, 4000);
                        }, 400);
                        // console.log(err)
                    })
            }

        }
    }

    function handleEnter(e) {


        if (e.key === 'Enter') {
            e.preventDefault()
            handleTransfer()
        }

    }

    return (




        <div className={`transfer-popup ${props.transferPopupOpened ? 'transfer-popup_active' : ''}`}>
            <div className={`transfer-popup__container ${props.transferPopupOpened ? 'transfer-popup__container_active' : ''}`}>
                <svg className={`transfer-popup__close`} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                    props.setTransferPopupOpened(false)
                    props.setSelectedTokenForTransfer(undefined)
                    setTimeout(() => {
                        setWalletValue('')
                        setErrorType('')
                    }, 400);
                }}>
                    <path className="transfer-popup__close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
                </svg>
                <p className="transfer-popup__title">Confirm transfer</p>
                <p className="transfer-popup__input-title">Enter NEAR wallet address</p>
                <div className="transfer-popup__input-container">
                    <input onKeyDown={handleEnter} autoFocus className={`transfer-popup__input`} placeholder={'abc.near'} name="transfer wallet" type="text" value={walletValue} onChange={handleWalletChange} min="0,0001" max="999999999"></input>
                </div>
                {errorType && errorType === 'NOT_USER_WALLET' ? <p className="transfer-popup__error">It is impossible to send to yourself</p> : <></>}
                {errorType && errorType === 'WALLET_NOT_EXISTS' ? <p className="transfer-popup__error">This wallet does not exist</p> : <></>}
                {errorType && errorType === 'USER_NOT_EXISTS' ? <p className="transfer-popup__error">User shloud be registered on<br />higgsfield.io</p> : <></>}
                <div className={`transfer-popup__btn ${walletValue && walletValue.length >= walletMinLength ? 'transfer-popup__btn_active' : ''}`} onClick={handleTransfer}>
                    {isPreloaderVisible ? <MiniPreloader /> : <p className="transfer-popup__btn-text">Transfer</p>}
                </div>
            </div>
            <div className={`transfer-popup__background ${props.transferPopupOpened ? 'transfer-popup__background_active' : '[price]'}`} onClick={() => {
                props.setTransferPopupOpened(false)
                props.setSelectedTokenForTransfer(undefined)
                setTimeout(() => {
                    setWalletValue('')
                    setErrorType('')
                }, 400);

            }}>

            </div>
        </div>

    );
}

export default TransferPopup;


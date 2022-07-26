import React from 'react'
import { Link } from 'react-router-dom'
import './ActionForm.css'


const ActionForm = ({ currentUser, login, handleRefStorageDeposit }) => {
    return (
        <div className='action-form__container'>
            <p className='action-form__title'>{currentUser ? 'Please sign the contract to begin earning with Higgs Field' : 'Please log in to access this page'}</p>
            <div className='action-form__btns'>
                <Link to='/' className='action-form__btn action-form__btn_back'>
                    <p className='action-form__btn-text action-form__btn-text_back'>Back to main</p>
                </Link>
                <div className='action-form__btn action-form__btn_action' onClick={() => {
                    if (currentUser) {
                        handleRefStorageDeposit()
                    } else {
                        login()
                    }
                }}>
                    <p className='action-form__btn-text action-form__btn-text_action'>{currentUser ? 'Sign' : 'Log in'}</p>
                </div>
            </div>
        </div>
    )
};

export default ActionForm
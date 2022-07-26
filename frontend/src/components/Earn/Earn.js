import React from 'react'
import { Link } from 'react-router-dom';
import './Earn.css'


const Earn = () => {
    return (
        <div className="login-page">
            <Link className="login-page__link login-page__link_main" to='/'>
                <p className="login-page__link-text login-page__link-text_main">Back to main</p>
            </Link>
        </div>
    )
};

export default Earn
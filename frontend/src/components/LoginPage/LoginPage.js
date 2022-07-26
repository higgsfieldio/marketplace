import React from 'react'
import { MetaTags } from 'react-meta-tags';
import { Link } from 'react-router-dom';
import './LoginPage.css'


const LoginPage = ({ login }) => {
    return (
        <div className="login-page">
            <MetaTags>
                <title>Log in</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={`Log in`} />
                <meta property="twitter:title" content={`Log in`} />
                <meta property="vk:title" content={`Log in`} />
            </MetaTags>
            <p className="login-page__title" >Enter with Near</p>
            <p className="login-page__text">To access this page, you must be logged in</p>
            <div className="login-page__link" onClick={login}>
                <p className="login-page__link-text">Log in</p>
            </div>
            <Link className="login-page__link login-page__link_main" to='/'>
                <p className="login-page__link-text login-page__link-text_main">Back to main</p>
            </Link>
        </div>
    )
};

export default LoginPage
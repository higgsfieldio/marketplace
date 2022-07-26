import React from 'react'
import './NotFound.css'

import mib from '../../assets/images/not-found/mib.gif'
import { Link } from 'react-router-dom';
import { MetaTags } from 'react-meta-tags';

const NotFound = () => {
    return (
        <div className="not-found">
            <MetaTags>
                <title>404 - Page not found</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={`404 - Page not found`} />
                <meta property="twitter:title" content={`404 - Page not found`} />
                <meta property="vk:title" content={`404 - Page not found`} />
            </MetaTags>
            <img className="not-found__img" src={mib} alt='' />
            <p className="not-found__title" >Oops! That page does not exist </p>
            <p className="not-found__text">Try to find something else</p>
            <Link className="not-found__link" to='/explore-collections/collectables'>
                <p  className="not-found__link-text">Explore collections</p>
            </Link>
        </div>
    )
};

export default NotFound
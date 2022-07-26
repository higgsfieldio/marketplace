import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';

import './RefLinkAdder.css'


const RefLinkAdder = ({ setLoginPopupOpened, loggedIn }) => {
    const navigate = useNavigate()
    const { code } = useParams()
    useEffect(() => {
        if (loggedIn !== undefined) {
            if (code) {
                if (code.length >= 5 && code.length <= 7) {
                    localStorage.setItem('ref-code', code)
                }
                navigate('/')
                if (!loggedIn) {
                    setLoginPopupOpened(true)
                }

            } else {
                navigate('/')
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, loggedIn])
    return (
        <div className='ref-link-adder'>

        </div>
    )
};

export default RefLinkAdder
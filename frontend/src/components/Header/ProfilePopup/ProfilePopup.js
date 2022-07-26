import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProfilePopup.css';



function ProfilePopup(props) {

    const [walletCopied, setWalletCopied] = useState(false)
    function copyToClipboard(text, type) {

        var textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            if (type === 'wallet') {
                setWalletCopied(true)
                setTimeout(() => {
                    setWalletCopied(false)
                }, 1500);
            }
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }

    function scrollTop() {
        window.scrollTo(0, 0);
    }

    return (
        <div className={`profile-popup ${props.profilePopupOpened ? 'profile-popup_active' : ''}`}>
            <svg className="profile-popup__close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                props.setProfilePopupOpened(false)
            }}>
                <path className="profile-popup__close-fill" d="M2.98555 13.0263C3.17461 13.2155 3.4304 13.3219 3.69701 13.3219C3.96363 13.3219 4.21942 13.2155 4.40848 13.0263L7.98126 9.37669L11.554 13.0263C11.8171 13.2914 12.2008 13.3949 12.5604 13.2979C12.9199 13.2009 13.2009 12.9179 13.2972 12.5557C13.3935 12.1936 13.2907 11.8071 13.0275 11.5421L9.40421 7.94341L13.0275 4.34471C13.25 4.08314 13.3257 3.72558 13.2287 3.39526C13.1318 3.06494 12.8751 2.80641 12.5472 2.70874C12.219 2.61105 11.8642 2.68729 11.6044 2.91142L7.98125 6.51012L4.40847 2.91142C4.14879 2.68729 3.79381 2.61105 3.46587 2.70874C3.13792 2.80642 2.88126 3.06493 2.78429 3.39526C2.6873 3.72558 2.763 4.08314 2.98551 4.34471L6.55829 7.94341L2.98551 11.5421C2.78175 11.7342 2.66602 12.003 2.66602 12.2841C2.66602 12.5654 2.78175 12.8339 2.98551 13.0262L2.98555 13.0263Z" fill="white" />
            </svg>
            <p className="profile-popup__username">{props.currentUser && props.currentUser.user_name ? props.currentUser.user_name : ''}{props.currentUser && props.currentUser.user_id && !props.currentUser.user_name ? props.currentUser.user_id : ''}</p>
            <p className='profile-popup__wallet' onClick={() => { copyToClipboard(props.currentUser.user_wallet, 'wallet') }}>{walletCopied ? 'Copied!' : `${props.currentUser.user_wallet.slice(0, 5)}....${props.currentUser.user_wallet.slice(props.currentUser.user_wallet.length - 5, props.currentUser.user_wallet.length)}`}</p>
            <div className='profile-popup__balance'>
                <div className='profile-popup__balance-near-icon-container'>
                    <svg className='profile-popup__balance-near-icon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__balance-near-icon-fill' d="M19.2633 1.21833L14.2467 8.66667C14.1752 8.77393 14.145 8.90345 14.1617 9.03125C14.1783 9.15905 14.2407 9.2765 14.3373 9.36188C14.4338 9.44725 14.558 9.49477 14.6869 9.49565C14.8158 9.49653 14.9406 9.45071 15.0383 9.36667L19.9767 5.08333C20.0056 5.05744 20.0415 5.04054 20.0798 5.03468C20.1182 5.02882 20.1575 5.03427 20.1928 5.05035C20.2282 5.06643 20.2581 5.09245 20.2789 5.12524C20.2997 5.15803 20.3105 5.19617 20.31 5.235V18.645C20.31 18.6861 20.2973 18.7261 20.2738 18.7597C20.2502 18.7933 20.2169 18.8189 20.1783 18.8329C20.1397 18.8469 20.0977 18.8487 20.0581 18.8381C20.0184 18.8274 19.983 18.8048 19.9567 18.7733L5.03 0.905C4.78991 0.621492 4.49095 0.393675 4.15392 0.237389C3.81688 0.081102 3.44984 9.51572e-05 3.07833 8.83313e-08H2.55667C1.8786 8.83313e-08 1.2283 0.269362 0.74883 0.74883C0.269362 1.2283 0 1.8786 0 2.55667V21.4433C0 22.1214 0.269362 22.7717 0.74883 23.2512C1.2283 23.7306 1.8786 24 2.55667 24C2.99386 24.0001 3.42379 23.8882 3.80543 23.6749C4.18706 23.4616 4.50767 23.1541 4.73667 22.7817L9.75333 15.3333C9.82478 15.2261 9.85497 15.0966 9.83832 14.9688C9.82166 14.8409 9.75929 14.7235 9.66274 14.6381C9.56618 14.5527 9.44198 14.5052 9.3131 14.5043C9.18422 14.5035 9.05938 14.5493 8.96167 14.6333L4.02333 18.9167C3.99439 18.9426 3.95854 18.9595 3.92015 18.9653C3.88176 18.9712 3.8425 18.9657 3.80715 18.9497C3.77181 18.9336 3.74191 18.9075 3.72111 18.8748C3.7003 18.842 3.68949 18.8038 3.69 18.765V5.35167C3.69002 5.31061 3.70266 5.27056 3.72623 5.23694C3.74979 5.20332 3.78314 5.17777 3.82172 5.16376C3.86031 5.14974 3.90228 5.14794 3.94192 5.1586C3.98157 5.16926 4.01698 5.19186 4.04333 5.22333L18.9683 23.095C19.2084 23.3785 19.5074 23.6063 19.8444 23.7626C20.1815 23.9189 20.5485 23.9999 20.92 24H21.4417C21.7776 24.0002 22.1102 23.9343 22.4206 23.8059C22.731 23.6775 23.013 23.4892 23.2506 23.2518C23.4882 23.0143 23.6766 22.7324 23.8052 22.4221C23.9338 22.1118 24 21.7792 24 21.4433V2.55667C24 1.8786 23.7306 1.2283 23.2512 0.74883C22.7717 0.269362 22.1214 8.83313e-08 21.4433 8.83313e-08C21.0061 -0.000114783 20.5762 0.111811 20.1946 0.325096C19.8129 0.538381 19.4923 0.845908 19.2633 1.21833Z" fill="white" />
                    </svg>
                </div>
                <div className='profile-popup__balance-texts'>
                    <p className='profile-popup__balance-text-title'>Balance</p>
                    <div className='profile-popup__balance-text-value-container'>
                        <p className='profile-popup__balance-text-value'>{props.nearAccountBalance}</p>
                        <svg className='profile-popup__balance-text-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className='profile-popup__balance-text-value-near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                        </svg>
                        <p className='profile-popup__balance-text-value-dollar'>(${Number(Number(props.nearAccountBalance * props.usdExchangeRate).toFixed(0)).toLocaleString('us')})</p>
                    </div>
                </div>
                <a className='profile-popup__balance-explorer' target="_blank" rel="noreferrer" href={`https://explorer.near.org/accounts/${props.currentUser.user_wallet}`}>
                    <svg className='profile-popup__balance-explorer-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__balance-explorer-icon-fill' d="M12 12.6667H4C3.63333 12.6667 3.33333 12.3667 3.33333 12V4C3.33333 3.63333 3.63333 3.33333 4 3.33333H7.33333C7.7 3.33333 8 3.03333 8 2.66667C8 2.3 7.7 2 7.33333 2H3.33333C2.59333 2 2 2.6 2 3.33333V12.6667C2 13.4 2.6 14 3.33333 14H12.6667C13.4 14 14 13.4 14 12.6667V8.66667C14 8.3 13.7 8 13.3333 8C12.9667 8 12.6667 8.3 12.6667 8.66667V12C12.6667 12.3667 12.3667 12.6667 12 12.6667ZM9.33333 2.66667C9.33333 3.03333 9.63333 3.33333 10 3.33333H11.7267L5.64 9.42C5.38 9.68 5.38 10.1 5.64 10.36C5.9 10.62 6.32 10.62 6.58 10.36L12.6667 4.27333V6C12.6667 6.36667 12.9667 6.66667 13.3333 6.66667C13.7 6.66667 14 6.36667 14 6V2H10C9.63333 2 9.33333 2.3 9.33333 2.66667Z" fill="white" />
                    </svg>

                </a>
            </div>
            <div className='profile-popup__create'>
                <p className='profile-popup__create-title'>Create</p>
                <Link className='profile-popup__create-item' to='/create-collection' onClick={() => {
                    scrollTop()
                    props.setProfilePopupOpened(false)
                }}>
                    <svg className='profile-popup__create-item-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__create-item-icon-fill' d="M4.73605 0H2.03202C0.91201 0 0 0.920011 0 2.04882V4.77605C0 5.91207 0.91201 6.82408 2.03202 6.82408H4.73605C5.86407 6.82408 6.76808 5.91207 6.76808 4.77605V2.04882C6.76808 0.920011 5.86407 0 4.73605 0Z" fill="white" />
                        <path className='profile-popup__create-item-icon-fill' d="M4.73605 9.17578H2.03202C0.91201 9.17578 0 10.0886 0 11.2246V13.9518C0 15.0798 0.91201 15.9999 2.03202 15.9999H4.73605C5.86407 15.9999 6.76808 15.0798 6.76808 13.9518V11.2246C6.76808 10.0886 5.86407 9.17578 4.73605 9.17578Z" fill="white" />
                        <path className='profile-popup__create-item-icon-fill' d="M13.9685 9.17578H11.2644C10.1364 9.17578 9.23242 10.0886 9.23242 11.2246V13.9518C9.23242 15.0798 10.1364 15.9999 11.2644 15.9999H13.9685C15.0885 15.9999 16.0005 15.0798 16.0005 13.9518V11.2246C16.0005 10.0886 15.0885 9.17578 13.9685 9.17578Z" fill="white" />
                        <rect className='profile-popup__create-item-icon-fill' x="12" width="1" height="7" rx="0.5" fillOpacity="0.4" />
                        <rect className='profile-popup__create-item-icon-fill' x="16" y="3" width="1" height="7.00001" rx="0.5" transform="rotate(90 16 3)" fillOpacity="0.4" />
                    </svg>
                    <p className='profile-popup__create-item-text'>Create collection</p>
                </Link>
                <Link className='profile-popup__create-item' to='/create-item' onClick={() => {
                    scrollTop()
                    props.setProfilePopupOpened(false)
                }}>
                    <svg className='profile-popup__create-item-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__create-item-icon-fill' d="M11.1962 0H4.80378C2.13712 0 0 2.14021 0 4.80375V11.1981C0 13.8429 2.13712 16 4.80378 16H11.1962C13.844 16 16 13.8429 16 11.1981V4.80375C16 2.14021 13.844 0 11.1962 0Z" fill="white" />
                    </svg>
                    <p className='profile-popup__create-item-text'>Create NFT</p>
                </Link>
            </div>
            <div className='profile-popup__profile'>
                <p className='profile-popup__profile-title'>Profile</p>
                <div className='profile-popup__profile-item' onClick={() => {
                    props.setProfilePopupOpened(false)
                    // scrollTop()
                    props.setRefreshPopupOpened(true)
                }}>
                    <svg className='profile-popup__profile-item-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__profile-item-icon-fill' d="M9.16223 7.23041L11.8065 4.58824C10.8148 3.48744 9.39404 2.87154 7.9125 2.90015C6.43114 2.92875 5.03513 3.59905 4.08664 4.73718C3.13804 5.87531 2.73038 7.36922 2.96922 8.83142C3.20806 10.2938 4.06986 11.5803 5.33125 12.3574C6.59267 13.1346 8.1294 13.3259 9.54273 12.8817C10.9562 12.4374 12.1071 11.4015 12.6971 10.0424H15.0504C15.0167 10.165 14.9784 10.2862 14.9353 10.4059L14.9354 10.4061C14.4101 11.9219 13.4025 13.2239 12.0667 14.1125C10.7309 15.0011 9.14072 15.4275 7.53956 15.3262C5.93826 15.2249 4.41448 14.6015 3.20147 13.5516C1.98839 12.5017 1.1528 11.083 0.822809 9.5129C0.492943 7.94292 0.686693 6.30792 1.37447 4.85845C2.06223 3.40891 3.20627 2.22486 4.63114 1.48765C6.05615 0.750287 7.68335 0.500448 9.26394 0.776187C10.8444 1.05194 12.2909 1.83809 13.382 3.01438L15.1839 1.21245V7.23008L9.16223 7.23041Z" fill="white" />
                    </svg>

                    <p className='profile-popup__profile-item-text'>Refresh metadata</p>
                </div>
                <Link className='profile-popup__profile-item' to={`/profile/${props.currentUser && props.currentUser.customURL? props.currentUser.customURL : props.currentUser.user_id}/on-sale`} onClick={() => {
                    scrollTop()
                    props.setProfilePopupOpened(false)
                }}>
                    <svg className='profile-popup__profile-item-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__profile-item-icon-fill' fillRule="evenodd" clipRule="evenodd" d="M14.9359 15.5669C14.9359 15.8036 14.7432 15.9997 14.5058 15.9997H1.51016C1.2761 15.9997 1.08008 15.8061 1.08008 15.5669C1.08008 11.7408 4.18186 8.63898 8.00795 8.63898C11.834 8.63898 14.9358 11.7408 14.9358 15.5669H14.9359ZM8.00802 7.77317C5.85579 7.77317 4.11134 6.02841 4.11134 3.87649C4.11134 1.72426 5.85579 -0.0205078 8.00802 -0.0205078C10.1603 -0.0205078 11.9047 1.72426 11.9047 3.87649C11.9047 6.02841 10.1603 7.77317 8.00802 7.77317Z" fill="white" />
                    </svg>

                    <p className='profile-popup__profile-item-text'>My profile</p>
                </Link>
                <Link className='profile-popup__profile-item' to={`/edit-profile`} onClick={() => {
                    scrollTop()
                    props.setProfilePopupOpened(false)
                }}>

                    <svg className='profile-popup__profile-item-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__profile-item-icon-fill' d="M15.1733 6.22265H13.6758C13.5612 6.22477 13.449 6.19162 13.354 6.12789C13.2589 6.06405 13.1858 5.97253 13.1445 5.86583C13.0977 5.76147 13.0847 5.64517 13.107 5.5331C13.1294 5.42093 13.1861 5.31859 13.2693 5.24012L14.3284 4.18094H14.3286C14.4824 4.02681 14.5687 3.81787 14.5687 3.60012C14.5687 3.38237 14.4824 3.17342 14.3286 3.0193L12.9781 1.6688C12.8214 1.51869 12.6128 1.43475 12.3957 1.43475C12.1786 1.43475 11.97 1.51869 11.8133 1.6688L10.754 2.72809C10.6465 2.83546 10.5006 2.89573 10.3486 2.89562C10.1966 2.89551 10.0508 2.83491 9.94356 2.7272C9.83619 2.61961 9.77603 2.47373 9.77637 2.32173V0.827253C9.77682 0.608272 9.69021 0.398096 9.53562 0.242977C9.38116 0.0878373 9.17133 0.000445729 8.95235 0H7.04023C6.82125 0 6.6113 0.0869458 6.4565 0.24186C6.30158 0.396665 6.21464 0.606615 6.21464 0.825593V2.32173C6.21498 2.47374 6.15482 2.61963 6.04745 2.7272C5.94019 2.8349 5.79442 2.89551 5.64241 2.89562C5.49039 2.89573 5.34451 2.83546 5.23702 2.72809L4.17773 1.6688C4.02103 1.51868 3.81243 1.43475 3.59534 1.43475C3.37826 1.43475 3.16967 1.51868 3.01295 1.6688L1.66245 3.0193C1.50865 3.17344 1.42227 3.38237 1.42227 3.60012C1.42227 3.81787 1.50865 4.02682 1.66245 4.18094L2.72009 5.2418C2.82801 5.34951 2.88862 5.49572 2.88862 5.64808C2.88862 5.80054 2.82801 5.94674 2.7202 6.05457C2.61238 6.16228 2.46617 6.22277 2.3137 6.22266H0.825596C0.607955 6.22221 0.398897 6.30793 0.244206 6.46117C0.089513 6.61431 0.00167605 6.82256 1.71303e-06 7.04022V8.96037C-0.000444729 9.17946 0.0863874 9.38961 0.241304 9.54465C0.396331 9.69957 0.606486 9.7864 0.825579 9.78595H2.32171C2.43611 9.78383 2.54839 9.81687 2.64349 9.88071C2.73847 9.94455 2.81158 10.036 2.85287 10.1428C2.89651 10.2467 2.90711 10.3615 2.88334 10.4717C2.85957 10.5819 2.80265 10.6821 2.72006 10.7588L1.66088 11.8179V11.8181C1.50708 11.9722 1.4207 12.1811 1.4207 12.3989C1.4207 12.6166 1.50708 12.8255 1.66088 12.9797L3.01138 14.3302L3.01127 14.3301C3.16797 14.4803 3.37668 14.5641 3.59377 14.5641C3.81075 14.5641 4.01944 14.4803 4.17616 14.3301L5.23534 13.2709C5.34293 13.1634 5.48881 13.1032 5.64081 13.1034C5.79282 13.1035 5.93847 13.1641 6.04585 13.2717C6.15322 13.3794 6.21327 13.5253 6.21304 13.6773V15.1733C6.2126 15.3928 6.29965 15.6036 6.45479 15.7587C6.61004 15.9139 6.82077 16.001 7.04018 16.0005H8.96033C9.17931 16.0005 9.38925 15.9136 9.54406 15.7587C9.69898 15.6039 9.78592 15.3939 9.78592 15.1749V13.6772C9.7838 13.5633 9.8165 13.4512 9.87967 13.3564C9.94284 13.2614 10.0335 13.1881 10.1395 13.1461C10.2439 13.0993 10.3602 13.0862 10.4722 13.1086C10.5844 13.1309 10.6867 13.1876 10.7652 13.2709L11.8244 14.3301C11.9811 14.4803 12.1898 14.5641 12.4068 14.5641C12.6239 14.5641 12.8326 14.4803 12.9893 14.3301L14.3398 12.9796L14.3397 12.9797C14.4935 12.8254 14.5798 12.6166 14.5798 12.3988C14.5798 12.1811 14.4935 11.9721 14.3397 11.818L13.2805 10.7587C13.1726 10.651 13.112 10.5048 13.112 10.3525C13.112 10.2 13.1726 10.0538 13.2804 9.94597C13.3882 9.83826 13.5344 9.77777 13.6869 9.77788H15.1829C15.3991 9.77587 15.6059 9.68904 15.7588 9.53613C15.9117 9.38322 15.9984 9.17652 16.0005 8.96034V7.04019C15.9976 6.82266 15.9092 6.61495 15.7544 6.46194C15.5996 6.30904 15.3909 6.22298 15.1733 6.22265L15.1733 6.22265ZM8.00027 10.0805C7.44857 10.0805 6.91955 9.86129 6.52945 9.47121C6.13938 9.08114 5.92018 8.5521 5.92018 8.00039C5.92018 7.44869 6.13938 6.91967 6.52945 6.52957C6.91952 6.1395 7.44857 5.9203 8.00027 5.9203C8.55197 5.9203 9.08099 6.1395 9.47109 6.52957C9.86116 6.91964 10.0804 7.44869 10.0804 8.00039C10.0804 8.5521 9.86116 9.08112 9.47109 9.47121C9.08102 9.86128 8.55197 10.0805 8.00027 10.0805Z" fill="white" />
                    </svg>

                    <p className='profile-popup__profile-item-text'>Edit profile</p>
                </Link>
                <div className='profile-popup__profile-item profile-popup__profile-item_logout' onClick={() => {
                    scrollTop()
                    props.setProfilePopupOpened(false)
                    props.logout()
                }}>
                    <svg className='profile-popup__profile-item-icon' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className='profile-popup__profile-item-icon-fill' d="M12.7671 11.9049C12.4012 11.9105 12.1646 12.1323 11.9771 12.3105L11.9724 12.3149C10.9515 13.2781 9.73308 13.8241 8.35059 13.9377C7.11533 14.0392 5.95077 13.7772 4.88827 13.1591C2.76982 11.9265 1.615 9.57271 1.947 7.16234C2.15699 5.63693 2.87076 4.3643 4.06864 3.37991C5.4219 2.26655 6.99715 1.8282 8.7502 2.07626C9.99812 2.25249 11.1164 2.81259 12.0722 3.74053C12.5047 4.16038 13.133 4.16957 13.5329 3.76148C13.7218 3.57312 13.8267 3.31658 13.8237 3.04985C13.8189 2.7736 13.6968 2.50755 13.4789 2.30018C11.4957 0.410967 9.13946 -0.320031 6.47596 0.127684C2.79357 0.746789 0.0222119 3.9162 -0.113196 7.66412C-0.159747 8.87443 0.0675719 10.0797 0.55178 11.1899C1.18266 12.6392 2.23283 13.8665 3.56728 14.714C4.85519 15.537 6.32478 15.9755 7.82986 15.9755C7.89646 15.9755 7.9634 15.98 8.03 15.98H8.02988C9.26389 15.9517 10.4746 15.6397 11.5685 15.0679C12.2857 14.6929 12.9415 14.2105 13.513 13.6373C13.821 13.3294 13.9054 12.8933 13.735 12.5023C13.5685 12.122 13.2061 11.8991 12.7669 11.9048L12.7671 11.9049Z" fill="white" />
                        <path className='profile-popup__profile-item-icon-fill' d="M15.8024 7.52917L15.048 7.09401L14.4394 6.74291L13.9053 6.43312C13.4993 6.19844 13.0807 5.95548 12.6649 5.71833C12.4188 5.57754 12.2384 5.63746 12.1528 5.68661C12.0671 5.73577 11.9213 5.85979 11.9153 6.14715C11.9153 6.19245 11.9077 6.23787 11.908 6.28351C11.908 6.30537 11.9013 6.32757 11.9013 6.34943V6.97225H10.4721C10.2066 6.97225 9.94212 6.96342 9.67731 6.96342C9.00726 6.96342 8.31364 6.95832 7.63269 6.96025C7.17285 6.96025 6.84709 7.28305 6.83984 7.74515V8.02582V8.14123C6.83984 8.70131 7.14713 9.00576 7.70404 9.00576C8.78513 9.00576 9.86656 9.00191 10.9477 9.00191H11.9017V9.08527C11.9017 9.3187 11.9084 9.54444 11.909 9.76993C11.909 10.0779 12.0406 10.2139 12.1465 10.2774L12.1466 10.2775C12.2109 10.3138 12.2838 10.3326 12.3577 10.3319C12.4794 10.3276 12.5976 10.2912 12.7006 10.2264C13.7297 9.63265 14.7759 9.02853 15.8086 8.4307C16.0645 8.28255 16.1185 8.10564 16.1185 7.98319C16.1185 7.86086 16.0649 7.67975 15.8026 7.52912L15.8024 7.52917Z" fill="white" />
                    </svg>
                    <p className='profile-popup__profile-item-text'>Log out</p>
                </div>

            </div>
        </div>
    );
}

export default ProfilePopup;
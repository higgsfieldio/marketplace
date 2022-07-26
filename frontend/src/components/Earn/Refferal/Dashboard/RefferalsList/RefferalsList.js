/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import pythonApi from '../../../../../assets/pythonApi';
import { API_LINK } from '../../../../../assets/utilis';
import './RefferalsList.css'


const RefferalsList = ({refferalsList, setRefferalsList}) => {
    const [walletCopied, setWalletCopied] = useState('')
    const [linkCopied, setLinkCopied] = useState('')

    function copyToClipboard(text, type, i) {

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
                setWalletCopied(text)
                setTimeout(() => {
                    setWalletCopied('')
                }, 1500);
            }
            if (type === 'link') {
                setLinkCopied(i)
                setTimeout(() => {
                    setLinkCopied('')
                }, 1500);
            }
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }

    const listInnerRef = useRef();

    const [pageValue, setPageValue] = useState(0);
    const [prevScrollPosition, setPrevScrollPosition] = useState(-1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isPreloaderVisible, setPreloaderVisible] = useState(false)
    const [cards, setCards] = useState([])
    const [scrollTraking, setScrollTraking] = useState(true);
    const handleScroll = () => {
        const position = window.pageYOffset;

        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    // const [pageValue, setPageValue] = useState(0);
    useEffect(() => {
        // console.log(scrollPosition, prevScrollPosition)
        if (listInnerRef.current && scrollTraking && scrollPosition > prevScrollPosition && refferalsList && refferalsList.length > 0) {
            // console.log(listInnerRef.current)
            setPrevScrollPosition(scrollPosition)
            const { scrollHeight } = listInnerRef.current;
            if (scrollHeight < scrollPosition + 400) {
                setScrollTraking(false)
                setPageValue(pageValue + 1)
                setTimeout(() => {
                    setScrollTraking(true)
                }, 500);
            }
        }
    }, [scrollPosition, scrollTraking, prevScrollPosition, pageValue, refferalsList]);

    useEffect(() => {

        if (pageValue > 0 && refferalsList && refferalsList.length === 10 * pageValue ) {
            let prevId = refferalsList[refferalsList.length - 1]._id
            console.log(prevId)
            console.log('ss')
            pythonApi.getChildReferrals({ last_id: prevId, limit: 10})
                .then((res) => {
                    console.log(res)
                    setRefferalsList(prewList => prewList.concat(res))
                })
                .catch((err) => {
                    console.log(err)
                })
        }

 // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageValue, refferalsList])


    return (
        <div className='refferals-list'>
            <p className='refferals-list__title'>List of the referrals</p>
            <div className='refferals-list__table-container'>
                <table className='refferals-list__table'>
                    <thead className='refferals-list__table-thead'>
                        <tr className='refferals-list__table-thead-tr'>
                            <th className='refferals-list__table-thead-th refferals-list__table-thead-th_numeral' colSpan="1">Referral</th>
                            <th className='refferals-list__table-thead-th refferals-list__table-thead-th_wallet' colSpan="1">
                                <div className='refferals-list__table-thead-th-row'>
                                    <span >Wallet</span>
                                </div>
                            </th>
                            <th className='refferals-list__table-thead-th refferals-list__table-thead-th_volume' colSpan="1">
                                <div className='refferals-list__table-thead-th-row'>
                                    <span >Traded volume</span>
                                </div>
                            </th>
                            <th className='refferals-list__table-thead-th refferals-list__table-thead-th_profit' colSpan="1">
                                <div className='refferals-list__table-thead-th-row'>
                                    <span >Profit</span>
                                </div>
                            </th>
                            <th className='refferals-list__table-thead-th refferals-list__table-thead-th_link' colSpan="1">
                                <div className='refferals-list__table-thead-th-row'>
                                    <span >Link</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='refferals-list__table-tbody' ref={listInnerRef}>
                        {refferalsList.map((item, i) => (<tr className='refferals-list__table-tbody-tr' key={`refferals-list__table-tbody-tr${i}`}>
                            <td className='refferals-list__table-tbody-td'>
                                <Link to={`/profile/${item.user_id}/items`} className='refferals-list__table-tbody-td-row refferals-list__table-tbody-td-row-name'>
                                    <div className='refferals-list__table-tbody-td-row-img'>
                                        {item.avatar_url ?
                                            <img className='refferals-list__table-tbody-td-row-img-elem' src={`${API_LINK}/users/get_file/${item.avatar_url}`} alt={`item.avatar_url`}></img>
                                            :
                                            <svg className='refferals-list__table-tbody-td-row-img-placeholder' width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path className='refferals-list__table-tbody-td-row-img-placeholder-fill' fillRule="evenodd" clipRule="evenodd" d="M10.2756 0.701852L7.77208 3.91143L9.68152 6.36149C9.96157 6.72083 9.88519 7.23534 9.51179 7.50485C9.13839 7.77436 8.60375 7.70902 8.32369 7.34151C7.43262 6.19815 6.36334 4.83429 5.69291 3.96043C5.35346 3.52759 4.67455 3.52759 4.33509 3.96043L0.940532 8.31337C0.524699 8.86055 0.92356 9.62824 1.61944 9.62824H16.895C17.5908 9.62824 17.9897 8.86055 17.5739 8.32154L11.6334 0.701852C11.2939 0.260841 10.615 0.260841 10.2756 0.701852Z" fill="#1D1D1D" />
                                            </svg>
                                        }
                                    </div>

                                    <p className='refferals-list__table-tbody-td-row-username'>@{item.user_id}</p>
                                </Link>
                            </td>
                            <td className='refferals-list__table-tbody-td'>
                                <span className='refferals-list__table-tbody-td-row'>
                                    <p className={`refferals-list__table-tbody-td-row-wallet-value`} title={item.user_wallet} onClick={() => { copyToClipboard(item.user_wallet, 'wallet') }}>{walletCopied === item.user_wallet ? 'Copied!' : `${item.user_wallet.slice(0, 5)}..${item.user_wallet.slice(item.user_wallet.length - 5, item.user_wallet.length)}`}</p>
                                </span>
                            </td>
                            <td className='refferals-list__table-tbody-td'>
                                <span className='refferals-list__table-tbody-td-row '>
                                    <p className={`refferals-list__table-tbody-td-row-price-value `}>{Number(item.child_traded_volume) < 1 ? ((parseInt(Number(item.child_traded_volume) * 100000)) / 100000) : Number(item.child_traded_volume) < 10 ? ((parseInt(Number(item.child_traded_volume) * 10000)) / 10000) : Number(item.child_traded_volume) < 100 ? ((parseInt(Number(item.child_traded_volume) * 1000)) / 1000) : Number(item.child_traded_volume) < 1000 ? ((parseInt(Number(item.child_traded_volume) * 100)) / 100) : ((parseInt(Number(item.child_traded_volume) * 10)) / 10) }</p>
                                    <svg className='refferals-list__table-tbody-td-row-price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`refferals-list__table-tbody-td-row-price-value-near-icon-fill `} d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </span>
                            </td>
                            <td className='refferals-list__table-tbody-td'>
                                <span className='refferals-list__table-tbody-td-row '>
                                    <p className={`refferals-list__table-tbody-td-row-price-value `}>{Number(item.child_profit) < 1 ? ((parseInt(Number(item.child_profit) * 100000)) / 100000) : Number(item.child_profit) < 10 ? ((parseInt(Number(item.child_profit) * 10000)) / 10000) : Number(item.child_profit) < 100 ? ((parseInt(Number(item.child_profit) * 1000)) / 1000) : Number(item.child_profit) < 1000 ? ((parseInt(Number(item.child_profit) * 100)) / 100) : ((parseInt(Number(item.child_profit) * 10)) / 10) }</p>
                                    <svg className='refferals-list__table-tbody-td-row-price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`refferals-list__table-tbody-td-row-price-value-near-icon-fill `} d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </span>
                            </td>
                            <td className='refferals-list__table-tbody-td'>
                                <span className='refferals-list__table-tbody-td-row'>
                                    <p className={`refferals-list__table-tbody-td-row-link-value`} onClick={() => { copyToClipboard(`${window.location.protocol}//${window.location.host}/r/${item.child_referral_code_connected_via}`, 'link', i) }}>{linkCopied === i ? 'Copied!' : `${window.location.host}/r/${item.child_referral_code_connected_via}`}</p>
                                </span>
                            </td>
                        </tr>))}

                    </tbody>
                </table>
            </div>

        </div>
    )
};

export default RefferalsList
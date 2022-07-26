/* eslint-disable no-unused-vars */
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react'
import pythonApi from '../../../../../assets/pythonApi';
import './RefLinksList.css'


const RefLinksList = ({ links, setRefLinks }) => {
    const time_zone = moment.tz.guess();
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
        if (listInnerRef.current && scrollTraking && scrollPosition > prevScrollPosition && links && links.length > 0) {
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
    }, [scrollPosition, scrollTraking, prevScrollPosition, pageValue, links]);

    useEffect(() => {

        if (pageValue > 0 && links && links.length === 10 * pageValue ) {
            let prevId = links[links.length - 1]._id
            console.log(prevId)
            console.log('ss')
            pythonApi.getCreatedRefLinks({ last_id: prevId, limit: 10})
                .then((res) => {
                    console.log(res)

                    setRefLinks(prewLinks => prewLinks.concat(res))
                })
                .catch((err) => {
                    console.log(err)
                })
        }

 // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageValue, links])


    return (
        <div className='ref-links-list'>
            <div className='ref-links-list__table-container'>
                <table className='ref-links-list__table'>
                    <thead className='ref-links-list__table-thead'>
                        <tr className='ref-links-list__table-thead-tr'>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_numeral' colSpan="1">Copy link</th>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_wallet' colSpan="1">
                                <div className='ref-links-list__table-thead-th-row'>
                                    <span >Link name</span>
                                </div>
                            </th>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_volume' colSpan="1">
                                <div className='ref-links-list__table-thead-th-row'>
                                    <span >Tag 1</span>
                                </div>
                            </th>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_profit' colSpan="1">
                                <div className='ref-links-list__table-thead-th-row'>
                                    <span >Tag 2</span>
                                </div>
                            </th>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_link' colSpan="1">
                                <div className='ref-links-list__table-thead-th-row'>
                                    <span >Connected via link</span>
                                </div>
                            </th>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_volume' colSpan="1">
                                <div className='ref-links-list__table-thead-th-row'>
                                    <span >Volume</span>
                                </div>
                            </th>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_profit' colSpan="1">
                                <div className='ref-links-list__table-thead-th-row'>
                                    <span >Profit</span>
                                </div>
                            </th>
                            <th className='ref-links-list__table-thead-th ref-links-list__table-thead-th_profit' colSpan="1">
                                <div className='ref-links-list__table-thead-th-row'>
                                    <span >Date created</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody ref={listInnerRef} className='ref-links-list__table-tbody'>
                        {links.map((item, i) => (<tr className={`ref-links-list__table-tbody-tr ${item.new? 'ref-links-list__table-tbody-tr_new': ''}`} key={`ref-links-list${i}`}>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row ref-links-list__table-tbody-td-row-link' onClick={() => { copyToClipboard(`${window.location.protocol}//${window.location.host}/r/${item.code}`, 'link', i) }}>
                                    <p className={`ref-links-list__table-tbody-td-row-link-value`} >{linkCopied === i ? 'Copied!' : `${window.location.host}/r/${item.code}`}</p>
                                    <svg className='ref-links-list__table-link-copy' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className='ref-links-list__table-link-copy-fill' d="M17.936 0.0254305H5.61405C5.07671 0.0255731 4.56129 0.236423 4.18122 0.611526C3.801 0.986599 3.58714 1.49529 3.58669 2.02576V3.80766L2.0268 3.8078C1.48961 3.80837 0.974494 4.01937 0.594568 4.39444C0.214642 4.76952 0.000890222 5.27806 0.000335693 5.80839V17.973C0.000913327 18.5033 0.214639 19.0119 0.594568 19.3868C0.974494 19.7619 1.48961 19.9727 2.0268 19.9733H14.3488C14.8861 19.9731 15.4015 19.7623 15.7816 19.3872C16.1618 19.0121 16.3757 18.5034 16.3761 17.973V16.1909H17.9372C18.4744 16.1903 18.9895 15.9793 19.3695 15.6043C19.7494 15.2292 19.9631 14.7207 19.9637 14.1903V2.02572C19.9631 1.49525 19.7492 0.986559 19.369 0.611486C18.9889 0.236413 18.4735 0.0255366 17.936 0.0253906V0.0254305ZM15.1121 17.9729C15.112 18.1726 15.0314 18.3642 14.8883 18.5055C14.7452 18.6468 14.5511 18.7263 14.3488 18.7265H2.02678C1.82446 18.7263 1.63036 18.6468 1.48726 18.5055C1.34415 18.3642 1.26357 18.1726 1.26343 17.9729V5.80828C1.26357 5.60855 1.34415 5.41693 1.48726 5.27565C1.63037 5.13437 1.82445 5.05482 2.02678 5.05454H14.3488C14.5511 5.05482 14.7452 5.13437 14.8883 5.27565C15.0314 5.41693 15.112 5.60854 15.1121 5.80828V17.9729ZM18.6994 14.1904C18.6992 14.3901 18.6186 14.5818 18.4755 14.723C18.3324 14.8643 18.1383 14.9439 17.936 14.9441H16.3761V5.80838C16.3757 5.27805 16.162 4.76951 15.782 4.39443C15.4023 4.01936 14.8871 3.80834 14.3499 3.80779H4.85199V2.02575C4.85213 1.82601 4.93271 1.6344 5.07582 1.49312C5.21893 1.35184 5.41302 1.27229 5.61534 1.27214H17.9362C18.1385 1.27229 18.3326 1.35184 18.4757 1.49312C18.6188 1.6344 18.6994 1.826 18.6996 2.02575L18.6994 14.1904Z" fill="white" />
                                    </svg>

                                </span>
                            </td>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row'>
                                    <p className={`ref-links-list__table-tbody-td-row-tag-value`} >{item.name}</p>
                                </span>
                            </td>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row'>
                                    <p className={`ref-links-list__table-tbody-td-row-tag-value`} >{item.tag_1}</p>
                                </span>
                            </td>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row'>
                                    <p className={`ref-links-list__table-tbody-td-row-tag-value`} >{item.tag_2}</p>
                                </span>
                            </td>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row'>
                                    <p className={`ref-links-list__table-tbody-td-row-tag-value`} >{Number(item.connected_via).toLocaleString('us')}</p>
                                </span>
                            </td>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row '>
                                    <p className={`ref-links-list__table-tbody-td-row-price-value `}>{Number(item.volume) < 1 ? ((parseInt(Number(item.volume) * 100000)) / 100000) : Number(item.volume) < 10 ? ((parseInt(Number(item.volume) * 10000)) / 10000) : Number(item.volume) < 100 ? ((parseInt(Number(item.volume) * 1000)) / 1000) : Number(item.volume) < 1000 ? ((parseInt(Number(item.volume) * 100)) / 100) : ((parseInt(Number(item.volume) * 10)) / 10)}</p>
                                    <svg className='ref-links-list__table-tbody-td-row-price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`ref-links-list__table-tbody-td-row-price-value-near-icon-fill `} d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </span>
                            </td>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row '>
                                    <p className={`ref-links-list__table-tbody-td-row-price-value `}>{Number(item.profit) < 1 ? ((parseInt(Number(item.profit) * 100000)) / 100000) : Number(item.profit) < 10 ? ((parseInt(Number(item.profit) * 10000)) / 10000) : Number(item.profit) < 100 ? ((parseInt(Number(item.profit) * 1000)) / 1000) : Number(item.profit) < 1000 ? ((parseInt(Number(item.profit) * 100)) / 100) : ((parseInt(Number(item.profit) * 10)) / 10)}</p>
                                    <svg className='ref-links-list__table-tbody-td-row-price-value-near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`ref-links-list__table-tbody-td-row-price-value-near-icon-fill `} d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                    </svg>
                                </span>
                            </td>
                            <td className='ref-links-list__table-tbody-td'>
                                <span className='ref-links-list__table-tbody-td-row'>
                                  
                                  
                                    <p className={`ref-links-list__table-tbody-td-row-date-value`} >{moment(`${item.date_created}+00:00`).tz(time_zone).format('DD.MM.YYYY / H:mm')}</p>
                                </span>
                            </td>

                        </tr>))}

                    </tbody>
                </table>
            </div>

        </div>
    )
};

export default RefLinksList
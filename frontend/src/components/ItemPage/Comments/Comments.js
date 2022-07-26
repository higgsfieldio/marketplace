import './Comments.css';

import gomer from '../../../assets/images/gif/gomer.gif'
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { API_LINK, API_VERSION, wordsBlackList } from '../../../assets/utilis';
import { useEffect, useRef, useState } from 'react';
// import pythonApi from '../../../assets/pythonApi';



function Comments({ comments, currentUser, handleSendComment, token_id, login, setComents }) {
    var tz = moment.tz.guess();
    const ws = useRef(null);
    const [comentesUpdated, setComentsUpdated] = useState(false)
    const [comentesUpdatedCount, setComentsUpdatedCount] = useState(0)
    const [commentValue, setCommentValue] = useState('')
    const [commentValidity, setCommentValidity] = useState({});




    function handleCommentChange(e) {
        let inputValue = e.target.value

        if (wordsBlackList.filter((i) => {
            if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i)) {
                return true
            }
            else return false
        }).length > 0) {
            console.log(inputValue.replace(/\s/g, ''))
            setCommentValidity({
                errorMassage: `Contains an invalid value ${wordsBlackList.filter((i) => {
                    if (`${inputValue.replace(/\s/g, '')}`.trim().toLowerCase().includes(i)) {
                        return true
                    }
                    else return false
                })[0]}`,
                validState: false
            });
        } else {
            setCommentValidity({
                errorMassage: ``,
                validState: true
            });
        }

        setCommentValue(inputValue)


    }

    function handleEnter(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (commentValidity.validState && commentValue) {
                handleSendComment({ text: commentValue })

                setCommentValue('')
            }
        }
    }

    function handleSend() {
        if (commentValidity.validState && commentValue) {
            handleSendComment({ text: commentValue })

            setCommentValue('')
        }
    }

    function handleLogin() {
        login()
    }

    // function handleWsMes(res) {
    //     handleAddCommentFromWs({ comment: res })
    // }

    useEffect(() => {
        if (token_id) {
            // console.log('conected' + ' ' + token_id)
            ws.current = new WebSocket(`wss://higgsfield.io/api/${API_VERSION}/ws/comments/${token_id}`);
            // ws.current.onopen = () => console.log("ws opened");
            // ws.current.onclose = () => console.log("ws closed");
            // setInterval(() => ws.current.send('echo'), 1000)
        }

        const wsCurrent = ws.current;
        return () => {
            wsCurrent.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token_id]);

    const [scrollTopPos, setScrollTopPos] = useState(0)

    useEffect(() => {
        if (token_id) {
            ws.current.onmessage = e => {
                var items = document.getElementById("comments");
                const res = JSON.parse(e.data)
                setComents(oldArray => [...oldArray, res])
                if (currentUser && (res.user_id === currentUser.user_id || res.user_id === currentUser.customURL)) {
                    items.scrollTo({ top: 0, behavior: 'smooth' });
                }
                else {

                    items.scrollTo({ top: scrollTopPos + 69 });
                    setComentsUpdated(true)
                    setComentsUpdatedCount(oldValue => oldValue + 1)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token_id, currentUser, scrollTopPos]);



    const listInnerRef = useRef();



    function onScroll() {
        const scrollTop = listInnerRef.current.scrollTop
        setScrollTopPos(scrollTop)
        if (comentesUpdated && scrollTop < 69) {
            setComentsUpdated(false)
            setTimeout(() => {
                setComentsUpdatedCount(0)
            }, 69);

        }
    }


    function handleScrollTop() {

        listInnerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        setComentsUpdated(false)
        setTimeout(() => {
            setComentsUpdatedCount(0)
        }, 310);
    }

    const [timerValue, setTimerValue] = useState(0);


    useEffect(() => {

        const timer = setInterval(() => {
            setTimerValue(timerValue + 10)
            clearInterval(timer)
        }, 10000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerValue])

    return (
        <div className='item-comments'>
            <div className={`item-comments__hint ${comentesUpdated && scrollTopPos >= 69 ? 'item-comments__hint_visible' : ''}`} onClick={handleScrollTop}>
                <p className='item-comments__hint-text'>See new {comentesUpdatedCount} comment{comentesUpdatedCount > 1 ? 's' : ''}</p>
            </div>
            <div className={`item-comments__items ${comments && comments.length > 3 ? '' : 'item-comments__items_hide-scroll'}`} id='comments' ref={listInnerRef} onScroll={onScroll}>

                {comments && comments.length > 0 ?
                    comments.map((comment, i) => (
                        <div className='item-comments__item' key={`comments-${token_id}-${i}`}>
                            <Link className='item-comments__item-avatar' to={`/profile/${comment.user_id}/on-sale`}>
                                <div className='item-comments__item-avatar-bg'>
                                    {comment.avatar_url ?

                                        <img className='item-comments__owner-avatar-img' src={comment.avatar_url ? `${API_LINK}/users/get_file/${comment.avatar_url}` : ''} alt='avatar' />
                                        :

                                        <svg className='item-comments__owner-avatar-placeholder' width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='item-comments__owner-avatar-placeholder-fill' fillRule="evenodd" clipRule="evenodd" d="M10.2756 0.701852L7.77208 3.91143L9.68152 6.36149C9.96157 6.72083 9.88519 7.23534 9.51179 7.50485C9.13839 7.77436 8.60375 7.70902 8.32369 7.34151C7.43262 6.19815 6.36334 4.83429 5.69291 3.96043C5.35346 3.52759 4.67455 3.52759 4.33509 3.96043L0.940532 8.31337C0.524699 8.86055 0.92356 9.62824 1.61944 9.62824H16.895C17.5908 9.62824 17.9897 8.86055 17.5739 8.32154L11.6334 0.701852C11.2939 0.260841 10.615 0.260841 10.2756 0.701852Z" fill="#1D1D1D" />
                                        </svg>
                                    }
                                </div>
                                {comment.verified ?
                                    <div className='item-comments__item-avatar-verified' title="Verified Creator">
                                        <svg className='item-comments__item-avatar-verified-icon' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className='item-comments__item-avatar-verified-icon-fill' d="M4.20536 7.46349C4.14062 7.52857 4.05236 7.56492 3.96063 7.56492C3.86889 7.56492 3.78063 7.52857 3.71589 7.46349L1.76151 5.50876C1.55866 5.30592 1.55866 4.97707 1.76151 4.77457L2.00624 4.52984C2.20909 4.32699 2.53759 4.32699 2.74043 4.52984L3.96063 5.75003L7.25774 2.45292C7.46059 2.25007 7.78943 2.25007 7.99193 2.45292L8.23666 2.69765C8.43951 2.90049 8.43951 3.22934 8.23666 3.43184L4.20536 7.46349Z" fill="white" />
                                        </svg>

                                    </div> : <></>}
                            </Link>
                            <div className='item-comments__item-texts'>
                                <Link className='item-comments__item-owner-name' title={comment.user_name ? comment.user_name : `@${comment.user_id}`} to={`/profile/${comment.user_id}/on-sale`}>{comment.user_name ? comment.user_name : `@${comment.user_id}`}</Link>
                                <p className='item-comments__item-text'>{comment.text}</p>
                            </div>
                            <p className='item-comments__item-date'>{Number(moment().format('x')) - Number(moment.unix(comment.timestamp).format('x')) > 43200000 ? moment.unix(comment.timestamp).tz(tz).format('DD.MM.YYYY HH:mm') : moment.unix(comment.timestamp).tz(tz).fromNow()}</p>
                        </div>
                    )).reverse()
                    :
                    <div className='item-comments__no-item'>
                        <img className='item-comments__no-item-img' src={gomer} alt=''></img>
                        <p className='item-comments__no-item-text'>There are no comments yet, be the first</p>
                    </div>
                }
            </div>
            {currentUser ?
                <div className={`item-comments__input-container ${commentValidity.errorMassage ? 'item-comments__input-container_error' : ''}`}>
                    <input className={`item-comments__input ${commentValidity.errorMassage ? 'item-comments__input_error' : ''}`} onKeyDown={handleEnter} placeholder='Write  your comment' name="comment" type="text" value={commentValue} onChange={handleCommentChange}></input>
                    <div className={`item-comments__send-btn ${commentValidity.validState && commentValue ? 'item-comments__send-btn_active' : ''}`} onClick={handleSend}>
                        <p className={`item-comments__send-btn-text`}>Send</p>
                    </div>
                </div>
                :
                <div className='item-comments__login-btn' onClick={handleLogin}>
                    <p className='item-comments__login-btn-text'>Login to leave a comment</p>
                </div>}
        </div>
    );
}

export default Comments;


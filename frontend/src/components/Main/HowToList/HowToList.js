import './HowToList.css';

import card1 from '../../../assets/images/main/how-to-list/card1.png'
import card2 from '../../../assets/images/main/how-to-list/card2.png'
import card3 from '../../../assets/images/main/how-to-list/card3.png'
import card_login from '../../../assets/images/main/how-to-list/card_login.png'
import { Link } from 'react-router-dom';

// const cards = [
//     {
//         title: '',
//         text: '',
//         img: card2,
//     },
//     {
//         title: '',
//         text: '',
//         img: card1,
//     },
//     {
//         title: '',
//         text: '',
//         img: card3,
//     },
// ]

function HowToList({ currentUser , login}) {

    return (
        <section className='how-to-list'>
            <h2 className='how-to-list__title'>How to list your collection?</h2>
            <div className='how-to-list__cards'>
                {!currentUser ?
                    <div className='how-to-list__card'>
                        <div className='how-to-list__card-texts'>
                            <p className='how-to-list__card-title'>Connect NEAR Wallet</p>
                            <p className='how-to-list__card-text'>Click <span className='how-to-list__card-text how-to-list__card-text_link' onClick={login}>Log in</span> and your opportunities in the NFT world will become limitless.</p>
                        </div>
                        <img className='how-to-list__card-img' src={card_login} alt='how to list card icon' />
                    </div>
                    : <></>}
                <div className='how-to-list__card'>
                    <div className='how-to-list__card-texts'>
                        <p className='how-to-list__card-title'>Create your collection</p>
                        <p className='how-to-list__card-text'>If you have already launched your collection or plan to do so, <a className='how-to-list__card-text how-to-list__card-text_link' target="_blank" rel="noreferrer" href='https://druhk0gh9fz.typeform.com/to/HXoES14C'>Apply&nbsp;for&nbsp;a&nbsp;Listing</a>. Add all necessary info, and let us know if you want to be listed on our <Link className='how-to-list__card-text how-to-list__card-text_link' to='/calendar'>Calendar</Link>.<br/><br/>Or click <Link className='how-to-list__card-text how-to-list__card-text_link' to='/create-collection'>Create&nbsp;collection</Link>, if you want to set up a collection on our marketplace and add your NFTs one by one.</p>
                    </div>
                    <img className='how-to-list__card-img' src={card2} alt='how to list card icon' />
                </div>
                <div className='how-to-list__card'>
                    <div className='how-to-list__card-texts'>
                        <p className='how-to-list__card-title'>Upload your works</p>
                        <p className='how-to-list__card-text'>Use <Link className='how-to-list__card-text how-to-list__card-text_link' to='/create-item'>Create item</Link> or implement our NFT standarts to your smart contract (<Link className='how-to-list__card-text how-to-list__card-text_link' to='/guide'>Guide</Link>).</p>
                    </div>
                    <img className='how-to-list__card-img' src={card1} alt='how to list card icon' />
                </div>
                <div className='how-to-list__card'>
                    <div className='how-to-list__card-texts'>
                        <p className='how-to-list__card-title'>Manage sales</p>
                        <p className='how-to-list__card-text'>Allow your community to have immediate, verified access to your collection.</p>
                    </div>
                    <img className='how-to-list__card-img' src={card3} alt='how to list card icon' />
                </div>


            </div>
        </section>
    );
}

export default HowToList;

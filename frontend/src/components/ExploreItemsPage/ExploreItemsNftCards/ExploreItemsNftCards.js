
import NftCard from '../NftCard/NftCard'
import './ExploreItemsNftCards.css'

import gomer from '../../../assets/images/gif/gomer.gif'
import { Link } from 'react-router-dom'

import Preloader from '../../Preloader/Preloader'


function ExploreItemsNftCards({ cards, usdExchangeRate, isCurrentUser, setRefreshPopupOpened, user, toggleLike, loggedIn, currentUser, setLoginPopupOpened, isPreloaderVisible, isExplictAccept, setExplictAccept }) {





    return (
        <>
            {isPreloaderVisible ?
                <div className="explore-nft-cards__cards-preloader">
                    <Preloader />
                </div> :
                <>
                    {cards && cards.length > 0 ?
                        <div className="explore-nft-cards">


                            {cards && cards.length > 0 ?
                                <div className="explore-nft-cards__cards">
                                    {cards.map((card, i) => (
                                        <NftCard usdExchangeRate={usdExchangeRate} isExplictAccept={isExplictAccept} setExplictAccept={setExplictAccept} setLoginPopupOpened={setLoginPopupOpened} item={card} key={`nft-card${i}`} user={user} toggleLike={toggleLike} loggedIn={loggedIn} currentUser={currentUser} />
                                    ))}
                                </div>
                                :
                                <div className="explore-nft-cards__no-cards">
                                    <img className='explore-nft-cards__no-cards-gif' src={gomer} alt='gomer'></img>
                                    <p className='explore-nft-cards__no-cards-title'>Nothing was found for these filters</p>


                                </div>
                            }


                        </div>
                        :
                        <div className="nft-cards__no-cards">
                            <img className='nft-cards__no-cards-gif' src={gomer} alt='gomer'></img>
                            <p className='nft-cards__no-cards-title'>Nothing to see here</p>
                            <p className='nft-cards__no-cards-text'>{isCurrentUser ? 'Try to refresh metadata or explore collections' : 'Come back soon! Or try to browse something for yourself on our marketplace'}</p>
                            <div className='nft-cards__no-cards-btns'>
                                <Link className='nft-cards__no-cards-link' to='/explore-collections/collectables'>
                                    <p className='nft-cards__no-cards-link-text'>Explore collections</p>
                                </Link>

                            </div>
                        </div>
                    }
                </>}
        </>

    )
};

export default ExploreItemsNftCards
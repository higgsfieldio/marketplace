import { Link } from 'react-router-dom';
import CollectionCard from './CollectionCard/CollectionCard';
import './Collections.css';
import gomer from '../../../assets/images/gif/gomer.gif'



function Collections({ cards, isCurrentUser }) {

    return (
        <div className='collections-profile'>
            {cards && cards.length > 0 ?
                <div className='collections-profile__cards'>
                    {cards.map((card, i) => {
                        if (isCurrentUser) {
                            if(card.items && card.items.length === 0){
                                return <CollectionCard card={card} key={`collections-profile__card-${i}`} />
                            } else return <CollectionCard card={card} key={`collections-profile__card-${i}`} />
                        } else {
                            if(card.items && card.items.length === 0){
                                return <></>
                            } else return <CollectionCard card={card} key={`collections-profile__card-${i}`} />
                        }
                    })}
                </div>
                :
                <div className="activity__no-cards">
                    <img className='activity__no-cards-gif' src={gomer} alt='gomer'></img>
                    <p className='activity__no-cards-title'>Nothing to see here</p>
                    <p className='activity__no-cards-text'>Come back soon! Or try to browse something for yourself on our marketplace</p>
                    <Link className='activity__no-cards-link' to='/explore-collections/collectables'>
                        <p className='activity__no-cards-link-text'>Explore collections</p>
                    </Link>
                </div>
            }

        </div>
    );
}

export default Collections;

import { Link } from 'react-router-dom';
import CollectionCard from './SearchCollectionCard/SearchCollectionCard';
import './SearchCollections.css';
import gomer from '../../../assets/images/gif/gomer.gif'



function SearchCollections({ cards, isCurrentUser, searchValue }) {

    return (
        <div className='collections-search'>
            {cards && cards.length > 0 ?
                <div className='collections-search__cards'>
                    {cards.map((card, i) => {
                        if (isCurrentUser) {
                            if (card.items && card.items.length === 0) {
                                return <CollectionCard card={card} key={`collections-search__card-${i}`} />
                            } else return <CollectionCard card={card} key={`collections-search__card-${i}`} />
                        } else {
                            if (card.items && card.items.length === 0) {
                                return <></>
                            } else return <CollectionCard card={card} key={`collections-search__card-${i}`} />
                        }
                    })}
                </div>
                :
                <div className="activity__no-cards">
                    {searchValue ? <img className='activity__no-cards-gif' src={gomer} alt='gomer'></img> : <></>}
                    <p className='activity__no-cards-title'>{searchValue ? 'Oops' : 'Try to find something'}</p>
                    {searchValue ? <p className='activity__no-cards-text'>Nothing was found</p> : <></>}
                    <Link className='activity__no-cards-link' to='/explore-collections/collectables'>
                        <p className='activity__no-cards-link-text'>Explore collections</p>
                    </Link>
                </div>
            }

        </div>
    );
}

export default SearchCollections
    ;

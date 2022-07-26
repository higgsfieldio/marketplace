import CollectionCard from './ExploreCollectionsCard/ExploreCollectionsCard';
import './ExploreCollections.css';
import incredible from '../../../assets/images/not-found/incredible.webp'




function ExploreCollections({ cards }) {
   
    return (
        <div className='collections-explore'>
            {cards && cards.length > 0 ?
                <div className='collections-explore__cards'>
                    {cards.map((card, i) => {
                        if (card.items && card.items.length === 0) {
                            return <></>
                        } else return <CollectionCard card={card} key={`collections-explore__card-${i}`} />
                    })}
                </div>
                :
                <div className="activity__no-cards">
                    <img className='activity__no-cards-gif' src={incredible} alt='gomer'></img>
                    <p className='activity__no-cards-text'>Nothing was found</p>

                </div>
            }

        </div>
    );
}

export default ExploreCollections
    ;

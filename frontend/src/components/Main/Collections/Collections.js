import { Link } from 'react-router-dom';
import PreloaderOnPage from '../../PreloaderOnPage/PreloaderOnPage';
import CollectionCard from './CollectionCard/CollectionCard';
import './Collections.css';

// import cardAvatar from '../../../assets/images/test/collection-avatar.png'
// import { collectionCards } from '../../../assets/utilis';



function Collections({ mainPopularCollections }) {

    return (
        <section className='collections'>

            <div className='collections__heading'>
                <h2 className='collections__title'>Popular Collections</h2>
                <Link className='collections__link' to='/explore-collections/collectables'>Explore More</Link>
            </div>

            { mainPopularCollections ?
                mainPopularCollections.length > 0 ?
                    <div className='collections__cards'>
                        {mainPopularCollections.slice(0, 6).map((card, i) => (
                            <CollectionCard card={card} key={`collections__card-${i}`} />
                        ))}
                    </div>
                    : <></> :
                <div className='collections__cards-preloader'>
                    <PreloaderOnPage />
                </div>}
        </section>
    );
}

export default Collections;

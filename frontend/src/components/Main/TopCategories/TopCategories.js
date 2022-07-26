import './TopCategories.css';

import artIcon from '../../../assets/images/main/categories/art.png'
import collectablesIcon from '../../../assets/images/main/categories/collectables.png'
import gamesIcon from '../../../assets/images/main/categories/games.png'
import metaversesIcon from '../../../assets/images/main/categories/metaverses.png'
import musicIcon from '../../../assets/images/main/categories/music.png'
import photoIcon from '../../../assets/images/main/categories/photos.png'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PreloaderOnPage from '../../PreloaderOnPage/PreloaderOnPage';

// const cards = [
//     {
//         icon: artIcon,
//         gradient_class: 'top-categories__card-container-gradient_green',
//         title: 'Art',
//         collections: 1000,
//         volume: 15000000,
//     },
//     {
//         icon: collectablesIcon,
//         gradient_class: 'top-categories__card-container-gradient_blue',
//         title: 'Collectables',
//         collections: 10000,
//         volume: 15000000,
//     },
//     {
//         icon: gamesIcon,
//         gradient_class: 'top-categories__card-container-gradient_purple',
//         title: 'Games',
//         collections: 100000,
//         volume: 15000000,
//     },
//     {
//         icon: metaversesIcon,
//         gradient_class: 'top-categories__card-container-gradient_pink',
//         title: 'Metaverses',
//         collections: 1000,
//         volume: 15000000,
//     },
//     {
//         icon: musicIcon,
//         gradient_class: 'top-categories__card-container-gradient_gray',
//         title: 'Music',
//         collections: 1000,
//         volume: 15000000,
//         cooming_soon: true,
//     },
//     {
//         icon: musicIcon,
//         gradient_class: 'top-categories__card-container-gradient_gray',
//         title: 'Photography',
//         collections: 1000,
//         volume: 15000000,
//         cooming_soon: true,
//     },
// ]


function TopCategories({ mainCategories }) {

    const [cards, setCards] = useState([])

    useEffect(() => {
        if (mainCategories) {
            let array = [
                {
                    icon: artIcon,
                    gradient_class: 'top-categories__card-container-gradient_green',
                    title: 'Art',
                },
                {
                    icon: collectablesIcon,
                    gradient_class: 'top-categories__card-container-gradient_blue',
                    title: 'Collectables',
                },
                {
                    icon: gamesIcon,
                    gradient_class: 'top-categories__card-container-gradient_purple',
                    title: 'Games',
                },
                {
                    icon: metaversesIcon,
                    gradient_class: 'top-categories__card-container-gradient_pink',
                    title: 'Metaverses',
                },
                {
                    icon: musicIcon,
                    gradient_class: 'top-categories__card-container-gradient_gray',
                    title: 'Music',
                    cooming_soon: true,
                },
                {
                    icon: photoIcon,
                    gradient_class: 'top-categories__card-container-gradient_gray',
                    title: 'Photography',
                    cooming_soon: true,
                },
            ].map((item) => {
                if (item.title.toLowerCase() === 'art') {
                    return {
                        ...item,
                        items: mainCategories.art.items,
                        collections: mainCategories.art.collections,
                        volume: mainCategories.art.purchase_summary,
                        _id: mainCategories.art._id
                    }
                } else if (item.title.toLowerCase() === 'collectables') {
                    return {
                        ...item,
                        items: mainCategories.collectables.items,
                        collections: mainCategories.collectables.collections,
                        volume: mainCategories.collectables.purchase_summary,
                        _id: mainCategories.collectables._id
                    }
                } else if (item.title.toLowerCase() === 'games') {
                    return {
                        ...item,
                        items: mainCategories.games.items,
                        collections: mainCategories.games.collections,
                        volume: mainCategories.games.purchase_summary,
                        _id: mainCategories.games._id
                    }
                }
                else if (item.title.toLowerCase() === 'metaverses') {
                    return {
                        ...item,
                        items: mainCategories.metaverses.items,
                        collections: mainCategories.metaverses.collections,
                        volume: mainCategories.metaverses.purchase_summary,
                        _id: mainCategories.metaverses._id
                    }
                } else {
                    return item
                }
            })
            console.log(array)
            setCards(array)

        }
    }, [mainCategories])

    return (
        <section className='top-categories'>
            <h2 className='top-categories__title'>Top Categories</h2>
            {mainCategories ?
                <div className='top-categories__cards'>
                    {cards && cards.length > 0 ? cards.sort((a, b) => {
                        if (a.volume < b.volume) return 1;
                        else if (b.volume < a.volume) return -1;
                        else return 0;
                    }).map((item, i) => {
                        if (item.cooming_soon) {
                            return (
                                <div className='top-categories__card' key={`top-categories__card${i}`}>
                                    <img className='top-categories__card-icon' src={item.icon} alt={item.title} />
                                    <div className='top-categories__card-container'>
                                        <div className={`top-categories__card-container-gradient ${item.gradient_class}`}></div>
                                        <p className={`top-categories__card-title ${item.cooming_soon ? 'top-categories__card-title_cooming' : ''}`}>{item.title}</p>
                                        {item.cooming_soon ?
                                            <p className='top-categories__card-cooming'>Cooming soon</p>
                                            :
                                            <>
                                                <p className='top-categories__card-collections'>Items: {Number(item.items) > 99999 ? '99 999+' : Number(item.items).toFixed(0).toLocaleString('us')}</p>
                                                <p className='top-categories__card-volume'>Collections: {Number(item.collections) > 99999 ? '99 999+' : Number(item.collections).toFixed(0).toLocaleString('us')}</p>
                                                <p className='top-categories__card-volume'>Volume: ${parseFloat(Number(item.volume).toFixed(0)).toLocaleString('us')}</p>
                                            </>}

                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <Link to={`/explore-collections/${item.title.toLowerCase()}`} className='top-categories__card' key={`top-categories__card${i}`}>
                                    <img className='top-categories__card-icon' src={item.icon} alt={item.title} />
                                    <div className='top-categories__card-container'>
                                        <div className={`top-categories__card-container-gradient ${item.gradient_class}`}></div>
                                        <p className={`top-categories__card-title ${item.cooming_soon ? 'top-categories__card-title_cooming' : ''}`}>{item.title}</p>
                                        {item.cooming_soon ?
                                            <p className='top-categories__card-cooming'>Cooming soon</p>
                                            :
                                            <>
                                                <p className='top-categories__card-collections'>Collections: {Number(item.collections) > 99999 ? '99 999+' : Number(item.collections).toFixed(0).toLocaleString('us')}</p>
                                                <p className='top-categories__card-volume'>Items: {Number(item.items) > 99999 ? '99 999+' : Number(item.items).toFixed(0).toLocaleString('us')}</p>
                                                <p className='top-categories__card-volume'>Volume: ${parseFloat(Number(item.volume).toFixed(0)).toLocaleString('us')}</p>
                                            </>}

                                    </div>
                                </Link>
                            )
                        }



                    }) : <></>}

                </div>
                :
                <div className='top-categories__cards-preloader'>
                    <PreloaderOnPage />
                </div>}

        </section>
    );
}

export default TopCategories;

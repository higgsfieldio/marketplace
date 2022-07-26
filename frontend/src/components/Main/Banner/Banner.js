import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable'
import './Banner.css';
// import referral from '../../../assets/images/refferal/banner.png'


const banners = [
    // {
    //     name: 'Referral',
    //     description: 'Earn up to 50% from our commission',
    //     collection_id: '',
    //     type: 'referral',
    //     image: referral,
    // },
    {
        name: 'NEAR Tiger Academy',
        description: 'A high-class collection of 2000 algorithmically generated NFTs.',
        collection_id: 'near-tiger-academy',
        image: 'https://i.ibb.co/BGnwV3T/image.png',
    },

    {
        name: 'Antisocial Ape Club',
        description: 'A collection of 3333 unique, randomly generated pixel art NFTs stored on the NEAR blockchain.',
        collection_id: '625e4cc267d6a1a572e843be',
        image: 'https://i.ibb.co/Mk93ZsD/image.png',
    },
    {
        name: 'NPunks collection',
        description: 'Pioneer of the NFT and most popular collection on Near. 10,000 unique punks. The collection is on its way to DeFi, GameFi, and Metaverses!',
        collection_id: '625e34cb67d6a1a572e7d9e7',
        image: 'https://i.ibb.co/8mWr21d/image.png',
    },
]

function Banner() {
    const timer = useRef(null)

    const [index, setIndex] = useState(0)

    // useEffect(()=>{
    //     setTimeout(() => {
    //         setChanged(true)
    //         if (index < 3){
    //             setIndex(index + 1)
    //             setChanged(false)
    //         } else {
    //             setIndex(0)
    //             setChanged(false)
    //         }

    //     }, 5000);


    // },[])

    useEffect(() => {
        timer.current = setTimeout(() => {
            if (index < banners.length - 1) {
                setIndex(index + 1)

            } else {
                setIndex(0)

            }
        }, 6500);


    }, [index])

    // useEffect(() => {
    //     console.log(index)

    // }, [index])

    function handleSliderClick(i) {
        clearTimeout(timer.current)
        setIndex(i)
    }

    const swipeHandlers = useSwipeable({
        // onSwiped: (eventData) => console.log("User Swiped!", eventData),

        onSwipedLeft: (eventData) => {
            if (eventData.absX > 150) {
                // console.log('left', eventData)
                clearTimeout(timer.current)
                if (index < banners.length - 1) {
                    setIndex(index + 1)

                } else {
                    setIndex(0)

                }
            }
        },
        onSwipedRight: (eventData) => {
            if (eventData.absX > 150) {
                // console.log('right', eventData)
                clearTimeout(timer.current)
                if (index === 0) {
                    setIndex(banners.length - 1)

                } else {
                    setIndex(index - 1)

                }
            }

        },
        swipeDuration: 500,
        preventScrollOnSwipe: true,
    });

    return (
        <section className='main-banner'>
            <div className='main-banner__cache'>
                {banners.map((item, i) => (
                    <img className='main-banner__image' key={`main-banner__cache${i}`} src={item.image} alt='' />
                ))}
            </div>
            <div className='main-banner__texts'>
                <h4 className='main-banner__name'>{banners[index].name}</h4>
                <p className='main-banner__description'>{banners[index].description}</p>
                <div className='main-banner__btn-and-slides'>
                    {banners[index].type === 'referral' ?
                        <Link className='main-banner__link' to={`/earn/referral/dashboard`}>
                            <svg className='main-banner__link-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='main-banner__link-icon-fill' d="M9.97375 11.1336L10.8285 9.77179C12.7354 6.73343 12.4901 4.15617 12.304 3.2113C12.2843 3.10882 12.2163 3.02029 12.1192 2.9678C12.0216 2.91546 11.9044 2.90525 11.7974 2.9395C10.8059 3.2571 8.22835 4.33604 6.31965 7.37715L5.4647 8.73934L5.08494 8.76353C4.35267 8.81074 3.69324 9.18968 3.32597 9.77486L2.30579 11.4003C2.24537 11.4966 2.24726 11.6163 2.31073 11.7112C2.37479 11.8059 2.49019 11.8603 2.61099 11.8527L3.84068 11.7803C4.18582 11.7602 4.52971 11.8339 4.8294 11.993L5.48241 12.3398L4.98802 13.1275C4.89707 13.2725 4.95097 13.4575 5.10813 13.541L5.63099 13.8187C5.78815 13.9021 5.9893 13.8525 6.08025 13.7076L6.57464 12.9199L7.22728 13.2665C7.52697 13.4257 7.76902 13.6624 7.92245 13.9486L8.46861 14.9637C8.52184 15.0637 8.63074 15.1284 8.75197 15.1321C8.87304 15.1352 8.98668 15.0769 9.04709 14.9806L10.0673 13.3552C10.4341 12.7707 10.4608 12.0557 10.1399 11.4482L9.97375 11.1336ZM9.05869 7.80273C8.51632 7.51468 8.32999 6.87609 8.64313 6.37718C8.95648 5.87791 9.65062 5.7074 10.193 5.99545C10.735 6.2833 10.9215 6.92155 10.6082 7.42081C10.295 7.91972 9.60068 8.09058 9.05869 7.80273Z" fill="white" />
                            </svg>
                            <p className='main-banner__link-text'>Explore Referral</p>
                        </Link>
                        :
                        <Link className='main-banner__link' to={`/collections/${banners[index].collection_id}/items`}>
                            <svg className='main-banner__link-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className='main-banner__link-icon-fill' d="M9.97375 11.1336L10.8285 9.77179C12.7354 6.73343 12.4901 4.15617 12.304 3.2113C12.2843 3.10882 12.2163 3.02029 12.1192 2.9678C12.0216 2.91546 11.9044 2.90525 11.7974 2.9395C10.8059 3.2571 8.22835 4.33604 6.31965 7.37715L5.4647 8.73934L5.08494 8.76353C4.35267 8.81074 3.69324 9.18968 3.32597 9.77486L2.30579 11.4003C2.24537 11.4966 2.24726 11.6163 2.31073 11.7112C2.37479 11.8059 2.49019 11.8603 2.61099 11.8527L3.84068 11.7803C4.18582 11.7602 4.52971 11.8339 4.8294 11.993L5.48241 12.3398L4.98802 13.1275C4.89707 13.2725 4.95097 13.4575 5.10813 13.541L5.63099 13.8187C5.78815 13.9021 5.9893 13.8525 6.08025 13.7076L6.57464 12.9199L7.22728 13.2665C7.52697 13.4257 7.76902 13.6624 7.92245 13.9486L8.46861 14.9637C8.52184 15.0637 8.63074 15.1284 8.75197 15.1321C8.87304 15.1352 8.98668 15.0769 9.04709 14.9806L10.0673 13.3552C10.4341 12.7707 10.4608 12.0557 10.1399 11.4482L9.97375 11.1336ZM9.05869 7.80273C8.51632 7.51468 8.32999 6.87609 8.64313 6.37718C8.95648 5.87791 9.65062 5.7074 10.193 5.99545C10.735 6.2833 10.9215 6.92155 10.6082 7.42081C10.295 7.91972 9.60068 8.09058 9.05869 7.80273Z" fill="white" />
                            </svg>
                            <p className='main-banner__link-text'>Explore Collection</p>
                        </Link>
                    }

                    {banners.length > 1 ?
                        <div className='main-banner__slides' style={{ gridTemplateColumns: `${banners.map(() => { return '1fr' }).join(' ')}` }}>
                            {banners.map((item, i) => (
                                <div className='main-banner__slide' key={`main-banner__slide${i}`} onClick={() => {
                                    if (index !== i) {
                                        handleSliderClick(i)
                                    }
                                }}>
                                    <div className={`main-banner__slide-bg `}>

                                    </div>
                                    <div className={`main-banner__slide-line ${index === i ? 'main-banner__slide-line_active' : ''}`}></div>
                                </div>
                            ))}
                        </div>
                        : <></>}

                </div>

            </div>
            <Link className='main-banner__image-link' to={`/collections/${banners[index].collection_id}/items`} {...swipeHandlers}>
                <img className='main-banner__image' src={banners[index].image} alt='' key={`main-banner__image${index}`} />
            </Link>
            {/* <img className='main-banner__image' src={banners[index].image} alt='' /> */}

        </section>
    );
}

export default Banner;

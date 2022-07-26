import './HowToBuy.css';

import card1 from '../../../assets/images/main/how-to-buy/card-1.svg'
import card2 from '../../../assets/images/main/how-to-buy/card-2.svg'
import card3 from '../../../assets/images/main/how-to-buy/card-3.svg'

import card1Trip from '../../../assets/images/main/how-to-buy/card-1-trip.svg'
import card2Trip from '../../../assets/images/main/how-to-buy/card-2-trip.svg'
import card3Trip from '../../../assets/images/main/how-to-buy/card-3-trip.svg'


const cards = [
    {
        title: 'Set up your wallet',
        text: 'A wallet that is functional for NFT purchasing. The Official NEAR Wallet is the best, most secure, and the only option available for these purposes.',
        img: card1,
        img_trip: card1Trip,
        links: [
            {
                name: 'Near.org',
                // link: 'https://wallet.near.org/',
                link: 'https://wallet.near.org/create',
            },
            // {
            //     name: 'Trust wallet',
            //     link: '/',
            // }
        ]
    },
    {
        title: 'Buy NEAR to activate your wallet',
        text: 'Before you can use your wallet you need to top-up your balance with NEAR, which you can buy following the links below.',
        img: card2,
        img_trip: card2Trip,
        links: [
            {
                name: 'Binance',
                link: 'https://accounts.binance.me/en/register?ref=100608686',
            },
            {
                name: 'Moonpay',
                link: 'https://www.moonpay.com',
            }
        ]
    },
    {
        title: 'Connect wallet',
        text: 'Click “Log in” and explore the platform',
        img: card3,
        img_trip: card3Trip,
        links: [
            {
                name: 'Log in',
                link: '/',

            },
        ]
    },
]


function HowToBuy(props) {


    return (
        <section className='how-to-buy'>
            <h2 className='how-to-buy__title'>How To Buy NFTs</h2>
            <div className='how-to-buy__cards'>
                {
                    cards.map((item, i) => (
                        <div className='how-to-buy__card' key={`how-to-buy__card${i}`}>
                            <div className='how-to-buy__card-container'>
                                <img className='how-to-buy__card-icon' src={props.theme === 'neon' ? item.img_trip : item.img} alt='icon' />
                                <h3 className='how-to-buy__card-title'>{item.title}</h3>
                                {item.title === 'Connect wallet' ? 
                                <>
                                {props.currentUser ? 
                                 <p className='how-to-buy__card-text'>You have already connected your wallet</p>
                                : 
                                <p className='how-to-buy__card-text'>{item.text}</p>
                                }
                                </>
                                : 
                                 <p className='how-to-buy__card-text'>{item.text}</p>
                                }
                               
                                {item.title === 'Connect wallet' ?
                                    <>
                                        {props.currentUser ?
                                            <>

                                            </>
                                            :
                                            <div className='how-to-buy__card-links'>
                                                {item.links.map((link, link_i) => (
                                                    <p className='how-to-buy__card-link' key={`how-to-buy__card-link${link_i}`} onClick={()=>{props.login()}}>{link.name}</p>
                                                ))}
                                            </div>
                                        }

                                    </>

                                    :
                                    <div className='how-to-buy__card-links'>
                                        {item.links.map((link, link_i) => (
                                            <a className='how-to-buy__card-link' href={link.link} key={`how-to-buy__card-link${link_i}`}>{link.name}</a>
                                        ))}
                                    </div>}

                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
}

export default HowToBuy;

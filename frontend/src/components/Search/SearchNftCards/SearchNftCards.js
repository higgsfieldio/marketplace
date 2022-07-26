
import NftCard from '../NftCard/NftCard'
import './SearchNftCards.css'

import gomer from '../../../assets/images/gif/gomer.gif'
import { Link } from 'react-router-dom'



function SearchNftCards({ searchValue, cards, usdExchangeRate, isCurrentUser, setRefreshPopupOpened, user, toggleLike, loggedIn, currentUser, setLoginPopupOpened, setExplictAccept, isExplictAccept,  }) {


    // function handleScroll(e) {
    //     const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    //     console.log(e.target.scrollHeight)
    //     if (bottom) { 
    //         console.log('bottom')
    //      }
    //   }


    // const listInnerRef = useRef();

    // const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    // function handleResize() {
    //     setScreenWidth(window.innerWidth)
    //     window.removeEventListener('resize', handleResize);
    // }
    // useEffect(() => {
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // });

    // const [prevScrollPosition, setPrevScrollPosition] = useState(-1);
    // const [scrollPosition, setScrollPosition] = useState(0);
    // const [scrollTraking, setScrollTraking] = useState(true);
    // const handleScroll = () => {
    //     const position = window.pageYOffset;

    //     setScrollPosition(position);
    // };

    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll, { passive: true });

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);
    // const [pageValue, setPageValue] = useState(0);
    // useEffect(() => {
    //     // console.log(scrollPosition, prevScrollPosition)

    //     if (listInnerRef.current && scrollTraking && scrollPosition > prevScrollPosition) {
    //         // console.log(listInnerRef.current)
    //         setPrevScrollPosition(scrollPosition)
    //         const { scrollHeight } = listInnerRef.current;
    //         if (scrollHeight < scrollPosition) {
    //             setScrollTraking(false)
    //             setPageValue(pageValue + 1)
    //             setTimeout(() => {
    //                 setScrollTraking(true)
    //             }, 500);
    //         }
    //     }
    // }, [scrollPosition, scrollTraking, prevScrollPosition, pageValue]);

    // useEffect(() => {
    //     console.log(pageValue)

    // }, [pageValue]);


    return (
        <>
            {cards && cards.length > 0 ?
                <div className="nft-cards">

                    {cards && cards.length > 0 ?
                        <div className="nft-cards__cards"
                            >
                            {cards.map((card, i) => (
                                <NftCard usdExchangeRate={usdExchangeRate} setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} setLoginPopupOpened={setLoginPopupOpened} item={card} key={`nft-card${i}`} user={user} toggleLike={toggleLike} loggedIn={loggedIn} currentUser={currentUser} />
                            ))}
                        </div>
                        :
                        <div className="nft-cards__no-cards">
                            <img className='nft-cards__no-cards-gif' src={gomer} alt='gomer'></img>
                            <p className='nft-cards__no-cards-title'>Nothing was found for these filters</p>


                        </div>
                    }
                </div>
                :
                <div className="nft-cards__no-cards">
                    {searchValue ? <img className='nft-cards__no-cards-gif' src={gomer} alt='gomer'></img> : <></>}
                    <p className='nft-cards__no-cards-title'>{searchValue ? 'Oops' : 'Try to find something'}</p>
                    {searchValue ? <p className='nft-cards__no-cards-text'>Nothing was found</p> : <></>}
                    <div className='nft-cards__no-cards-btns'>
                        <Link className='nft-cards__no-cards-link' to='/explore-collections/collectables'>
                            <p className='nft-cards__no-cards-link-text'>Explore collections</p>
                        </Link>
                    </div>
                </div>
            }

        </>

    )
};

export default SearchNftCards
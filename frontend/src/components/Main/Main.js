import './Main.css';

import bgimage from '../../assets/images/main/bg.png'
import bgTripimage from '../../assets/images/main/bg-trip.png'

import Collections from './Collections/Collections';
import HowToBuy from './HowToBuy/HowToBuy';
import TopCategories from './TopCategories/TopCategories';
import Releases from './Releases/Releases';
import HowToList from './HowToList/HowToList';
import { useEffect, useState } from 'react';
import pythonApi from '../../assets/pythonApi';
import Stats from './Stats/Stats';
import Banner from './Banner/Banner';
import { MetaTags } from 'react-meta-tags';

import site_logo from '../../assets/images/main/site-logo.png'

function Main(props) {
    const [mainPopularCollections, setMainPopularCollections] = useState(undefined);
    const [mainCategories, setMainCategories] = useState(undefined);
    const [stats, setStats] = useState(null)
    const [releases, setReleases] = useState([]);

    useEffect(() => {

        pythonApi.getCalendarForMain()
            .then((res) => {
                setReleases(res.upcoming)
                // console.log(res.upcoming)
            })
            .catch((err) => {
                console.log(err)
            })

        pythonApi.getStatsForMain()
            .then((res) => {
                setStats(res)
                // setReleases(res.upcoming)
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
        pythonApi.getInfoForMain()
            .then((res) => {
                console.log(res)
                setMainPopularCollections(res.collections)
                setMainCategories(res.categories)
                // console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className='main'>
            <MetaTags>
                <title>{'Higgs Field'}</title>
                <meta property="og:site_name" content={`Higgs Field`} />
                <meta property="og:title" content={'Higgs Field'} />
                <meta property="og:description" content={'Higgs Field is the first of its kind Marketplace for Collections on NEAR Protocol. Higgs Field gives the opportunity to trade, collect, and analyze NFTs all in one place. Enjoy your experience as an NFT Collector with Higgs Field.'} />
                <meta property="twitter:title" content={'Higgs Field'} />
                <meta property="twitter:description" content={'Higgs Field is the first of its kind Marketplace for Collections on NEAR Protocol. Higgs Field gives the opportunity to trade, collect, and analyze NFTs all in one place. Enjoy your experience as an NFT Collector with Higgs Field.'} />
                <meta property='og:image' content={site_logo} />
                <meta property='twitter:image' content={site_logo} />
                <meta property='vk:image' content={site_logo} />
                <meta property="vk:title" content={'Higgs Field'} />
                <meta property="vk:description" content={'Higgs Field is the first of its kind Marketplace for Collections on NEAR Protocol. Higgs Field gives the opportunity to trade, collect, and analyze NFTs all in one place. Enjoy your experience as an NFT Collector with Higgs Field.'} />

            </MetaTags>
            <img className='main__bg-image' src={bgimage} alt='' />
            {props.theme === 'neon' ?
                <img className='main__bg-trip-image' src={bgTripimage} alt='' />
                : <></>}

            <div className='main__container'>
                <Banner />
                <Stats stats={stats} />
                <Collections mainPopularCollections={mainPopularCollections} />

                <HowToBuy currentUser={props.currentUser} theme={props.theme} login={props.login} />
                <TopCategories mainCategories={mainCategories} />
                {releases && releases.length > 0 ? <Releases releases={releases} usdExchangeRate={props.usdExchangeRate} /> : <></>}
                <HowToList login={props.login} currentUser={props.currentUser} />
            </div>
        </div>
    );
}

export default Main;

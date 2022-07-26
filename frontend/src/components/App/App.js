import { useTheme } from '../../assets/hooks/use-theme';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import { useLocation } from "react-router";
import { usePageVisibility } from 'react-page-visibility';

import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './App.css';
import Main from '../Main/Main';
import Profile from '../Profile/Profile';

import { API_VERSION, users } from '../../assets/utilis';
import coingecoApi from '../../assets/coingecoApi';
import EditProfile from '../EditProfile/EditProfile';
import CreateItem from '../CreateItem/CreateItem';
import CreateCollection from '../CreateCollection/CreateCollection';
import ItemPage from '../ItemPage/ItemPage';
import ProfilePopup from '../Header/ProfilePopup/ProfilePopup';
import pythonApi from '../../assets/pythonApi';
import rpcNearApi from '../../assets/rpcNearApi';
import near from '../../assets/near';
import Preloader from '../Preloader/Preloader';
import RefreshPopup from '../RefreshPopup/RefreshPopup';
import ListPopup from '../ListPopup/ListPopup';
import CollectionPage from '../CollectionPage/CollectionPage';
import EditCollection from '../EditCollection/EditCollection';
import LoginPopup from '../LoginPopup/LoginPopup';
import CollectionAddItems from '../CollectionAddItems/CollectionAddItems';
import NotifyPopup from '../Header/NotifyPupup/NotifyPopup';

import notify_sound from '../../assets/sounds/notify_sound.mp3'
import notify_sound_standart from '../../assets/sounds/notify_sound_standart.mp3'

import MenuPopup from '../MenuPopup/MenuPopup';
import Search from '../Search/Search';
import StatisticsPage from '../StatisticsPage/StatisticsPage';
import CalendarPage from '../CalendarPage/CalendarPage';
import ExploreCollectionsPage from '../ExploreCollectionsPage/ExploreCollectionsPage';
import ExploreItemsPage from '../ExploreItemsPage/ExploreItemsPage';
import NotFound from '../NotFound/NotFound';
import LoginPage from '../LoginPage/LoginPage';
import TransferPopup from '../TransferPopup/TransferPopup';


import AboutTeam from '../Footer/AboutTeam/AboutTeam';
import HowToPage from '../Footer/HowToPage/HowToPage';
import Faq from '../Footer/Faq/Faq';
import WarningPopup from '../WarningPopup/WarningPopup';
import WarningBetaPopup from '../WarningBetaPopup/WarningBetaPopup';
import Earn from '../Earn/Earn';
import Refferal from '../Earn/Refferal/Refferal';
import RefferalPopup from '../RefferalPopup/RefferalPopup';
import RefLinkAdder from '../Earn/Refferal/RefLinkAdder/RefLinkAdder';
import LoginFromRefPopup from '../LoginFromRefPopup/LoginFromRefPopup';


const MARKETPLACE_CONTRACT_ID = 'higgsfield.near'
const NFT_CREATE_CONTRACT_ID = 'higgs_field_nft_contract.near' //higgs_field_nft_contract.near

function App() {
  const isVisible = usePageVisibility()
  const ws = useRef(null);
  const [refreshPopupOpened, setRefreshPopupOpened] = useState(false)
  const [warningPopupOpened, setWarningPopupOpened] = useState(false)
  const [warningBetaPopupOpened, setWarningBetaPopupOpened] = useState(false)
  const [refferalPopupOpened, setRefferalPopupOpened] = useState(false)
  const [loginPopupOpened, setLoginPopupOpened] = useState(false)
  const [loginFromRefPopupOpened, setLoginFromRefPopupOpened] = useState(false)
  const [listPopupOpened, setListPopupOpened] = useState(false)
  const [profilePopupOpened, setProfilePopupOpened] = useState(false)
  const [notifyPopupOpened, setNotifyPopupOpened] = useState(false)
  const [transferPopupOpened, setTransferPopupOpened] = useState(false)
  const [selectedTokenForTransfer, setSelectedTokenForTransfer] = useState(undefined);

  const [isExplictAccept, setExplictAccept] = useState(false)

  const [currentUser, setCurrentUser] = useState(undefined);

  const [isMenuPopupOpen, setMenuPopupOpen] = useState(false)
  // localStorage.setItem('app-theme', 'light')
  const [loggedIn, setLoggedIn] = useState(undefined);


  // const [pageOnError, setPageOnError] = useState(false);

  const [usdExchangeRate, setUsdExchangeRate] = useState(10)
  const [nearAccountBalance, setNearAccountBalance] = useState(0)

  const location = useLocation();

  function clearLocalStorage() {
    let appTheme = localStorage.getItem('app-theme')
    let refCode = localStorage.getItem('ref-code')
    localStorage.clear();
    if (appTheme) {
      localStorage.setItem('app-theme', appTheme)
    }
    if (refCode) {
      localStorage.setItem('ref-code', refCode)
    }
  }

  useEffect(() => {
    let explictAccept = localStorage.getItem('explictAccept')
    if (explictAccept && explictAccept === 'yes') {
      setExplictAccept(true)
    }

  }, [])
  async function connect() {
    near.checkPubKeyAvailability()
      .then((res) => {
        if (res) {
          near.authToken()
            .then((authRes) => {
              if (authRes) {
                if (!ws.current) {
                  ws.current = new WebSocket(`wss://higgsfield.io/api/${API_VERSION}/ws/notifications/${authRes}`);
                  ws.current.onopen = () => console.log("ws opened");
                  // ws.current.onclose = () => console.log("ws closed");
                  ws.current.onclose = function (e) {
                    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
                    ws.current = null
                    setTimeout(function () {
                      connect();
                    }, 1000);
                  };

                  ws.current.onerror = function (err) {
                    console.error('Socket encountered error: ', err.message, 'Closing socket');
                    ws.current.close();
                  };
                  ws.current.onmessage = e => {
                    const res = JSON.parse(e.data)
                    console.log(res)
                    setCurrentUser(exampleState => ({
                      ...exampleState, notifications: [res, ...exampleState.notifications], notifications_not_viewed: exampleState.notifications_not_viewed + 1
                    }))
                    if (res.type === 'resolve_purchase') {
                      let audio = new Audio(notify_sound)
                      audio.play()
                        .catch((err) => {
                          console.log(err)
                        })
                    } else if (res.type !== 'new_comment') {
                      let audio = new Audio(notify_sound_standart)
                      audio.play()
                        .catch((err) => {
                          console.log(err)
                        })
                    }

                  }
                }
              }
            })

        }
      })
      .catch(err => console.log(err))


  }



  useEffect(() => {
    setProfilePopupOpened(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);




  function handleCurrentUserReload() {
    if (currentUser) {
      let accountId = near.accountId

      if (accountId) {
        near.checkPubKeyAvailability()
          .then((res) => {
            // console.log(res)
            if (res) {
              pythonApi.getLogedProfile()
                .then((res) => {
                  localStorage.setItem('nowal', 'yes')
                  // console.log(res)
                  setLoggedIn(true)
                  console.log("CURRENT")
                  console.log(res)
                  setCurrentUser(res)

                  rpcNearApi.viewAccount({ accountId: near.accountId })
                    .then((res) => {


                      let amount = formatNearAmount(res.result.amount)
                      console.log(amount.split(',').join(''))
                      setNearAccountBalance(Number(amount.split(',').join('')).toFixed(4))


                    })
                    .catch((err) => {
                      console.log(err)
                    })
                })
                .catch((err) => {
                  setLoggedIn(false)
                  console.log(err)
                })
            }
            else {
              setCurrentUser(undefined)
              setLoggedIn(false)
              clearLocalStorage()
            }
          }).catch((err) => {
            setCurrentUser(undefined)
            setLoggedIn(false)
            console.log(err)
          })


      }
    }

  }

  useEffect(() => {
    console.log(isVisible)
    if (isVisible) {
      near.checkPubKeyAvailability()
        .then((res) => {
          if (!ws && res) {
            connect()
          }
          handleCurrentUserReload()
        })
        .catch(() => {
          handleCurrentUserReload()
        })

    }
    else {
      if (ws && ws.current) {
        ws.current.close()
      }

    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    connect()


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    coingecoApi.getUsdExchangeRate()
      .then((res) => {
        setUsdExchangeRate(res.near.usd)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // useEffect(() => {
  //   console.log(loggedIn)
  // }, [loggedIn])

  useEffect(() => {
    let wallet = localStorage.getItem('undefined_wallet_auth_key')
    let nowal = localStorage.getItem('nowal')

    if (wallet && (!nowal || nowal === 'no')) {
      return
    } else {
      let accountId = near.accountId

      if (accountId) {
        near.checkPubKeyAvailability()
          .then((res) => {
            console.log(res)
            if (res) {
              pythonApi.getLogedProfile()
                .then((res) => {
                  localStorage.setItem('nowal', 'yes')
                  // console.log(res)
                  setLoggedIn(true)
                  console.log("CURRENT")
                  console.log(res)
                  setCurrentUser(res)

                  rpcNearApi.viewAccount({ accountId: near.accountId })
                    .then((res) => {


                      let amount = formatNearAmount(res.result.amount)
                      setNearAccountBalance(Number(amount.split(',').join('')).toFixed(4))


                    })
                    .catch((err) => {
                      console.log(err)
                    })
                })
                .catch((err) => {
                  setLoggedIn(false)
                  clearLocalStorage()
                  setCurrentUser(undefined)
                  console.log(err)
                })
            }

            else {
              clearLocalStorage()
              setCurrentUser(undefined)
              setLoggedIn(false)
            }
          }).catch((err) => {
            setLoggedIn(false)
            setCurrentUser(undefined)
            clearLocalStorage()
            console.log(err)
          })


      }
    }





  }, [])

  useEffect(() => {
    let wallet = localStorage.getItem('undefined_wallet_auth_key')
    let nowal = localStorage.getItem('nowal')

    // console.log(nowal)
    if (wallet && (!nowal || nowal === 'no')) {
      setTimeout(() => {
        pythonApi.getLogedProfile()
          .then((res) => {
            localStorage.setItem('nowal', 'yes')
            // console.log(res)
            setLoggedIn(true)
            console.log("CURRENT")
            console.log(res)
            setCurrentUser(res)
            connect();
            rpcNearApi.viewAccount({ accountId: near.accountId })
              .then((res) => {


                let amount = formatNearAmount(res.result.amount)
                setNearAccountBalance(Number(amount.split(',').join('')).toFixed(4))


              })
              .catch((err) => {
                console.log(err)
              })
          })
          .catch(() => {
            pythonApi.createProfile({
              user_wallet: near.accountId
            })
              .then((res) => {
                console.log(wallet)
                console.log(res.user)
                setCurrentUser(res.user)
                console.log("CURRENT")
                console.log(res.user)
                setLoggedIn(true)
                pythonApi.refreshMetadata()
                  .then((res) => {
                    console.log("CURRENT")
                    console.log(res)
                    setCurrentUser(res)
                    connect();
                  })
                  .catch((err) => {
                    console.log(err)
                  })
                localStorage.setItem('nowal', 'yes')
              })
              .catch((err) => {
                setCurrentUser(undefined)
                setLoggedIn(false)
                clearLocalStorage()
                console.log(err)
              })

          })
      }, 4000);


    }
    else {
      if (nowal && nowal === 'yes') {
        return
      } else {
        setCurrentUser(undefined)
        setLoggedIn(false)
      }
      // console.log('nowallet')

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])





  // useEffect(() => {
  //   let wallet = localStorage.getItem('undefined_wallet_auth_key')
  //   let nowal = localStorage.getItem('nowal')

  //   if (wallet && (!nowal || nowal === 'no')) {
  //     return
  //   } else {
  //     let accountId = near.accountId

  //     if (accountId) {
  //       near.checkPubKeyAvailability()
  //         .then((res) => {
  //           console.log(res)
  //           if (res) {
  //             pythonApi.getLogedProfile()
  //               .then((res) => {
  //                 localStorage.setItem('nowal', 'yes')
  //                 // console.log(res)
  //                 setLoggedIn(true)
  //                 console.log("CURRENT")
  //                 console.log(res)
  //                 setCurrentUser(res)

  //                 rpcNearApi.viewAccount({ accountId: near.accountId })
  //                   .then((res) => {


  //                     let amount = formatNearAmount(res.result.amount)
  //                     setNearAccountBalance(Number(amount.split(',').join('')).toFixed(4))


  //                   })
  //                   .catch((err) => {
  //                     console.log(err)
  //                   })
  //               })
  //               .catch((err) => {
  //                 setLoggedIn(false)
  //                 console.log(err)
  //               })
  //           }

  //           else {
  //             clearLocalStorage()
  //             setCurrentUser(undefined)
  //             setLoggedIn(false)
  //           }
  //         }).catch((err) => {
  //           setLoggedIn(false)
  //           console.log(err)
  //         })


  //     }
  //   }





  // }, [])

  // useEffect(() => {
  //   let wallet = localStorage.getItem('undefined_wallet_auth_key')
  //   let nowal = localStorage.getItem('nowal')

  //   // console.log(nowal)
  //   if (wallet && (!nowal || nowal === 'no')) {
  //     setTimeout(() => {
  //       pythonApi.getLogedProfile()
  //         .then((res) => {
  //           localStorage.setItem('nowal', 'yes')
  //           // console.log(res)
  //           setLoggedIn(true)
  //           console.log("CURRENT")
  //           console.log(res)
  //           setCurrentUser(res)
  //           connect();
  //           rpcNearApi.viewAccount({ accountId: near.accountId })
  //             .then((res) => {


  //               let amount = formatNearAmount(res.result.amount)
  //               setNearAccountBalance(Number(amount.split(',').join('')).toFixed(4))


  //             })
  //             .catch((err) => {
  //               console.log(err)
  //             })
  //         })
  //         .catch(() => {
  //           pythonApi.createProfile({
  //             user_wallet: near.accountId
  //           })
  //             .then((res) => {
  //               console.log(wallet)
  //               console.log(res.user)
  //               setCurrentUser(res.user)
  //               console.log("CURRENT")
  //               console.log(res.user)
  //               setLoggedIn(true)
  //               pythonApi.refreshMetadata()
  //                 .then((res) => {
  //                   console.log("CURRENT")
  //                   console.log(res)
  //                   setCurrentUser(res)
  //                   connect();
  //                 })
  //                 .catch((err) => {
  //                   console.log(err)
  //                 })
  //               localStorage.setItem('nowal', 'yes')
  //             })
  //             .catch((err) => {
  //               setCurrentUser(undefined)
  //               setLoggedIn(false)
  //               clearLocalStorage()
  //               console.log(err)
  //             })

  //         })
  //     }, 4000);


  //   }
  //   else {
  //     if (nowal && nowal === 'yes') {
  //       return
  //     } else {
  //       setCurrentUser(undefined)
  //       setLoggedIn(false)
  //     }
  //     // console.log('nowallet')

  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])




  const { theme, setTheme } = useTheme()

  function login() {
    console.log('LOGIN')
    near.login()

  }
  function logout() {
    near.logout()
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key !== 'app-theme' && key !== 'ref-code') {
        localStorage.removeItem(key)
      }
    }
    // clearLocalStorage()
    localStorage.setItem('nowal', 'no')
    setLoggedIn(false)
    setCurrentUser(undefined)
  }

  // const[isLikeClick, setLikeClicked] = useState(false)

  // function toggleLike({ token_id }) {
  //   // console.log(token_id)

  //   pythonApi.toggleLike({ tokenId: token_id })
  //     .then(() => {
  //       pythonApi.getLogedProfile()
  //         .then((res) => {
  //           setCurrentUser(res)
  //           console.log(res)
  //         }
  //         )
  //         .catch((err) => {
  //           console.log(err)
  //         })

  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }

  // function handleRefreshMeta() {

  // }

  const [listColbackURL, setListColbackURL] = useState('')
  const [tokenListValue, setTokenListValue] = useState(undefined)

  const onUpdateListing = async ({ price, token, colbackURL }) => {

    console.log(colbackURL)
    if (!near.accountId) {
      // console.log('no')
      return

    }
    // trackUpdateListingToken(data.token_id)

    try {
      const txs = []

      if (true) {
        txs.push({
          receiverId: MARKETPLACE_CONTRACT_ID,
          functionCalls: [
            {
              methodName: 'storage_deposit',
              contractId: MARKETPLACE_CONTRACT_ID,
              args: { receiver_id: near.accountId },
              attachedDeposit: '8590000000000000000000',
              gas: '300000000000000',
            },
          ],
        })
      }


      const params = {
        token_id: token.token_contract_id,
        account_id: MARKETPLACE_CONTRACT_ID,
        msg: JSON.stringify({
          price: parseNearAmount(`${price}`),
          market_type: 'sale',
          ft_token_id: `near`,
        }),
      }
      console.log(txs)
      txs.push({
        receiverId: token.contract_id,
        functionCalls: [
          {
            methodName: 'nft_approve',
            contractId: token.contract_id,
            args: params,
            attachedDeposit: '400000000000000000000',
            gas: '300000000000000',
          },
        ],
      })

      return await near.executeMultipleTransactions(txs, colbackURL)
    } catch (err) {
      console.log(err)
    }
  }

  const onUpdateMarketdata = async ({ price, token, colbackURL }) => {

    console.log(colbackURL)
    if (!near.accountId) {
      // console.log('no')
      return

    }
    // trackUpdateListingToken(data.token_id)

    try {
      const txs = []


      const params = {
        // token_id: token.token_contract_id,
        // account_id: MARKETPLACE_CONTRACT_ID,
        // msg: JSON.stringify({
        //   price: parseNearAmount(`${price}`),
        //   market_type: 'sale',
        //   ft_token_id: `near`,
        // }),
        nft_contract_id: token.contract_id,
        token_id: token.token_contract_id,
        ft_token_id: "near",
        price: parseNearAmount(`${price}`),
      }
      console.log(txs)
      txs.push({
        receiverId: MARKETPLACE_CONTRACT_ID,
        functionCalls: [
          {
            methodName: 'update_market_data',
            contractId: MARKETPLACE_CONTRACT_ID,
            args: params,
            attachedDeposit: '1',
            gas: '300000000000000',
          },
        ],
      })

      return await near.executeMultipleTransactions(txs, colbackURL)
    } catch (err) {
      console.log(err)
    }
  }

  const onBuyFromMarketplace = async ({ token, colbackURL }) => {

    console.log(colbackURL)
    if (!near.accountId) {
      // console.log('no')
      return

    }
    // trackUpdateListingToken(data.token_id)

    try {
      const txs = []


      const params = {
        // token_id: token.token_contract_id,
        // account_id: MARKETPLACE_CONTRACT_ID,
        // msg: JSON.stringify({
        //   price: parseNearAmount(`${price}`),
        //   market_type: 'sale',
        //   ft_token_id: `near`,
        // }),
        nft_contract_id: token.contract_id,
        token_id: token.token_contract_id,
      }
      console.log(txs)
      txs.push({
        receiverId: MARKETPLACE_CONTRACT_ID,
        functionCalls: [
          {
            methodName: 'buy',
            contractId: MARKETPLACE_CONTRACT_ID,
            args: params,
            attachedDeposit: `${token.price}`,
            gas: '300000000000000',
          },
        ],
      })

      return await near.executeMultipleTransactions(txs, colbackURL)
    } catch (err) {
      console.log(err)
    }
  }


  const onDeleteMarketdata = async ({ token, colbackURL }) => {

    console.log(colbackURL)
    if (!near.accountId) {
      // console.log('no')
      return

    }
    // trackUpdateListingToken(data.token_id)

    try {
      const txs = []


      const params = {
        // token_id: token.token_contract_id,
        // account_id: MARKETPLACE_CONTRACT_ID,
        // msg: JSON.stringify({
        //   price: parseNearAmount(`${price}`),
        //   market_type: 'sale',
        //   ft_token_id: `near`,
        // }),
        nft_contract_id: token.contract_id,
        token_id: token.token_contract_id,
        ft_token_id: "near",
      }
      console.log(txs)
      txs.push({
        receiverId: MARKETPLACE_CONTRACT_ID,
        functionCalls: [
          {
            methodName: 'delete_market_data',
            contractId: MARKETPLACE_CONTRACT_ID,
            args: params,
            attachedDeposit: '1',
            gas: '300000000000000',
          },
        ],
      })

      return await near.executeMultipleTransactions(txs, colbackURL)
    } catch (err) {
      console.log(err)
    }
  }



  const onReferralDeposit = async ({ colbackURL }) => {

    console.log(colbackURL)
    if (!near.accountId) {
      // console.log('no')
      return

    }
    // trackUpdateListingToken(data.token_id)

    try {
      const txs = []

      txs.push({
        receiverId: MARKETPLACE_CONTRACT_ID,
        functionCalls: [
          {
            methodName: 'storage_referral_deposit',
            contractId: MARKETPLACE_CONTRACT_ID,
            args: { referrer_id: near.accountId },
            attachedDeposit: '8590000000000000000000',
            gas: '300000000000000',
          },
        ],
      })
      return await near.executeMultipleTransactions(txs, colbackURL)
    } catch (err) {
      console.log(err)
    }
  }



  function handleListPopupOpen({ token, colbackURL }) {
    setListColbackURL(colbackURL)
    setTokenListValue(token)
    setListPopupOpened(true)
    // console.log({ token, colbackURL })

  }

  function handleBuyFromMarketplace({ token, colbackURL }) {
    onBuyFromMarketplace({ token: token, colbackURL: colbackURL })

  }

  function handleList({ price }) {
    onUpdateListing({ price, token: tokenListValue, colbackURL: listColbackURL })
  }

  function handleUpdaTeMarketData({ price }) {
    onUpdateMarketdata({ price, token: tokenListValue, colbackURL: listColbackURL })
  }

  function handleDeleteMarketData() {
    onDeleteMarketdata({ token: tokenListValue, colbackURL: listColbackURL })
  }

  function handleReferralDeposit({ colbackURL }) {
    onReferralDeposit({ colbackURL: colbackURL })

  }



  // useEffect(() => {
  //   if (currentUser && ws.current) {
  //     ws.current.onmessage = e => {
  //       const res = JSON.parse(e.data)
  //       console.log(res)
  //       setCurrentUser(exampleState => ({
  //         ...exampleState, notifications: [...exampleState.notifications, res], notifications_not_viewed: exampleState.notifications_not_viewed + 1
  //       }))
  //       if (res.type === 'resolve_purchase') {
  //         let audio = new Audio(notify_sound)
  //         audio.play()
  //       }

  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser, ws]);

  const [transferColbackURL, setTransferColbackURL] = useState('')
  function handleTransferPopupOpen({ token, colbackURL }) {
    setSelectedTokenForTransfer(token)
    setTransferPopupOpened(true)
    setTransferColbackURL(colbackURL)
  }



  const onTransfer = async ({ token, colbackURL, wallet }) => {

    console.log({ token, colbackURL, wallet })
    if (!near.accountId) {
      // console.log('no')
      return

    }
    if (token.is_on_sale) {

      try {
        const txs = []
        const params1 = {
          // token_id: token.token_contract_id,
          // account_id: MARKETPLACE_CONTRACT_ID,
          // msg: JSON.stringify({
          //   price: parseNearAmount(`${price}`),
          //   market_type: 'sale',
          //   ft_token_id: `near`,
          // }),
          nft_contract_id: token.contract_id,
          token_id: token.token_contract_id,
          ft_token_id: "near",
        }
        txs.push({
          receiverId: MARKETPLACE_CONTRACT_ID,
          functionCalls: [
            {
              methodName: 'delete_market_data',
              contractId: MARKETPLACE_CONTRACT_ID,
              args: params1,
              attachedDeposit: '1',
              gas: '300000000000000',
            },
          ],
        })

        const params = {
          // token_id: token.token_contract_id,
          // account_id: MARKETPLACE_CONTRACT_ID,
          // msg: JSON.stringify({
          //   price: parseNearAmount(`${price}`),
          //   market_type: 'sale',
          //   ft_token_id: `near`,
          // }),
          receiver_id: wallet.trim(),
          token_id: token.token_contract_id,
        }

        console.log(txs)
        txs.push({
          receiverId: token.contract_id,
          functionCalls: [
            {
              methodName: 'nft_transfer',
              contractId: token.contract_id,
              args: params,
              attachedDeposit: '1',
              gas: '300000000000000',
            },
          ],
        })

        return await near.executeMultipleTransactions(txs, colbackURL)
      } catch (err) {
        console.log(err)
      }

    } else {

      try {
        const txs = []


        const params = {
          // token_id: token.token_contract_id,
          // account_id: MARKETPLACE_CONTRACT_ID,
          // msg: JSON.stringify({
          //   price: parseNearAmount(`${price}`),
          //   market_type: 'sale',
          //   ft_token_id: `near`,
          // }),
          receiver_id: wallet.trim(),
          token_id: token.token_contract_id,
        }
        console.log(txs)
        txs.push({
          receiverId: token.contract_id,
          functionCalls: [
            {
              methodName: 'nft_transfer',
              contractId: token.contract_id,
              args: params,
              attachedDeposit: '1',
              gas: '300000000000000',
            },
          ],
        })

        return await near.executeMultipleTransactions(txs, colbackURL)
      } catch (err) {
        console.log(err)
      }
    }
    // trackUpdateListingToken(data.token_id)


  }




  const onNftCreate = async ({ img, json, price, title, colbackURL, royalty }) => {

    console.log({ img, json, price, title, colbackURL, royalty })
    if (!near.accountId) {
      // console.log('no')
      return

    }


    try {
      const txs = []

      if (price) {
        if (true) {
          txs.push({
            receiverId: MARKETPLACE_CONTRACT_ID,
            functionCalls: [
              {
                methodName: 'storage_deposit',
                contractId: MARKETPLACE_CONTRACT_ID,
                args: { receiver_id: near.accountId },
                attachedDeposit: '8590000000000000000000',
                gas: '300000000000000',
              },
            ],
          })
        }

        const params = {
          account_id: MARKETPLACE_CONTRACT_ID,
          creator_id: near.accountId,
          token_metadata: {
            title: title,
            media: img,
            reference: json,
            copies: 1,
          },
          price: parseNearAmount(Number(price).toString()),
          msg: JSON.stringify({
            market_type: 'sale',
            price: parseNearAmount(Number(price).toString()),
            //Не дает отправить price: null в обьекте msg
            // {"index":0,"kind":{"ExecutionError":"Smart contract panicked: panicked at 'price not specified', paras-marketplace-contract/src/nft_callbacks.rs:75:13"}}
            ft_token_id: "near",
          }),
          royalty: {
            [near.accountId]: royalty,
          },
          // receiver_id: wallet.trim(),
          // token_id: token.token_contract_id,
        }
        console.log(txs)
        txs.push({
          receiverId: NFT_CREATE_CONTRACT_ID,
          functionCalls: [
            {
              methodName: 'nft_create',
              contractId: NFT_CREATE_CONTRACT_ID,
              args: params,
              attachedDeposit: '14000000000000000000000',
              gas: '300000000000000',
            },
          ],
        })

      } else {


        const params = {
          creator_id: near.accountId,
          token_metadata: {
            title: title,
            media: img,
            reference: json,
            copies: 1,
          },

          royalty: {
            [near.accountId]: royalty,
          },
          // receiver_id: wallet.trim(),
          // token_id: token.token_contract_id,
        }
        console.log(txs)
        txs.push({
          receiverId: NFT_CREATE_CONTRACT_ID,
          functionCalls: [
            {
              methodName: 'nft_create_without_listing',
              contractId: NFT_CREATE_CONTRACT_ID,
              args: params,
              attachedDeposit: '14000000000000000000000',
              gas: '300000000000000',
            },
          ],
        })
      }

      return await near.executeMultipleTransactions(txs, colbackURL)
    } catch (err) {
      console.log(err)
    }
  }



  function handleExplictWarningOpen() {
    if (!isExplictAccept) {
      setWarningPopupOpened(true)
    }
  }
  return (

    <div className={`app ${theme === 'neon' ? 'app_theme_trip' : ''}`}>
      {/* {pageOnError ?
        <div className='app__on-error'>
          <p  className='app__on-error-text'>At the moment our servers are unavailable, we are already working on it, we apologize for the inconvenience</p>
        </div>
        : */}
      {loggedIn === undefined ?
        <div className='app__preloader'>
          <Preloader />
        </div>

        :
        <>
          <Header setMenuPopupOpen={setMenuPopupOpen} setCurrentUser={setCurrentUser} setNotifyPopupOpened={setNotifyPopupOpened} notifyPopupOpened={notifyPopupOpened} setRefreshPopupOpened={setRefreshPopupOpened} logout={logout} login={login} nearAccountBalance={nearAccountBalance} usdExchangeRate={usdExchangeRate} profilePopupOpened={profilePopupOpened} setProfilePopupOpened={setProfilePopupOpened} theme={theme} setTheme={setTheme} currentUser={currentUser} setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
          <div className='app__container'>
            <RefferalPopup refferalPopupOpened={refferalPopupOpened} setRefferalPopupOpened={setRefferalPopupOpened} />
            <WarningBetaPopup warningBetaPopupOpened={warningBetaPopupOpened} setWarningBetaPopupOpened={setWarningBetaPopupOpened} />
            <WarningPopup setExplictAccept={setExplictAccept} warningPopupOpened={warningPopupOpened} setWarningPopupOpened={setWarningPopupOpened} />
            <MenuPopup theme={theme} setTheme={setTheme} isMenuPopupOpen={isMenuPopupOpen} setMenuPopupOpen={setMenuPopupOpen} />
            {currentUser ? <ProfilePopup setRefreshPopupOpened={setRefreshPopupOpened} nearAccountBalance={nearAccountBalance} usdExchangeRate={usdExchangeRate} logout={logout} profilePopupOpened={profilePopupOpened} setProfilePopupOpened={setProfilePopupOpened} currentUser={currentUser} /> : <></>}
            {currentUser ? <RefreshPopup setCurrentUser={setCurrentUser} setRefreshPopupOpened={setRefreshPopupOpened} refreshPopupOpened={refreshPopupOpened} /> : <></>}
            {currentUser ? <ListPopup currentUser={currentUser} handleDeleteMarketData={handleDeleteMarketData} handleUpdaTeMarketData={handleUpdaTeMarketData} tokenListValue={tokenListValue} handleList={handleList} listPopupOpened={listPopupOpened} setListPopupOpened={setListPopupOpened} /> : <></>}
            {currentUser ? <div className='app__header-popup'><NotifyPopup currentUser={currentUser} setCurrentUser={setCurrentUser} notifications={currentUser && currentUser.notifications} setNotifyPopupOpened={setNotifyPopupOpened} notifyPopupOpened={notifyPopupOpened} /> </div> : <></>}
            {currentUser ? <TransferPopup currentUser={currentUser} transferColbackURL={transferColbackURL} onTransfer={onTransfer} selectedTokenForTransfer={selectedTokenForTransfer} setSelectedTokenForTransfer={setSelectedTokenForTransfer} transferPopupOpened={transferPopupOpened} setTransferPopupOpened={setTransferPopupOpened} /> : <></>}
            <LoginPopup setLoginPopupOpened={setLoginPopupOpened} loginPopupOpened={loginPopupOpened} login={login} />
            <LoginFromRefPopup setLoginPopupOpened={setLoginFromRefPopupOpened} loginPopupOpened={loginFromRefPopupOpened} login={login} />
            <Routes>
              <Route exact path="/" element={<Main currentUser={currentUser} login={login} theme={theme} usdExchangeRate={usdExchangeRate} />} />
              <Route path="/profile/:id/:selected" element={<Profile setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} setLoginPopupOpened={setLoginPopupOpened} setCurrentUser={setCurrentUser} loggedIn={loggedIn} setRefreshPopupOpened={setRefreshPopupOpened} usdExchangeRate={usdExchangeRate} currentUser={currentUser} users={users} />} />
              <Route path="/profile/:id" element={<Profile setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} setLoginPopupOpened={setLoginPopupOpened} setCurrentUser={setCurrentUser} loggedIn={loggedIn} setRefreshPopupOpened={setRefreshPopupOpened} usdExchangeRate={usdExchangeRate} currentUser={currentUser} users={users} />} />
              <Route path="/collections/:id/:selected" element={<CollectionPage setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} handleExplictWarningOpen={handleExplictWarningOpen} setLoginPopupOpened={setLoginPopupOpened} theme={theme} setCurrentUser={setCurrentUser} loggedIn={loggedIn} setRefreshPopupOpened={setRefreshPopupOpened} usdExchangeRate={usdExchangeRate} currentUser={currentUser} users={users} />} />
              <Route path="/collections/:id" element={<CollectionPage setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} handleExplictWarningOpen={handleExplictWarningOpen} setLoginPopupOpened={setLoginPopupOpened} theme={theme} setCurrentUser={setCurrentUser} loggedIn={loggedIn} setRefreshPopupOpened={setRefreshPopupOpened} usdExchangeRate={usdExchangeRate} currentUser={currentUser} users={users} />} />
              <Route path="/collections-stats" element={<StatisticsPage theme={theme} />} />
              <Route path="/calendar" element={<CalendarPage theme={theme} usdExchangeRate={usdExchangeRate} />} />
              <Route path="/search/:value" element={<Search setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} setLoginPopupOpened={setLoginPopupOpened} setCurrentUser={setCurrentUser} loggedIn={loggedIn} setRefreshPopupOpened={setRefreshPopupOpened} usdExchangeRate={usdExchangeRate} currentUser={currentUser} />} />
              <Route path="/search" element={<Search setExplictAccept={setExplictAccept} isExplictAccept={isExplictAccept} setLoginPopupOpened={setLoginPopupOpened} setCurrentUser={setCurrentUser} loggedIn={loggedIn} setRefreshPopupOpened={setRefreshPopupOpened} usdExchangeRate={usdExchangeRate} currentUser={currentUser} />} />
              <Route path="/item/:id/:selected/:transactionHashes" element={<ItemPage handleExplictWarningOpen={handleExplictWarningOpen} handleTransferPopupOpen={handleTransferPopupOpen} theme={theme} login={login} setLoginPopupOpened={setLoginPopupOpened} handleBuyFromMarketplace={handleBuyFromMarketplace} handleListPopupOpen={handleListPopupOpen} setCurrentUser={setCurrentUser} currentUser={currentUser} usdExchangeRate={usdExchangeRate} />} />
              <Route path="/item/:id/:selected" element={<ItemPage handleExplictWarningOpen={handleExplictWarningOpen} handleTransferPopupOpen={handleTransferPopupOpen} theme={theme} login={login} setLoginPopupOpened={setLoginPopupOpened} handleBuyFromMarketplace={handleBuyFromMarketplace} handleListPopupOpen={handleListPopupOpen} setCurrentUser={setCurrentUser} currentUser={currentUser} usdExchangeRate={usdExchangeRate} />} />
              <Route path="/item/:id/" element={<ItemPage handleExplictWarningOpen={handleExplictWarningOpen} handleTransferPopupOpen={handleTransferPopupOpen} theme={theme} login={login} setLoginPopupOpened={setLoginPopupOpened} handleBuyFromMarketplace={handleBuyFromMarketplace} handleListPopupOpen={handleListPopupOpen} setCurrentUser={setCurrentUser} currentUser={currentUser} usdExchangeRate={usdExchangeRate} />} />
              <Route path="/explore-collections/:name" element={<ExploreCollectionsPage theme={theme} />} />
              <Route path="/explore-collections" element={<ExploreCollectionsPage theme={theme} />} />
              <Route path="/explore-items/:name" element={<ExploreItemsPage isExplictAccept={isExplictAccept} setExplictAccept={setExplictAccept} setCurrentUser={setCurrentUser} setLoginPopupOpened={setLoginPopupOpened} theme={theme} loggedIn={loggedIn} currentUser={currentUser} />} />
              <Route path="/explore-items" element={<ExploreItemsPage isExplictAccept={isExplictAccept} setExplictAccept={setExplictAccept} setCurrentUser={setCurrentUser} setLoginPopupOpened={setLoginPopupOpened} theme={theme} loggedIn={loggedIn} currentUser={currentUser} />} />

              <Route path="/about" element={<AboutTeam theme={theme} />} />
              <Route path="/guide" element={<HowToPage theme={theme} />} />


              <Route path="/faq" element={<Faq theme={theme} login={login} currentUser={currentUser} />} />

              <Route path='/r' element={<RefLinkAdder setLoginPopupOpened={setLoginFromRefPopupOpened} loggedIn={loggedIn} />} />
              <Route path='/r/:code' element={<RefLinkAdder setLoginPopupOpened={setLoginFromRefPopupOpened} loggedIn={loggedIn} />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/earn/referral/:pageName" element={<Refferal usdExchangeRate={usdExchangeRate} setCurrentUser={setCurrentUser} handleReferralDeposit={handleReferralDeposit} currentUser={currentUser} setRefferalPopupOpened={setRefferalPopupOpened} login={login} />} />
              <Route path="/earn/referral" element={<Refferal usdExchangeRate={usdExchangeRate} setCurrentUser={setCurrentUser} handleReferralDeposit={handleReferralDeposit} currentUser={currentUser} setRefferalPopupOpened={setRefferalPopupOpened} login={login} />} />

              {currentUser ?
                <>

                  <Route path="/edit-profile" element={<EditProfile setCurrentUser={setCurrentUser} loggedIn={loggedIn} currentUser={currentUser} />} />
                  <Route path="/create-collection" element={<CreateCollection setCurrentUser={setCurrentUser} loggedIn={loggedIn} currentUser={currentUser} />} />
                  <Route path="/create-item" element={<CreateItem setExplictAccept={setExplictAccept} onNftCreate={onNftCreate} currentUser={currentUser} usdExchangeRate={usdExchangeRate} />} />
                  <Route path="/edit-collection/:id" element={<EditCollection setCurrentUser={setCurrentUser} loggedIn={loggedIn} currentUser={currentUser} />} />
                  <Route path="/collection-add-items/:id" element={<CollectionAddItems currentUser={currentUser} usdExchangeRate={usdExchangeRate} />} />

                </>
                :
                <>

                  <Route path="/edit-profile" element={<LoginPage login={login} />} />
                  <Route path="/create-collection" element={<LoginPage login={login} />} />
                  <Route path="/create-item" element={<LoginPage login={login} />} />
                  <Route path="/edit-collection/:id" element={<LoginPage login={login} />} />
                  <Route path="/collection-add-items/:id" element={<LoginPage login={login} />} />

                </>
              }

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer setWarningBetaPopupOpened={setWarningBetaPopupOpened} currentUser={currentUser} />
        </>}
    </div>


  );
}

export default App;

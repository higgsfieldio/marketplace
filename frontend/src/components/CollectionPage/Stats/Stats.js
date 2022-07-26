import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

import Graph from './Graph/Graph';
import './Stats.css';

// let testData = {
//     "week": {
//         "items": [
//             {
//                 "value": 0,
//                 "timestamp": "1645726271.034208",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645812671.034208",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645899071.034208",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645985471.034208",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1646071871.034208",
//                 "percent": 0
//             },
//             {
//                 "timestamp": "1646158271.034208",
//                 "value": 123,
//                 "percent": 100
//             },
//             {
//                 "timestamp": "1646244671.034208",
//                 "value": 10,
//                 "percent": 8
//             }
//         ],
//         "brake_points": [
//             "0",
//             "41",
//             "82",
//             "123"
//         ]
//     },
//     "month": {
//         "items": [
//             {
//                 "value": 0,
//                 "timestamp": "1643739071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1643825471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1643911871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1643998271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644084671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644171071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644257471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644343871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644430271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644516671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644603071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644689471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644775871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644862271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644948671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645035071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645121471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645207871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645294271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645380671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645467071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645553471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645639871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645726271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645812671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645899071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645985471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1646071871.034282",
//                 "percent": 0
//             },
//             {
//                 "timestamp": "1646158271.034282",
//                 "value": 123,
//                 "percent": 100
//             },
//             {
//                 "timestamp": "1646244671.034282",
//                 "value": 10,
//                 "percent": 8
//             }
//         ],
//         "brake_points": [
//             "0",
//             "41",
//             "82",
//             "123"
//         ]
//     }, "all_time": {
//         "items": [
//             {
//                 "value": 0,
//                 "timestamp": "1643739071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1643825471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1643911871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1643998271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644084671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644171071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644257471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644343871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644430271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644516671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644603071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644689471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644775871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644862271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1644948671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645035071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645121471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645207871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645294271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645380671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645467071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645553471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645639871.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645726271.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645812671.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645899071.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1645985471.034282",
//                 "percent": 0
//             },
//             {
//                 "value": 0,
//                 "timestamp": "1646071871.034282",
//                 "percent": 0
//             },
//             {
//                 "timestamp": "1646158271.034282",
//                 "value": 123,
//                 "percent": 100
//             },
//             {
//                 "timestamp": "1646244671.034282",
//                 "value": 10,
//                 "percent": 8
//             }
//         ],
//         "brake_points": [
//             "0",
//             "41",
//             "82",
//             "123"
//         ]
//     }
// }




function Stats({ statistics, collection_id, theme, recomendedBuyLink }) {
    const [rangeValue, setRengeValue] = useState('7d')

    const [priceRangeValue, setPriceRengeValue] = useState('Floor price')

    // let statistics = {
    //     listed_nfts_amount_dict: testData,
    //     market_cap_history_dict: testData,
    //     resolve_purchase_history_dict: testData,
    //     owners_history_dict: testData,
    //     sellers_history_dict: testData,
    //     buyers_history_dict: testData,
    // }
    var tz = moment.tz.guess();
    const dateNow = moment().tz(tz).format('MMM DD')

    const [capValue, setCapValue] = useState(0)
    const [transValue, setTransValue] = useState(0)
    const [ownersValue, setOwnersValue] = useState(0)
    const [sellersValue, setSellersValue] = useState(0)
    const [buyersValue, setBuyersValue] = useState(0)

    const [avPriceValue, setAvPriceValue] = useState(0)
    const [floorPriceValue, setFloorPriceValue] = useState(0)
    const [avPriceDateValue, setAvPriceDateValue] = useState('')
    const [floorPriceDateValue, setFloorPriceDateValue] = useState('')

    const [capDateValue, setCapDateValue] = useState('')
    const [transDateValue, setTransDateValue] = useState('')
    const [ownersDateValue, setOwnersDateValue] = useState('')
    const [sellersDateValue, setSellersDateValue] = useState('')
    const [buyersDateValue, setBuyersDateValue] = useState('')

    function handleLeave() {
        setCapDateValue('')
        setTransDateValue('')
        setOwnersDateValue('')
        setSellersDateValue('')
        setBuyersDateValue('')
        setFloorPriceDateValue('')
        setAvPriceDateValue('')
        if (rangeValue === '7d') {
            if (statistics && statistics.market_cap_history_dict && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.week && statistics.market_cap_history_dict.floor_price.week.items) {
                if (priceRangeValue === 'Floor price') {
                    setCapValue(statistics.market_cap_history_dict.floor_price.week.items[statistics.market_cap_history_dict.floor_price.week.items.length - 1].value)
                } else {
                    setCapValue(statistics.market_cap_history_dict.average_price.week.items[statistics.market_cap_history_dict.average_price.week.items.length - 1].value)
                }

            }
            if (statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.week && statistics.resolve_purchase_history_dict.week.items) {
                let res = statistics.resolve_purchase_history_dict.week.items.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.value),
                    0
                );

                setTransValue(res)
            }
            if (statistics && statistics.owners_history_dict && statistics.owners_history_dict.week && statistics.owners_history_dict.week.items) {
                setOwnersValue(statistics.owners_history_dict.week.items[statistics.owners_history_dict.week.items.length - 1].value)
            }

            if (statistics && statistics.price && statistics.price.average_price && statistics.price.average_price.week && statistics.price.average_price.week.items) {
                setAvPriceValue(statistics.price.average_price.week.items[statistics.price.average_price.week.items.length - 1].value)
            }
            if (statistics && statistics.price && statistics.price.floor_price && statistics.price.floor_price.week && statistics.price.floor_price.week.items) {
                setFloorPriceValue(statistics.price.floor_price.week.items[statistics.price.floor_price.week.items.length - 1].value)
            }


            if (statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.week && statistics.sellers_history_dict.week.items) {
                setSellersValue(statistics.sellers_history_dict.week.amount_in_all)
            }
            if (statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.week && statistics.buyers_history_dict.week.items) {
                setBuyersValue(statistics.buyers_history_dict.week.amount_in_all)
            }
        } else if (rangeValue === '30d') {
            if (statistics && statistics.market_cap_history_dict && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.week && statistics.market_cap_history_dict.floor_price.week.items) {
                if (priceRangeValue === 'Floor price') {
                    setCapValue(statistics.market_cap_history_dict.floor_price.week.items[statistics.market_cap_history_dict.floor_price.week.items.length - 1].value)
                } else {
                    setCapValue(statistics.market_cap_history_dict.average_price.week.items[statistics.market_cap_history_dict.average_price.week.items.length - 1].value)
                }

            }
            if (statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.month && statistics.resolve_purchase_history_dict.month.items) {
                let res = statistics.resolve_purchase_history_dict.month.items.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.value),
                    0
                );

                setTransValue(res)
            }

            if (statistics && statistics.price && statistics.price.average_price && statistics.price.average_price.week && statistics.price.average_price.week.items) {
                setAvPriceValue(statistics.price.average_price.week.items[statistics.price.average_price.week.items.length - 1].value)
            }
            if (statistics && statistics.price && statistics.price.floor_price && statistics.price.floor_price.week && statistics.price.floor_price.week.items) {
                setFloorPriceValue(statistics.price.floor_price.week.items[statistics.price.floor_price.week.items.length - 1].value)
            }


            if (statistics && statistics.owners_history_dict && statistics.owners_history_dict.month && statistics.owners_history_dict.month.items) {
                setOwnersValue(statistics.owners_history_dict.week.items[statistics.owners_history_dict.week.items.length - 1].value)
            }
            if (statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.month && statistics.sellers_history_dict.month.items) {
                setSellersValue(statistics.sellers_history_dict.month.amount_in_all)
            }
            if (statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.month && statistics.buyers_history_dict.month.items) {
                setBuyersValue(statistics.buyers_history_dict.month.amount_in_all)
            }
        }
        else if (rangeValue === 'All time') {
            if (statistics && statistics.market_cap_history_dict && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.week && statistics.market_cap_history_dict.floor_price.week.items) {
                if (priceRangeValue === 'Floor price') {
                    setCapValue(statistics.market_cap_history_dict.floor_price.week.items[statistics.market_cap_history_dict.floor_price.week.items.length - 1].value)
                } else {
                    setCapValue(statistics.market_cap_history_dict.average_price.week.items[statistics.market_cap_history_dict.average_price.week.items.length - 1].value)
                }

            }
            if (statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.all_time && statistics.resolve_purchase_history_dict.all_time.items) {
                let res = statistics.resolve_purchase_history_dict.all_time.items.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.value),
                    0
                );

                setTransValue(res)
            }


            if (statistics && statistics.price && statistics.price.average_price && statistics.price.average_price.week && statistics.price.average_price.week.items) {
                setAvPriceValue(statistics.price.average_price.week.items[statistics.price.average_price.week.items.length - 1].value)
            }
            if (statistics && statistics.price && statistics.price.floor_price && statistics.price.floor_price.week && statistics.price.floor_price.week.items) {
                setFloorPriceValue(statistics.price.floor_price.week.items[statistics.price.floor_price.week.items.length - 1].value)
            }


            if (statistics && statistics.owners_history_dict && statistics.owners_history_dict.all_time && statistics.owners_history_dict.all_time.items) {
                setOwnersValue(statistics.owners_history_dict.week.items[statistics.owners_history_dict.week.items.length - 1].value)
            }
            if (statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.all_time && statistics.sellers_history_dict.all_time.items) {
                setSellersValue(statistics.sellers_history_dict.all_time.amount_in_all)
            }
            if (statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.all_time && statistics.buyers_history_dict.all_time.items) {
                setBuyersValue(statistics.buyers_history_dict.all_time.amount_in_all)
            }
        }

    }

    useEffect(() => {
        if (statistics && statistics.market_cap_history_dict && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.week && statistics.market_cap_history_dict.floor_price.week.items) {
            if (priceRangeValue === 'Floor price') {
                setCapValue(statistics.market_cap_history_dict.floor_price.week.items[statistics.market_cap_history_dict.floor_price.week.items.length - 1].value)
            } else {
                setCapValue(statistics.market_cap_history_dict.average_price.week.items[statistics.market_cap_history_dict.average_price.week.items.length - 1].value)
            }

        }
        if (statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.week && statistics.resolve_purchase_history_dict.week.items) {
            let res = statistics.resolve_purchase_history_dict.week.items.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.value),
                0
            );

            setTransValue(res)
        }

        if (statistics && statistics.price && statistics.price.average_price && statistics.price.average_price.week && statistics.price.average_price.week.items) {
            setAvPriceValue(statistics.price.average_price.week.items[statistics.price.average_price.week.items.length - 1].value)
        }
        if (statistics && statistics.price && statistics.price.floor_price && statistics.price.floor_price.week && statistics.price.floor_price.week.items) {
            setFloorPriceValue(statistics.price.floor_price.week.items[statistics.price.floor_price.week.items.length - 1].value)
        }


        if (statistics && statistics.owners_history_dict && statistics.owners_history_dict.week && statistics.owners_history_dict.week.items) {
            setOwnersValue(statistics.owners_history_dict.week.items[statistics.owners_history_dict.week.items.length - 1].value)
        }
        if (statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.week && statistics.sellers_history_dict.week.items) {
            setSellersValue(statistics.sellers_history_dict.week.amount_in_all)
        }
        if (statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.week && statistics.buyers_history_dict.week.items) {
            setBuyersValue(statistics.buyers_history_dict.week.amount_in_all)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statistics])

    useEffect(() => {
        if (rangeValue === '7d') {

            if (statistics && statistics.market_cap_history_dict && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.week && statistics.market_cap_history_dict.floor_price.week.items) {
                if (priceRangeValue === 'Floor price') {
                    setCapValue(statistics.market_cap_history_dict.floor_price.week.items[statistics.market_cap_history_dict.floor_price.week.items.length - 1].value)
                } else {
                    setCapValue(statistics.market_cap_history_dict.average_price.week.items[statistics.market_cap_history_dict.average_price.week.items.length - 1].value)
                }

            }

            if (statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.week && statistics.resolve_purchase_history_dict.week.items) {
                let res = statistics.resolve_purchase_history_dict.week.items.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.value),
                    0
                );

                setTransValue(res)
            }
            if (statistics && statistics.owners_history_dict && statistics.owners_history_dict.week && statistics.owners_history_dict.week.items) {
                setOwnersValue(statistics.owners_history_dict.week.items[statistics.owners_history_dict.week.items.length - 1].value)
            }

            if (statistics && statistics.price && statistics.price.average_price && statistics.price.average_price.week && statistics.price.average_price.week.items) {
                setAvPriceValue(statistics.price.average_price.week.items[statistics.price.average_price.week.items.length - 1].value)
            }
            if (statistics && statistics.price && statistics.price.floor_price && statistics.price.floor_price.week && statistics.price.floor_price.week.items) {
                setFloorPriceValue(statistics.price.floor_price.week.items[statistics.price.floor_price.week.items.length - 1].value)
            }


            if (statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.week && statistics.sellers_history_dict.week.items) {
                setSellersValue(statistics.sellers_history_dict.week.amount_in_all)
            }
            if (statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.week && statistics.buyers_history_dict.week.items) {
                setBuyersValue(statistics.buyers_history_dict.week.amount_in_all)
            }
        } else if (rangeValue === '30d') {

            if (statistics && statistics.market_cap_history_dict && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.month && statistics.market_cap_history_dict.floor_price.month.items) {
                if (priceRangeValue === 'Floor price') {
                    setCapValue(statistics.market_cap_history_dict.floor_price.month.items[statistics.market_cap_history_dict.floor_price.month.items.length - 1].value)
                } else {
                    setCapValue(statistics.market_cap_history_dict.average_price.month.items[statistics.market_cap_history_dict.average_price.month.items.length - 1].value)
                }

            }
            if (statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.month && statistics.resolve_purchase_history_dict.month.items) {
                let res = statistics.resolve_purchase_history_dict.month.items.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.value),
                    0
                );

                setTransValue(res)
            }
            if (statistics && statistics.owners_history_dict && statistics.owners_history_dict.month && statistics.owners_history_dict.month.items) {
                setOwnersValue(statistics.owners_history_dict.week.items[statistics.owners_history_dict.week.items.length - 1].value)
            }


            if (statistics && statistics.price && statistics.price.average_price && statistics.price.average_price.week && statistics.price.average_price.week.items) {
                setAvPriceValue(statistics.price.average_price.week.items[statistics.price.average_price.week.items.length - 1].value)
            }
            if (statistics && statistics.price && statistics.price.floor_price && statistics.price.floor_price.week && statistics.price.floor_price.week.items) {
                setFloorPriceValue(statistics.price.floor_price.week.items[statistics.price.floor_price.week.items.length - 1].value)
            }


            if (statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.month && statistics.sellers_history_dict.month.items) {
                setSellersValue(statistics.sellers_history_dict.month.amount_in_all)
            }
            if (statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.month && statistics.buyers_history_dict.month.items) {
                setBuyersValue(statistics.buyers_history_dict.month.amount_in_all)
            }
        }
        else if (rangeValue === 'All time') {
            if (statistics && statistics.market_cap_history_dict && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.all_time && statistics.market_cap_history_dict.floor_price.all_time.items) {
                if (priceRangeValue === 'Floor price') {
                    setCapValue(statistics.market_cap_history_dict.floor_price.all_time.items[statistics.market_cap_history_dict.floor_price.all_time.items.length - 1].value)
                } else {
                    setCapValue(statistics.market_cap_history_dict.average_price.all_time.items[statistics.market_cap_history_dict.average_price.all_time.items.length - 1].value)
                }

            }
            if (statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.all_time && statistics.resolve_purchase_history_dict.all_time.items) {
                let res = statistics.resolve_purchase_history_dict.all_time.items.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.value),
                    0
                );

                setTransValue(res)
            }
            if (statistics && statistics.owners_history_dict && statistics.owners_history_dict.all_time && statistics.owners_history_dict.all_time.items) {
                setOwnersValue(statistics.owners_history_dict.week.items[statistics.owners_history_dict.week.items.length - 1].value)
            }


            if (statistics && statistics.price && statistics.price.average_price && statistics.price.average_price.week && statistics.price.average_price.week.items) {
                setAvPriceValue(statistics.price.average_price.week.items[statistics.price.average_price.week.items.length - 1].value)
            }
            if (statistics && statistics.price && statistics.price.floor_price && statistics.price.floor_price.week && statistics.price.floor_price.week.items) {
                setFloorPriceValue(statistics.price.floor_price.week.items[statistics.price.floor_price.week.items.length - 1].value)
            }



            if (statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.all_time && statistics.sellers_history_dict.all_time.items) {
                setSellersValue(statistics.sellers_history_dict.all_time.amount_in_all)
            }
            if (statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.all_time && statistics.buyers_history_dict.all_time.items) {
                setBuyersValue(statistics.buyers_history_dict.all_time.amount_in_all)
            }
        }

    }, [rangeValue, statistics, priceRangeValue])



    return (
        <div className='statistics'>
            <div className='statistics__range-selector'>
                <p className={`statistics__range-selector-item ${rangeValue === '7d' ? 'statistics__range-selector-item_selected' : ''}`} onClick={() => {
                    if (rangeValue !== '7d') {
                        setRengeValue('7d')
                    }
                }}>7d</p>
                <p className={`statistics__range-selector-item ${rangeValue === '30d' ? 'statistics__range-selector-item_selected' : ''}`} onClick={() => {
                    if (rangeValue !== '30d') {
                        setRengeValue('30d')
                    }
                }}>30d</p>
                <p className={`statistics__range-selector-item ${rangeValue === 'All time' ? 'statistics__range-selector-item_selected' : ''}`} onClick={() => {
                    if (rangeValue !== 'All time') {
                        setRengeValue('All time')
                    }
                }}>All time</p>
            </div>

            <div className='statistics__price-listed'>
                <div className='statistics__graph statistics__graph_listed'>
                    <div className='statistics__graph-heading-row'>
                        <p className='statistics__graph-grand-name'>Price</p>

                        {/* <Link className='statistics__graph-buy-link' to={recomendedBuyLink}>Buy now</Link> */}
                        <div className='statistics__price-range-selector'>
                            <p className={`statistics__range-selector-item ${priceRangeValue === 'Floor price' ? 'statistics__range-selector-item_selected' : ''}`} onClick={() => {
                                if (priceRangeValue !== 'Floor price') {
                                    setPriceRengeValue('Floor price')
                                    setAvPriceDateValue('')
                                    setFloorPriceDateValue('')
                                }
                            }}>Floor price</p>
                            <p className={`statistics__range-selector-item ${priceRangeValue === 'Average price' ? 'statistics__range-selector-item_selected' : ''}`} onClick={() => {
                                if (priceRangeValue !== 'Average price') {
                                    setPriceRengeValue('Average price')
                                    setAvPriceDateValue('')
                                    setFloorPriceDateValue('')
                                }
                            }}>Average price</p>

                        </div>
                    </div>
                    <div className='statistics__graph-heading-row statistics__graph-heading-row_price'>
                        {/* <p className='statistics__graph-name'>Market cap</p> */}
                        {statistics && statistics.price.average_price ?
                            <div className='statistics__graph-value-container'>
                                <p className='statistics__graph-value statistics__graph-value_price'>{priceRangeValue === 'Floor price' ? floorPriceValue : avPriceValue}</p>
                                <svg className='statistics__near-icon' width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='statistics__near-icon-fill' d="M10.4417 27.2184V8.51942H13.6311L23.2864 23.767L22.7621 23.5922C22.7621 22.9223 22.7476 22.2524 22.7184 21.5825C22.6893 20.8835 22.6748 20.199 22.6748 19.5291V8.51942H25.5583V27.2184H22.3689L12.6699 11.8835L13.1942 12.0583C13.2233 12.7864 13.2524 13.5 13.2816 14.199C13.3107 14.8981 13.3252 15.5971 13.3252 16.2961V27.2184H10.4417ZM18 36C15.5243 36 13.1942 35.534 11.0097 34.6019C8.82524 33.6699 6.90291 32.3884 5.24272 30.7573C3.61165 29.0971 2.3301 27.1748 1.39806 24.9903C0.466019 22.8058 0 20.4757 0 18C0 15.4951 0.466019 13.165 1.39806 11.0097C2.3301 8.82524 3.61165 6.91748 5.24272 5.28641C6.90291 3.62621 8.82524 2.3301 11.0097 1.39806C13.1942 0.466019 15.5243 0 18 0C20.5049 0 22.835 0.466019 24.9903 1.39806C27.1748 2.3301 29.0825 3.62621 30.7136 5.28641C32.3738 6.91748 33.6699 8.82524 34.6019 11.0097C35.534 13.165 36 15.4951 36 18C36 20.4757 35.534 22.8058 34.6019 24.9903C33.6699 27.1748 32.3738 29.0971 30.7136 30.7573C29.0825 32.3884 27.1748 33.6699 24.9903 34.6019C22.835 35.534 20.5049 36 18 36ZM18 33.5534C20.1553 33.5534 22.165 33.1602 24.0291 32.3738C25.9223 31.5583 27.5825 30.4369 29.0097 29.0097C30.4369 27.5825 31.5437 25.9369 32.3301 24.0728C33.1456 22.1796 33.5534 20.1553 33.5534 18C33.5534 15.8447 33.1456 13.835 32.3301 11.9709C31.5437 10.0777 30.4369 8.41748 29.0097 6.99029C27.5825 5.56311 25.9223 4.45631 24.0291 3.6699C22.165 2.85437 20.1553 2.4466 18 2.4466C15.8447 2.4466 13.8204 2.85437 11.9272 3.6699C10.0631 4.45631 8.41748 5.56311 6.99029 6.99029C5.56311 8.41748 4.44175 10.0777 3.62621 11.9709C2.83981 13.835 2.4466 15.8447 2.4466 18C2.4466 20.1553 2.83981 22.1796 3.62621 24.0728C4.44175 25.9369 5.56311 27.5825 6.99029 29.0097C8.41748 30.4369 10.0631 31.5583 11.9272 32.3738C13.8204 33.1602 15.8447 33.5534 18 33.5534Z" fill="white" />
                                </svg>
                            </div> : <></>}

                        <p className='statistics__graph-range'>{priceRangeValue === 'Floor price' ? floorPriceDateValue && floorPriceDateValue !== dateNow ? floorPriceDateValue : 'Now' : avPriceDateValue && avPriceDateValue !== dateNow ? avPriceDateValue : 'Now'}</p>
                    </div>

                    <div className='statistics__graph-container statistics__graph-container_listed' >
                        <Graph setDateValue={priceRangeValue === 'Floor price' ? setFloorPriceDateValue : setAvPriceDateValue} setValue={priceRangeValue === 'Floor price' ? setFloorPriceValue : setAvPriceValue} stats={priceRangeValue === 'Floor price' ? statistics.price.floor_price : statistics.price.average_price} rangeValue={rangeValue} collection_id={collection_id} graphName={'Listed NFTs from collection'} theme={theme} bars_vivsible={true} brake_points_visible={true} brake_lines_visible={true} dates_visible={true} toltip_price={true} toltip_value_name={priceRangeValue === 'Floor price'? 'Floor price' :'Average price'} />
                    </div>

                </div>

                <div className='statistics__graph statistics__graph_listed'>
                    <div className='statistics__graph-heading-row'>
                        <p className='statistics__graph-grand-name'>Listed NFTs</p>
                        {/* <Link className='statistics__graph-buy-link' to={recomendedBuyLink}>Buy now</Link> */}
                    </div>
                    <div className='statistics__graph-heading-row statistics__graph-heading-row_listed'>
                        {/* <p className='statistics__graph-name'>Market cap</p> */}
                        {/* {statistics && statistics.owners_history_dict && statistics.owners_history_dict.week && statistics.owners_history_dict.week.items ? <p className='statistics__graph-value'>{ownersValue}</p> : <></>} */}

                    </div>

                    <div className='statistics__graph-container statistics__graph-container_listed' >
                        <Graph stats={statistics.listed_nfts_amount_dict} rangeValue={rangeValue} collection_id={collection_id} graphName={'Listed NFTs from collection'} theme={theme} bars_vivsible={true} brake_points_visible={true} brake_lines_visible={true} dates_visible={true} toltip_price={false} toltip_value_name={'Listed'} />
                    </div>

                </div>
            </div>
            <div className='statistics__cap-transactions'>
                <div className='statistics__graph statistics__graph_cap-transactions'>
                    <div className='statistics__graph-heading'>
                        <div className='statistics__graph-heading-row'>
                            <p className='statistics__graph-name'>Market cap {priceRangeValue === 'Floor price' ? '(by floor price)' : '(by average price)'}</p>
                            <p className='statistics__graph-range'>{capDateValue && capDateValue !== dateNow ? capDateValue : 'Now'}</p>
                        </div>
                        {statistics && statistics.market_cap_history_dict.floor_price && statistics.market_cap_history_dict.floor_price.week && statistics.market_cap_history_dict.floor_price.week.items ? <p className='statistics__graph-value'>${parseFloat(Number(capValue)) > 1000 ? `${Number(parseFloat(Number(capValue)).toFixed(0)).toLocaleString('us')}` : `${Number(parseFloat(parseFloat(Number(capValue)).toFixed(2))).toLocaleString('us')}`}</p> : <></>}
                    </div>
                    <div className='statistics__graph-container' onMouseLeave={handleLeave}>
                        <Graph setDateValue={setCapDateValue} setValue={setCapValue} stats={priceRangeValue === 'Floor price' ? statistics.market_cap_history_dict.floor_price : statistics.market_cap_history_dict.average_price} rangeValue={rangeValue} collection_id={collection_id} graphName={'Listed NFTs from collection'} theme={theme} bars_vivsible={false} brake_points_visible={false} brake_lines_visible={false} dates_visible={false} toltip_price={false} toltip_value_name={priceRangeValue === 'Floor price'? 'Floor m. cap.' :'Average m. cap.'} />
                    </div>
                </div>
                <div className='statistics__graph statistics__graph_cap-transactions'>
                    <div className='statistics__graph-heading'>
                        <div className='statistics__graph-heading-row'>
                            <p className='statistics__graph-name'>Purchases</p>
                            <p className='statistics__graph-range'>{transDateValue ? transDateValue : rangeValue === '7d' ? 'Last 7 days' : rangeValue === '30d' ? 'Last 30 days' : 'All time'}</p>
                        </div>
                        {statistics && statistics.resolve_purchase_history_dict && statistics.resolve_purchase_history_dict.week && statistics.resolve_purchase_history_dict.week.items ? <p className='statistics__graph-value'>{transValue}</p> : <></>}
                    </div>
                    <div className='statistics__graph-container' onMouseLeave={handleLeave}>
                        <Graph setDateValue={setTransDateValue} setValue={setTransValue} stats={statistics.resolve_purchase_history_dict} rangeValue={rangeValue} collection_id={collection_id} graphName={'Listed NFTs from collection'} theme={theme} bars_vivsible={false} brake_points_visible={false} brake_lines_visible={false} dates_visible={false} toltip_price={false} toltip_value_name={'Purchases'} />
                    </div>
                </div>
            </div>
            <div className='statistics__owner-sellers-byers'>
                <div className='statistics__graph statistics__graph_owner-sellers-byers'>
                    <div className='statistics__graph-heading'>
                        <div className='statistics__graph-heading-row'>
                            <p className='statistics__graph-name'>Owners</p>
                            <p className='statistics__graph-range'>{ownersDateValue && ownersDateValue !== dateNow ? ownersDateValue : 'Now'}</p>
                        </div>
                        {statistics && statistics.owners_history_dict && statistics.owners_history_dict.week && statistics.owners_history_dict.week.items ? <p className='statistics__graph-value'>{ownersValue}</p> : <></>}
                    </div>
                    <div className='statistics__graph-container' onMouseLeave={handleLeave}>
                        <Graph setDateValue={setOwnersDateValue} setValue={setOwnersValue} stats={statistics.owners_history_dict} rangeValue={rangeValue} collection_id={collection_id} graphName={'Listed NFTs from collection'} theme={theme} bars_vivsible={false} brake_points_visible={false} brake_lines_visible={false} dates_visible={false} toltip_price={false} toltip_value_name={'Owners'} />
                    </div>
                </div>
                <div className='statistics__graph statistics__graph_owner-sellers-byers'>
                    <div className='statistics__graph-heading'>
                        <div className='statistics__graph-heading-row'>
                            <p className='statistics__graph-name'>Sellers</p>
                            <p className='statistics__graph-range'>{sellersDateValue ? sellersDateValue : rangeValue === '7d' ? 'Last 7 days' : rangeValue === '30d' ? 'Last 30 days' : 'All time'}</p>
                        </div>
                        {statistics && statistics.sellers_history_dict && statistics.sellers_history_dict.week && statistics.sellers_history_dict.week.items ? <p className='statistics__graph-value'>{sellersValue}</p> : <></>}
                    </div>
                    <div className='statistics__graph-container' onMouseLeave={handleLeave}>
                        <Graph setDateValue={setSellersDateValue} setValue={setSellersValue} stats={statistics.sellers_history_dict} rangeValue={rangeValue} collection_id={collection_id} graphName={'Listed NFTs from collection'} theme={theme} bars_vivsible={false} brake_points_visible={false} brake_lines_visible={false} dates_visible={false} toltip_price={false} toltip_value_name={'Sellers'} />
                    </div>
                </div>
                <div className='statistics__graph statistics__graph_owner-sellers-byers'>
                    <div className='statistics__graph-heading'>
                        <div className='statistics__graph-heading-row'>
                            <p className='statistics__graph-name'>Buyers</p>
                            <p className='statistics__graph-range'>{buyersDateValue ? buyersDateValue : rangeValue === '7d' ? 'Last 7 days' : rangeValue === '30d' ? 'Last 30 days' : 'All time'}</p>
                        </div>
                        {statistics && statistics.buyers_history_dict && statistics.buyers_history_dict.week && statistics.buyers_history_dict.week.items ? <p className='statistics__graph-value'>{buyersValue}</p> : <></>}
                    </div>
                    <div className='statistics__graph-container' onMouseLeave={handleLeave}>
                        <Graph setDateValue={setBuyersDateValue} setValue={setBuyersValue} stats={statistics.buyers_history_dict} rangeValue={rangeValue} collection_id={collection_id} graphName={'Listed NFTs from collection'} theme={theme} bars_vivsible={false} brake_points_visible={false} brake_lines_visible={false} dates_visible={false} toltip_price={false} toltip_value_name={'Buyers'} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;

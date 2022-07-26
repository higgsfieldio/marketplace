import { useState } from 'react';
import './Details.css';

// import gomer from '../../../assets/images/gif/gomer.gif'




function Details({ token }) {

    const [isCoied, setCopied] = useState(false)
    const [isWalletCopied, setWalletCopied] = useState(false)
    const [walletCopiedId, setWalletCopiedId] = useState('')

    function copyToClipboard({text, type, id}) {

        var textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            if(type === 'address'){
                setCopied(true)
                setTimeout(() => {
                    setCopied(false)
                }, 1500);
            }
            else {
                setWalletCopiedId(id)
                setWalletCopied(true)
                setTimeout(() => {
                    setWalletCopiedId(false)
                    setWalletCopied(false)
                }, 1500);
            }
           
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }

    

    return (
        <div className='item-details'>
            <div className='item-details__container'>
                {token.contract_id ?
                    <div className='item-details__item'>
                        <p className='item-details__item-name'>Contract address</p>
                        <p className='item-details__item-value' title={token.contract_id} onClick={() => copyToClipboard({text: token.contract_id, type: 'address'})}>{isCoied? 'Copied!' : `${token.contract_id.slice(0, 5)}....${token.contract_id.slice(token.contract_id.length - 5, token.contract_id.length)}`}</p>
                    </div>
                    : <></>}
                {token.token_contract_id ?
                    <div className='item-details__item'>
                        <p className='item-details__item-name'>Token ID</p>
                        <p className='item-details__item-value' title={token.token_contract_id} >{token.token_contract_id}</p>
                    </div>
                    : <></>}

                {token.rank ?
                    <div className='item-details__item'>
                        <p className='item-details__item-name'>Rank {token.score ? `/ Score` : ''}</p>
                        <p className='item-details__item-value' title={`#${token.rank} ${token.score ? `/ ${parseFloat(Number(token.score.toFixed(2)))}` : ''}`} >#{token.rank} {token.score ? `/ ${parseFloat(Number(token.score.toFixed(2)))}` : ''}</p>
                    </div>
                    : <></>}
                {token.royalty && token.royalty.length > 0 ?
                    <p className='item-details__item-royalty'>Royalty</p>
                    : <></>}
                {token.royalty && token.royalty.length > 0 ?
                    token.royalty.map((item, i) => (
                        <div className='item-details__item' key={`tem-details__item-royalty${i}`}>
                            <p className='item-details__item-name' title={item.wallet} onClick={() => copyToClipboard({text: item.wallet, type: 'wallet', id: i})}>{isWalletCopied && walletCopiedId === i? 'Copied!' :`${item.wallet.slice(0, 5)}....${item.wallet.slice(item.wallet.length - 5, item.wallet.length)}`}</p>
                            <p className='item-details__item-value'>{parseFloat(item.value / 100)}%</p>
                        </div>
                    ))
                    : <></>}

            </div>
        </div>
    );
}

export default Details;


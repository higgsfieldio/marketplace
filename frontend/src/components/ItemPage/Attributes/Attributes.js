import './Attributes.css';

import gomer from '../../../assets/images/gif/gomer.gif'




function Attributes({ attributes, token_id }) {


    return (
        <div className='item-attributes'>
            {attributes && attributes.length > 0 ?
                <div className='item-attributes__items'>
                    {attributes.map((attribute, i) => (
                        <div className='item-attributes__item' key={`attributes-${token_id}-${i}`}>
                            <p className='item-attributes__item-trait-type' title={attribute.trait_type}>{attribute.trait_type}</p>
                            <div className='item-attributes__item-values'>
                                <p className='item-attributes__item-value' title={attribute.value}>{attribute.value}</p>
                                {attribute.rarity ? <p className='item-attributes__item-percent'>{attribute.rarity}</p> : <></>}
                            </div>
                        </div>
                    ))}
                </div>
                :
                <div className='item-attributes__no-item'>
                    <img className='item-attributes__no-item-img' src={gomer} alt=''></img>
                    <p className='item-attributes__no-item-text'>There are no attributes</p>
                </div>
            }
        </div>
    );
}

export default Attributes;


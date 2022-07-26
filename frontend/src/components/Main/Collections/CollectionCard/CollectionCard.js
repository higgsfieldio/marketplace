
import { Link } from 'react-router-dom';
import { API_LINK } from '../../../../assets/utilis';
import './CollectionCard.css';


function CollectionCard({ card }) {

    return (
        <Link to={`/collections/${card.customURLorID}/items`} className='collection-card'>
            <div className='collection-card__container'>
                <div className='collection-card__heading'>
                    <Link to={`/collections/${card.customURLorID}/items`} className='collection-card__avatar'>
                        <div className='collection-card__avatar-img-container'>
                            <img className='collection-card__avatar-img' src={`${API_LINK}/collections/get_file/${card.avatar_url.size3}`} alt="collection avatar" />
                        </div>
                        {card.verified ?
                            <svg className='collection-card__avatar-verify' width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.2398 5.09024C14.1097 3.13101 16.8903 3.13101 17.7602 5.09024V5.09024C18.2949 6.2943 19.6796 6.86786 20.909 6.39451V6.39451C22.9096 5.62429 24.8757 7.59043 24.1055 9.59097V9.59097C23.6321 10.8204 24.2057 12.2051 25.4098 12.7398V12.7398C27.369 13.6097 27.369 16.3903 25.4098 17.2602V17.2602C24.2057 17.7949 23.6321 19.1796 24.1055 20.409V20.409C24.8757 22.4096 22.9096 24.3757 20.909 23.6055V23.6055C19.6796 23.1321 18.2949 23.7057 17.7602 24.9098V24.9098C16.8903 26.869 14.1097 26.869 13.2398 24.9098V24.9098C12.7051 23.7057 11.3204 23.1321 10.091 23.6055V23.6055C8.09043 24.3757 6.12429 22.4096 6.89451 20.409V20.409C7.36786 19.1796 6.7943 17.7949 5.59024 17.2602V17.2602C3.63101 16.3903 3.63101 13.6097 5.59024 12.7398V12.7398C6.7943 12.2051 7.36786 10.8204 6.89451 9.59097V9.59097C6.12429 7.59043 8.09043 5.62429 10.091 6.39451V6.39451C11.3204 6.86786 12.7051 6.2943 13.2398 5.09024V5.09024Z" fill="#6F6FE9" />
                                <path d="M15.0809 16.4449C14.6406 16.8889 13.9227 16.8889 13.4824 16.4449L12.4254 15.379C12.2188 15.1706 11.882 15.1706 11.6754 15.379V15.379C11.4712 15.5848 11.4712 15.9168 11.6754 16.1227L13.4824 17.9449C13.9227 18.3889 14.6406 18.3889 15.0809 17.9449L20.2879 12.6941C20.492 12.4883 20.492 12.1563 20.2879 11.9504V11.9504C20.0813 11.7421 19.7445 11.7421 19.5379 11.9504L15.0809 16.4449Z" fill="white" />
                            </svg>
                            : <></>}
                    </Link>
                    <div className='collection-card__about'>
                        <Link to={`/collections/${card.customURLorID}/items`} className='collection-card__name'>{card.name}</Link>
                        <p className='collection-card__owner collection-card__owner_pc'>Created by <Link to={`/profile/${card.creator.user_id}/on-sale`} className='collection-card__owner-name'>{card.creator && card.creator.user_name ? card.creator.user_name : `@${card.creator.user_id}`}</Link></p>
                        <p className='collection-card__owner collection-card__owner_mobile'>by <Link to={`/profile/${card.creator.user_id}/on-sale`} className='collection-card__owner-name'>{card.creator && card.creator.user_name ? card.creator.user_name : `@${card.creator.user_id}`}</Link></p>
                    </div>
                    <div className='collection-card__likes'>
                        <svg className='collection-card__like-icon' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_994_32700)">
                                <path className='collection-card__like-icon-fill' d="M15.2145 3.08387C13.4744 1.34207 10.6436 1.34207 8.90392 3.08387L8.49985 3.4882L8.09602 3.08387C6.35636 1.34184 3.5253 1.34184 1.78565 3.08387C0.0813119 4.7903 0.0702447 7.49518 1.75998 9.37584C3.30114 11.0905 7.84642 14.795 8.03927 14.9518C8.17019 15.0584 8.32772 15.1102 8.48431 15.1102C8.48949 15.1102 8.49467 15.1102 8.49962 15.11C8.66162 15.1175 8.8248 15.0619 8.95996 14.9518C9.15281 14.795 13.6986 11.0905 15.2402 9.3756C16.9297 7.49518 16.9186 4.7903 15.2145 3.08387ZM14.19 8.4295C12.9884 9.76602 9.68545 12.5225 8.49962 13.5007C7.31379 12.5228 4.01155 9.76649 2.81018 8.42973C1.63141 7.11796 1.62035 5.2498 2.78451 4.0842C3.37908 3.48914 4.1599 3.19137 4.94072 3.19137C5.72154 3.19137 6.50236 3.4889 7.09692 4.0842L7.98511 4.97349C8.09084 5.07934 8.22412 5.14253 8.36399 5.16469C8.59098 5.21349 8.83728 5.15007 9.01389 4.97372L9.90255 4.0842C11.0919 2.89385 13.0265 2.89408 14.2152 4.0842C15.3794 5.2498 15.3683 7.11796 14.19 8.4295Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_994_32700">
                                    <rect className='collection-card__like-icon-fill' width="16" height="16" transform="translate(0.5)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <p className='collection-card__like-count'>{card.likes > 999 ? '999+' : card.likes}</p>
                    </div>
                </div>
                <Link to={`/collections/${card.customURLorID}/items`} className='collection-card__items'>
                    {card.items && card.items.length > 0 ?
                        <>
                            <div className='collection-card__main-image'>
                                <img className='collection-card__main-image-img' src={card.items[0].preview_url} alt='collection item' />
                            </div>
                            <div className='collection-card__another-images'>
                                {card.items.slice(1, 5).map((item, i) => (
                                    <div className='collection-card__another-image' key={`collection_item${i}`}>
                                        <img className='collection-card__another-image-img' src={card.items[i + 1].preview_url} alt='collection item' ></img>
                                    </div>

                                ))}
                            </div>
                        </>
                        :
                        <div className='collection-card__no-items'>
                            <p className='collection-card__no-items-text'>There are no tokens here, other users can't see this collection in your profile</p>
                        </div>

                    }

                </Link>
            </div>
        </Link>
    );
}

export default CollectionCard;

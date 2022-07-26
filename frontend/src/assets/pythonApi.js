import near from "./near";
import moment from "moment-timezone";
import { API_LINK } from "./utilis";

class PythonApi {
  constructor({ baseUrl }) {
    this._BASE_URL = baseUrl
  }

  async createProfile() {

    return fetch(`${this._BASE_URL}/users/create`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken(),
        'x-referral-code': localStorage.getItem('ref-code')
      }
    }).then(this._checkResponse)
  };

  async updateProfile({ data }) {
    return fetch(`${this._BASE_URL}/users/update_profile`, {
      method: 'POST',
      headers: {
        'Authorization': await near.authToken()
      },
      body: data
    }).then(this._checkResponse)
  };

  getProfile({ userCustomUrlOrIdOrWallet }) {
    return fetch(`${this._BASE_URL}/users/get_profile/${userCustomUrlOrIdOrWallet}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

    }).then(this._checkResponse)
  };

  async getLogedProfile() {
    console.log(localStorage.getItem('ref-code'))
    return fetch(`${this._BASE_URL}/users/get_logged_user`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken(),
        'x-referral-code': localStorage.getItem('ref-code')
      }
    }).then(this._checkResponse)
  };

  async toggleLike({ tokenId }) {
    return fetch(`${this._BASE_URL}/tokens/toggle_like`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken()
      },
      body: JSON.stringify({
        "token_id": tokenId
      })
    }).then(this._checkResponse)
  };

  async refreshMetadata() {
    return fetch(`${this._BASE_URL}/tokens/refresh_metadata`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken()
      }
    }).then(this._checkResponse)
  };

  getToken({ tokenId, tz }) {
    return fetch(`${this._BASE_URL}/tokens/get/${tokenId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "tz": tz,
      }
    }).then(this._checkResponse)
  };

  checkUserNameAvailability({ customURL }) {
    return fetch(`${this._BASE_URL}/users/check_custom_url/${customURL}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(this._checkResponse)
  };

  async checkTransactionsHashes({ transaction_hashes, tz }) {
    return fetch(`${this._BASE_URL}/transactions/check_hash`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "tz": tz,
        'Authorization': await near.authToken()
      },
      body: JSON.stringify({
        "transaction_hashes": transaction_hashes,
      })
    }).then(this._checkResponse)
  };


  async sendComment({ token_id, text, tz }) {
    return fetch(`${this._BASE_URL}/tokens/comment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "tz": tz,
        'Authorization': await near.authToken()
      },
      body: JSON.stringify({
        "token_id": token_id,
        "text": text
      })
    }).then(this._checkResponse)
  };

  async createCollection({ data }) {
    var tz = moment.tz.guess();
    return fetch(`${this._BASE_URL}/collections/create`, {
      method: 'POST',
      headers: {
        "tz": tz,
        'Authorization': await near.authToken()
      },
      body: data
    }).then(this._checkResponse)
  };

  async updateCollection({ data }) {
    var tz = moment.tz.guess();
    return fetch(`${this._BASE_URL}/collections/update_collection`, {
      method: 'POST',
      headers: {
        "tz": tz,
        'Authorization': await near.authToken()
      },
      body: data
    }).then(this._checkResponse)
  };

  getCollection({ collection_id }) {
    var tz = moment.tz.guess();
    return fetch(`${this._BASE_URL}/collections/get/${collection_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        "tz": tz,
        'Content-Type': 'application/json'
      }
    }).then(this._checkResponse)
  };

  async getCollectionPossibleItems({ collection_id }) {
    var tz = moment.tz.guess();
    return fetch(`${this._BASE_URL}/collections/possible_items/${collection_id}`, {
      method: 'GET',
      headers: {
        "tz": tz,
        'Authorization': await near.authToken()
      }
    }).then(this._checkResponse)
  };

  async addItemsToCollection({ collection_id, tokens }) {
    var tz = moment.tz.guess();
    return fetch(`${this._BASE_URL}/collections/add_items`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "tz": tz,
        'Authorization': await near.authToken()
      },
      body: JSON.stringify({
        "tokens": tokens,
        "collection_id": collection_id
      })
    }).then(this._checkResponse)
  };

  async changeNotifyViewProps({ notifications }) {
    return fetch(`${this._BASE_URL}/notifications/viewed`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken()
      },
      body: JSON.stringify({
        "notifications": notifications,

      })
    }).then(this._checkResponse)
  };

  search({ text, from_index, limit }) {
    return fetch(`${this._BASE_URL}/search/base`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "text": text,
        "from_index": from_index,
        "limit": limit,
      })
    }).then(this._checkResponse)
  };

  getInfoForMain() {
    var tz = moment.tz.guess();
    return fetch(`${this._BASE_URL}/search/popular`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        "tz": tz,
        'Content-Type': 'application/json'
      }
    }).then(this._checkResponse)
  };


  getCollectonsStats({ from_index, limit, range, sort_name, sort_order }) {
    return fetch(`${this._BASE_URL}/search/statistics`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "from_index": from_index,
        "limit": limit,
        "range": range,
        "sort_name": sort_name,
        "sort_order": sort_order
      })
    }).then(this._checkResponse)
  };

  getCalendar() {
    return fetch(`${this._BASE_URL}/calendar/get`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(this._checkResponse)
  };

  getCalendarForMain() {
    return fetch(`${this._BASE_URL}/calendar/main_page`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(this._checkResponse)
  };

  getExploreCollectons({ next_id, name, limit, days, volume_next }) {
    return fetch(`${this._BASE_URL}/search/explore_collections`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "next_id": next_id,
        "limit": limit,
        "days": days,
        "name": name,
        "volume_next": volume_next
      })
    }).then(this._checkResponse)
  };

  getStatsForMain() {
    return fetch(`${this._BASE_URL}/search/main_statistics`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(this._checkResponse)
  };

  getExploreItems({ next_id, limit, name, is_only_on_sale }) {
    return fetch(`${this._BASE_URL}/search/category`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "next_id": next_id,
        "limit": limit,
        "name": name,
        "is_only_on_sale": is_only_on_sale
      })
    }).then(this._checkResponse)
  };

  async createItem({ data }) {
    return fetch(`${this._BASE_URL}/ipfs/upload`, {
      method: 'POST',
      headers: {
        'Authorization': await near.authToken()
      },
      body: data
    }).then(this._checkResponse)
  };

  getProfileByWallet({ user_wallet }) {
    return fetch(`${this._BASE_URL}/users/get_profile_by_wallet/${user_wallet}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

    }).then(this._checkResponse)
  };

  submitEmail({ email }) {
    return fetch(`${this._BASE_URL}/email/member/add`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "email_address": email,
        }
      )
    }).then(this._checkResponse)
  };

  getTokenMeta({ id }) {
    return fetch(`${this._BASE_URL}/tokens/metadata/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },

    }).then(this._checkResponse)
  };

  async getRefLeaderBoards() {
    return fetch(`${this._BASE_URL}/referrals/leaders`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken() ? await near.authToken() : null,
      },

    }).then(this._checkResponse)
  };

  async getRefDashboard() {
    return fetch(`${this._BASE_URL}/referrals/dashboard`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken()
      },
    }).then(this._checkResponse)
  };

  async getChildReferrals() {
    return fetch(`${this._BASE_URL}/referrals/referrals`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken()
      },
    }).then(this._checkResponse)
  };

  async getCreatedRefLinks({ last_id = null, limit = null }) {
    return fetch(`${this._BASE_URL}/referrals/links${last_id && !limit ? `?last_id=${last_id}` : ''}${limit && !last_id ? `?limit=${limit}` : ''}${limit && last_id ? `?last_id=${last_id}&?limit=${limit}` : ''}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken()
      },
    }).then(this._checkResponse)
  };

  async createRefLink({ link_name, tag_1, tag_2, customName }) {
    return fetch(`${this._BASE_URL}/referrals/create_link`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await near.authToken()
      },
      body: JSON.stringify(
        {
          "name": link_name,
          "tag_1": tag_1 ? tag_1 : null,
          "tag_2": tag_2 ? tag_2 : null,
          "customName": customName ? customName : null,

        }
      ),
    }).then(this._checkResponse)
  };

  checkCustomLinkAvailability({ code }) {
    return fetch(`${this._BASE_URL}/referrals/check_custom_link_availability?code=${code}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(this._checkResponse)
  };



  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    else {
      var statusCode = res.status
      return res.json().then((res) => {
        return Promise.reject({
          statusCode: statusCode,
          message: res.message,
          detail: res.detail,
        })
      })
    }
    ;
  }

}

const pythonApi = new PythonApi({
  baseUrl: API_LINK
});
export default pythonApi
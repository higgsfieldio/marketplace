class CoingecoApi {
    constructor({ baseUrl }) {
      this._BASE_URL = baseUrl
    }
  
    getUsdExchangeRate() {
      return fetch(`${this._BASE_URL}/v3/simple/price?ids=near&vs_currencies=usd`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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
            message: res.message
          })
        })
      }
      ;
    }
  
  }
  
  const coingecoApi = new CoingecoApi({
    baseUrl: 'https://api.coingecko.com/api'
    // baseUrl: 'http://localhost:3003'
  });
  export default coingecoApi
  
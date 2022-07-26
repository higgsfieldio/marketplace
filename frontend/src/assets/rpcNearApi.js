import getConfig from "./config";

class RpcNearApi {
  constructor({ nodeUrl, walletUrl, helperUrl }) {
    this._NODE_URL = nodeUrl
    this._WALLET_URL = walletUrl
    this._HELPER_URL = helperUrl
  }

  checkPubKeyAvailability(accountId, key) {
    return fetch(this._NODE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
          "request_type": "view_access_key",
          "finality": "final",
          "account_id": accountId,
          "public_key": key
        }
      })

    }).then(this._checkResponseForTrueFalse)
  };

  viewAccount({ accountId }) {
    return fetch(this._NODE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
          "request_type": "view_account",
          "finality": "final",
          "account_id": accountId
        }
      })

    }).then(this._checkResponse)
  };

  checkMethodAvailability({ accountId, methodName, testArgs }) {
    return fetch(this._NODE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
          "request_type": "call_function",
          "account_id": accountId,
          "method_name": methodName,
          "args_base64": testArgs,
          "finality": "optimistic",
        }
      })

    }).then(this._checkMethodResponse)
  };

  _checkResponseForTrueFalse(res) {
    if (res.ok) {
      const toReturn = res.json().then((resJsoned) => {
        if (!('error' in resJsoned) && !('error' in resJsoned.result)) {
          return true
        }
        else {
          return false
        }
      })
      return toReturn
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

  _checkResponse(res) {
    if (res.ok) {
      const toReturn = res.json().then((resJsoned) => {
        if (!('error' in resJsoned) && !('error' in resJsoned.result)) {
          return resJsoned
        }
        else {
          return Promise.reject({
            statusCode: statusCode,
            message: res.message
          })
        }
      })
      return toReturn
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

  _checkMethodResponse(res) {
    if (res.ok) {
      return res.json().then((resJsoned) => {
        if (resJsoned && resJsoned.result && resJsoned.result.error && resJsoned.result.error.toString().toLowerCase().includes('prohibitedinview')) {
          return {
            methodAvailible: true
          }
        } else {
          return {
            methodAvailible: false
          }
        }

      });
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

const rpcNearApi = new RpcNearApi({
  nodeUrl: getConfig(process.env.CONTRACT_NAME || 'mainnet').nodeUrl,
  walletUrl: getConfig(process.env.CONTRACT_NAME || 'mainnet').walletUrl,
  helperUrl: getConfig(process.env.CONTRACT_NAME || 'mainnet').helperUrl
});
export default rpcNearApi

import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'
import { base_decode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils'
import { createTransaction, functionCall } from 'near-api-js/lib/transaction'
import "regenerator-runtime/runtime";
import rpcNearApi from './rpcNearApi'
import getConfig from './config'

class Near {
	constructor() {
		this.accountId = {}
		this.wallet = {}
		this.near = {}
	}

	async init() {
		const nearConfig = getConfig(process.env.CONTRACT_NAME || 'mainnet')

		const near = await nearAPI.connect({
			deps: {
				keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
			},
			...nearConfig,
		})

		// Needed to access wallet
		this.wallet = new nearAPI.WalletConnection(near)
		this.accountId = this.wallet.getAccountId()
		this.near = near
		this.config = nearConfig
		this.signer = new nearAPI.InMemorySigner(this.wallet._keyStore)

		// this.contract = await this.near.loadContract(nearConfig.contractName, {
		// 	// NOTE: This configuration only needed while NEAR is still in development
		// 	// View methods are read only. They don't modify the state, but usually return some value.
		// 	viewMethods: ['whoSaidHi'],
		// 	// Change methods can modify the state. But you don't receive the returned value when called.
		// 	changeMethods: ['sayHi'],
		// 	// Sender is the account ID to initialize transactions.
		// 	sender: this.accountId,
		//   });

	}

	async authToken() {
		if (!this.accountId) {
			return null
		}

		const arr = new Array(this.accountId)
		for (var i = 0; i < this.accountId.length; i++) {
			arr[i] = this.accountId.charCodeAt(i)
		}
		const msgBuf = new Uint8Array(arr)
		const signedMsg = await this.signer.signMessage(
			msgBuf,
			this.wallet._authData.accountId,
			this.wallet._networkId
		)
		const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
		const signature = Buffer.from(signedMsg.signature).toString('hex')
		const payload = [this.accountId, pubKey, signature]

		return Base64.encode(payload.join('&'))
	}

	async checkPubKeyAvailability() {
		const keyPair = await this.signer.keyStore.getKey(this.wallet._networkId, this.wallet._authData.accountId)
		const msg = Buffer.from("hi")

		const { signature } = keyPair.sign(msg)
		// let isValid
		// try {
		// 	isValid = keyPair.verify(msg, signature)
			

		// } catch (err) {
		// 	throw Error('Not availible')
		// }
		// if (isValid) {
		// 	return rpcNearApi.checkPubKeyAvailability(this.accountId, keyPair.getPublicKey().toString())
		// }
		const isValid = keyPair.verify(msg, signature)
		if (isValid) {
			return rpcNearApi.checkPubKeyAvailability(this.accountId, keyPair.getPublicKey().toString())
		} else{
			 return false
		}


	}

	async login() {
		this.wallet.requestSignIn(this.config.contractName, "higgsfield.io")
	}

	logout() {
		this.wallet.signOut()
		window.location.replace(window.location.origin + window.location.pathname)
	}

	async createTransaction({ receiverId, actions, nonceOffset = 1 }) {
		const localKey = await this.near.connection.signer.getPublicKey(
			this.wallet.account().accountId,
			this.near.connection.networkId
		)
		const accessKey = await this.wallet
			.account()
			.accessKeyForTransaction(receiverId, actions, localKey)
		if (!accessKey) {
			throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`)
		}

		const block = await this.near.connection.provider.block({ finality: 'final' })
		const blockHash = base_decode(block.header.hash)
		const publicKey = PublicKey.from(accessKey.public_key)
		const nonce = accessKey.access_key.nonce + nonceOffset

		return createTransaction(
			this.wallet.account().accountId,
			publicKey,
			receiverId,
			nonce,
			actions,
			blockHash
		)
	}

	async executeMultipleTransactions(transactions, callbackUrl) {
		const nearTransactions = await Promise.all(
			transactions.map((tx, i) =>
				this.createTransaction({
					receiverId: tx.receiverId,
					nonceOffset: i + 1,
					actions: tx.functionCalls.map((fc) =>
						functionCall(fc.methodName, fc.args, fc.gas, fc.attachedDeposit)
					),
				})
			)
		)
		console.log(nearTransactions, callbackUrl)
		return this.wallet.requestSignTransactions({
			transactions: nearTransactions,
			callbackUrl: callbackUrl,
		})
	}
}

const near = new Near()
near.init()

export default near
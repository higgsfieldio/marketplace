#!/usr/bin/env node

'use strict';
require('dotenv').config();
const blockchain = require('./blockchain');
const api = require('./api');
const faker = require('faker');
const crypto = require('crypto');
const CatboxMemory = require('@hapi/catbox-memory');
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const { Client } = require('pg');
Client.poolSize = 100;

const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, 'utf8'));
const ViewCacheExpirationInSeconds = 10;
const ViewGenerateTimeoutInSeconds = 30;

const private_key = process.env.NEAR_KEY
const account_id = process.env.NEAR_ID
const market_id = process.env.MARKETPLACE_NEAR_ID
const admin_key = process.env.ADMIN_KEY


const init = async () => {
    const server = Hapi.server({
        port: settings.server_port,
        host: settings.server_host,
        cache: [
            {
                name: 'near-api-cache',
                provider: {
                    constructor: CatboxMemory
                }
            }
        ]
    });

    function processRequest(request) {
        Object.keys(request.payload).map((key) => {
            switch (request.payload[key]) {
                case '{username}':
                    request.payload[key] = faker.internet
                        .userName()
                        .replace(/[^0-9a-z]/gi, '');
                    break;
                case '{color}':
                    request.payload[key] = faker.internet.color();
                    break;
                case '{number}':
                    request.payload[key] = faker.random.number();
                    break;
                case '{word}':
                    request.payload[key] = faker.random.word();
                    break;
                case '{words}':
                    request.payload[key] = faker.random.words();
                    break;
                case '{image}':
                    request.payload[key] = faker.random.image();
                    break;
            }
        });

        return request;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return api.notify(
                'Welcome to NEAR REST API SERVER (https://github.com/near-examples/near-api-rest-server)! ' +
                (!settings.master_account_id
                    ? 'Please initialize your NEAR account in order to use simple nft mint/transfer methods'
                    : `Master Account: ${settings.master_account_id}`)
            );
        },
    });


    server.route({
        method: 'POST',
        path: '/add_approved_nft_contract_ids',
        handler: async (request) => {
            request = processRequest(request);
            let {
                ids,
                network,
                rpc_node,
                headers
            } = request.payload;
            let params = { "nft_contract_ids": ids }
            let attached_gas = '10000000000000'
            let attached_tokens = '1'
            let method = "add_approved_nft_contract_ids"
            console.log({
                account_id: account_id,
                private_key: private_key,
                attached_tokens,
                attached_gas,
                contract: market_id,
                method,
                params,
                network,
                rpc_node,
            })
            return await blockchain.Call({
                account_id: account_id,
                private_key: private_key,
                attached_tokens,
                attached_gas,
                recipient: market_id,
                method,
                params,
                network,
                rpc_node,
                headers
            });
        },
    });

    server.route({
        method: 'GET',
        path: '/balance',
        handler: async () => {
            return await blockchain.GetBalance(account_id);
        }
    });


    server.route({
        method: 'POST',
        path: '/new-tx',
        handler: async (request) => {
            request = processRequest(request);
            let {
                method,
                params,
                attached_gas,
                attached_tokens,
                
                network,
                rpc_node,
                headers
            } = request.payload;
            
            console.log({
                account_id: account_id,
                private_key: private_key,
                attached_tokens,
                attached_gas,
                contract: market_id,
                method,
                params,
                network,
                rpc_node,
            })
            return await blockchain.Call({
                account_id: account_id,
                private_key: private_key,
                attached_tokens,
                attached_gas,
                recipient: market_id,
                method,
                params,
                network,
                rpc_node,
                headers
            });
        },
    });

    // server.route({
    //     method: 'POST',
    //     path: '/parse_seed_phrase',
    //     handler: async (request) => {
    //         request = processRequest(request);

    //         return await user.GetKeysFromSeedPhrase(request.payload.seed_phrase);
    //     },
    // });



    // server.route({
    //     method: 'GET',
    //     path: '/keypair',
    //     handler: async () => {
    //         return await user.GenerateKeyPair();
    //     }
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/mint_nft',
    //     handler: async (request) => {
    //         let { min, max } = request.payload;

    //         if (!min || !max) min = max = 0;
    //         let response = [];

    //         request = processRequest(request);
    //         for (let i = min; i <= max; i++) {
    //             const tokenId = request.payload.token_id.replace('{inc}', i);

    //             let { account_id, private_key, metadata, contract } = request.payload;

    //             const tx = await token.MintNFT(
    //                 tokenId,
    //                 metadata,
    //                 contract,
    //                 account_id,
    //                 private_key
    //             );

    //             if (tx) {
    //                 if (min === max) {
    //                     let create_token = await token.ViewNFT(tokenId, contract);
    //                     create_token.token_id = tokenId;
    //                     response.push({ token: create_token, tx: tx });
    //                 } else {
    //                     response.push({ tx: tx });
    //                 }
    //             } else {
    //                 response.push({ text: 'Error. Check backend logs.' });
    //             }
    //         }

    //         return response;
    //     },
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/transfer_nft',
    //     handler: async (request) => {
    //         request = processRequest(request);

    //         let {
    //             token_id,
    //             receiver_id,
    //             enforce_owner_id,
    //             memo,
    //             contract,
    //             owner_private_key,
    //         } = request.payload;

    //         const txStatus = await token.TransferNFT(
    //             token_id,
    //             receiver_id,
    //             enforce_owner_id,
    //             memo,
    //             contract,
    //             owner_private_key
    //         );

    //         if (txStatus.error) {
    //             return txStatus;
    //         } else if (txStatus.status.Failure) {
    //             return {
    //                 error:
    //                     'Because of some reason transaction was not applied as expected',
    //             };
    //         } else {
    //             const new_token = await token.ViewNFT(token_id, contract);
    //             if (!new_token) return api.reject('Token not found');

    //             new_token.tx = txStatus.transaction.hash;
    //             return new_token;
    //         }
    //     },
    // });

    // server.route({
    //     method: 'GET',
    //     path: '/about',
    //     handler: async () => {
    //         const json = require('./package.json');
    //         return "NEAR REST API SERVER Ver. " + json.version;
    //     }
    // });

//     server.route({
//         method: 'POST',
//         path: '/explorer',
//         handler: async (request) => {
//             let {
//                 user,
//                 host,
//                 database,
//                 password,
//                 port,
//                 query,
//                 parameters
//             } = request.payload;

//             const client = new Client({
//                 user,
//                 host,
//                 database,
//                 password,
//                 port,
//             });

//             if (["104.199.89.51", "35.184.214.98"].includes(host)) {
//                 return api.reject('Please run explorer function only on your own NEAR REST API SERVER instance, https://github.com/near-examples/near-api-rest-server');
//             }

//             try {
//                 client.connect();
//                 let response = await client.query(query, parameters);
//                 return response.rows;
//             } catch (ex) {
//                 return api.reject('Error. ' + ex.message);
//             }
//         },
//     });

//     server.route({
//         method: 'POST',
//         path: '/sign_url',
//         handler: async (request) => {
//             let {
//                 account_id,
//                 method,
//                 params,
//                 deposit,
//                 gas,
//                 receiver_id,
//                 meta,
//                 callback_url,
//                 network
//             } = request.payload;

//             return blockchain.GetSignUrl(
//                 account_id,
//                 method,
//                 params,
//                 deposit,
//                 gas,
//                 receiver_id,
//                 meta,
//                 callback_url,
//                 network
//             );
//         },
//     });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

const getServerMethodParams = () => {
    return {
        generateKey: (params) => {
            let hash = crypto.createHash('sha1');
            hash.update(JSON.stringify(params));
            return hash.digest('base64');
        },
        cache: {
            cache: 'near-api-cache',
            expiresIn: ViewCacheExpirationInSeconds * 1000,
            generateTimeout: ViewGenerateTimeoutInSeconds * 1000,
            getDecoratedValue: true
        }
    }
};

const replyCachedValue = (h, { value, cached }) => {
    const lastModified = cached ? new Date(cached.stored) : new Date();
    return h.response(value).header('Last-Modified', lastModified.toUTCString());
};

init();

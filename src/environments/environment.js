/**
 * For a list of all our constants & env files, see constants.js
 */

// switch these to do debugging discord on local
export const isDev = process.env.NODE_ENV !== 'production';
// export const isDev = false; // if want to test prod stuff, when on local

export const environment = {
    backendApi: isDev ? 'http://localhost:5001/nft-discord-relay/us-central1/api' : 'https://us-central1-nft-discord-relay.cloudfunctions.net/api',
    // backendApi: 'http://localhost:5001/nft-discord-relay/us-central1/api', // if doing prod locally ... but want to still point to dev

    // freelance - 973441843347984424
    // production - 927008889092857898
    // vehn IC bot - 861589624400904204
    // damjan? - 973608903801708634

    clientId: isDev ? process.env.REACT_APP_devClientId : '927008889092857898', // client ID for our discord bot,

	ionicAppUrl : isDev ? "http://localhost:8100" : "https://soldecoder.app"
};


export const VERSION_CODE = '1.0.55';

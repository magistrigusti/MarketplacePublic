import axios from "axios";
import { environment } from "../environments/environment";
import { instance } from "../axios";

export async function getLiveFoxTokenData(mySplTokens: any) {

    // get token data directly from FF, from the user's browser
    // const rawTokenData = (await axios.get('https://dens.famousfoxes.com/cache.json')).data;
    // // get whitelisted named data from FF
    // const verifiedTokenData = (await axios.get('https://dens.famousfoxes.com/whitelist.json')).data;

    // Use the data aggregation logic from the backend, but use data obtained from clientside-called FamousFoxes API
    const results = (await instance.get(`${environment.backendApi}/receiver/foxTokenAnalysis`, {
        // rawTokenData,
        // verifiedTokenData
    })).data;

    // NOTE: we don't have the "got 401 - go login" because the "FFNamed" on this page should do that

    // loop through table data (all fox tokens)... to eventually add which of these are your SPL tokens
    for (const splToken of mySplTokens) {
        const token = results.find((r: any) => r.token === splToken.token);
        if (!token) continue;
        // then ADD data
        if (!token.whichMyWallets)
            token.whichMyWallets = `${splToken.amount} - ${shortenedWallet(splToken.wallet)}`;
        else
            token.whichMyWallets += `, ${shortenedWallet(splToken.wallet)}`;
    }

    return results;
}

export function shortenedWallet(wallet: string) {
    return wallet.substring(0, 4) +
        '...' +
        wallet.substring(wallet.length - 4);
}

// OLD GET TABLE DATA
// instance
//     .get(environment.backendApi + '/receiver/foxTokenAnalysis')
//     .then((res) => {
//
//         const data = res.data.data;
//         // const newData = [];
//         //
//         //
//         // for(let i in data){
//         //     if(data[i].customName){
//         //         newData.push(data[i]);
//         //     }
//         // }
//
//         // console.log(mySplTokens);
//
//         // loop through table data (all fox tokens)... to eventually add which of these are your SPL tokens
//         for (let i in data) {
//             // loop through user tokens
//             for (let y in mySplTokens) {
//                 // if match
//                 // @ts-ignore
//                 if (splToken.token === data[i].token) {
//                     // then ADD data
//                     // @ts-ignore
//                     if (!data[i].whichMyWallets) {
//                         data[i].whichMyWallets = shortenedWallet(splToken.wallet);
//                     }
//                     // @ts-ignore
//                     else {
//                         data[i].whichMyWallets += ", " + shortenedWallet(splToken.wallet);
//                     }
//
//                     break;
//                 }
//             }
//         }
//
//         setTableData(data);
//         setFullTableData(data);
//     })
//     .catch((err) => {
//         console.error("error when getting fox token data: " + err);
//     });

export interface FoxTokenData {
	token : string;
	floorPrice: number;name : string;
	listedTokens : {
		cost: number;
		count: number;
	}[],
	totalTokenListings : number;
	whichMyWallets : string;
    lastSaleDate: string;
    twitter: string;
    discord: string;
	createdAt:string
}

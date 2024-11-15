import { Dispatch, SetStateAction } from "react";
import { ServerModel } from "./Server";

export interface IWhitelist {
	id: string;
	active:boolean;
	max_users : number;
	target_server : string;
	source_server : string;
	expiration_date : string;
	image : string;
	twitter : string | null;
	discordInvite : string | null;
	type : "raffle" | "fcfs";
	description : string;
	required_role : string;
	whitelist_role : string;
	required_role_name : string;
	whitelist_role_name : string;
	targetServer: ServerModel;
	sourceServer: ServerModel;
	claimed: boolean;
	claimCounts: number;
	isExpired:boolean;
	showLive:boolean;
	claims:any;
	myLiveDAO:boolean;
	magicEdenUpvoteUrl:string;
	iMod: boolean;
	setIsExploding?:Dispatch<SetStateAction<boolean>>;
	setSourceServerData?:Dispatch<SetStateAction<sourceServerData>>;
	isExploding?:boolean;
	tabButton?:string;
	deleteWhiteList?:any;
	won: boolean;
	numOfElements: number;
	category: string;
}

export interface sourceServerData {
	id: string | '',
	category: string
}

export interface Server {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: [];
}

export interface ServerModel {
    id: string;
    name: string;
    iconUrl: string;
	discordGuildId : string;
	guildOwnerDiscordId : string;
}
export interface FormFields {
    whitelist_role:string;
    image: File & { path: string;} | '';
    target_server: number | '';
    expiration_date: string;
    type: 'raffle' | 'fcfs';
    description: string;
    twitter: string;
    discordInvite:string;
    magicEdenUpvoteUrl?:string;
    mintDate:string;
    mintSupply:string;
    mintPrice:any | ''
    verified_role: string;
}

export interface multipleServerDetails{
    max_users: number | '';
    required_role:string;
    required_role_name?: string;
    id:string;
    name:string;
    discordGuildId:string;
    required_role_dropdown:any[] ;
}


export interface multipleField extends FormFields {
    multipleServerDetails:multipleServerDetails[];
}
export interface whiteListFormField extends FormFields {
        max_users: string,
        required_role: string,
        required_role_name: string,
        id?:string;
        imagePath?:string;
}


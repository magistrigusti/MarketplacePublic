import { Message } from "./Message";

export interface SearchResponse {
    error?: boolean;
    body?: string;
    hasMore?: boolean;
    messages: (Message | undefined)[];
    totalCount: number;
    word: string;
    ten_day_count: {
        count: number;
        date: string;
    }[];
    source : [string,number][]
}
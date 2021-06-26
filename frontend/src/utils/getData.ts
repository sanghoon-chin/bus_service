import { myAPIKey } from '@/config';
import {origin} from '../data/apiList';

type FETCHDATA = (path: string, query?: string) => Promise<string>;

export const fetchData: FETCHDATA = (path, query='') => {
    query += `&serviceKey=${myAPIKey}`;
    const endpoint = `${origin}${path}?${query}`;
    return fetch(endpoint).then(res => res.text());
}
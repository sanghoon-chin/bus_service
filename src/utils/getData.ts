// 여기도 promise<any> 말고 방법은 뭐가 있나..??
type GETDATA = (origin: string, path: string, query: string, method?: string) => Promise<any>

export const getData: GETDATA = (origin, path, query, method='GET') => {
    const url = `${origin}${path}?${query}`;
    return fetch(url, {method}).then(res => res.text());
}
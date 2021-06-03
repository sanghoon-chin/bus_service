type GETDATA = (origin: string, path: string, query: string, method?: string) => Promise<string>

export const getData: GETDATA = (origin, path, query, method='GET') => {
    const url = `${origin}${path}?${query}`;
    const dom = new DOMParser()
    return fetch(url, {method}).then(res => res.text());
}
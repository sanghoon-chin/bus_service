import './index.scss';
import './map'
import { myAPIKey } from '../config/index';
import { getData } from '../utils/getData';

import endpoint from '../data/reqApiList';

// 이건 어디서 불러오는 거지??
// import {writeFile} from 'fs/promises';
// import path from 'path';
// const filePath = path.resolve(__dirname, 'src/data');

const requestOrigin:string = `http://openapi.tago.go.kr/openapi/service/`;

const $: typeof document.querySelector = document.querySelector.bind(document);
const $$: typeof document.querySelectorAll = document.querySelectorAll.bind(document);

interface CITYINFO {
    cityCode: string;
    cityName: string;
}

let cityInfo: (null | CITYINFO[]) = null;
const cityContainer = $('#city-container') as HTMLDivElement;
const busContainer = $('#bus-container') as HTMLDivElement;

const init = () => {
    console.log(cityInfo);
    cityInfo?.forEach(({cityName, cityCode}) => {
        const input:HTMLInputElement = document.createElement('input');
        input.type = 'radio';
        input.name = 'city';
        input.id = cityName;
        input.style.display = 'none';
        const label:HTMLLabelElement = document.createElement('label');
        label.innerHTML = cityName;
        label.dataset.code = cityCode;
        label.classList.add('option-form');
        label.htmlFor = cityName;
        cityContainer.appendChild(input);
        cityContainer.appendChild(label);
    })
};

cityContainer.addEventListener('click', async (e:MouseEvent) => {
    const tar = e.target as HTMLElement;
    console.log(tar.dataset.code);
    const q = new URLSearchParams();
    q.append('ServiceKey', myAPIKey);
    q.append('citycode', '25')
    q.append('routeId', 'DJB30300052')
    const data = await getData(requestOrigin, endpoint.get('노선별버스위치목록조회'), q.toString())
    console.log(data)
});

(async () => {
    const queries = new URLSearchParams();
    queries.append('ServiceKey', myAPIKey);
    queries.append('cityCode', '22')
    queries.append('cityname', '대구광역시')
    const result = await getData(requestOrigin, endpoint.get('도시코드목록조회'), queries.toString());
    const dom:DOMParser = new DOMParser();
    const data = dom.parseFromString(result, 'text/xml');
    // 타입 추론을 해주는데 이렇게 하는 게 맞나??
    cityInfo = Array.from(data.querySelectorAll('items > item')).map(v => ({
        cityCode: v.querySelector('citycode')?.innerHTML,
        cityName: v.querySelector('cityname')?.innerHTML
    })) as CITYINFO[]
    // 질문. 파일로 저장하고 싶음
    // await writeFile(filePath + 'cityInfo.json', JSON.stringify(cityInfo))

    init();
})();
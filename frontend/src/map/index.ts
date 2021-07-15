import { url } from '../data/apiList';
import { initMap } from './map';
import { fetchData } from '../utils/getData';
import { areaIds } from '../data/areaIds';

import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrapInit from './common';
import './index.scss';
import { IKakaoMap, IKakaoLatLng, IKakaoMarker, IKakaoPolyline } from 'tenel-kakao-map';
import type {POSITION, Station} from '../interface/type';

bootstrapInit.init();

// let map: InstanceType<typeof kakao.maps.Map>;    // 이런 방법도 가능. class와 instance는 엄연히 다름!!
let map: IKakaoMap;

// 전역변수(window property)로 등록. jquery랑 충돌나는것도 해결해야할 듯 => 잘 안됨..
window.$ = document.querySelector.bind(document);
// globalThis.$ => 이거 타입 등록해도 안됨.. 어차피 브라우저에서는 윈도우랑 같은거 아닌가!?!?!?

let polyLine:IKakaoPolyline;
let markers:IKakaoMarker[] = [];
let positions:POSITION[] = [];

(async () => {
    map = await initMap();
    window.$('.spinner-border')?.classList.add('none');
})();

const busLocContainer = window.$('#bus-loc-container') as HTMLUListElement;
const busRouteContainer = window.$("#bus-route-container") as HTMLUListElement;
const selectedLoc = window.$('#bus-loc-info') as HTMLDivElement;
const selectedRoute = window.$('#bus-route-info') as HTMLDivElement;
const searchBtn = window.$('#search-btn') as HTMLButtonElement;
const stationBtn = window.$('#station-btn') as HTMLButtonElement;

const routeColorSet = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

const initBusLocInfo = () => {
    for (let { cityId, cityName } of areaIds) {
        const li = document.createElement('li');
        li.classList.add('dropdown-item');
        li.dataset.id = cityId;
        li.innerHTML = cityName;
        busLocContainer.appendChild(li)
    }

    busLocContainer.addEventListener('click', async (e: Event) => {
        if ((e.target as HTMLElement).nodeName !== 'LI')
            return;
        // selectedRoute.innerHTML = '노선 선택';
        selectedRoute.dataset.id = '';
        const li = e.target as HTMLLIElement;
        selectedLoc.innerHTML = li.innerHTML;
        const id = li.dataset.id as string;
        selectedLoc.dataset.id = id;
        selectedRoute.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
            노선 선택
        `;
        initBusRouteInfo(id);
    })
}

const initBusRouteInfo = async (areaId: string) => {
    const queries = new URLSearchParams();
    queries.append('areaId', areaId);
    const textData = await fetchData(url.get('운행지역별노선번호목록조회') as string, queries.toString());
    const dom = new DOMParser();
    const html = dom.parseFromString(textData, 'application/xml');
    const msgBody = html.querySelectorAll('msgBody > busRouteList');
    const data = [...msgBody].map((v) => {
        const routeName = v.querySelector('routeName') as HTMLElement;
        const routeId = v.querySelector('routeId') as HTMLElement;
        const routeTypeCd = v.querySelector('routeTypeCd') as HTMLElement;
        return {
            routeName: routeName.innerHTML,
            routeId: routeId.innerHTML,
            routeTypeCd: routeTypeCd.innerHTML
        }
    })

    // render
    busRouteContainer.innerHTML = '';
    data.forEach(({ routeName, routeId }) => {
        const li = document.createElement('li');
        li.classList.add('dropdown-item');
        li.dataset.id = routeId;
        li.innerHTML = `${routeName.replace(/예약/, '')} 번 버스`;
        busRouteContainer.appendChild(li);
        selectedRoute.innerHTML = '노선 선택';
    });

    busRouteContainer.addEventListener('click', (e: Event) => {
        if ((e.target as HTMLElement).nodeName !== 'LI') return;
        const li = e.target as HTMLLIElement;
        selectedRoute.innerHTML = li.innerHTML;
        selectedRoute.dataset.id = li.dataset.id
    });

    stationBtn.disabled = false;
    stationBtn.addEventListener('click', async (e: Event) => {
        // 경유 정류소 정보 가져오기
        // 정류소 marker그리기

        const stationList = await getBusStationInfo();

        markers = [];
        positions = [];
        if(markers.length > 0){
            removeMarkers(positions, markers)
        }

        stationList.forEach((station:Station) => {
            positions.push({
                title: station.stationName,
                latlng: new kakao.maps.LatLng(station.stationLoc.y, station.stationLoc.x)
            })
        })

        const markerImage = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', new kakao.maps.Size(24, 35))

        positions.forEach((pos) => {
            const marker = new kakao.maps.Marker({
                map,
                position: pos.latlng,
                title: pos.title,
                image: markerImage
            })
            markers.push(marker);
        })
    })
};

searchBtn.addEventListener('click', async () => {
    const areaId = selectedLoc.dataset.id;
    const routeId = selectedRoute.dataset.id;
    if (!areaId || !routeId) {
        bootstrapInit.init().toastMsg.show();
        return;
    }
    const queries = new URLSearchParams();
    queries.append('routeId', routeId);
    const textData = await fetchData(url.get('노선형상정보목록조회') as string, queries.toString());
    const dom = new DOMParser();
    const html = dom.parseFromString(textData, 'application/xml');
    const busRouteLineList = html.querySelectorAll('msgBody > busRouteLineList');
    const data = [...busRouteLineList].map((v) => {
        const x = v.querySelector('x') as HTMLElement;
        const y = v.querySelector('y') as HTMLElement;
        return {
            lat: Number(x.innerHTML),
            lon: Number(y.innerHTML)
        }
    });

    const linePath: IKakaoLatLng[] = [];
    
    // 지도 범위 재설정
    const bounds = new kakao.maps.LatLngBounds();
    
    data.forEach(({ lat, lon }) => {
        const obj = new kakao.maps.LatLng(lon, lat);
        linePath.push(obj)
        bounds.extend(obj)
    });
    
    map.setBounds(bounds);

    // 기존의 경로 및 마커 초기화
    if(polyLine){
        removePolyLine(polyLine);
    }
    if(markers.length > 0){
        removeMarkers(positions, markers)
    }
    markers = [];
    positions = [];

    // 해당 노선 경로 그리주기
    polyLine = new kakao.maps.Polyline({
        path: linePath,
        strokeStyle: 'solid',
        strokeColor: routeColorSet[0],
        strokeWeight: 5,
        strokeOpacity: 0.7,
    });


    // 실시간 버스 위치 대신 mock 데이터
    const randomIdx = Math.floor(Math.random() * linePath.length)
    const randomCoord = linePath[randomIdx];
    const prev = linePath[randomIdx - 10];  // 앞에서 10번째 이내나 뒤에서 10번째 이내면 에러 날수도 있으니깐 이거 에러처리
    const next = linePath[randomIdx + 10];
    const slope =  (next.getLng() - prev.getLng()) / (next.getLat() - prev.getLat());
    const angle = Math.atan2(slope, 1);

    // 이거 어떻게 등록..??
    // Math.prototype.radian = 
    
    const customOverlay = new kakao.maps.CustomOverlay({
        map,
        clickable: true,
        content: returnCustomBusMarkerImg(angle),
        position: randomCoord,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: 1000
    });

    customOverlay.setMap(map);
    polyLine.setMap(map);
});

const returnCustomBusMarkerImg = (angle:number) => {

    const rad2Deg = (rad: number) => rad * Math.PI / 180;

    const div = document.createElement('div');
    div.classList.add('customOverlay');
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.backgroundImage = 'url(./assets/bus_icon.png)';
    div.style.backgroundSize = 'contain';
    div.style.transform = `rotate(${90 - rad2Deg(angle)}deg)`
    return div;
}


const getBusStationInfo = async () => {
    const routeId = selectedRoute.dataset.id as string;
    const queries = new URLSearchParams();
    queries.append('routeId', routeId);
    const textData = await fetchData(url.get('경유정류소목록조회') as string, queries.toString());
    const dom = new DOMParser();
    const html = dom.parseFromString(textData, 'application/xml');
    const busRouteStationList = html.querySelectorAll('msgBody > busRouteStationList');
    const data:Station[] = [...busRouteStationList].map((v) => {
        return {
            regionName: (v.querySelector('regionName') as HTMLElement).innerHTML,
            stationLoc: {
                x: Number((v.querySelector('x') as HTMLElement).innerHTML),
                y: Number((v.querySelector('y') as HTMLElement).innerHTML)
            },
            stationName: (v.querySelector('stationName') as HTMLElement).innerHTML,
            stationId: (v.querySelector('stationId') as HTMLElement).innerHTML
        };
    });
    return data;
};

const removeMarkers = (positions: POSITION[], markers: IKakaoMarker[]) => {
    markers.forEach(
        (marker:IKakaoMarker) => {marker.setMap(null)
    });
    markers = [];
    positions = [];
}

const removePolyLine = (polyline:IKakaoPolyline) => {
    polyline.setMap(null);
};

(window.$('nav') as HTMLDivElement).addEventListener('mouseenter', function () {
    this.classList.add('bg-light');
});

(window.$('nav') as HTMLDivElement).addEventListener('mouseleave', function () {
    this.classList.remove('bg-light');
});

initBusLocInfo();

// const test = async () => {
//     const queries = new URLSearchParams();
//     queries.append('routeId', '233000031');
//     const htmlText = await fetchData(url.get('버스위치정보목록조회'), queries.toString());
//     console.log(htmlText);
// }

// test()
import { url } from '../data/apiList';
import { initMap } from './map';
import { fetchData } from '../utils/getData';
import { areaIds } from '../data/areaIds';

import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrapInit from './common';
import './index.scss';
import { IKakaoMap, IKakaoLatLng, IKakaoMarker, IKakaoPolyline, IKakaoCustomOverlay } from 'tenel-kakao-map';
import type {POSITION, Station, BUS_DATA, ILoc} from '../interface/type';

import {getRandomBusLoc} from './test'

bootstrapInit.init();

// let map: InstanceType<typeof kakao.maps.Map>;
let map: IKakaoMap;

window.$ = document.querySelector.bind(document);

let polyLine:IKakaoPolyline;
let markers:IKakaoMarker[] = [];
let positions:POSITION[] = [];

(async () => {
    map = await initMap();
    window.$('.spinner-border')?.classList.add('none');
})();

const busLocContainer = window.$<HTMLUListElement>('#bus-loc-container');
const busRouteContainer = window.$<HTMLUListElement>("#bus-route-container");
const selectedLoc = window.$<HTMLDivElement>('#bus-loc-info');
const selectedRoute = window.$<HTMLDivElement>('#bus-route-info');
const searchBtn = window.$<HTMLButtonElement>('#search-btn');   // 경로보기 버튼
const stationBtn = window.$<HTMLButtonElement>('#station-btn');

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
    // routeId를 여기서 받아옴
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

    // console.log(data)

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
    const textData = await fetchData(url.get('노선형상정보목록조회'), queries.toString());
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
    // if(markers.length > 0){
    //     removeMarkers(positions, markers)
    // }
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

    let bus_data:BUS_DATA[] = []
    
    for(let i = 0;i<10;i++){
        const randomIdx = Math.floor(Math.random() * linePath.length)
        const randomCoord = linePath[randomIdx];
        const customOverlay = new kakao.maps.CustomOverlay({
            map,
            clickable: true,
            content: returnCustomBusMarkerImg(45),
            position: randomCoord,
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 1000
        });
        bus_data.push({data:randomCoord, overlay: customOverlay, directionX: 0, directionY: 0})
    }
    

    // 테스트용
    getRandomBusLoc(bus_data, linePath, map)

    // customOverlay.setMap(map);
    polyLine.setMap(map);
});

// 버스 마커 회전하는 로직
const returnCustomBusMarkerImg = (angle:number) => {

    const rad2Deg = (rad: number) => rad * 180 / Math.PI;

    const div = document.createElement('div');
    div.classList.add('customOverlay');
    div.style.width = '30px';
    div.style.height = '30px';
    div.style.backgroundImage = 'url(./assets/bus_icon.png)';
    div.style.backgroundSize = 'contain';
    div.style.position = 'relative'
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



import {fetchData} from '../utils/getData'
import {origin, url} from '../data/apiList2';
import {myAPIKey} from '../config/index'

import type {IKakaoCustomOverlay, IKakaoLatLng, IKakaoMap} from 'tenel-kakao-map'
import type {POSITION, Station, BUS_DATA, ILoc} from '../interface/type';

interface Loc {
    lat: number;
    lon: number;
    directionX?:number;
    directionY?:number;
    customOverlay?
}

let setT:ReturnType<typeof setInterval>

const UPDATE_INTERVAL = 5000;

export const getRandomBusLoc = async (buses:BUS_DATA[], path:IKakaoLatLng[], map:IKakaoMap) => {
    // 다음 버스 정보 받아오는 함수
    const updateNextBusLoc = (path:IKakaoLatLng[], busNum:number):ILoc[] => {
        let nextBusLoc:ILoc[] = []
        for(let i = 0;i<busNum;i++){
            const randPath = path[Math.floor(Math.random() * path.length)]
            nextBusLoc.push({
                lat: randPath.getLat(),
                lon: randPath.getLng()
            })
        }
        return nextBusLoc
    }

    let prevLoc:ILoc[] = []

    buses.forEach(({data}) => {
        prevLoc.push({
            lat: (data as IKakaoLatLng).getLat(),
            lon: (data as IKakaoLatLng).getLng(),
        })
    })

    // 5초에 한 번씩 요청해서 새로운 버스 위치를 받아옴.
    setT = setInterval(() => {
        // 새로운 버스 위치가 업데이트 된 순간 각 버스들의 다음 위치와 현재 위치를 비교해서 방향 구하기
        const nextLoc = updateNextBusLoc(path, buses.length);
        buses.forEach((bus, idx) => {
            const dx = nextLoc[idx].lat - prevLoc[idx].lat
            const dy = nextLoc[idx].lon - prevLoc[idx].lon
            const dist = Math.sqrt(Math.pow(dx ** 2 + dy ** 2, 2))
            const theta = Math.atan2(dy, dx)
            const directionX = Math.cos(theta) * 0.0001
            const directionY = Math.sin(theta) * 0.0001

            bus.directionX = directionX
            bus.directionY = directionY
        })

        let cnt = 0;
        // 버스 마커 이미지를 연속적으로 그려주는 함수
        let innerSetT = setInterval(() => {
            cnt++
            buses.forEach(bus => {
                // 버스의 새로운 위치 좌표를 얻음
                (bus.data as IKakaoLatLng) = new kakao.maps.LatLng(
                    (bus.data as IKakaoLatLng).getLat() + bus.directionX,
                    (bus.data as IKakaoLatLng).getLng() + bus.directionY,
                )
                const newMarkerPos = new kakao.maps.LatLng(
                    (bus.data as IKakaoLatLng).getLat() + bus.directionX,
                    (bus.data as IKakaoLatLng).getLng() + bus.directionY,
                )
                console.log(bus.directionX, bus.directionY)
                bus.overlay.setPosition(newMarkerPos)
                bus.overlay.setMap(map);
            })
            if(cnt >= 500) {
                clearInterval(innerSetT)
                cnt = 0
            }
        }, 10)
    }, UPDATE_INTERVAL)
}
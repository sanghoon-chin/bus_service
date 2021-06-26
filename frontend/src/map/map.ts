import { getPosition } from '../utils/getMyPos';

export const initMap = async () => {
    const container = document.querySelector('#map') as HTMLDivElement; //지도를 담을 영역의 DOM 레퍼런스
    const { lat, lon } = await getPosition();
    const options = {
        center: new kakao.maps.LatLng(lat, lon),
        level: 3
    };

    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.BOTTOMLEFT);

    const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(lat, lon),
        clickable: true,
        // image: new kakao.maps.MarkerImage(
        //     'https://study.in-coding.com/static/icon/favicon-32x32.png',
        //     new kakao.maps.Size(35, 35),
        //     {
        //         offset: new kakao.maps.Point(16, 34),
        //         alt: "마커 이미지 예제",
        //         shape: "poly",
        //         coords: "1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33"
        //     }
        // )
    });
    
    marker.setMap(map);

    const infowindow = new kakao.maps.InfoWindow({
        content: '<div style="padding:5px; text-align: center;">내 위치</div>'
    });

    kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });
    return map;
}
import { getPosition } from '../utils/getMyPos';

export const initMap = async () => {
    // getPosition 때문에 kakaomap loading 느려지는 문제 해결
    const container = document.querySelector('#map') as HTMLDivElement;
    const randomLoc = [37.320651399999996, 126.83180239999999]
    const options = {
        center: new kakao.maps.LatLng(randomLoc[0], randomLoc[1]),
        level: 3
    };
    const map = new kakao.maps.Map(container, options);

    const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(randomLoc[0], randomLoc[1]),
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

    getPosition()
        .then(({ lat, lon })=>{
            map.setCenter(new kakao.maps.LatLng(lat, lon))

            marker.setPosition(new kakao.maps.LatLng(lat, lon))
            
            marker.setMap(map);
            
            const infowindow = new kakao.maps.InfoWindow({
                content: `
                    <div style="padding:5px; text-align: center;" class="text-primary">내 위치</div>
                `,
                removable: true // declare 로!! git에서 fork 해서 커스터마이징 해도 됨. 이게 tenel-kakao-map에는 없음
            });
            
            kakao.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
            
            map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.BOTTOMLEFT);
        })
    return map;
}
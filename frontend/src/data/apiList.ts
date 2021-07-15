const url = new Map<string, string>();
const origin:string = `http://apis.data.go.kr/6410000/`;

/**
 * @params keyword number ex)30    
 * @description 노선번호에 해당하는 노선 목록을 조회한다.
 */
url.set('노선번호목록조회', 'busrouteservice/getBusRouteList');


/**
 * @params areaId number ex)운행지역ID 02
 * @params keyword? number ex)노선번호 30   
 * @description 운행지역ID와 노선번호에 해당하는 노선 목록을 조회한다.
 */
url.set('운행지역별노선번호목록조회', 'busrouteservice/getAreaBusRouteList');


/**
 * @params routeId number ex)200000085
 * @description 노선ID에 해당하는 노선의 기본 정보 및 배차 정보를 조회한다.
 */
url.set('노선정보항목조회', 'busrouteservice/getBusRouteInfoItem');


/**
 * @params routeId number ex) 200000085
 * @description 노선ID에 해당하는 노선의 경유정류소 목록을 조회한다.
 */
url.set('경유정류소목록조회', 'busrouteservice/getBusRouteStationList');


/**
 * @params routeId number ex)200000085
 * @description 노선 ID에 해당하는 노선 항목 조회 
 */
url.set('노선형상정보목록조회', 'busrouteservice/getBusRouteLineList');

/**
 * @params stationId number ex)200000078
 * @description 해당 정류소에 정차하는 모든 노선에 대한 첫번째/두번째 도착예정 버스의 위치정보와 도착예정시간, 빈자리, 저상버스 정보를 제공하는 버스도착정보목록서비스   
 */
url.set('버스도착정보목록조회', 'busarrivalservice/getBusArrivalList');

/**
 * @params stationId number ex)200000177
 * @params routeId  number ex)200000085
 * @params staOrder number ex)19
 * @description 해당 정류소(정류소ID)에 정차하는 특정 노선(노선ID)의 도착 정보를 조회한다
 */
url.set('버스도착정보항목조회', 'busarrivalservice/getBusArrivalItem');

/**
 * @params routeId number ex)233000031
 * @description 노선ID에 해당하는 노선의 실시간 버스 위치 정보를 조회한다
 */
url.set('버스위치정보목록조회', 'buslocationservice/getBusLocationList');

export {
    url,
    origin
};
// 경기도 지역 버스 API
import {myAPIKey} from "../config/index";

const url = new Map<string, string>();
url.set('origin', `http://openapi.gbis.go.kr/`);
url.set('servicekey', myAPIKey);

// 버스노선조회 서비스
/**
 * 샘플 URL 11번 노선 목록을 검색할 경우:
 * - http://openapi.gbis.go.kr/ws/rest/busrouteservice?serviceKey=1234567890&keyword=11
 * @param keyword 노선번호
 */
url.set('노선번호 목록조회', 'ws/rest/busrouteservice')

/**
 * 샘플 URL 
 * 고양시 소속의 11번 노선 목록을 검색할 경우:
 * - http://openapi.gbis.go.kr/ws/rest/busrouteservice/area?serviceKey=1234567890&areaId=02&keyword=11
 * @param areaId 운행지역아이디
 * @param keyword 노선번호
 */
url.set('운행지역별노선번호 목록조회', 'ws/rest/busrouteservice/area')
url.set('노선정보 항목조회', 'ws/rest/busrouteservice/info')
url.set('경유정류소 목록조회', 'ws/rest/busrouteservice/station')
url.set('노선형상정보', 'ws/rest/busrouteservice/line')

// 정류소 조회 서비스
url.set('정류소명/번호 목록조회', 'ws/rest/busstationservice')
url.set('주변정류소 목록조회', 'ws/rest/busstationservice/searcharound')
url.set('정류소 경유노선 목록조회', 'ws/rest/busstationservice/route')

// 버스위치정보 조회 서비스
url.set('버스 위치정보 목록조회', 'ws/rest/buslocationservice')

// 버스도착정보 조회 서비스
url.set('버스 도착정보 목록조회', 'ws/rest/busarrivalservice/station')
url.set('버스 도착정보 항목조회', '/ws/rest/busarrivalservice')


// 기반정보 관리 서비스
url.set('기반정보 항목조회', 'ws/rest/baseinfoservice');

export default url;
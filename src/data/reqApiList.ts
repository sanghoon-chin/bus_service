const requestPaths = new Map<string, string>();

// 1. 도착정보조회 서비스
/**
 * @param citycode 도시코드 ex. 25
 * @param nodeId 정류소ID ex. DJB8001793
 */
requestPaths.set('정류소별도착예정정보목록조회', 'ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList')

/**
 * @param citycode 도시코드 ex. 25
 * @param nodeId 정류소ID ex. DJB8001793
 * @param routeId 노선ID ex. DJB30300002
 */
requestPaths.set('정류소별특정노선버스도착예정정보목록조회', 'ArvlInfoInqireService/getSttnAcctoSpcifyRouteBusArvlPrearngeInfoList')

/**
 * @param citycode 도시코드 ex. 25
 * @param cityname 도시명 ex. 대구광역시
 */
// requestPaths.set('도시코드목록조회', 'ArvlInfoInqireService/getCtyCodeList');


// 2. 버스노선정보조회서비스 => 시내버스 노선정보 조회
/**
 * @param citycode 도시코드 ex. 25
 * @param routeNo 노선번호 ex. 5
 */
requestPaths.set('노선번호목록조회', 'BusRouteInfoInqireService/getRouteNoList')

/**
 * @param numOfRows 한 페이지 결과 수 ex. 10
 * @param pageNo 페이지 번호 ex. 1
 * @param citycode 도시코드 ex. 25
 * @param routeId 노선Id ex. DJB30300004
 */
requestPaths.set('노선별경유정류소목록조회', 'BusRouteInfoInqireService/getRouteAcctoThrghSttnList')

/**
 * @param citycode 도시코드 ex. 25
 * @param routeId 노선ID ex. DJB30300002
 */
requestPaths.set('노선정보항목조회', 'BusRouteInfoInqireService/getRouteInfoIem')

/**
 * @param citycode 도시코드 ex. 25
 * @param cityname 도시명 ex. 대구광역시
 */
// requestPaths.set('도시코드목록조회', 'BusRouteInfoInqireService/getCtyCodeList')


// 3. 버스정류소 정보조회 서비스
/**
 * @param citycode 도시코드 ex. 25
 * @param nodeNm 정류소명 ex. 전통시장
 * @param nodeNo 정류소번호 ex. 44810
 */
requestPaths.set('정류소번호목록조회', 'BusSttnInfoInqireService/getSttnNoList');

/**
 * @desc GPS좌표를 기반으로 근처(반경 500m)에 있는 정류장을 검색한다
 * 
 * @param gpsLati GPS Y좌표 ex. 36.3
 * @param gpsLong GPS X좌표 ex. 127.3
 */
requestPaths.set('좌표기반근접정류소목록조회', 'BusSttnInfoInqireService/getCrdntPrxmtSttnList');

/**
 * @param citycode 도시코드 ex. 25
 * @param cityname 도시명 ex. 대구광역시
 */
// requestPaths.set('도시코드 목록 조회', 'BusSttnInfoInqireService/getCtyCodeList');


// 4. 버스위치정보조회서비스 => 시내버스 위치정보 조회 /BusLcInfoInqireService
/**
 * @param citycode 도시코드 ex. 25
 * @param routeId 노선ID ex. DJB30300052
 */
requestPaths.set('노선별버스위치목록조회', 'BusLcInfoInqireService/getRouteAcctoBusLcList')

/**
 * @param citycode 도시코드 ex. 25
 * @param routeId 노선ID ex. DJB30300052
 * @param nodeId 정류소ID ex. DJB8005621
 */
requestPaths.set('노선별특정정류소접근버스위치정보조회', 'BusLcInfoInqireService/getRouteAcctoSpcifySttnAccesBusLcInfo')

/**
 * @param citycode 도시코드 ex. 25
 * @param cityname 도시명 ex. 대구광역시
 */
requestPaths.set('도시코드목록조회', 'BusLcInfoInqireService/getCtyCodeList')


export default requestPaths;
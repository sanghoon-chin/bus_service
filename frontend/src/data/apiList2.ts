const url = new Map<string, string>();
const origin = `http://openapi.tago.go.kr/openapi/service/`;


/**
 * @params serviceKey string
 * @params cityCode
 * @params routeId
 */
url.set('노선별버스위치목록조회', 'BusLcInfoInqireService/getRouteAcctoBusLcList')


/**
 * @params serviceKey string
 * @params cityCode 25
 * @params routeId 5 
 */
url.set('노선번호목록조회', 'BusRouteInfoInqireService/getRouteNoList')
url.set('노선정보항목조회', 'BusRouteInfoInqireService/getRouteInfoIem')

/**
 * @params serviceKey string
 */
url.set('도시코드목록조회', 'BusRouteInfoInqireService/getCtyCodeList')


export {
    url,
    origin
}
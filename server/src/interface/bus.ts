type BOOL = 'Y' | 'N';

export interface STATIONRESPONSE{
    stationId: string;
    stationSeq: number;
    stationName: string;
    mobileNo: number;
    regionName: string;
    districtCd: number
    centerYn: BOOL;
    turnYn: BOOL
};

// 버스 실시간 위치 정보
export interface BusLocationListResponse {
    routeId: string;
    stationId: string;
    stationsSeq: number;
    endBus: string;
    lowPlate: number;
    platNo: string;
    plateType: string;
    remainSeatCnt: number;
}
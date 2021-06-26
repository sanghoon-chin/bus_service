type BOOL = 'Y' | 'N';

export default interface STATIONRESPONSE{
    stationId: string;
    stationSeq: number;
    stationName: string;
    mobileNo: number;
    regionName: string;
    districtCd: number
    centerYn: BOOL;
    turnYn: BOOL
};
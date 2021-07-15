import { IKakaoLatLng } from "tenel-kakao-map";

export interface POSITION {
    title: string
    latlng: IKakaoLatLng
};

export interface Station {
    regionName: string
    stationLoc:  {
        x: number
        y: number
    }
    stationName: string
    stationId: string;
}
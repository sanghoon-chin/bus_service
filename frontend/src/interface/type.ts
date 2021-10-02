import type { IKakaoLatLng, IKakaoCustomOverlay } from "tenel-kakao-map";

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

export interface ILoc {
    lat: number;
    lon: number
}

export interface BUS_DATA{
    data: ILoc | IKakaoLatLng;
    overlay: IKakaoCustomOverlay;
    directionX?:number;
    directionY?:number;
}
import { IKakao, IKakaoInfoWindowOptions } from "tenel-kakao-map";

// 타입 정의. kakao 라는 namespace가 있다 라는 걸 알려줌
declare global {
    const kakao: IKakao;
    
    interface Window {
        $: typeof document.querySelector;
    }
}

declare module "tenel-kakao-map" {
    // augumentation
    export interface IKakaoInfoWindowOptions {
        removable: boolean
    }
}

declare module Math {
    radian: (deg:number) => number;
}
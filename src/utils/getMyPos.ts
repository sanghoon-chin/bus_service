// interface POS {
//     lat: number;
//     lon: number;
// }

export const getPosition = async () => {
    // any 말고 할 수 있는 방법은 뭐가 있을까??
    const {coords} = await new Promise<any>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return {
        lat: coords.latitude,
        lon: coords.longitude
    }
};
export const getPosition = async () => {
    const {coords} = await new Promise<any>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return {
        lat: coords.latitude,
        lon: coords.longitude
    }
};
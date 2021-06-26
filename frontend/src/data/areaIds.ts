const cityList = `수원시,용인시,성남시,부천시,화성시,안산시,안양시,평택시,시흥시,김포시,광주시,광명시,군포시,하남시,오산시,이천시,안성시,의왕시,양평군,여주시,과천시,고양시,남양주시,파주시,의정부시,양주시,구리시,포천시,동두천시,가평군,연천군`;

const parse_cityList = cityList.split(',').sort();
parse_cityList.push('서울특별시', '인천광역시');

interface CITYINFO {
    cityName: string;
    cityId: string;
}

export const areaIds:CITYINFO[] = parse_cityList.map((city, idx) => ({
    cityName: city, 
    cityId: (idx+1 < 10) ? ('0' + (idx + 1)) : (idx+1).toString()
}));

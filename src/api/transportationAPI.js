import delay from './delay';

const destinations = [
    { Id: '', Code: 'GB-LON', Name: 'London' },
    { Id: '', Code: 'GB-CAM', Name: 'Cambridge' },
    { Id: '', Code: 'GB-BRI', Name: 'Brighton' }
]

const unallocatedStudents = [
    { BookingId: '22343232', StudentName: 'Santhosh Kumar', Program: 'LS' },
    { BookingId: '1232323', StudentName: 'Test Student1', Program: 'AY' },
    { BookingId: '232323323', StudentName: 'Test Student2', Program: 'LS' }
]

const gateways = [
    { Id: '', Code: 'LCY', Name: 'London City', DestinationCode: 'GB-LON' },
    { Id: '', Code: 'LDY', Name: 'Londonderry Eglinton Airport', DestinationCode: 'GB-LON' },
    { Id: '', Code: 'LNV', Name: 'London Victoria', DestinationCode: 'GB-LON' },
    { Id: '', Code: 'LHR', Name: 'London Heathrow', DestinationCode: 'GB-LON' },
    { Id: '', Code: 'LGW', Name: 'Gatwick', DestinationCode: 'GB-LON' },

    { Id: '', Code: 'LCY', Name: 'London City', DestinationCode: 'GB-CAM' },
    { Id: '', Code: 'LHR', Name: 'London Heathrow', DestinationCode: 'GB-CAM' },
    { Id: '', Code: 'LGW', Name: 'Gatwick', DestinationCode: 'GB-CAM' },

    { Id: '', Code: 'LHR', Name: 'London Heathrow', DestinationCode: 'GB-BRI' },
    { Id: '', Code: 'LGW', Name: 'Gatwick', DestinationCode: 'GB-BRI' },
]

class transportationAPI {
    static loadDestinations() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Object.assign([], destinations));
            }, delay);
        });
    }

    static loadGateways() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Object.assign([], gateways));
            }, delay);
        });
    }
    static updateDestination(destinationCode) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Object.assign([], gateways.filter(gateway => gateway.DestinationCode === destinationCode)));
            }, delay);
        });
    }

    static loadunAllocatedStudents(searchParameter) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(Object.assign([], unallocatedStudents));
            }, delay);
        });
    }
}


export default transportationAPI;
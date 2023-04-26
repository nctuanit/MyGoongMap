

const goongMapRest = {
    init : () => {
        var client = axios.create({
            baseURL: 'https://rsapi.goong.io',
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        client.interceptors.request.use(function (config) {
            console.log(config);
        })
        client.interceptors.response.use(function (response) {
            return response.data;
        })
    },
    getDirection: (origin, destination) => {
        return client.get(`/direction?origin=${origin}&destination=${destination}&api_key=${goongjs.accessToken}`);
    }
}


class GoongMapRest{
    url = "https://rsapi.goong.io";
    constructor(){
        this.client = axios.create({
            baseURL: 'https://rsapi.goong.io',
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        this.client.interceptors.request.use(function (config) {
            console.log(config);
        })
        this.client.interceptors.response.use(function (response) {
            return response.data;
        })
    }

    // getDirection
    
}
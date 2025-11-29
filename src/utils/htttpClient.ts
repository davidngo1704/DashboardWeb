import axios from "axios";
const httpClient: any = {
    getMethod: async (url: string) => {
        return await axios.get(url);
    },
    postMethod: async (url: string, payload: any) => {
        return await axios.post(url, payload);
    },
    putMethod: async (url: string, payload: any) => {
        return await axios.put(url, payload);
    }
}
export default httpClient;
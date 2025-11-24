import axios from "axios";
declare let window: any;
export const ENV = window._env_;
const httpClient: any = {
    getMethod: async (url: string) => {
        return await axios.get(url);
    },
    postMethod: async (url: string, payload: any) => {
        return await axios.post(url, payload);
    }
}
export default httpClient;
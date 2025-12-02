import axios from "axios";

const getFullUrl = (url: string): string => {
    const apiGatewayEndpoint = localStorage.getItem("apiGatewayEndpoint") || "";
    if (!apiGatewayEndpoint) {
        return url;
    }
    
    const path = url.startsWith("/") ? url : `/${url}`;
    
    return `${apiGatewayEndpoint}${path}`;
};

const httpClient: any = {
    getMethod: async (url: string) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.get(fullUrl);
        if(status === 200 && ok) {
            return data;
        }
        return null;
    },
    postMethod: async (url: string, payload: any) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.post(fullUrl, payload);
        if(status === 200 && ok) {
            return data;
        }
        return null;
    },
    putMethod: async (url: string, payload: any) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.put(fullUrl, payload);
        if(status === 200 && ok) {
            return data;
        }
        return null;
    },
    deleteMethod: async (url: string) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.delete(fullUrl);
        if(status === 200 && ok) {
            return data;
        }
        return null;
    }
}
export default httpClient;
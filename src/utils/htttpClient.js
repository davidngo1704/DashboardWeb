import axios from "axios";

const getFullUrl = (url) => {
    const apiGatewayEndpoint = localStorage.getItem("apiGatewayEndpoint") || "";
    if (!apiGatewayEndpoint) {
        return url;
    }

    const path = url.startsWith("/") ? url : `/${url}`;

    return `${apiGatewayEndpoint}${path}`;
};

async function uploadFile(url, filepath, filename, file) {
    const fullUrl = getFullUrl(url);

    const serverUrl = `${fullUrl}?filepath=${encodeURIComponent(filepath || '')}&filename=${filename}`;

    try {
        let body;
        let contentType;

        if (typeof file === 'string') {
            // Nếu file là string, sử dụng trực tiếp
            body = file;
            contentType = "text/plain";
        } else {
            // Nếu file là File/Blob object, chuyển đổi sang ArrayBuffer
            body = await file.arrayBuffer();
            contentType = "application/octet-stream";
        }

        const response = await fetch(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": contentType
            },
            body: body
        });

        const result = await response.text();
        return result;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
}


const httpClient = {
    getMethod: async (url) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.get(fullUrl);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    getFile: async (url, asString = false) => {
        const fullUrl = getFullUrl(url);
        try {
            const response = await axios.get(fullUrl, {
                responseType: asString ? 'text' : 'blob'
            });
            
            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error("Get file failed:", error);
            return null;
        }
    },
    postMethod: async (url, payload) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.post(fullUrl, payload);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    putMethod: async (url, payload) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.put(fullUrl, payload);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    deleteMethod: async (url) => {
        const fullUrl = getFullUrl(url);
        const { status, data: { ok, data } } = await axios.delete(fullUrl);
        if (status === 200 && ok) {
            return data;
        }
        return null;
    },
    uploadFile
}
export default httpClient;
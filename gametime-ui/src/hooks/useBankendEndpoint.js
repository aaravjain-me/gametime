import axios from "axios";

const backendEndpoint = async(endpoint, data, type) => {
    try {
        if (type === 'get') {
            const response = await axios.get(endpoint);
            return response.data;
        } else if (type === 'post') {
            const response = await axios.post(endpoint, data);
            return response.data;
        } else {
            throw new Error("Invalid type of request");
        }
    } catch (error){
        console.error("Error" + error);
        throw error;
    }
}

export default backendEndpoint;
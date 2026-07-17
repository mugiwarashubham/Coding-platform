import axios from "axios";

const axiosClient = axios.create({
    baseURL:"https://coding-platform-1-nxb4.onrender.com",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosClient;
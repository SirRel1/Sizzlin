import axios from "axios";
require("dotenv").config();

const baseURL = process.env.SIZZLIN_APP_API_URL;
const USER_ID = 'terrell';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'x-user-id': USER_ID,
    },
});

export default axiosClient;
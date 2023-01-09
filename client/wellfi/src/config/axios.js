import axios from "axios";
import Auth from "../Components/ClientAuth/auth";
require("dotenv").config();

let user;

    try {
        const { data } = Auth.getProfile();
        user = data.username;
      } catch (error) {
        if (error) {
          user = "Guest";
        }}

const baseURL = process.env.SIZZLIN_APP_API_URL;
const USER_ID = user;

const axiosClient = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'x-user-id': USER_ID,
    },
});


export default axiosClient;
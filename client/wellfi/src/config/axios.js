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


// const apiUrl =
//   "http://www.7timer.info/bin/astro.php?lon=113.17&lat=23.09&ac=0&lang=en&unit=metric&output=internal&tzshift=0";

// axios
//   .get(apiUrl)
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });



export default axiosClient;
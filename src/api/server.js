import axios from 'axios'

export default axios.create({
    // baseURL: "http://d8ce9f4412e1.ngrok.io/api/"
    // baseURL: "https://gulaan.herokuapp.com/api/"
    baseURL: "http://192.168.100.12:8080/api/"
})
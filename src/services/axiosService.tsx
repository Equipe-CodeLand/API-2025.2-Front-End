// serviços externos (APIs, Firebase, Axios, etc.)
import axios from "axios";

export const api = axios.create({
  baseURL: "https://minhaapi.com",
});

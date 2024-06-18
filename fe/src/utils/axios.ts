import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import jwt_decode from "jwt-decode";
import { JwtPayload } from "../Model/user";
import { AuthApi } from "../Apis/auth.api";

export const apiAxios = axios.create({
  baseURL: process.env.REACT_APP_BE_URL,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});


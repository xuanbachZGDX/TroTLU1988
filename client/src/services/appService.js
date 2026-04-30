import axios from "../axiosConfig";
import axiosDefault from "axios";

export const apiGetPrices = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/prices/all",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetAreas = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/areas/all",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetProvinces = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/provinces/all",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPublicProvinces = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosDefault({
        method: "get",
        url: "https://provinces.open-api.vn/api/v1/p/",
      });

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPublicDistrict = (provinceCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosDefault({
        method: "get",
        url: `https://provinces.open-api.vn/api/v1/p/${provinceCode}?depth=2`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPublicWard = (districtCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosDefault({
        method: "get",
        url: `https://provinces.open-api.vn/api/v1/d/${districtCode}?depth=2`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetFeatures = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: "/api/v1/features/all",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

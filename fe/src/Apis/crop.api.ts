import axios from "axios";
import { Crop, CreateCrop, updateCrop, CropStat } from "../Model/crop";
import { Stat } from "../Model/stat";
import { CreateHistory, History } from "../Model/history";
import { apiAxios } from "../utils/axios";

export class CropApi {
  static async getAllCropsByPondId(id: string): Promise<Crop[]> {
    const response = await apiAxios.get("crop/pond/" + id);
    return response.data;
  }

  static async getCropById(id: string): Promise<Crop | void> {
    const response = await apiAxios.get("crop/" + id);
    return response.data;
  }

  static async getAllTrackingCropsByPondId(
    userName: string,
    statID: number
  ): Promise<Crop[]> {
    const response = await apiAxios.get(
      `crop/tracking/${userName}?statID=${statID}`
    );
    return response.data;
  }

  static async getStatCrop(id: string): Promise<CropStat[]> {
    const response = await apiAxios.get("crop/stat/" + id);
    return response.data;
  }

  static async createCrop(payload: CreateCrop): Promise<string> {
    const response = await apiAxios.post("crop/", payload);
    return response.data;
  }

  static async deleteCrop(id: string): Promise<boolean | void> {
    const response = await apiAxios.delete("crop/" + id);
    return response.data;
  }

  static async updateCrop(payload: updateCrop): Promise<boolean | void> {
    const { id, ...data } = payload;
    const response = await apiAxios.put("crop/" + id, data);
    return response.data;
  }

  static async createStatCrop(payload: {
    id: string;
    lstStats: string;
    lstActive: string;
  }): Promise<boolean | void> {
    const response = await apiAxios.post("crop/stat/" + payload.id, {
      lstStats: payload.lstStats,
      lstActive: payload.lstActive,
    });
    return response.data;
  }

  static async updateStatCrop(payload: {
    id: string;
    statId: string;
    isActive: number;
  }): Promise<boolean | void> {
    const response = await apiAxios.put("crop/stat/" + payload.id, {
      statId: payload.statId,
      isActive: payload.isActive,
    });
    return response.data;
  }

  static async getCropHistory(id: string): Promise<History[]> {
    const response = await apiAxios.get("crop/history/all/" + id);
    return response.data;
  }

  static async getCropHistoryByStat(
    id: number,
    cropID: string
  ): Promise<History[]> {
    const response = await apiAxios.get(
      "crop/history/stat/" + id + "?cropID=" + cropID
    );
    return response.data;
  }

  static async getCropHistoryById(id: string): Promise<History | void> {
    const response = await apiAxios.get("crop/history/" + id);
    return response.data;
  }

  static async createCropHistory(
    payload: CreateHistory
  ): Promise<boolean | void> {
    const response = await apiAxios.post("crop/history", payload);
    return response.data;
  }

  static async deleteCropHistory(id: string): Promise<boolean | void> {
    const response = await apiAxios.delete("crop/history/" + id);
    return response.data;
  }

  static async connectIoTDevice(payload: {
    id: string;
    statId: number;
    iotId: number;
  }): Promise<boolean | void> {
    const response = await apiAxios.put("crop/stat/iot/" + payload.id, {
      statId: payload.statId,
      iotId: payload.iotId,
    });
    return response.data;
  }
}

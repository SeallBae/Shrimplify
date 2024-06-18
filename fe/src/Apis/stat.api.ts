import axios from "axios";
import { Stat } from "../Model/stat";
import { apiAxios } from "../utils/axios";

export class StatApi {
  static async updateStat(payload: Stat): Promise<Stat> {
    const response = await apiAxios.put("stat/", payload);
    return response.data;
  }

  static async getStatById(id: string): Promise<Stat[]> {
    const response = await apiAxios.get("stat/" + id);
    return response.data;
  }

  static async getAllStats(): Promise<Stat[]> {
    const response = await apiAxios.get("stat");
    return response.data;
  }

  static async getPredictWQI(payload: {
    pH: number;
    temp: number;
    turbidity: number;
    do: number;
    conductivity: number;
  }): Promise<any[]> {
    const response = await apiAxios.get(
      `data/predict?pH=${payload.pH}&temp=${payload.temp}&turbidity=${payload.turbidity}&do=${payload.do}&conductivity=${payload.conductivity}`
    );
    return response.data;
  }
}

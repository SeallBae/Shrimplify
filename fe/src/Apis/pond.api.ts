import axios from "axios";
import { CreatePond, Pond, UpdatePond } from "../Model/pond";
import { apiAxios } from "../utils/axios";

export class PondApi {
  static async getPondsByUser(username: string): Promise<Pond[]> {
    const response = await apiAxios.get("pond/" + username);
    return response?.data;
  }

  static async getPondById(id: string): Promise<Pond> {
    const response = await apiAxios.get("pond/p/" + id);
    return response.data[0];
  }

  static async createPond(payload: CreatePond): Promise<boolean | void> {
    const response = await apiAxios.post("pond", payload);
    return response.data;
  }

  static async updatePond(payload: UpdatePond): Promise<boolean | void> {
    const response = await apiAxios.put("pond", payload);
    return response.data;
  }

  static async deletePond(id: string): Promise<boolean | void> {
    const response = await apiAxios.delete("pond/" + id);
    return response.data;
  }
}

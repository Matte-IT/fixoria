import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { baseURL } from "@/utils/baseUrl";

export const axiosInstance = axios.create({
  baseURL,
});

export default function useTanstackQuery(endpoint) {
  const query = useQuery({
    queryKey: [endpoint],

    queryFn: async () => {
      const res = await axiosInstance.get(`${endpoint}`);

      return res.data;
    },
  });

  return query;
}

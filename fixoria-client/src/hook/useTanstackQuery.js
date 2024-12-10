import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://fixoria.matteit.com/api",
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

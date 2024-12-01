import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useTanstackQuery(endpoint) {
  const query = useQuery({
    queryKey: [endpoint],

    queryFn: async () => {
      const res = await axios.get(`${endpoint}`);

      return res.data;
    },
  });

  return query;
}

import { useState, useEffect } from "react";
import axios from "../libs/axiosClient";

export enum RequestType {
  GET,
  DEL,
  POST,
  PUT
}

export default function useApi(
  url: string,
  type = RequestType.GET,
  postData?: any
) {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // AxiosStatic
        let res = { data: [] };

        switch (type) {
          case RequestType.GET:
          default:
            res = await axios.get(url);
            break;
          case RequestType.POST:
            res = await axios.post(url, postData);
            break;
          case RequestType.PUT:
            res = await axios.put(url, postData);
            break;
          case RequestType.DEL:
            res = await axios.delete(url);
            break;
        }

        // To avoid setting state for unmounted components this check.
        if (!mounted) {
          return;
        }

        // TODO: Handle this in a better way later.
        if (res && (res as any).status < 210) {
          setData(res.data);
        } else {
          setData({});
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup cb to give the useEffect api to call after its done.
    const cleanup = () => {
      mounted = false;
    };
    return cleanup;
  }, [url]);

  return [loading, data, error];
}

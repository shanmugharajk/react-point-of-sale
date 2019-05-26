import urlBuilder from "./urlBuilder";
import axiosClient from "./axiosClient";

const serviceBuilder = (mainRouteName: string) => {
  const urls = urlBuilder(mainRouteName);

  return {
    urls,
    services: {
      fetchById: (id: string) => axiosClient.get(urls.fetchById(id)),

      fetchByPages: (pageNo = 1, pageSize = 10) =>
        axiosClient.get(urls.fetchByPages(pageNo, pageSize)),

      fetchAll: () => axiosClient.get(urls.fetchAll()),

      searchByIdAndGetByPages: (id: string, pageNo = 1, pageSize = 10) =>
        axiosClient.get(urls.searchByIdAndGetByPages(id, pageNo, pageSize)),

      searchByIdAndGetAll: (id: string) =>
        axiosClient.get(urls.searchByIdAndGetAll(id)),

      createNew: (data: any) => axiosClient.post(urls.createNew(), data),

      update: (id: string, data: any) => axiosClient.put(urls.update(id), data),

      delete: (id: string) => axiosClient.delete(urls.delete(id))
    }
  };
};

export default serviceBuilder;

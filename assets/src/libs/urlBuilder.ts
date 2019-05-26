import { HOST } from "../constants";

const urlBuilder = (mainRouteName: string) => ({
  fetchById: (id: string) => `${HOST}/${mainRouteName}/${id}`,

  fetchByPages: (pageNo = 1, pageSize = 10) =>
    `${HOST}/${mainRouteName}?page_size=${pageSize}&page_number=${pageNo}`,

  // TODO: Refactor ??
  fetchAll: () => `${HOST}/${mainRouteName}?page_size=5000&page_number=1`,

  searchByIdAndGetByPages: (id: string, pageNo = 1, pageSize = 10) =>
    `${HOST}/${mainRouteName}?q=${id}&per_page=${pageSize}&page_number=${pageNo}`,

  searchByIdAndGetAll: (id: string) => `${HOST}/${mainRouteName}/all?q=${id}`,

  createNew: () => `${HOST}/${mainRouteName}`,

  update: (id: string) => `${HOST}/${mainRouteName}/${id}`,

  delete: (id: string) => `${HOST}/${mainRouteName}/${id}`
});

export default urlBuilder;

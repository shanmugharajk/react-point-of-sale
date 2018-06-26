import axios from "axios";

const apiBuilder = mainRouteName => ({
  fetchById: id => axios.get(`/api/${mainRouteName}/${id}`),

  fetchByPages: () => axios.get(`/api/${mainRouteName}?per_page=10&page=1`),

  fetchAll: () => axios.get(`/api/${mainRouteName}/all/items`),

  searchByIdAndGetByPages: id =>
    axios.get(`/api/${mainRouteName}?q=${id}&per_page=10&page=1`),

  searchByIdAndGetAll: id => axios.get(`/api/${mainRouteName}/all?q=${id}`),

  createNew: item => axios.post(`/api/${mainRouteName}`, item),

  update: (id, item) => axios.put(`/api/${mainRouteName}/${id}`, item),

  delete: id => axios.delete(`/api/${mainRouteName}/${id}`)
});

export default apiBuilder;

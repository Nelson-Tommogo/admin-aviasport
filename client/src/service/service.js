
import axios from "axios";

const REST_API_BASE_URL = "http://localhost:9000/mataa/sparepart/";

export const listSpareparts = () => axios.get(REST_API_BASE_URL);

export const addSparepart = (formData) => axios.post(REST_API_BASE_URL,formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getSparepart = (sparepartId) => axios.get(REST_API_BASE_URL + sparepartId);

export const updateSparepart= (id,sparepart) => axios.put(REST_API_BASE_URL + id + '/',sparepart, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
});
export const deleteSparepart = (id) => axios.delete(REST_API_BASE_URL + id + '/');
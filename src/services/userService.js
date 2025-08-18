import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const registerUser = async (formData) => {
  const { data } = await axios.post(`${backendUrl}/user/register`, formData);
  return data;
};

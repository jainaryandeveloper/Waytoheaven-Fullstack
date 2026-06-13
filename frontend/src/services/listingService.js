import axios from "axios";

const API =
`${import.meta.env.VITE_API_URL}/api/listings`;

export const getListings = async () => {

  const response =
    await axios.get(API);

  return response.data;

};
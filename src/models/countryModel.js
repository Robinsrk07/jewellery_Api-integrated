import axiosInstance from "../Data/server/axiosinstance";

const CountryModel = {
  getCountries: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`/manage-countries/?${params.toString()}`);
  },
  CreateCountry: (countryData) => {
    return axiosInstance.post('/manage-countries/', countryData);
  },
  updateCountry: (countryId, countryData) => {
    return axiosInstance.put(`/manage-countries/${countryId}/`, countryData);
  },
  deleteCountry: (countryId) => {
  return axiosInstance.delete(`/manage-countries/${countryId}/`);
},

};


export default CountryModel;

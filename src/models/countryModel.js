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
  }
};


export default CountryModel;

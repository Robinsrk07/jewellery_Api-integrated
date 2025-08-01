import axiosInstance from '../Data/server/axiosinstance';

const TaxModel = {
  getTax: (user_id,) => {
    return axiosInstance.get('/settings-tax/', {
      params: { user_id }
    });
  }
};

export default TaxModel;

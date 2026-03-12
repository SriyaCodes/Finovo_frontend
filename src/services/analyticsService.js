import apiClient from './apiClient';

const getAnalytics = async (timeframe = 'month', categoryId = null, startDate = null, endDate = null, year = null, paymentMethod = null) => {
    let url = `/transactions/analytics/?timeframe=${timeframe}`;
    if (categoryId) url += `&category_id=${categoryId}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    if (year) url += `&year=${year}`;
    if (paymentMethod) url += `&payment_method=${paymentMethod}`;
    const response = await apiClient.get(url);
    return response.data;
};

export default { getAnalytics };

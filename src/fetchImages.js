const axios = require('axios').default;

export default async (input, count) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=31296497-f77e3cd3a2890044dbd34d20b&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&page=${count}&per_page=40`
    );
    return response.data;
  } catch (error) {
    return;
  }
};

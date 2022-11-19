const axios = require('axios').default;

export default async (input, count) => {
  const searchParams = new URLSearchParams({
    key: '31296497-f77e3cd3a2890044dbd34d20b',
    q: input,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: count,
    per_page: 40,
  });

  try {
    const response = await axios.get(
      new URL(`https://pixabay.com/api?${searchParams}`)
    );
    return response.data;
  } catch (error) {}
};

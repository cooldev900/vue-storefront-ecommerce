import ratesData from '../resource/rates.json';

const LOCATIONS_DATA_KEY = 'locations';
const RATES_DATA_KEY = 'rates';

const saveLocations = data => {
  const previousLocations =
    JSON.parse(localStorage.getItem(LOCATIONS_DATA_KEY)) || [];

  previousLocations.forEach((v, index) => {
    if (v.brand === data.brand) {
      previousLocations.splice(index, 1);
    }
  });
  const newLocations = [...new Set([...previousLocations, data])];

  localStorage.setItem(LOCATIONS_DATA_KEY, JSON.stringify(newLocations));
};

const clearLocations = () => {
  localStorage.removeItem('');
};

const getAllLocations = () => {
  return JSON.parse(localStorage.getItem(LOCATIONS_DATA_KEY));
};

const getLocationByBrand = brand => {
  const locations = getAllLocations();

  return locations?.find(location => location.brand === brand);
};

// const getRateByBrand = brand => {
//   const rates = ratesData[RATES_DATA_KEY];
//   const rate = rates?.find(rate => rate.brand === brand);

//   return rate?.rate ? rate.rate : 0;
// };

// const getFittingPrice = (brand, fittingTime) => {
//   const rate = getRateByBrand(brand);
//   return Number(rate) * Number(fittingTime);
// };

export {
  saveLocations,
  clearLocations,
  getAllLocations,
  getLocationByBrand,
  // getRateByBrand,
  // getFittingPrice,
  LOCATIONS_DATA_KEY
};

// import { vehiclesStore } from './vehicles';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
export const VEHICLE_DATA_KEY = 'vehicles';

export const asyncLocalStorage = {
  setItem: async function (key, value) {
    await null;
    return localStorage.setItem(key, value)
  },
  getItem: async function (key) {
    await null;
    return localStorage.getItem(key)
  },
  removeItem: async function (key) {
    await null;
    return localStorage.removeItem(key)
  }
};

export const availableLocalStorage = async () => {
  const test = 'test';
  try {
    await asyncLocalStorage.setItem(test, test);
    await asyncLocalStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const saveMaxPrice = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      asyncLocalStorage?.removeItem(storeView.storeCode + '/maxPrice');
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/maxPrice',
        JSON.stringify(data)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const loadMaxPrice = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      const maxPrice = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/maxPrice'
      );
      return maxPrice ? parseInt(JSON.parse(maxPrice)) : 0;
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const saveMinPrice = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      asyncLocalStorage?.removeItem(storeView.storeCode + '/minPrice');
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/minPrice',
        JSON.stringify(data)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const loadMinPrice = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      const minPrice = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/minPrice'
      );
      return minPrice ? parseInt(JSON.parse(minPrice)) : 0;
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const saveCategoryId = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      asyncLocalStorage?.removeItem(storeView.storeCode + '/categoryId');
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/categoryId',
        JSON.stringify(data)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const loadCategoryId = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      const categoryId = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/categoryId'
      );
      return categoryId ? parseInt(JSON.parse(categoryId)) : 0;
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

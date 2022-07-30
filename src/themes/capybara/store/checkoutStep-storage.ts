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

export const saveAddressId = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      asyncLocalStorage?.removeItem(storeView.storeCode + '/addressId');
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/addressId',
        JSON.stringify(data)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const loadAddressId = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      const addressId = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/addressId'
      );
      return addressId ? parseInt(JSON.parse(addressId)) : -1;
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

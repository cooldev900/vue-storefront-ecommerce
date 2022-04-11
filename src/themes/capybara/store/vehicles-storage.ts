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

export const saveVehicles = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      let oldVehicles: any = await asyncLocalStorage.getItem(
        storeView.storeCode + '/vehicles'
      );
      oldVehicles = oldVehicles ? JSON.parse(oldVehicles) : []

      let newVehicles;
      // remove duplicated vehicles
      oldVehicles.forEach((v, index) => {
        if (v.national_code === data.national_code) {
          oldVehicles.splice(index, 1);
        }
      });
      if (Object.keys(data).length) {
        newVehicles = [...new Set([...oldVehicles, data])];
      } else {
        newVehicles = []
      }
      await asyncLocalStorage?.setItem(
        storeView.storeCode + '/active-vehicle',
        JSON.stringify(data)
      );
      await asyncLocalStorage?.setItem(
        storeView.storeCode + '/vehicles',
        JSON.stringify(newVehicles)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e)
  }
};

export const saveActiveVehicle = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      asyncLocalStorage?.removeItem(storeView.storeCode + '/active-vehicle');
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/active-vehicle',
        JSON.stringify(data)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const saveLocation = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      asyncLocalStorage?.removeItem(storeView.storeCode + '/location');
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/location',
        JSON.stringify(data)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const getLocation = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      const location = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/active-vehicle'
      );
      return location ? JSON.parse(location) : {};
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const clearVehicles = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/vehicles',
        JSON.stringify([])
      );
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/active-vehicle',
        JSON.stringify({})
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const getSavedVehiclesData = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      const vehicles = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/vehicles'
      );
      return vehicles ? JSON.parse(vehicles) : []
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const getActiveVehicleData = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();
    if (existLocalStorage) {
      const activeVehicle = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/active-vehicle'
      );
      return activeVehicle ? JSON.parse(activeVehicle) : {}
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const removeVehicle = async data => {
  try {
    const existLocalStorage = await availableLocalStorage();
    if (existLocalStorage) {
      const activeVehicle = await getActiveVehicleData();
      const oldVehicles = await getSavedVehiclesData();
      await clearVehicles();

      const newVehicles = oldVehicles.filter(vehicle => {
        return vehicle.national_code !== data.national_code
      })
      Promise.all(newVehicles.map(async vehicle => {
        await saveVehicles(vehicle);
      }))
      if (activeVehicle.national_code !== data.national_code) await saveActiveVehicle(data);
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const setRecentViewed = async sku => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();

    if (existLocalStorage) {
      const recentViewed = await getRecentViewed();
      if (recentViewed.length > 16) recentViewed.pop();
      await asyncLocalStorage?.setItem(
        storeView.storeCode + '/recent-viewed',
        JSON.stringify([...new Set([sku, ...recentViewed])])
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const getRecentViewed = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();

    if (existLocalStorage) {
      const recentViewed = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/recent-viewed'
      );
      return recentViewed ? JSON.parse(recentViewed) : [];
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
};

export const setFittingProducts = async payload => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();

    if (existLocalStorage) {
      const fittingProducts = await getFittingProducts();
      await asyncLocalStorage?.setItem(
        storeView.storeCode + '/fitting-products',
        JSON.stringify([payload, ...fittingProducts])
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const updateFittingProductVisible = async (sku, status) => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();

    if (existLocalStorage) {
      const fittingProducts = await getFittingProducts();
      fittingProducts.forEach(product => {
        if (product.sku === sku) product.status = status;
      });
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/fitting-products',
        JSON.stringify([...fittingProducts])
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const removeFittingProduct = async sku => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();

    if (existLocalStorage) {
      const fittingProducts = await getFittingProducts();
      const newFittingProducts = fittingProducts.filter(product => product.sku !== sku)
      asyncLocalStorage?.setItem(
        storeView.storeCode + '/fitting-products',
        JSON.stringify(newFittingProducts)
      );
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

export const getFittingProducts = async () => {
  try {
    const existLocalStorage = await availableLocalStorage();
    const storeView = currentStoreView();

    if (existLocalStorage) {
      const result = await asyncLocalStorage?.getItem(
        storeView.storeCode + '/fitting-products'
      );

      return result ? JSON.parse(result) : [];
    }
  } catch (e) {
    console.log('localStorage error----', e);
  }
}

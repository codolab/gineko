export function localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

export function localStorageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {}
}

export function localStorageSetItem(key, value) {
  try {
    return localStorage.setItem(key, value);
  } catch (error) {}
}

const storage = {
  getItem: localStorageGetItem,
  removeItem: localStorageRemoveItem,
  setItem: localStorageSetItem,
};

export default storage;
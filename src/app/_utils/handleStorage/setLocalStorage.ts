export default function setLocalStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

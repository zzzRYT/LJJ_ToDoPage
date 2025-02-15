export default function getLocalData(key: string) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

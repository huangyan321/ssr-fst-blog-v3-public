export default function escapeJSON(str: string) {
  if (str) {
    str = str.replace(/[\\$'"]/g, '\\$&');
  }
  return str;
}
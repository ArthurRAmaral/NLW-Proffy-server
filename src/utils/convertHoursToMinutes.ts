export default function convertHoursToMinutes(time: string) {
  if (!time) return time;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

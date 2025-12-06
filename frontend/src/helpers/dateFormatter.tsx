import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const formatLocalDate = (dateString: string | null) => {
  if (!dateString) return '-';
  // Parse UTC date from backend and convert to local timezone
  return dayjs.utc(dateString).local().format('MM/DD/YYYY');
};


export function getOverlappedTimeIndex(times, time) {
  const timeStart = Number(time.start.replace(':', ''));
  const timeEnd = Number(time.end.replace(':', ''));

  for (let i = 0; i < times.length; i++) {
    const curTime = times[i];
    const curStart = Number(curTime.start.replace(':',''));
    const curEnd = Number(curTime.end.replace(':',''));

    if (curTime.day === time.day) {
      if (timeStart > curStart && timeStart < curEnd) {
        return i;
      } else if (timeEnd > curStart && timeEnd < curEnd) {
        return i;
      } else if (timeStart === curStart && timeEnd === curEnd) {
        return i;
      }
    }
  }
  return -1;
}

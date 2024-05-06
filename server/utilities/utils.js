function withinOneDay(currentPrayerDate, lastPrayerDate) {
  // Calculate the time difference in milliseconds
  const timeDifference = currentPrayerDate.getTime() - lastPrayerDate.getTime();

  // Convert the time difference to days
  const daysDifference = timeDifference / (1000 * 3600 * 24);

  // Check if the difference is less than 1 day
  return daysDifference < 1;
}

module.exports = [withinOneDay];

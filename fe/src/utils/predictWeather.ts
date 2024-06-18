export const handlePredictWeather = (
  times: string[],
  weatherCode: number[]
) => {
  let isRainyToday = false;
  let isRainyTomorrow = false;

  let startRainyToday: Date = new Date();
  let startRainyTomorrow: Date = new Date();

  const today = new Date();
  today.setDate(today.getDate() + 1);

  const currentDate = new Date().getDate();
  const nextDate = today.getDate();

  times.forEach((time, index) => {
    if (new Date(time).getDate() === currentDate && weatherCode[index] > 60) {
      if (!isRainyToday && new Date(time).getHours() > new Date().getHours()) {
        isRainyToday = true;
        startRainyToday = new Date(time);
      }
    } else if (
      new Date(time).getDate() === nextDate &&
      weatherCode[index] > 60
    ) {
      if (!isRainyTomorrow) {
        isRainyTomorrow = true;
        startRainyTomorrow = new Date(time);
      }
    }
  });

  return {
    today: {
      time: new Date(startRainyToday.setHours(startRainyToday.getHours() + 7)),
      isRainy: isRainyToday,
    },
    tomorrow: {
      time: new Date(
        startRainyTomorrow.setHours(startRainyTomorrow.getHours() + 7)
      ),
      isRainy: isRainyTomorrow,
    },
  };
};

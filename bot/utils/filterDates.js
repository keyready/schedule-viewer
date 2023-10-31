function filterDates(days, shift = 1) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const msPerDay = 24 * 60 * 60 * 1000;
    const targetDate = new Date(today.getTime() + msPerDay * shift);

    return days.filter((day) => {
        const currentDate = new Date(day.date);
        currentDate.setHours(0, 0, 0, 0);
        return currentDate.getTime() === targetDate.getTime();
    })[0];
}

module.exports = {
    filterDates,
};

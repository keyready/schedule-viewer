function filterDates(days) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return days.filter((day) => {
        const currentDate = new Date(day.date);
        return (
            currentDate.getDate() === tomorrow.getDate() &&
            currentDate.getMonth() === tomorrow.getMonth() &&
            currentDate.getFullYear() === tomorrow.getFullYear()
        );
    });
}

module.exports = {
    filterDates,
};

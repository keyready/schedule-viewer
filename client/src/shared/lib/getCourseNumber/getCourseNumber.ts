import { ScheduleDay } from 'entities/ScheduleDay';

export function calculateCourse(groupNumber: string) {
    const currentYear = new Date().getFullYear();

    const cleaned = groupNumber.split('-')[0]; // "611/11" → "611", "612" → "612"

    if (!/^\d{3}$/.test(cleaned)) {
        throw new Error(
            `Неверный формат группы. Ожидается 3 цифры, например: "612", "611/11", "641/2", получено ${groupNumber}`,
        );
    }

    const admissionYearDigit = cleaned[1]; // например, "1" из "612"
    const admissionYear = parseInt('202' + admissionYearDigit); // "1" → 2021, "4" → 2024

    const course = parseInt('6' + (currentYear - admissionYear + 1));

    return Math.max(course, 1);
}

export function groupScheduleByCourse(scheduleDays: ScheduleDay[]): Record<string, ScheduleDay[]> {
    const result: Record<string, ScheduleDay[]> = {};

    for (const day of scheduleDays) {
        if (!day.groupName) continue;

        try {
            const course = calculateCourse(day.groupName);
            const courseKey = course.toString();

            if (!result[courseKey]) {
                result[courseKey] = [];
            }
            result[courseKey].push(day);
        } catch (error) {
            console.warn(`Пропущена группа с некорректным форматом: ${day.groupName}`, error);
            continue;
        }
    }

    return result;
}

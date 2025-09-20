import { ScheduleGroupDay } from '@/entities/schedule';

export function calculateCourse(groupNumber: string) {
    const currentYear = new Date().getFullYear();

    const cleaned = groupNumber.split('-')[0];

    if (!/^\d{3}$/.test(cleaned)) {
        throw new Error(
            `Неверный формат группы. Ожидается 3 цифры, например: "612", "611/11", "641/2", получено ${groupNumber}`,
        );
    }

    const admissionYearDigit = cleaned[1];
    const admissionYear = parseInt(`202${admissionYearDigit}`, 10);

    const course = parseInt(`6${currentYear - admissionYear + 1}`, 10);

    return Math.max(course, 1);
}

export function calculateLectern(groupNumber: string) {
    const cleaned = groupNumber.split('-')[0];

    if (!/^\d{3}$/.test(cleaned)) {
        throw new Error(
            `Неверный формат группы. Ожидается 3 цифры, например: "612", "611/11", "641/2", получено ${groupNumber}`,
        );
    }

    const lecternDigit = cleaned[2];
    const lectern = parseInt(`6${lecternDigit}`, 10);

    return Math.max(lectern, 1);
}

export function groupScheduleByCourse(
    scheduleDays: ScheduleGroupDay[],
): Record<string, ScheduleGroupDay[]> {
    const result: Record<string, ScheduleGroupDay[]> = {};

    for (const day of scheduleDays) {
        if (!day.groupName) continue;

        try {
            const courseKey = calculateCourse(day.groupName).toString();
            const lecternKey = calculateLectern(day.groupName).toString();

            if (!result[courseKey]) {
                result[courseKey] = [];
            }
            result[courseKey].push({ ...day, lectern: lecternKey });
        } catch (error) {
            console.warn(`Пропущена группа с некорректным форматом: ${day.groupName}`, error);
            continue;
        }
    }

    return result;
}


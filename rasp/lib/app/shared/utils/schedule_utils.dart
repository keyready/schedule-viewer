import '../../data/models/schedule_day_model.dart';

/// Группирует расписание по неделям
List<List<ScheduleDayModel>> groupByWeeks(List<ScheduleDayModel> days) {
  if (days.isEmpty) return [];

  // Сортируем по дате
  final sorted = List<ScheduleDayModel>.from(days)
    ..sort((a, b) => a.date.compareTo(b.date));

  final result = <List<ScheduleDayModel>>[];
  var currentWeek = <ScheduleDayModel>[];
  DateTime? currentWeekStart;

  for (final day in sorted) {
    final weekStart = _getWeekStart(day.date);

    if (currentWeekStart == null || weekStart != currentWeekStart) {
      if (currentWeek.isNotEmpty) {
        result.add(currentWeek);
      }
      currentWeek = [day];
      currentWeekStart = weekStart;
    } else {
      currentWeek.add(day);
    }
  }

  if (currentWeek.isNotEmpty) {
    result.add(currentWeek);
  }

  return result;
}

/// Получает начало недели (понедельник)
DateTime _getWeekStart(DateTime date) {
  final weekday = date.weekday;
  final daysFromMonday = weekday == 7 ? 0 : weekday - 1;
  return DateTime(date.year, date.month, date.day - daysFromMonday);
}

/// Вычисляет курс по номеру группы
int calculateCourse(String groupNumber) {
  final currentYear = DateTime.now().year;
  final cleaned = groupNumber.split('-')[0];

  if (!RegExp(r'^\d{3}$').hasMatch(cleaned)) {
    return 1; // По умолчанию первый курс
  }

  final admissionYearDigit = cleaned[1];
  final admissionYear = int.parse('202$admissionYearDigit');

  final course = int.parse('${currentYear - admissionYear + 1}');
  return course > 0 ? course : 1;
}

/// Группирует расписание по курсам
Map<String, List<ScheduleDayModel>> groupScheduleByCourse(
  List<ScheduleDayModel> scheduleDays,
) {
  final result = <String, List<ScheduleDayModel>>{};

  for (final day in scheduleDays) {
    if (day.groupName == null || day.groupName!.isEmpty) continue;

    try {
      final courseKey = calculateCourse(day.groupName!).toString();
      if (!result.containsKey(courseKey)) {
        result[courseKey] = [];
      }
      result[courseKey]!.add(day);
    } catch (e) {
      continue;
    }
  }

  return result;
}


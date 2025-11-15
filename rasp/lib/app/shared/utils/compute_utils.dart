import 'package:flutter/foundation.dart';
import '../../data/models/schedule_day_model.dart';
import '../../data/models/subject_model.dart';
import 'schedule_utils.dart';

/// Параметры для фильтрации расписания (сериализуемые)
class FilterParams {
  final List<Map<String, dynamic>> scheduleJson;
  final Map<String, List<Map<String, dynamic>>> subjectsByGroupJson;
  final String searchQuery;
  final String? selectedCourse;
  final String? selectedLecternTitle;
  final String? selectedClassroomTitle;

  FilterParams({
    required this.scheduleJson,
    required this.subjectsByGroupJson,
    required this.searchQuery,
    this.selectedCourse,
    this.selectedLecternTitle,
    this.selectedClassroomTitle,
  });
}

/// Фильтрация расписания в отдельном изоляте
List<Map<String, dynamic>> _filterSchedule(FilterParams params) {
  // Десериализуем данные
  final schedule = params.scheduleJson
      .map((json) => ScheduleDayModel.fromJson(json))
      .toList();
  
  final subjectsByGroup = params.subjectsByGroupJson.map((k, v) => 
    MapEntry(k, v.map((s) => SubjectModel.fromJson(s)).toList()));

  var filtered = List<ScheduleDayModel>.from(schedule);

  // Фильтр по поисковому запросу
  if (params.searchQuery.isNotEmpty) {
    final query = params.searchQuery.toLowerCase();
    filtered = filtered.where((day) {
      // Поиск по группе
      if (day.groupName?.toLowerCase().contains(query) ?? false) {
        return true;
      }
      
      // Поиск по предметам в jobs
      for (final job in day.jobs) {
        if (job.toLowerCase().contains(query)) {
          return true;
        }
      }
      
      // Поиск по предметам из subjectsByGroup
      final groupSubjects = subjectsByGroup[day.groupName ?? ''];
      if (groupSubjects != null) {
        for (final subject in groupSubjects) {
          if (subject.title.toLowerCase().contains(query) ||
              subject.abbr.toLowerCase().contains(query)) {
            return true;
          }
        }
      }
      
      return false;
    }).toList();
  }

  // Фильтр по курсу
  if (params.selectedCourse != null) {
    filtered = filtered.where((day) {
      if (day.groupName == null || day.groupName!.isEmpty) return false;
      try {
        final course = calculateCourse(day.groupName!).toString();
        return course == params.selectedCourse;
      } catch (e) {
        return false;
      }
    }).toList();
  }

  // Фильтр по кафедре
  if (params.selectedLecternTitle != null) {
    final kafTitle = params.selectedLecternTitle!.split(' | ').first;
    filtered = filtered.where((day) {
      if (day.groupName == null) return false;
      try {
        final groupNum = day.groupName!.split('-').first;
        if (groupNum.length >= 3) {
          final lecternDigit = groupNum[2];
          final lecternNum = int.parse('6$lecternDigit');
          return kafTitle.contains(lecternNum.toString());
        }
      } catch (e) {
        return false;
      }
      return false;
    }).toList();
  }

  // Фильтр по аудитории
  if (params.selectedClassroomTitle != null) {
    final classroomTitle = params.selectedClassroomTitle!;
    filtered = filtered.where((day) {
      return day.jobs.any((job) => job.contains('аудитория: $classroomTitle'));
    }).toList();
  }

  // Сериализуем обратно
  return filtered.map((day) => day.toJson()).toList();
}

/// Вычисление статистики в отдельном изоляте
Map<String, dynamic> _calculateStatistics(List<Map<String, dynamic>> filteredJson) {
  final filtered = filteredJson
      .map((json) => ScheduleDayModel.fromJson(json))
      .toList();
  
  final totalLessons = filtered.fold<int>(
    0, (sum, day) => sum + day.jobs.length
  );
  
  final groups = filtered
      .where((day) => day.groupName != null && day.groupName!.isNotEmpty)
      .map((day) => day.groupName!)
      .toSet()
      .toList();
  
  final days = filtered.map((day) => day.date).toSet().length;
  
  // Подсчет популярных предметов
  final subjectCounts = <String, int>{};
  for (final day in filtered) {
    for (final job in day.jobs) {
      // Пытаемся извлечь название предмета из job
      final parts = job.split(', ');
      for (final part in parts) {
        if (part.startsWith('дисциплина:')) {
          final subjectName = part.replaceFirst('дисциплина:', '').trim();
          if (subjectName.isNotEmpty) {
            subjectCounts[subjectName] = (subjectCounts[subjectName] ?? 0) + 1;
          }
        }
      }
    }
  }
  
  final topSubjects = subjectCounts.entries.toList()
    ..sort((a, b) => b.value.compareTo(a.value));
  
  return {
    'totalLessons': totalLessons,
    'groupsCount': groups.length,
    'daysCount': days,
    'topSubjects': topSubjects.take(5).map((e) => {
      'name': e.key,
      'count': e.value,
    }).toList(),
  };
}

/// Группировка по курсам в отдельном изоляте
Map<String, List<Map<String, dynamic>>> _groupByCourse(List<Map<String, dynamic>> scheduleJson) {
  final schedule = scheduleJson
      .map((json) => ScheduleDayModel.fromJson(json))
      .toList();
  
  final grouped = groupScheduleByCourse(schedule);
  
  return grouped.map((k, v) => MapEntry(
    k,
    v.map((day) => day.toJson()).toList(),
  ));
}

/// Группировка по неделям в отдельном изоляте
List<List<Map<String, dynamic>>> _groupByWeeks(List<Map<String, dynamic>> scheduleJson) {
  final schedule = scheduleJson
      .map((json) => ScheduleDayModel.fromJson(json))
      .toList();
  
  final weeks = groupByWeeks(schedule);
  
  return weeks.map((week) => week.map((day) => day.toJson()).toList()).toList();
}

/// Обертки для compute
Future<List<ScheduleDayModel>> filterScheduleInIsolate(
  List<ScheduleDayModel> schedule,
  Map<String, List<SubjectModel>> subjectsByGroup,
  String searchQuery,
  String? selectedCourse,
  String? selectedLecternTitle,
  String? selectedClassroomTitle,
) async {
  final params = FilterParams(
    scheduleJson: schedule.map((d) => d.toJson()).toList(),
    subjectsByGroupJson: subjectsByGroup.map((k, v) => 
      MapEntry(k, v.map((s) => s.toJson()).toList())),
    searchQuery: searchQuery,
    selectedCourse: selectedCourse,
    selectedLecternTitle: selectedLecternTitle,
    selectedClassroomTitle: selectedClassroomTitle,
  );
  
  final result = await compute(_filterSchedule, params);
  return result.map((json) => ScheduleDayModel.fromJson(json)).toList();
}

Future<Map<String, dynamic>> calculateStatisticsInIsolate(
  List<ScheduleDayModel> filteredSchedule,
) async {
  final filteredJson = filteredSchedule.map((d) => d.toJson()).toList();
  return compute(_calculateStatistics, filteredJson);
}

Future<Map<String, List<ScheduleDayModel>>> groupByCourseInIsolate(
  List<ScheduleDayModel> schedule,
) async {
  final scheduleJson = schedule.map((d) => d.toJson()).toList();
  final result = await compute(_groupByCourse, scheduleJson);
  return result.map((k, v) => MapEntry(
    k,
    v.map((json) => ScheduleDayModel.fromJson(json)).toList(),
  ));
}

Future<List<List<ScheduleDayModel>>> groupByWeeksInIsolate(
  List<ScheduleDayModel> schedule,
) async {
  final scheduleJson = schedule.map((d) => d.toJson()).toList();
  final result = await compute(_groupByWeeks, scheduleJson);
  return result.map((week) => 
    week.map((json) => ScheduleDayModel.fromJson(json)).toList()
  ).toList();
}


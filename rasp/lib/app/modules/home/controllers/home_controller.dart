import 'package:get/get.dart';
import 'package:flutter/material.dart';
import '../../../data/services/schedule_service.dart';
import '../../../data/services/filter_service.dart';
import '../../../data/services/cache_service.dart';
import '../../../data/models/schedule_day_model.dart';
import '../../../data/models/subject_model.dart';
import '../../../data/models/lectern_model.dart';
import '../../../data/models/classroom_model.dart';
import '../../../shared/utils/schedule_utils.dart';
import '../../../shared/utils/compute_utils.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'dart:async';

class HomeController extends GetxController {
  final ScheduleService _scheduleService = ScheduleService();
  final FilterService _filterService = FilterService();

  // Observable состояния
  final schedule = <ScheduleDayModel>[].obs;
  final subjectsByGroup = <String, List<SubjectModel>>{}.obs; // Предметы по группам
  final isLoading = false.obs;
  final errorMessage = ''.obs;
  final selectedDate = DateTime.now().obs;
  final viewMode = 'list'.obs; // 'list' или 'week'
  final isDarkMode = false.obs; // Темная тема
  final lastUpdateTime = Rx<DateTime?>(null); // Время последнего обновления
  final isOnline = true.obs; // Онлайн/офлайн статус
  
  // Поиск и фильтры
  final searchQuery = ''.obs; // Поисковый запрос
  final selectedCourse = Rx<String?>(null); // Выбранный курс
  
  // Фильтры
  final lecterns = <LecternModel>[].obs;
  final classrooms = <ClassroomModel>[].obs;
  final selectedLectern = Rx<LecternModel?>(null);
  final selectedClassroom = Rx<ClassroomModel?>(null);
  final isLoadingFilters = false.obs;
  
  // Кешированные результаты тяжелых операций
  final filteredSchedule = <ScheduleDayModel>[].obs;
  final statistics = <String, dynamic>{}.obs;
  final isComputing = false.obs;
  
  Timer? _filterDebounceTimer;

  @override
  void onInit() {
    super.onInit();
    _loadThemePreference();
    loadFilters();
    loadCommonSchedule();
    
    // Слушаем изменения фильтров для обновления результатов
    ever(searchQuery, (_) => _updateFilteredSchedule());
    ever(selectedCourse, (_) => _updateFilteredSchedule());
    ever(selectedLectern, (_) => _updateFilteredSchedule());
    ever(selectedClassroom, (_) => _updateFilteredSchedule());
    ever(schedule, (_) => _updateFilteredSchedule());
    ever(subjectsByGroup, (_) => _updateFilteredSchedule());
  }
  
  @override
  void onClose() {
    _filterDebounceTimer?.cancel();
    super.onClose();
  }
  
  /// Загрузить предпочтения темы
  Future<void> _loadThemePreference() async {
    try {
      final box = await Hive.openBox('settings');
      final isDark = box.get('isDarkMode') as bool? ?? false;
      isDarkMode.value = isDark;
    } catch (e) {
      // Игнорируем ошибки
    }
  }
  
  /// Сохранить предпочтения темы
  Future<void> _saveThemePreference() async {
    try {
      final box = await Hive.openBox('settings');
      await box.put('isDarkMode', isDarkMode.value);
    } catch (e) {
      // Игнорируем ошибки
    }
  }
  
  /// Переключить тему
  Future<void> toggleTheme() async {
    isDarkMode.value = !isDarkMode.value;
    await _saveThemePreference();
    Get.changeThemeMode(isDarkMode.value ? ThemeMode.dark : ThemeMode.light);
  }
  
  /// Установить поисковый запрос
  void setSearchQuery(String query) {
    searchQuery.value = query;
    // Обновление произойдет через ever() с debounce
  }
  
  /// Очистить поиск
  void clearSearch() {
    searchQuery.value = '';
  }
  
  /// Установить выбранный курс
  void setSelectedCourse(String? course) {
    selectedCourse.value = course;
  }
  
  /// Получить список доступных курсов
  List<String> getAvailableCourses() {
    final courses = schedule
        .where((day) => day.groupName != null && day.groupName!.isNotEmpty)
        .map((day) => calculateCourse(day.groupName!).toString())
        .toSet()
        .toList();
    courses.sort((a, b) => b.compareTo(a));
    return courses;
  }

  @override
  void onReady() {
    super.onReady();
  }

  /// Изменить выбранную дату
  void changeDate(DateTime date) {
    selectedDate.value = date;
    loadCommonSchedule();
  }

  /// Переключить режим просмотра (список/неделя)
  void toggleViewMode() {
    viewMode.value = viewMode.value == 'list' ? 'week' : 'list';
    // Перезагружаем расписание при смене режима
    loadCommonSchedule();
  }
  
  /// Очистить кеш
  Future<void> clearCache() async {
    try {
      final cacheService = CacheService();
      await cacheService.clearCache();
      // Перезагружаем данные
      await loadFilters();
      await loadCommonSchedule();
    } catch (e) {
      errorMessage.value = 'Ошибка очистки кеша: $e';
    }
  }
  
  /// Перейти к сегодняшнему дню
  void goToToday() {
    selectedDate.value = DateTime.now();
    loadCommonSchedule();
  }

  /// Загрузить фильтры (кафедры и аудитории)
  Future<void> loadFilters() async {
    try {
      isLoadingFilters.value = true;
      final results = await Future.wait([
        _filterService.getLecterns(),
        _filterService.getClassrooms(),
      ]);
      lecterns.value = results[0] as List<LecternModel>;
      classrooms.value = results[1] as List<ClassroomModel>;
    } catch (e) {
      // Игнорируем ошибки фильтров, они не критичны
      print('Ошибка загрузки фильтров: $e');
    } finally {
      isLoadingFilters.value = false;
    }
  }

  /// Загрузить общее расписание на выбранную дату
  Future<void> loadCommonSchedule() async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      
      List<ScheduleDayModel> commonSchedule;
      
      // В режиме недель загружаем расписание на всю неделю
      if (viewMode.value == 'week') {
        final weekStart = _getWeekStart(selectedDate.value);
        
        // Загружаем расписание для каждого дня недели
        final futures = <Future<List<ScheduleDayModel>>>[];
        for (int i = 0; i < 7; i++) {
          final day = weekStart.add(Duration(days: i));
          futures.add(_scheduleService.getCommonSchedule(viewedDay: day));
        }
        
        final results = await Future.wait(futures);
        commonSchedule = results.expand((list) => list).toList();
      } else {
        // В режиме списка загружаем только выбранную дату
        commonSchedule = await _scheduleService.getCommonSchedule(
          viewedDay: selectedDate.value,
        );
      }
      
      schedule.value = commonSchedule;
      
      // Получаем уникальные группы из расписания
      final uniqueGroups = commonSchedule
          .where((day) => day.groupName != null && day.groupName!.isNotEmpty)
          .map((day) => day.groupName!)
          .toSet()
          .toList();
      
      // Загружаем предметы для всех групп параллельно
      if (uniqueGroups.isNotEmpty) {
        final subjectsMap = await _scheduleService.getSubjectsForGroups(uniqueGroups);
        subjectsByGroup.value = subjectsMap;
      }
      
      // Обновляем время последнего обновления
      lastUpdateTime.value = DateTime.now();
      isOnline.value = true;
      
      // Обновляем фильтрованное расписание после загрузки
      await _updateFilteredSchedule();
    } catch (e) {
      errorMessage.value = 'Ошибка загрузки расписания: $e';
      isOnline.value = false;
    } finally {
      isLoading.value = false;
    }
  }
  
  /// Получить начало недели (понедельник)
  DateTime _getWeekStart(DateTime date) {
    final weekday = date.weekday;
    final daysFromMonday = weekday == 7 ? 0 : weekday - 1;
    return DateTime(date.year, date.month, date.day - daysFromMonday);
  }

  /// Изменить выбранную кафедру
  void changeLectern(LecternModel? lectern) {
    selectedLectern.value = lectern;
    // Сбрасываем аудиторию при смене кафедры
    if (lectern == null) {
      selectedClassroom.value = null;
    }
    _applyFilters();
  }

  /// Изменить выбранную аудиторию
  void changeClassroom(ClassroomModel? classroom) {
    selectedClassroom.value = classroom;
    _applyFilters();
  }

  /// Применить фильтры к расписанию
  void _applyFilters() {
    // Обновление произойдет через ever() с debounce
  }

  /// Обновить отфильтрованное расписание в отдельном изоляте
  Future<void> _updateFilteredSchedule() async {
    // Отменяем предыдущий таймер
    _filterDebounceTimer?.cancel();
    
    // Для поиска используем debounce, чтобы не пересчитывать при каждом символе
    if (searchQuery.value.isNotEmpty) {
      _filterDebounceTimer = Timer(const Duration(milliseconds: 300), () {
        _performFilterUpdate();
      });
    } else {
      // Для других фильтров обновляем сразу
      _performFilterUpdate();
    }
  }
  
  /// Выполнить обновление фильтрации
  Future<void> _performFilterUpdate() async {
    if (schedule.isEmpty) {
      filteredSchedule.clear();
      statistics.clear();
      return;
    }
    
    try {
      isComputing.value = true;
      
      // Фильтруем в отдельном изоляте
      // Преобразуем observable коллекции в обычные для передачи в isolate
      final scheduleList = List<ScheduleDayModel>.from(schedule);
      final subjectsMap = Map<String, List<SubjectModel>>.from(subjectsByGroup);
      final filtered = await filterScheduleInIsolate(
        scheduleList,
        subjectsMap,
        searchQuery.value,
        selectedCourse.value,
        selectedLectern.value?.title,
        selectedClassroom.value?.title,
      );
      
      filteredSchedule.value = filtered;
      
      // Вычисляем статистику в отдельном изоляте
      final stats = await calculateStatisticsInIsolate(filtered);
      statistics.value = stats;
    } catch (e) {
      print('Ошибка при фильтрации: $e');
      // В случае ошибки используем синхронную фильтрацию как fallback
      filteredSchedule.value = _filterScheduleSync();
      statistics.value = _calculateStatisticsSync();
    } finally {
      isComputing.value = false;
    }
  }
  
  /// Синхронная фильтрация (fallback)
  List<ScheduleDayModel> _filterScheduleSync() {
    var filtered = List<ScheduleDayModel>.from(schedule);

    if (searchQuery.value.isNotEmpty) {
      final query = searchQuery.value.toLowerCase();
      filtered = filtered.where((day) {
        if (day.groupName?.toLowerCase().contains(query) ?? false) {
          return true;
        }
        for (final job in day.jobs) {
          if (job.toLowerCase().contains(query)) {
            return true;
          }
        }
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

    if (selectedCourse.value != null) {
      filtered = filtered.where((day) {
        if (day.groupName == null || day.groupName!.isEmpty) return false;
        try {
          final course = calculateCourse(day.groupName!).toString();
          return course == selectedCourse.value;
        } catch (e) {
          return false;
        }
      }).toList();
    }

    if (selectedLectern.value != null) {
      final kafTitle = selectedLectern.value!.title.split(' | ').first;
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

    if (selectedClassroom.value != null) {
      final classroomTitle = selectedClassroom.value!.title;
      filtered = filtered.where((day) {
        return day.jobs.any((job) => job.contains('аудитория: $classroomTitle'));
      }).toList();
    }

    return filtered;
  }
  
  /// Синхронное вычисление статистики (fallback)
  Map<String, dynamic> _calculateStatisticsSync() {
    final filtered = filteredSchedule;
    final totalLessons = filtered.fold<int>(
      0, (sum, day) => sum + day.jobs.length
    );
    
    final groupsCount = filtered
        .where((day) => day.groupName != null && day.groupName!.isNotEmpty)
        .map((day) => day.groupName!)
        .toSet()
        .length;
    
    final daysCount = filtered
        .map((day) => day.date)
        .toSet()
        .length;
    
    final subjectCounts = <String, int>{};
    for (final day in filtered) {
      final groupSubjects = subjectsByGroup[day.groupName ?? ''];
      if (groupSubjects != null) {
        for (final subject in groupSubjects) {
          subjectCounts[subject.abbr] = (subjectCounts[subject.abbr] ?? 0) + 1;
        }
      }
    }
    
    final topSubjects = subjectCounts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    
    return {
      'totalLessons': totalLessons,
      'groupsCount': groupsCount,
      'daysCount': daysCount,
      'topSubjects': topSubjects.take(5).map((e) => {'name': e.key, 'count': e.value}).toList(),
    };
  }
  
  /// Получить отфильтрованное расписание (из кеша)
  List<ScheduleDayModel> getFilteredSchedule() {
    return filteredSchedule;
  }
  
  /// Получить статистику по расписанию (из кеша)
  Map<String, dynamic> getStatistics() {
    return statistics;
  }
}

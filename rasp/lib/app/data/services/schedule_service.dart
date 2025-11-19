import '../models/schedule_day_model.dart';
import '../models/subject_model.dart';
import 'api_client.dart';
import 'cache_service.dart';

class ScheduleService {
  final ApiClient _apiClient;
  final CacheService _cacheService;

  ScheduleService({ApiClient? apiClient, CacheService? cacheService})
      : _apiClient = apiClient ?? ApiClient(),
        _cacheService = cacheService ?? CacheService();

  /// Получить список всех групп
  Future<List<String>> getGroups() async {
    try {
      // Проверяем кеш
      if (_cacheService.isGroupsCacheValid()) {
        final cached = await _cacheService.getGroups();
        if (cached != null && cached.isNotEmpty) {
          return cached;
        }
      }
      
      // Загружаем с сервера
      final groups = await _apiClient.getGroups();
      await _cacheService.saveGroups(groups);
      return groups;
    } catch (e) {
      // Пробуем получить из кеша даже если истек срок
      final cached = await _cacheService.getGroups();
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      throw Exception('Ошибка при получении списка групп: $e');
    }
  }

  /// Получить список предметов для группы
  Future<List<SubjectModel>> getSubjects({String? group}) async {
    if (group == null || group.isEmpty) {
      return [];
    }
    
    try {
      // Проверяем кеш
      if (_cacheService.isSubjectsCacheValid(group)) {
        final cached = await _cacheService.getSubjects(group);
        if (cached != null && cached.isNotEmpty) {
          return cached;
        }
      }
      
      // Загружаем с сервера
      final data = await _apiClient.getSubjects(group: group);
      final subjects = data.map((json) => SubjectModel.fromJson(json)).toList();
      await _cacheService.saveSubjects(group, subjects);
      return subjects;
    } catch (e) {
      // Пробуем получить из кеша даже если истек срок
      final cached = await _cacheService.getSubjects(group);
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      throw Exception('Ошибка при получении предметов: $e');
    }
  }

  /// Получить расписание для группы
  Future<List<ScheduleDayModel>> getSchedule({String? group}) async {
    if (group == null || group.isEmpty) {
      return [];
    }
    
    try {
      // Проверяем кеш
      if (_cacheService.isScheduleCacheValid(group)) {
        final cached = await _cacheService.getSchedule(group);
        if (cached != null && cached.isNotEmpty) {
          return cached;
        }
      }
      
      // Загружаем с сервера
      final data = await _apiClient.getSchedule(group: group);
      final schedule = data.map((json) => ScheduleDayModel.fromJson(json)).toList();
      await _cacheService.saveSchedule(group, schedule);
      return schedule;
    } catch (e) {
      // Пробуем получить из кеша даже если истек срок
      final cached = await _cacheService.getSchedule(group);
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      throw Exception('Ошибка при получении расписания: $e');
    }
  }

  /// Получить расписание на конкретный день для всех групп
  Future<List<ScheduleDayModel>> getToday({required DateTime viewedDay}) async {
    try {
      // Форматируем дату в ISO строку
      final dateString = viewedDay.toIso8601String().split('T')[0];
      
      // Проверяем кеш
      if (_cacheService.isTodayScheduleCacheValid(dateString)) {
        final cached = await _cacheService.getTodaySchedule(dateString);
        if (cached != null && cached.isNotEmpty) {
          return cached;
        }
      }
      
      // Загружаем с сервера
      final data = await _apiClient.getToday(viewedDay: dateString);
      final schedule = data.map((json) => ScheduleDayModel.fromJson(json)).toList();
      await _cacheService.saveTodaySchedule(dateString, schedule);
      return schedule;
    } catch (e) {
      // Пробуем получить из кеша даже если истек срок
      final dateString = viewedDay.toIso8601String().split('T')[0];
      final cached = await _cacheService.getTodaySchedule(dateString);
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      throw Exception('Ошибка при получении расписания на день: $e');
    }
  }

  /// Получить общее расписание на день (для всех групп)
  Future<List<ScheduleDayModel>> getCommonSchedule({required DateTime viewedDay}) async {
    return getToday(viewedDay: viewedDay);
  }

  /// Получить предметы для всех групп из расписания
  Future<Map<String, List<SubjectModel>>> getSubjectsForGroups(List<String> groups) async {
    final Map<String, List<SubjectModel>> result = {};
    
    // Загружаем предметы для всех групп параллельно
    final futures = groups.map((group) async {
      try {
        final subjects = await getSubjects(group: group);
        return MapEntry(group, subjects);
      } catch (e) {
        return MapEntry(group, <SubjectModel>[]);
      }
    });
    
    final results = await Future.wait(futures);
    for (final entry in results) {
      result[entry.key] = entry.value;
    }
    
    return result;
  }
}


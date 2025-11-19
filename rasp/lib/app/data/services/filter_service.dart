import '../models/lectern_model.dart';
import '../models/classroom_model.dart';
import 'api_client.dart';
import 'cache_service.dart';

class FilterService {
  final ApiClient _apiClient;
  final CacheService _cacheService;

  FilterService({ApiClient? apiClient, CacheService? cacheService})
      : _apiClient = apiClient ?? ApiClient(),
        _cacheService = cacheService ?? CacheService();

  /// Получить список кафедр
  Future<List<LecternModel>> getLecterns({bool populate = true}) async {
    try {
      // Проверяем кеш
      final cached = await _cacheService.getLecterns();
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      
      // Загружаем с сервера
      final data = await _apiClient.getLecterns(populate: populate);
      final lecterns = data.map((json) => LecternModel.fromJson(json)).toList();
      await _cacheService.saveLecterns(lecterns);
      return lecterns;
    } catch (e) {
      // Пробуем получить из кеша
      final cached = await _cacheService.getLecterns();
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      throw Exception('Ошибка при получении кафедр: $e');
    }
  }

  /// Получить список аудиторий
  Future<List<ClassroomModel>> getClassrooms() async {
    try {
      // Проверяем кеш
      final cached = await _cacheService.getClassrooms();
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      
      // Загружаем с сервера
      final data = await _apiClient.getClassrooms();
      final classrooms = data.map((json) => ClassroomModel.fromJson(json)).toList();
      await _cacheService.saveClassrooms(classrooms);
      return classrooms;
    } catch (e) {
      // Пробуем получить из кеша
      final cached = await _cacheService.getClassrooms();
      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      throw Exception('Ошибка при получении аудиторий: $e');
    }
  }
}


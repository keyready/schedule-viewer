import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConfig {
  // Базовый URL сервера API
  // Для веб используем относительный путь (nginx будет проксировать /api к серверу)
  // Для десктопного приложения используем localhost
  static String get baseUrl {
    if (kIsWeb) {
      // В веб-версии используем относительный путь
      // nginx будет проксировать /api запросы к серверу
      return '';
    }
    // Для десктопной версии используем localhost
    return 'http://localhost:6000';
  }
  
  // Префикс API
  static const String apiPrefix = '/api';
  
  // Полный базовый URL для API запросов
  static String get apiBaseUrl {
    final base = baseUrl;
    return base.isEmpty ? apiPrefix : '$base$apiPrefix';
  }
  
  // Эндпоинты
  static const String groupsEndpoint = '/groups';
  static const String subjectsEndpoint = '/subjects';
  static const String scheduleEndpoint = '/schedule';
  static const String todayEndpoint = '/today';
  static const String lecternsEndpoint = '/get_kafs';
  static const String classroomsEndpoint = '/fetch_auds';
}


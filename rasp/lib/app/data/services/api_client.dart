import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiClient {
  final String baseUrl;

  ApiClient({String? baseUrl}) 
      : baseUrl = baseUrl ?? ApiConfig.apiBaseUrl;

  Future<List<dynamic>> _handleListResponse(http.Response response) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) {
        return [];
      }
      return json.decode(response.body) as List<dynamic>;
    } else {
      throw Exception(
        'Ошибка запроса: ${response.statusCode} - ${response.reasonPhrase}',
      );
    }
  }

  Future<List<String>> getGroups() async {
    final url = Uri.parse('$baseUrl${ApiConfig.groupsEndpoint}');
    final response = await http.get(url);
    final data = await _handleListResponse(response);
    return data.map((item) => item.toString()).toList();
  }

  Future<List<Map<String, dynamic>>> getSubjects({String? group}) async {
    final uri = Uri.parse('$baseUrl${ApiConfig.subjectsEndpoint}');
    final url = group != null
        ? uri.replace(queryParameters: {'group': group})
        : uri;
    final response = await http.get(url);
    final data = await _handleListResponse(response);
    return data.map((item) {
      if (item is Map) {
        return Map<String, dynamic>.from(item);
      }
      return <String, dynamic>{};
    }).toList();
  }

  Future<List<Map<String, dynamic>>> getSchedule({String? group}) async {
    final uri = Uri.parse('$baseUrl${ApiConfig.scheduleEndpoint}');
    final url = group != null
        ? uri.replace(queryParameters: {'group': group})
        : uri;
    final response = await http.get(url);
    final data = await _handleListResponse(response);
    return data.map((item) {
      if (item is Map) {
        return Map<String, dynamic>.from(item);
      }
      return <String, dynamic>{};
    }).toList();
  }

  Future<List<Map<String, dynamic>>> getToday({required String viewedDay}) async {
    final url = Uri.parse('$baseUrl${ApiConfig.todayEndpoint}').replace(
      queryParameters: {'viewedDay': viewedDay},
    );
    final response = await http.get(url);
    final data = await _handleListResponse(response);
    return data.map((item) {
      if (item is Map) {
        return Map<String, dynamic>.from(item);
      }
      return <String, dynamic>{};
    }).toList();
  }

  Future<List<Map<String, dynamic>>> getLecterns({bool populate = true}) async {
    final url = Uri.parse('$baseUrl${ApiConfig.lecternsEndpoint}').replace(
      queryParameters: {'populate': populate ? '1' : '0'},
    );
    final response = await http.get(url);
    final data = await _handleListResponse(response);
    return data.map((item) {
      if (item is Map) {
        return Map<String, dynamic>.from(item);
      }
      return <String, dynamic>{};
    }).toList();
  }

  Future<List<Map<String, dynamic>>> getClassrooms() async {
    final url = Uri.parse('$baseUrl${ApiConfig.classroomsEndpoint}');
    final response = await http.get(url);
    final data = await _handleListResponse(response);
    return data.map((item) {
      if (item is Map) {
        return Map<String, dynamic>.from(item);
      }
      return <String, dynamic>{};
    }).toList();
  }
}


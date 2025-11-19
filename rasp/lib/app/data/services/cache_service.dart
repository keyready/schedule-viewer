import 'package:hive_flutter/hive_flutter.dart';
import '../models/schedule_day_model.dart';
import '../models/subject_model.dart';
import '../models/lectern_model.dart';
import '../models/classroom_model.dart';

class CacheService {
  static const String _groupsBoxName = 'groups';
  static const String _subjectsBoxName = 'subjects';
  static const String _scheduleBoxName = 'schedule';
  static const String _lecternsBoxName = 'lecterns';
  static const String _classroomsBoxName = 'classrooms';
  static const String _todayScheduleBoxName = 'today_schedule';

  static Future<void> init() async {
    // Hive работает на веб через IndexedDB автоматически
    await Hive.initFlutter();
  }

  // Группы
  Future<List<String>?> getGroups() async {
    final box = await Hive.openBox(_groupsBoxName);
    return box.get('list')?.cast<String>();
  }

  Future<void> saveGroups(List<String> groups) async {
    final box = await Hive.openBox(_groupsBoxName);
    await box.put('list', groups);
    await box.put('timestamp', DateTime.now().millisecondsSinceEpoch);
  }

  bool isGroupsCacheValid({Duration maxAge = const Duration(days: 7)}) {
    try {
      final box = Hive.box(_groupsBoxName);
      final timestamp = box.get('timestamp');
      if (timestamp == null) return false;
      final timestampInt = timestamp is int ? timestamp : int.tryParse(timestamp.toString());
      if (timestampInt == null) return false;
      final cacheTime = DateTime.fromMillisecondsSinceEpoch(timestampInt);
      return DateTime.now().difference(cacheTime) < maxAge;
    } catch (e) {
      return false;
    }
  }

  // Предметы для группы
  Future<List<SubjectModel>?> getSubjects(String group) async {
    try {
      final box = await Hive.openBox(_subjectsBoxName);
      final data = box.get(group);
      if (data == null) return null;
      final list = data is List ? data : [];
      return list.map((e) {
        final map = e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{};
        return SubjectModel.fromJson(map);
      }).toList();
    } catch (e) {
      return null;
    }
  }

  Future<void> saveSubjects(String group, List<SubjectModel> subjects) async {
    final box = await Hive.openBox(_subjectsBoxName);
    final data = subjects.map((s) => s.toJson()).toList();
    await box.put(group, data);
    await box.put('${group}_timestamp', DateTime.now().millisecondsSinceEpoch);
  }

  bool isSubjectsCacheValid(String group, {Duration maxAge = const Duration(days: 7)}) {
    try {
      final box = Hive.box(_subjectsBoxName);
      final timestamp = box.get('${group}_timestamp');
      if (timestamp == null) return false;
      final timestampInt = timestamp is int ? timestamp : int.tryParse(timestamp.toString());
      if (timestampInt == null) return false;
      final cacheTime = DateTime.fromMillisecondsSinceEpoch(timestampInt);
      return DateTime.now().difference(cacheTime) < maxAge;
    } catch (e) {
      return false;
    }
  }

  // Расписание для группы
  Future<List<ScheduleDayModel>?> getSchedule(String group) async {
    try {
      final box = await Hive.openBox(_scheduleBoxName);
      final data = box.get(group);
      if (data == null) return null;
      final list = data is List ? data : [];
      return list.map((e) {
        final map = e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{};
        return ScheduleDayModel.fromJson(map);
      }).toList();
    } catch (e) {
      return null;
    }
  }

  Future<void> saveSchedule(String group, List<ScheduleDayModel> schedule) async {
    final box = await Hive.openBox(_scheduleBoxName);
    final data = schedule.map((s) => s.toJson()).toList();
    await box.put(group, data);
    await box.put('${group}_timestamp', DateTime.now().millisecondsSinceEpoch);
  }

  bool isScheduleCacheValid(String group, {Duration maxAge = const Duration(days: 7)}) {
    try {
      final box = Hive.box(_scheduleBoxName);
      final timestamp = box.get('${group}_timestamp');
      if (timestamp == null) return false;
      final timestampInt = timestamp is int ? timestamp : int.tryParse(timestamp.toString());
      if (timestampInt == null) return false;
      final cacheTime = DateTime.fromMillisecondsSinceEpoch(timestampInt);
      return DateTime.now().difference(cacheTime) < maxAge;
    } catch (e) {
      return false;
    }
  }

  // Расписание на день (общее)
  Future<List<ScheduleDayModel>?> getTodaySchedule(String dateKey) async {
    try {
      final box = await Hive.openBox(_todayScheduleBoxName);
      final data = box.get(dateKey);
      if (data == null) return null;
      final list = data is List ? data : [];
      return list.map((e) {
        final map = e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{};
        return ScheduleDayModel.fromJson(map);
      }).toList();
    } catch (e) {
      return null;
    }
  }

  Future<void> saveTodaySchedule(String dateKey, List<ScheduleDayModel> schedule) async {
    final box = await Hive.openBox(_todayScheduleBoxName);
    final data = schedule.map((s) => s.toJson()).toList();
    await box.put(dateKey, data);
    await box.put('${dateKey}_timestamp', DateTime.now().millisecondsSinceEpoch);
  }

  bool isTodayScheduleCacheValid(String dateKey, {Duration maxAge = const Duration(days: 7)}) {
    try {
      final box = Hive.box(_todayScheduleBoxName);
      final timestamp = box.get('${dateKey}_timestamp');
      if (timestamp == null) return false;
      final timestampInt = timestamp is int ? timestamp : int.tryParse(timestamp.toString());
      if (timestampInt == null) return false;
      final cacheTime = DateTime.fromMillisecondsSinceEpoch(timestampInt);
      return DateTime.now().difference(cacheTime) < maxAge;
    } catch (e) {
      return false;
    }
  }

  // Кафедры
  Future<List<LecternModel>?> getLecterns() async {
    try {
      final box = await Hive.openBox(_lecternsBoxName);
      final data = box.get('list');
      if (data == null) return null;
      final list = data is List ? data : [];
      return list.map((e) {
        final map = e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{};
        return LecternModel.fromJson(map);
      }).toList();
    } catch (e) {
      return null;
    }
  }

  Future<void> saveLecterns(List<LecternModel> lecterns) async {
    final box = await Hive.openBox(_lecternsBoxName);
    final data = lecterns.map((l) => l.toJson()).toList();
    await box.put('list', data);
    await box.put('timestamp', DateTime.now().millisecondsSinceEpoch);
  }

  // Аудитории
  Future<List<ClassroomModel>?> getClassrooms() async {
    try {
      final box = await Hive.openBox(_classroomsBoxName);
      final data = box.get('list');
      if (data == null) return null;
      final list = data is List ? data : [];
      return list.map((e) {
        final map = e is Map ? Map<String, dynamic>.from(e) : <String, dynamic>{};
        return ClassroomModel.fromJson(map);
      }).toList();
    } catch (e) {
      return null;
    }
  }

  Future<void> saveClassrooms(List<ClassroomModel> classrooms) async {
    final box = await Hive.openBox(_classroomsBoxName);
    final data = classrooms.map((c) => c.toJson()).toList();
    await box.put('list', data);
    await box.put('timestamp', DateTime.now().millisecondsSinceEpoch);
  }

  // Очистка кеша
  Future<void> clearCache() async {
    await Hive.deleteBoxFromDisk(_groupsBoxName);
    await Hive.deleteBoxFromDisk(_subjectsBoxName);
    await Hive.deleteBoxFromDisk(_scheduleBoxName);
    await Hive.deleteBoxFromDisk(_todayScheduleBoxName);
    await Hive.deleteBoxFromDisk(_lecternsBoxName);
    await Hive.deleteBoxFromDisk(_classroomsBoxName);
  }
}


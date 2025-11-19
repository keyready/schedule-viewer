# Пример реализации функций

## 1. Поиск по группам и предметам

### Добавить в HomeController:

```dart
// В контроллер
final searchQuery = ''.obs;
final selectedCourse = Rx<String?>(null);

// Метод для фильтрации
List<ScheduleDayModel> getFilteredSchedule() {
  var filtered = List<ScheduleDayModel>.from(schedule);

  // Фильтр по поисковому запросу
  if (searchQuery.value.isNotEmpty) {
    final query = searchQuery.value.toLowerCase();
    filtered = filtered.where((day) {
      // Поиск по группе
      if (day.groupName?.toLowerCase().contains(query) ?? false) {
        return true;
      }
      
      // Поиск по предметам
      final groupSubjects = subjectsByGroup[day.groupName ?? ''];
      if (groupSubjects != null) {
        for (final job in day.jobs) {
          // Парсим job и ищем совпадения
          if (job.toLowerCase().contains(query)) {
            return true;
          }
        }
      }
      
      return false;
    }).toList();
  }

  // Фильтр по курсу
  if (selectedCourse.value != null) {
    filtered = filtered.where((day) {
      if (day.groupName == null) return false;
      final course = calculateCourse(day.groupName!).toString();
      return course == selectedCourse.value;
    }).toList();
  }

  // Остальные фильтры (кафедра, аудитория)...
  
  return filtered;
}

// Получить список доступных курсов
List<String> getAvailableCourses() {
  final courses = schedule
      .where((day) => day.groupName != null)
      .map((day) => calculateCourse(day.groupName!).toString())
      .toSet()
      .toList();
  courses.sort((a, b) => b.compareTo(a));
  return courses;
}
```

### Добавить в HomeView:

```dart
// В _buildMainContent, после DateNavigator:
Column(
  children: [
    DateNavigator(...),
    
    // Поиск
    Obx(() => SearchScheduleBar(
      hintText: 'Поиск по группе или предмету...',
      searchQuery: controller.searchQuery.value,
      onChanged: (query) => controller.searchQuery.value = query,
      onClear: () => controller.searchQuery.value = '',
    )),
    
    // Фильтр по курсу
    Obx(() => CourseFilter(
      availableCourses: controller.getAvailableCourses(),
      selectedCourse: controller.selectedCourse.value,
      onCourseSelected: (course) => controller.selectedCourse.value = course,
    )),
    
    // Индикатор обновления
    Obx(() => LastUpdateIndicator(
      lastUpdate: controller.lastUpdateTime.value,
      isOnline: controller.isOnline.value,
    )),
    
    Expanded(child: _buildScheduleContent()),
  ],
)
```

## 2. Pull-to-Refresh

### Добавить в CommonScheduleView и WeekScheduleView:

```dart
RefreshIndicator(
  onRefresh: () async {
    await controller.loadCommonSchedule();
  },
  color: AppTheme.navColor,
  child: ListView.builder(...), // или GridView
)
```

## 3. Индикатор последнего обновления

### Добавить в HomeController:

```dart
final lastUpdateTime = Rx<DateTime?>(null);
final isOnline = true.obs;

// В loadCommonSchedule:
Future<void> loadCommonSchedule() async {
  try {
    isOnline.value = true;
    // ... загрузка данных
    lastUpdateTime.value = DateTime.now();
  } catch (e) {
    isOnline.value = false;
    // ...
  }
}
```

## 4. Статистика

### Создать виджет ScheduleStatistics:

```dart
class ScheduleStatistics extends StatelessWidget {
  final List<ScheduleDayModel> schedule;
  
  Widget build(BuildContext context) {
    final totalLessons = schedule.fold<int>(
      0, (sum, day) => sum + day.jobs.length
    );
    
    final groupsCount = schedule
        .where((day) => day.groupName != null)
        .map((day) => day.groupName!)
        .toSet()
        .length;
    
    return Container(
      padding: EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _StatItem('Занятий', totalLessons.toString()),
          _StatItem('Групп', groupsCount.toString()),
          _StatItem('Дней', schedule.length.toString()),
        ],
      ),
    );
  }
}
```


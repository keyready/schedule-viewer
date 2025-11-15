import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/home_controller.dart';
import '../../../shared/widgets/date_navigator.dart';
import '../../../shared/widgets/week_schedule_view.dart';
import '../../../shared/widgets/common_schedule_view.dart';
import '../../../shared/widgets/schedule_filters.dart';
import '../../../shared/widgets/skeleton_filters.dart';
import '../../../shared/widgets/skeleton_schedule_list.dart';
import '../../../shared/theme/app_theme.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;
    
    return Scaffold(
      appBar: AppBar(
        title: isMobile ? const SizedBox.shrink() : const Text('Расписание занятий'),
        // На мобильных добавляем кнопку для открытия фильтров
        leading: isMobile
            ? Builder(
                builder: (context) => Obx(() => IconButton(
                      icon: Stack(
                        children: [
                          const Icon(Icons.filter_list),
                          // Индикатор активных фильтров
                          if (controller.selectedLectern.value != null ||
                              controller.selectedClassroom.value != null ||
                              controller.selectedCourse.value != null ||
                              controller.searchQuery.value.isNotEmpty)
                            Positioned(
                              right: 0,
                              top: 0,
                              child: Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: Theme.of(context).colorScheme.error,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                        ],
                      ),
                      onPressed: () => _showFiltersDrawer(context),
                      tooltip: 'Фильтры',
                    )),
              )
            : null,
        actions: [
          // Переключение темы
          Obx(() => IconButton(
                icon: Icon(
                  controller.isDarkMode.value
                      ? Icons.light_mode
                      : Icons.dark_mode,
                ),
                onPressed: controller.toggleTheme,
                tooltip: controller.isDarkMode.value
                    ? 'Светлая тема'
                    : 'Темная тема',
              )),
          // Переключение вида (список/неделя)
          Obx(() => IconButton(
                icon: Icon(
                  controller.viewMode.value == 'list'
                      ? Icons.grid_view
                      : Icons.list,
                ),
                onPressed: controller.toggleViewMode,
                tooltip: controller.viewMode.value == 'list'
                    ? 'Вид по неделям'
                    : 'Вид списком',
              )),
          // Переход к сегодня
          IconButton(
            icon: const Icon(Icons.today),
            onPressed: controller.goToToday,
            tooltip: 'Сегодня',
          ),
          // Меню
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) async {
              switch (value) {
                case 'refresh':
                  await controller.loadCommonSchedule();
                  break;
                case 'clear_cache':
                  await controller.clearCache();
                  break;
                case 'statistics':
                  _showStatistics(context);
                  break;
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'refresh',
                child: Row(
                  children: [
                    Icon(Icons.refresh, size: 20),
                    SizedBox(width: 8),
                    Text('Обновить'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'statistics',
                child: Row(
                  children: [
                    Icon(Icons.bar_chart, size: 20),
                    SizedBox(width: 8),
                    Text('Статистика'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'clear_cache',
                child: Row(
                  children: [
                    Icon(Icons.delete_outline, size: 20),
                    SizedBox(width: 8),
                    Text('Очистить кеш'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: AppTheme.backgroundGradient(context),
        ),
        child: Obx(() {
          if (controller.isLoading.value && controller.schedule.isEmpty) {
            return const SkeletonScheduleList(itemCount: 6);
          }

          if (controller.errorMessage.value.isNotEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red[300],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      controller.errorMessage.value,
                      style: TextStyle(
                        color: Colors.red[700],
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    FilledButton.icon(
                      onPressed: controller.loadCommonSchedule,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Повторить'),
                    ),
                  ],
                ),
              ),
            );
          }

          return _buildMainContent(context);
        }),
      ),
      // Drawer с фильтрами для мобильных
      endDrawer: isMobile ? _buildFiltersDrawer(context) : null,
    );
  }

  Widget _buildMainContent(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;
    
    if (isMobile) {
      // Мобильный layout: фильтры в Drawer, контент на весь экран
      return Column(
        children: [
          // Навигатор по датам
          DateNavigator(
            selectedDate: controller.selectedDate.value,
            onDateChanged: controller.changeDate,
          ),
          // Расписание
          Expanded(
            child: _buildScheduleContent(context),
          ),
        ],
      );
    } else {
      // Desktop layout: фильтры слева, контент справа
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Боковая панель с фильтрами
          Padding(
            padding: const EdgeInsets.only(left: 20, top: 20, right: 20),
            child: Obx(() {
              if (controller.isLoadingFilters.value && controller.lecterns.isEmpty) {
                return const SkeletonFilters();
              }
              return ScheduleFilters(
                lecterns: controller.lecterns,
                classrooms: controller.classrooms,
                selectedLectern: controller.selectedLectern.value,
                selectedClassroom: controller.selectedClassroom.value,
                selectedDate: controller.selectedDate.value,
                onLecternChanged: controller.changeLectern,
                onClassroomChanged: controller.changeClassroom,
                onDateChanged: controller.changeDate,
                isLoading: controller.isLoadingFilters.value,
                searchQuery: controller.searchQuery.value,
                onSearchChanged: controller.setSearchQuery,
                onSearchClear: controller.searchQuery.value.isNotEmpty
                    ? controller.clearSearch
                    : null,
                availableCourses: controller.getAvailableCourses(),
                selectedCourse: controller.selectedCourse.value,
                onCourseSelected: controller.setSelectedCourse,
                statistics: controller.statistics,
                lastUpdate: controller.lastUpdateTime.value,
                isOnline: controller.isOnline.value,
                schedule: controller.schedule,
              );
            }),
          ),
          // Основной контент
          Expanded(
            child: Column(
              children: [
                // Навигатор по датам
                DateNavigator(
                  selectedDate: controller.selectedDate.value,
                  onDateChanged: controller.changeDate,
                ),
                // Расписание
                Expanded(
                  child: _buildScheduleContent(context),
                ),
              ],
            ),
          ),
        ],
      );
    }
  }

  Widget _buildScheduleContent(BuildContext context) {
    return Obx(() {
      if (controller.isLoading.value) {
        return const SkeletonScheduleList(itemCount: 6);
      }

      return _buildCommonScheduleContent();
    });
  }

  Widget _buildCommonScheduleContent() {
    return Obx(() {
      // Показываем индикатор загрузки при вычислениях
      if (controller.isComputing.value && controller.filteredSchedule.isEmpty) {
        return const Center(
          child: CircularProgressIndicator(),
        );
      }
      
      // Используем observable напрямую для реактивности
      final filteredSchedule = controller.filteredSchedule;
      final subjectsByGroup = controller.subjectsByGroup;
      
      return AnimatedSwitcher(
        duration: const Duration(milliseconds: 400),
        transitionBuilder: (child, animation) {
          return FadeTransition(
            opacity: animation,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0.0, 0.1),
                end: Offset.zero,
              ).animate(CurvedAnimation(
                parent: animation,
                curve: Curves.easeOutCubic,
              )),
              child: child,
            ),
          );
        },
        child: controller.viewMode.value == 'week'
            ? WeekScheduleView(
                key: const ValueKey('week'),
                schedule: filteredSchedule,
                subjects: null,
                subjectsByGroup: subjectsByGroup,
                selectedDate: controller.selectedDate.value,
                onRefresh: controller.loadCommonSchedule,
                searchQuery: controller.searchQuery.value,
                selectedClassroom: controller.selectedClassroom.value?.title,
              )
            : CommonScheduleView(
                key: const ValueKey('list'),
                schedule: filteredSchedule,
                subjects: null,
                subjectsByGroup: subjectsByGroup,
                onRefresh: controller.loadCommonSchedule,
                searchQuery: controller.searchQuery.value,
                selectedClassroom: controller.selectedClassroom.value?.title,
              ),
      );
    });
  }
  
  /// Показать Drawer с фильтрами на мобильных
  void _showFiltersDrawer(BuildContext context) {
    // Используем Scaffold.of с правильным контекстом
    // Builder уже обеспечивает правильный контекст
    final scaffoldState = Scaffold.of(context);
    scaffoldState.openEndDrawer();
  }

  /// Построить Drawer с фильтрами для мобильных
  Widget _buildFiltersDrawer(BuildContext context) {
    return Drawer(
      width: MediaQuery.of(context).size.width * 0.85,
      child: SafeArea(
        child: Column(
          children: [
            // Заголовок Drawer
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Text(
                    'Фильтры',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                    tooltip: 'Закрыть',
                  ),
                ],
              ),
            ),
            const Divider(),
            // Контент фильтров
            Expanded(
              child: Obx(() {
                if (controller.isLoadingFilters.value && controller.lecterns.isEmpty) {
                  return const Center(child: CircularProgressIndicator());
                }
                
                return ScheduleFilters(
                  lecterns: controller.lecterns,
                  classrooms: controller.classrooms,
                  selectedLectern: controller.selectedLectern.value,
                  selectedClassroom: controller.selectedClassroom.value,
                  selectedDate: controller.selectedDate.value,
                  onLecternChanged: controller.changeLectern,
                  onClassroomChanged: controller.changeClassroom,
                  onDateChanged: controller.changeDate,
                  isLoading: controller.isLoadingFilters.value,
                  searchQuery: controller.searchQuery.value,
                  onSearchChanged: controller.setSearchQuery,
                  onSearchClear: controller.searchQuery.value.isNotEmpty
                      ? controller.clearSearch
                      : null,
                  availableCourses: controller.getAvailableCourses(),
                  selectedCourse: controller.selectedCourse.value,
                  onCourseSelected: controller.setSelectedCourse,
                  statistics: controller.statistics,
                  lastUpdate: controller.lastUpdateTime.value,
                  isOnline: controller.isOnline.value,
                  schedule: controller.schedule,
                );
              }),
            ),
          ],
        ),
      ),
    );
  }
  
  /// Показать статистику
  void _showStatistics(BuildContext context) {
    final stats = controller.statistics;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Статистика расписания'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _StatRow('Всего занятий', stats['totalLessons']?.toString() ?? '0'),
              _StatRow('Групп', stats['groupsCount']?.toString() ?? '0'),
              _StatRow('Дней', stats['daysCount']?.toString() ?? '0'),
              if (stats['topSubjects'] != null &&
                  (stats['topSubjects'] as List).isNotEmpty) ...[
                const SizedBox(height: 16),
                const Text(
                  'Популярные предметы:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                ...(stats['topSubjects'] as List).map((item) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text('${item['name']}: ${item['count']} занятий'),
                  );
                }),
              ],
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Закрыть'),
          ),
        ],
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  final String label;
  final String value;

  const _StatRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

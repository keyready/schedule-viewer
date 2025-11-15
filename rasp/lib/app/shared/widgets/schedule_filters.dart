import 'package:flutter/material.dart';
import '../../data/models/lectern_model.dart';
import '../../data/models/classroom_model.dart';
import '../../data/models/schedule_day_model.dart';
import 'search_schedule_bar.dart';
import 'course_filter.dart';
import 'schedule_statistics.dart';
import 'last_update_indicator.dart';
import 'schedule_calendar.dart';
import 'animations/fade_slide_transition.dart';

class ScheduleFilters extends StatefulWidget {
  final List<LecternModel> lecterns;
  final List<ClassroomModel> classrooms;
  final LecternModel? selectedLectern;
  final ClassroomModel? selectedClassroom;
  final DateTime selectedDate;
  final ValueChanged<LecternModel?> onLecternChanged;
  final ValueChanged<ClassroomModel?> onClassroomChanged;
  final ValueChanged<DateTime> onDateChanged;
  final bool isLoading;
  
  // Новые параметры для поиска, курсов и статистики
  final String searchQuery;
  final ValueChanged<String> onSearchChanged;
  final VoidCallback? onSearchClear;
  final List<String> availableCourses;
  final String? selectedCourse;
  final ValueChanged<String?> onCourseSelected;
  final Map<String, dynamic>? statistics;
  final DateTime? lastUpdate;
  final bool isOnline;
  
  // Календарь
  final List<ScheduleDayModel> schedule;

  const ScheduleFilters({
    super.key,
    required this.lecterns,
    required this.classrooms,
    this.selectedLectern,
    this.selectedClassroom,
    required this.selectedDate,
    required this.onLecternChanged,
    required this.onClassroomChanged,
    required this.onDateChanged,
    this.isLoading = false,
    required this.searchQuery,
    required this.onSearchChanged,
    this.onSearchClear,
    required this.availableCourses,
    this.selectedCourse,
    required this.onCourseSelected,
    this.statistics,
    this.lastUpdate,
    this.isOnline = true,
    required this.schedule,
  });

  @override
  State<ScheduleFilters> createState() => _ScheduleFiltersState();
}

class _ScheduleFiltersState extends State<ScheduleFilters> {
  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final isMobile = MediaQuery.of(context).size.width < 768;
    
    final content = SingleChildScrollView(
      padding: EdgeInsets.all(isMobile ? 16 : 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          FadeSlideTransition(
            delay: Duration.zero,
            duration: const Duration(milliseconds: 400),
            offset: const Offset(-20, 0),
            child: Text(
              'Фильтры',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: colorScheme.onSurface,
              ),
            ),
          ),
          const SizedBox(height: 20),
          // Поиск
          FadeSlideTransition(
            delay: const Duration(milliseconds: 50),
            duration: const Duration(milliseconds: 400),
            offset: const Offset(0, 10),
            child: _buildSearch(),
          ),
          const SizedBox(height: 16),
          // Фильтр по курсу
          if (widget.availableCourses.isNotEmpty) ...[
            FadeSlideTransition(
              delay: const Duration(milliseconds: 100),
              duration: const Duration(milliseconds: 400),
              offset: const Offset(0, 10),
              child: _buildCourseFilter(),
            ),
            const SizedBox(height: 16),
          ],
          // Фильтр по кафедре
          FadeSlideTransition(
            delay: const Duration(milliseconds: 150),
            duration: const Duration(milliseconds: 400),
            offset: const Offset(0, 10),
            child: _buildLecternFilter(),
          ),
          const SizedBox(height: 16),
          // Фильтр по аудитории
          FadeSlideTransition(
            delay: const Duration(milliseconds: 200),
            duration: const Duration(milliseconds: 400),
            offset: const Offset(0, 10),
            child: _buildClassroomFilter(),
          ),
          const SizedBox(height: 16),
          // Календарь
          FadeSlideTransition(
            delay: const Duration(milliseconds: 250),
            duration: const Duration(milliseconds: 400),
            offset: const Offset(0, 10),
            child: _buildCalendar(),
          ),
          // Статистика
          if (widget.statistics != null && 
              (widget.statistics!['totalLessons'] as int? ?? 0) > 0) ...[
            const SizedBox(height: 20),
            const Divider(),
            const SizedBox(height: 16),
            FadeSlideTransition(
              delay: const Duration(milliseconds: 300),
              duration: const Duration(milliseconds: 400),
              offset: const Offset(0, 10),
              child: _buildStatistics(),
            ),
          ],
          // Индикатор обновления
          if (widget.lastUpdate != null) ...[
            const SizedBox(height: 20),
            const Divider(),
            const SizedBox(height: 16),
            FadeSlideTransition(
              delay: const Duration(milliseconds: 350),
              duration: const Duration(milliseconds: 400),
              offset: const Offset(0, 10),
              child: _buildLastUpdate(),
            ),
          ],
        ],
      ),
    );
    
    // На мобильных не используем Card, на desktop - используем
    if (isMobile) {
      return content;
    } else {
      return Card(
        child: Container(
          width: 320,
          constraints: const BoxConstraints(maxHeight: double.infinity),
          child: content,
        ),
      );
    }
  }
  
  Widget _buildSearch() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Поиск',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        SearchScheduleBar(
          hintText: 'Поиск по группе или предмету...',
          searchQuery: widget.searchQuery,
          onChanged: widget.onSearchChanged,
          onClear: widget.onSearchClear,
        ),
      ],
    );
  }
  
  Widget _buildCourseFilter() {
    return CourseFilter(
      availableCourses: widget.availableCourses,
      selectedCourse: widget.selectedCourse,
      onCourseSelected: widget.onCourseSelected,
    );
  }
  
  Widget _buildStatistics() {
    return ScheduleStatistics(statistics: widget.statistics!);
  }
  
  Widget _buildLastUpdate() {
    return LastUpdateIndicator(
      lastUpdate: widget.lastUpdate,
      isOnline: widget.isOnline,
    );
  }

  Widget _buildLecternFilter() {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Кафедра',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<LecternModel?>(
          value: widget.selectedLectern,
          decoration: const InputDecoration(
            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          ),
          items: [
            const DropdownMenuItem<LecternModel?>(
              value: null,
              child: Text('Все кафедры'),
            ),
            ...widget.lecterns.map((lectern) => DropdownMenuItem<LecternModel?>(
                  value: lectern,
                  child: Text(
                    lectern.title.split(' | ').first,
                    overflow: TextOverflow.ellipsis,
                  ),
                )),
          ],
          onChanged: widget.isLoading ? null : widget.onLecternChanged,
        ),
      ],
    );
  }

  Widget _buildClassroomFilter() {
    // Фильтруем аудитории по выбранной кафедре
    final filteredClassrooms = widget.selectedLectern != null
        ? widget.classrooms.where((classroom) {
            final kafTitle = widget.selectedLectern!.title.split(' | ').first;
            return classroom.kafTitle?.contains(kafTitle) ?? false;
          }).toList()
        : widget.classrooms;

    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Аудитория',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<ClassroomModel?>(
          value: widget.selectedClassroom,
          decoration: const InputDecoration(
            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          ),
          items: [
            const DropdownMenuItem<ClassroomModel?>(
              value: null,
              child: Text('Все аудитории'),
            ),
            ...filteredClassrooms.map((classroom) => DropdownMenuItem<ClassroomModel?>(
                  value: classroom,
                  child: Text(
                    classroom.title,
                    overflow: TextOverflow.ellipsis,
                  ),
                )),
          ],
          onChanged: widget.isLoading || widget.selectedLectern == null
              ? null
              : widget.onClassroomChanged,
        ),
      ],
    );
  }

  Widget _buildCalendar() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Календарь',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: 12),
        ScheduleCalendar(
          selectedDate: widget.selectedDate,
          onDateSelected: widget.onDateChanged,
          schedule: widget.schedule,
        ),
      ],
    );
  }
}



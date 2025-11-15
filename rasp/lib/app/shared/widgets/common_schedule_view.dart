import 'package:flutter/material.dart';
import '../../data/models/schedule_day_model.dart';
import '../../data/models/subject_model.dart';
import 'schedule_card.dart';
import '../utils/schedule_utils.dart';
import '../utils/grid_utils.dart';
import 'animations/fade_slide_transition.dart';

class CommonScheduleView extends StatelessWidget {
  final List<ScheduleDayModel> schedule;
  final List<SubjectModel>? subjects;
  final Map<String, List<SubjectModel>>? subjectsByGroup;
  final Future<void> Function()? onRefresh;
  final String searchQuery;
  final String? selectedClassroom;

  const CommonScheduleView({
    super.key,
    required this.schedule,
    this.subjects,
    this.subjectsByGroup,
    this.onRefresh,
    this.searchQuery = '',
    this.selectedClassroom,
  });

  @override
  Widget build(BuildContext context) {
    final groupedByCourse = groupScheduleByCourse(schedule);
    final courses = groupedByCourse.keys.toList()..sort((a, b) => b.compareTo(a));

    if (schedule.isEmpty) {
      final colorScheme = Theme.of(context).colorScheme;
      
      return Center(
        child: Card(
          margin: const EdgeInsets.all(24),
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.event_busy,
                  size: 64,
                  color: colorScheme.onSurface.withOpacity(0.5),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Расписание не найдено',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: onRefresh ?? () async {},
      child: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: courses.length,
      itemBuilder: (context, courseIndex) {
        final course = courses[courseIndex];
        final courseDays = groupedByCourse[course]!;

        return FadeSlideTransition(
          delay: Duration(milliseconds: courseIndex * 80),
          duration: const Duration(milliseconds: 500),
          offset: const Offset(0, 30),
          curve: Curves.easeOutCubic,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Заголовок курса
              FadeSlideTransition(
                delay: Duration(milliseconds: courseIndex * 80),
                duration: const Duration(milliseconds: 400),
                offset: const Offset(-20, 0),
                child: _CourseTitle(course: course),
              ),
              const SizedBox(height: 16),
              // Сетка расписания по курсу
              LayoutBuilder(
                builder: (context, constraints) {
                  // Используем реальную доступную ширину из constraints
                  const spacing = 12.0;
                  const minCardWidth = 280.0;
                  
                  // Вычисляем оптимальное количество колонок
                  final crossAxisCount = GridUtils.getCrossAxisCount(
                    constraints.maxWidth,
                    minCardWidth: minCardWidth,
                    spacing: spacing,
                  );
                  
                  // Вычисляем реальную ширину карточки
                  final cardWidth = (constraints.maxWidth - (crossAxisCount - 1) * spacing) / crossAxisCount;
                  
                  // Рассчитываем aspect ratio на основе реальной ширины карточки
                  final aspectRatio = GridUtils.getAspectRatio(cardWidth, lessonsCount: 4);
                  
                  return GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossAxisCount,
                      crossAxisSpacing: spacing,
                      mainAxisSpacing: spacing,
                      childAspectRatio: aspectRatio,
                    ),
                    itemCount: courseDays.length,
                itemBuilder: (context, dayIndex) {
                  final day = courseDays[dayIndex];
                  return ScaleFadeTransition(
                    delay: Duration(milliseconds: (courseIndex * 100) + (dayIndex * 40)),
                    duration: const Duration(milliseconds: 400),
                    beginScale: 0.85,
                    curve: Curves.easeOutCubic,
                    child: ScheduleCard(
                      day: day,
                      subjects: subjectsByGroup?[day.groupName ?? ''] ?? subjects,
                      searchQuery: searchQuery,
                      selectedClassroom: selectedClassroom,
                    ),
                  );
                },
                  );
                },
              ),
              const SizedBox(height: 32),
            ],
          ),
        );
      },
      ),
    );
  }
}

class _CourseTitle extends StatelessWidget {
  final String course;

  const _CourseTitle({required this.course});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Row(
      children: [
        _getCourseIcon(course, colorScheme),
        const SizedBox(width: 12),
        Text(
          '$course курс',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: colorScheme.onSurface,
          ),
        ),
      ],
    );
  }

  Widget _getCourseIcon(String course, ColorScheme colorScheme) {
    IconData icon;
    Color color;

    switch (course) {
      case '65':
        icon = Icons.sentiment_very_satisfied;
        color = colorScheme.primary;
        break;
      case '64':
        icon = Icons.sentiment_satisfied;
        color = colorScheme.secondary;
        break;
      case '63':
        icon = Icons.sentiment_neutral;
        color = colorScheme.tertiary;
        break;
      default:
        icon = Icons.sentiment_dissatisfied;
        color = colorScheme.error;
    }

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: colorScheme.primaryContainer.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color: color, size: 28),
    );
  }
}


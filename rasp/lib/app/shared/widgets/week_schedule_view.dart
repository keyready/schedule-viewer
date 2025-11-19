import 'package:flutter/material.dart';
import '../../data/models/schedule_day_model.dart';
import '../../data/models/subject_model.dart';
import 'schedule_card.dart';
import '../utils/schedule_utils.dart';
import '../utils/grid_utils.dart';
import 'animations/fade_slide_transition.dart';

class WeekScheduleView extends StatelessWidget {
  final List<ScheduleDayModel> schedule;
  final List<SubjectModel>? subjects;
  final Map<String, List<SubjectModel>>? subjectsByGroup;
  final DateTime? selectedDate;
  final Future<void> Function()? onRefresh;
  final String searchQuery;
  final String? selectedClassroom;

  const WeekScheduleView({
    super.key,
    required this.schedule,
    this.subjects,
    this.subjectsByGroup,
    this.selectedDate,
    this.onRefresh,
    this.searchQuery = '',
    this.selectedClassroom,
  });

  @override
  Widget build(BuildContext context) {
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

    // Группируем по неделям
    final weeks = groupByWeeks(schedule);
    final today = DateTime.now();
    final colorScheme = Theme.of(context).colorScheme;

    if (weeks.isEmpty) {
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
        itemCount: weeks.length,
      itemBuilder: (context, weekIndex) {
        final week = weeks[weekIndex];
        
        // Получаем начало и конец недели
        final weekStart = week.isNotEmpty ? _getWeekStart(week.first.date) : null;
        final weekEnd = weekStart != null 
            ? weekStart.add(const Duration(days: 6))
            : null;
        
        return FadeSlideTransition(
          delay: Duration(milliseconds: weekIndex * 100),
          duration: const Duration(milliseconds: 500),
          offset: const Offset(0, 30),
          curve: Curves.easeOutCubic,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Заголовок недели с датами
              FadeSlideTransition(
                delay: Duration(milliseconds: weekIndex * 100),
                duration: const Duration(milliseconds: 400),
                offset: const Offset(-20, 0),
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Row(
                    children: [
                      Text(
                        'Неделя ${weekIndex + 1}',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: colorScheme.onSurface,
                        ),
                      ),
                      if (weekStart != null && weekEnd != null) ...[
                        const SizedBox(width: 12),
                        Text(
                          '(${_formatDate(weekStart)} - ${_formatDate(weekEnd)})',
                          style: TextStyle(
                            fontSize: 14,
                            color: colorScheme.onSurface.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              // Сетка карточек расписания для этой недели
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
                    itemCount: week.length,
                    itemBuilder: (context, dayIndex) {
                      final day = week[dayIndex];
                      final isToday = day.date.year == today.year &&
                          day.date.month == today.month &&
                          day.date.day == today.day;

                      return ScaleFadeTransition(
                        delay: Duration(milliseconds: (weekIndex * 100) + (dayIndex * 40)),
                        duration: const Duration(milliseconds: 400),
                        beginScale: 0.85,
                        curve: Curves.easeOutCubic,
                        child: ScheduleCard(
                          day: day,
                          subjects: subjectsByGroup?[day.groupName ?? ''] ?? subjects,
                          isToday: isToday,
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
  
  /// Получает начало недели (понедельник)
  DateTime _getWeekStart(DateTime date) {
    final weekday = date.weekday;
    final daysFromMonday = weekday == 7 ? 0 : weekday - 1;
    return DateTime(date.year, date.month, date.day - daysFromMonday);
  }

  String _formatDate(DateTime date) {
    return '${date.day}.${date.month}.${date.year}';
  }
}


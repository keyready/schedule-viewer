import 'package:flutter/material.dart';
import 'dart:ui';
import '../../data/models/schedule_day_model.dart';
import '../../data/models/subject_model.dart';
import 'highlighted_text.dart';

class ScheduleCard extends StatelessWidget {
  final ScheduleDayModel day;
  final List<SubjectModel>? subjects;
  final bool isToday;
  final VoidCallback? onTap;
  final String searchQuery;
  final String? selectedClassroom;

  const ScheduleCard({
    super.key,
    required this.day,
    this.subjects,
    this.isToday = false,
    this.onTap,
    this.searchQuery = '',
    this.selectedClassroom,
  });

  @override
  Widget build(BuildContext context) {
    final dateStr = _formatDate(day.date);
    final weekdayStr = _formatWeekday(day.date);
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: isToday
            ? Border.all(
                color: colorScheme.primary,
                width: 2,
              )
            : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Заголовок с датой
          Padding(
            padding: const EdgeInsets.only(top: 12, left: 12, right: 12, bottom: 8),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '$dateStr, $weekdayStr',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: colorScheme.onSurface,
                  ),
                  textAlign: TextAlign.center,
                ),
                if (day.groupName != null) ...[
                  const SizedBox(height: 4),
                  HighlightedText(
                    text: '${day.groupName} уч. гр.',
                    highlight: searchQuery,
                    style: TextStyle(
                      fontSize: 14,
                      color: colorScheme.onSurface.withOpacity(0.6),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (day.jobs.isEmpty) ...[
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Text(
                'Нет занятий на этот день',
                style: TextStyle(
                  fontSize: 14,
                  fontStyle: FontStyle.italic,
                  color: colorScheme.onSurface.withOpacity(0.5),
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ] else ...[
            // Заголовки колонок
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Дисциплина',
                    style: TextStyle(
                      fontSize: 11,
                      fontStyle: FontStyle.italic,
                      color: colorScheme.onSurface.withOpacity(0.5),
                    ),
                  ),
                  Text(
                    'Аудитория',
                    style: TextStyle(
                      fontSize: 11,
                      fontStyle: FontStyle.italic,
                      color: colorScheme.onSurface.withOpacity(0.5),
                    ),
                  ),
                ],
              ),
            ),
            // Список занятий без прокрутки (компактный)
            ...day.jobs.asMap().entries.map((entry) {
              final index = entry.key;
              final job = entry.value;
              final lessonData = _parseJob(job);
              final subject = _findSubject(lessonData['title'], subjects);

              return _LessonItem(
                lessonData: lessonData,
                subject: subject,
                index: index,
                isLast: index == day.jobs.length - 1,
                searchQuery: searchQuery,
                selectedClassroom: selectedClassroom,
              );
            }),
            // Небольшой отступ снизу
            const SizedBox(height: 4),
          ],
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}.${date.month}.${date.year}';
  }

  String _formatWeekday(DateTime date) {
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return weekdays[date.weekday - 1];
  }

  Map<String, String> _parseJob(String job) {
    // Парсим строку вида "Тип занятия: ЛЕК, дисциплина: МАТАН, аудитория: 123"
    final parts = job.split(', ');
    String type = '';
    String title = '';
    String classroom = '';

    for (final part in parts) {
      if (part.startsWith('Тип занятия:')) {
        type = part.replaceFirst('Тип занятия:', '').trim();
      } else if (part.startsWith('дисциплина:')) {
        title = part.replaceFirst('дисциплина:', '').trim();
      } else if (part.startsWith('аудитория:')) {
        classroom = part.replaceFirst('аудитория:', '').trim();
      }
    }

    return {
      'type': type,
      'title': title,
      'classroom': classroom,
    };
  }

  SubjectModel? _findSubject(String? title, List<SubjectModel>? subjects) {
    if (subjects == null || title == null || title.isEmpty) return null;
    try {
      return subjects.firstWhere(
        (s) => s.abbr.toUpperCase() == title.toUpperCase(),
      );
    } catch (e) {
      return null;
    }
  }
}

class _LessonItem extends StatelessWidget {
  final Map<String, String> lessonData;
  final SubjectModel? subject;
  final int index;
  final bool isLast;
  final String searchQuery;
  final String? selectedClassroom;

  const _LessonItem({
    required this.lessonData,
    this.subject,
    required this.index,
    required this.isLast,
    this.searchQuery = '',
    this.selectedClassroom,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = _isDisabled(lessonData['type'] ?? '', lessonData['title'] ?? '');
    final colorScheme = Theme.of(context).colorScheme;
    final classroom = lessonData['classroom'] ?? '';
    // Сравниваем аудитории (может быть просто номер или полное название)
    final isHighlighted = selectedClassroom != null && 
        classroom.isNotEmpty && 
        (classroom.toLowerCase().contains(selectedClassroom!.toLowerCase()) ||
         selectedClassroom!.toLowerCase().contains(classroom.toLowerCase()));

    return MouseRegion(
      cursor: isDisabled ? MouseCursor.defer : SystemMouseCursors.click,
      child: Container(
        decoration: BoxDecoration(
          color: isHighlighted
              ? colorScheme.primaryContainer.withOpacity(0.3)
              : Colors.transparent,
          border: isLast ? null : Border(
            bottom: BorderSide(
              color: isHighlighted
                  ? colorScheme.primary.withOpacity(0.3)
                  : colorScheme.outline.withOpacity(0.2),
              width: isHighlighted ? 2 : 1,
            ),
          ),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isDisabled ? null : () => _showLessonDetails(context),
            borderRadius: BorderRadius.circular(8),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: HighlightedText(
                      text: (lessonData['title'] ?? lessonData['type'] ?? '').toUpperCase(),
                      highlight: searchQuery,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: isDisabled 
                            ? colorScheme.onSurface.withOpacity(0.38)
                            : colorScheme.onSurface,
                        letterSpacing: 0.2,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        lessonData['classroom'] ?? '—',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: isDisabled 
                              ? colorScheme.onSurface.withOpacity(0.38)
                              : colorScheme.onSurface,
                        ),
                      ),
                      if (!isDisabled) ...[
                        const SizedBox(width: 6),
                        Icon(
                          Icons.keyboard_arrow_down,
                          size: 18,
                          color: colorScheme.primary,
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  bool _isDisabled(String type, String title) {
    final disabledTypes = ['хоз. день', 'выходной день', 'хозяйственный день'];
    final lowerType = type.toLowerCase();
    final lowerTitle = title.toLowerCase();
    return disabledTypes.any((disabled) =>
        lowerType.contains(disabled) || lowerTitle.contains(disabled));
  }

  void _showLessonDetails(BuildContext context) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Закрыть',
      barrierColor: Colors.black.withOpacity(0.5),
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (context, animation, secondaryAnimation) {
        return _LessonDetailsDialog(
          lessonData: lessonData,
          subject: subject,
        );
      },
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: animation,
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.8, end: 1.0).animate(
              CurvedAnimation(
                parent: animation,
                curve: Curves.easeOutCubic,
              ),
            ),
            child: child,
          ),
        );
      },
    );
  }
}

class _LessonDetailsDialog extends StatelessWidget {
  final Map<String, String> lessonData;
  final SubjectModel? subject;

  const _LessonDetailsDialog({
    required this.lessonData,
    this.subject,
  });

  @override
  Widget build(BuildContext context) {
    final lessonType = _getLessonType(lessonData['type'] ?? '');
    final group = _getGroup(lessonData['type'] ?? '');
    final colorScheme = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 480),
        margin: const EdgeInsets.symmetric(horizontal: 20),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isDark
                      ? [
                          colorScheme.surfaceContainerHighest.withOpacity(0.3),
                          colorScheme.surfaceContainerHighest.withOpacity(0.2),
                        ]
                      : [
                          Colors.white.withOpacity(0.9),
                          Colors.white.withOpacity(0.7),
                        ],
                ),
                border: Border.all(
                  color: isDark
                      ? Colors.white.withOpacity(0.1)
                      : Colors.white.withOpacity(0.3),
                  width: 1.5,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 30,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Заголовок с градиентом
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          colorScheme.primary.withOpacity(0.2),
                          colorScheme.primary.withOpacity(0.1),
                        ],
                      ),
                      border: Border(
                        bottom: BorderSide(
                          color: isDark
                              ? Colors.white.withOpacity(0.1)
                              : Colors.black.withOpacity(0.05),
                          width: 1,
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: colorScheme.primary.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.school,
                            color: colorScheme.primary,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Детали занятия',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: colorScheme.onSurface.withOpacity(0.6),
                                  letterSpacing: 0.5,
                                  decoration: TextDecoration.none,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                (subject?.title ?? 'Неизвестный предмет').toUpperCase(),
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: colorScheme.onSurface,
                                  letterSpacing: 0.5,
                                  decoration: TextDecoration.none,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: Icon(
                            Icons.close_rounded,
                            color: colorScheme.onSurface.withOpacity(0.6),
                          ),
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            padding: const EdgeInsets.all(8),
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Контент
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        _DetailRow(
                          icon: Icons.class_,
                          label: 'Тип занятия',
                          value: lessonType,
                          colorScheme: colorScheme,
                        ),
                        const SizedBox(height: 16),
                        _DetailRow(
                          icon: Icons.groups,
                          label: 'Группа',
                          value: group,
                          colorScheme: colorScheme,
                        ),
                        const SizedBox(height: 16),
                        _DetailRow(
                          icon: Icons.person,
                          label: 'Преподаватель',
                          value: subject?.trainer.split('; ').first ?? '—',
                          colorScheme: colorScheme,
                        ),
                        const SizedBox(height: 16),
                        _DetailRow(
                          icon: Icons.business,
                          label: 'Кафедра',
                          value: subject?.lectern.toString() ?? '—',
                          colorScheme: colorScheme,
                        ),
                        const SizedBox(height: 16),
                        _DetailRow(
                          icon: Icons.meeting_room,
                          label: 'Аудитория',
                          value: lessonData['classroom'] ?? '—',
                          colorScheme: colorScheme,
                        ),
                        const SizedBox(height: 24),
                        // Кнопка закрытия
                        Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                colorScheme.primary,
                                colorScheme.primary.withOpacity(0.8),
                              ],
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: colorScheme.primary.withOpacity(0.3),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () => Navigator.of(context).pop(),
                              borderRadius: BorderRadius.circular(16),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.check_circle_outline,
                                      color: colorScheme.onPrimary,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Закрыть',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: colorScheme.onPrimary,
                                        letterSpacing: 0.5,
                                        decoration: TextDecoration.none,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  String _getLessonType(String type) {
    if (type.contains('П') || type.contains('ПР')) {
      return 'Практика';
    } else if (type.contains('Л') || type.contains('ЛЕК')) {
      return 'Лекция';
    }
    return type;
  }

  String _getGroup(String type) {
    final parts = type.split('/');
    if (parts.length > 1) {
      return parts[1].replaceAll('.', '').replaceAll('Т', 'тема ').trim();
    }
    return '—';
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final ColorScheme colorScheme;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.colorScheme,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark
            ? Colors.white.withOpacity(0.05)
            : Colors.black.withOpacity(0.02),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? Colors.white.withOpacity(0.05)
              : Colors.black.withOpacity(0.05),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              size: 20,
              color: colorScheme.primary,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface.withOpacity(0.6),
                    letterSpacing: 0.3,
                    decoration: TextDecoration.none,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                    decoration: TextDecoration.none,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


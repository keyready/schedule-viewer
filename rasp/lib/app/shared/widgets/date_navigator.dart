import 'package:flutter/material.dart';

class DateNavigator extends StatelessWidget {
  final DateTime selectedDate;
  final ValueChanged<DateTime> onDateChanged;

  const DateNavigator({
    super.key,
    required this.selectedDate,
    required this.onDateChanged,
  });

  @override
  Widget build(BuildContext context) {
    final today = DateTime.now();
    final difference = _getDaysDifference(today, selectedDate);
    final dayLabel = _getDayLabel(difference);
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Кнопка назад (двойная стрелка)
          _DateButton(
            icon: Icons.keyboard_double_arrow_left,
            onPressed: () => onDateChanged(
              selectedDate.subtract(const Duration(days: 1)),
            ),
          ),
          const SizedBox(width: 16),
          // Дата и день недели
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            transitionBuilder: (child, animation) {
              return FadeTransition(
                opacity: animation,
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0.0, 0.2),
                    end: Offset.zero,
                  ).animate(CurvedAnimation(
                    parent: animation,
                    curve: Curves.easeOutCubic,
                  )),
                  child: child,
                ),
              );
            },
            child: Column(
              key: ValueKey(selectedDate),
              children: [
                Text(
                  dayLabel != null ? '$dayLabel, ${_formatDate(selectedDate)}' : _formatDate(selectedDate),
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: colorScheme.onSurface,
                  ),
                ),
                Text(
                  _formatWeekday(selectedDate),
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                    color: colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          // Кнопка вперед (двойная стрелка)
          _DateButton(
            icon: Icons.keyboard_double_arrow_right,
            onPressed: () => onDateChanged(
              selectedDate.add(const Duration(days: 1)),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}.${date.month}.${date.year}';
  }

  String _formatWeekday(DateTime date) {
    const weekdays = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ];
    return weekdays[date.weekday - 1];
  }

  int _getDaysDifference(DateTime date1, DateTime date2) {
    final d1 = DateTime(date1.year, date1.month, date1.day);
    final d2 = DateTime(date2.year, date2.month, date2.day);
    return d2.difference(d1).inDays;
  }

  String? _getDayLabel(int difference) {
    switch (difference) {
      case 0:
        return 'Сегодня';
      case -1:
        return 'Вчера';
      case 1:
        return 'Завтра';
      case -2:
        return 'Позавчера';
      case 2:
        return 'Послезавтра';
      default:
        return null;
    }
  }
}

class _DateButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;

  const _DateButton({
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return IconButton(
      onPressed: onPressed,
      icon: Icon(icon),
      style: IconButton.styleFrom(
        backgroundColor: colorScheme.surfaceContainerHighest,
      ),
    );
  }
}


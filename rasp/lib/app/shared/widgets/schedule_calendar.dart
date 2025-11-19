import 'package:flutter/material.dart';
import 'dart:ui';
import '../../data/models/schedule_day_model.dart';

class ScheduleCalendar extends StatelessWidget {
  final DateTime selectedDate;
  final ValueChanged<DateTime> onDateSelected;
  final List<ScheduleDayModel> schedule;
  final DateTime? today;

  const ScheduleCalendar({
    super.key,
    required this.selectedDate,
    required this.onDateSelected,
    required this.schedule,
    this.today,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final now = today ?? DateTime.now();
    
    // Получаем дни с занятиями
    final daysWithLessons = schedule
        .where((day) => day.jobs.isNotEmpty)
        .map((day) => DateTime(day.date.year, day.date.month, day.date.day))
        .toSet();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark
            ? Colors.white.withOpacity(0.05)
            : Colors.black.withOpacity(0.02),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark
              ? Colors.white.withOpacity(0.1)
              : Colors.black.withOpacity(0.05),
          width: 1,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Заголовок с месяцем и годом
          _buildHeader(context, selectedDate, colorScheme, onDateSelected),
          const SizedBox(height: 16),
          // Дни недели
          _buildWeekdays(colorScheme),
          const SizedBox(height: 8),
          // Календарная сетка
          _buildCalendarGrid(
            context,
            selectedDate,
            now,
            daysWithLessons,
            colorScheme,
            isDark,
            onDateSelected,
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(
    BuildContext context,
    DateTime date,
    ColorScheme colorScheme,
    ValueChanged<DateTime> onDateSelected,
  ) {
    final monthNames = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          onPressed: () {
            final prevMonth = DateTime(date.year, date.month - 1, 1);
            onDateSelected(prevMonth);
          },
          icon: Icon(
            Icons.chevron_left_rounded,
            color: colorScheme.primary,
          ),
          style: IconButton.styleFrom(
            backgroundColor: colorScheme.primaryContainer.withOpacity(0.3),
            padding: const EdgeInsets.all(8),
          ),
        ),
        Column(
          children: [
            Text(
              monthNames[date.month - 1],
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: colorScheme.onSurface,
              ),
            ),
            Text(
              date.year.toString(),
              style: TextStyle(
                fontSize: 14,
                color: colorScheme.onSurface.withOpacity(0.6),
              ),
            ),
          ],
        ),
        IconButton(
          onPressed: () {
            final nextMonth = DateTime(date.year, date.month + 1, 1);
            onDateSelected(nextMonth);
          },
          icon: Icon(
            Icons.chevron_right_rounded,
            color: colorScheme.primary,
          ),
          style: IconButton.styleFrom(
            backgroundColor: colorScheme.primaryContainer.withOpacity(0.3),
            padding: const EdgeInsets.all(8),
          ),
        ),
      ],
    );
  }

  Widget _buildWeekdays(ColorScheme colorScheme) {
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    return Row(
      children: weekdays.map((day) {
        return Expanded(
          child: Center(
            child: Text(
              day,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface.withOpacity(0.5),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCalendarGrid(
    BuildContext context,
    DateTime selectedDate,
    DateTime today,
    Set<DateTime> daysWithLessons,
    ColorScheme colorScheme,
    bool isDark,
    ValueChanged<DateTime> onDateSelected,
  ) {
    final firstDayOfMonth = DateTime(selectedDate.year, selectedDate.month, 1);
    final lastDayOfMonth = DateTime(selectedDate.year, selectedDate.month + 1, 0);
    
    // Находим первый понедельник месяца (неделя начинается с понедельника)
    // weekday: 1 = Monday, 7 = Sunday
    // Если первый день месяца - понедельник (weekday = 1), то вычитаем 0 дней
    // Если вторник (weekday = 2), вычитаем 1 день и т.д.
    final daysToSubtract = (firstDayOfMonth.weekday - 1) % 7;
    final firstMonday = firstDayOfMonth.subtract(Duration(days: daysToSubtract));
    
    // Находим последнее воскресенье месяца
    // Если последний день месяца - воскресенье (weekday = 7), добавляем 0 дней
    // Если суббота (weekday = 6), добавляем 1 день и т.д.
    final daysToAdd = (7 - lastDayOfMonth.weekday) % 7;
    final lastSunday = lastDayOfMonth.add(Duration(days: daysToAdd));
    
    final daysInView = lastSunday.difference(firstMonday).inDays + 1;
    final weeks = (daysInView / 7).ceil();

    return Column(
      children: List.generate(weeks, (weekIndex) {
        return Row(
          children: List.generate(7, (dayIndex) {
            final day = firstMonday.add(Duration(days: weekIndex * 7 + dayIndex));
            final isCurrentMonth = day.month == selectedDate.month;
            final isSelected = day.year == selectedDate.year &&
                day.month == selectedDate.month &&
                day.day == selectedDate.day;
            final isToday = day.year == today.year &&
                day.month == today.month &&
                day.day == today.day;
            final hasLessons = daysWithLessons.contains(day);

            return Expanded(
              child: _buildDayCell(
                day: day,
                isCurrentMonth: isCurrentMonth,
                isSelected: isSelected,
                isToday: isToday,
                hasLessons: hasLessons,
                colorScheme: colorScheme,
                isDark: isDark,
                onTap: () {
                  if (isCurrentMonth) {
                    onDateSelected(day);
                  }
                },
              ),
            );
          }),
        );
      }),
    );
  }

  Widget _buildDayCell({
    required DateTime day,
    required bool isCurrentMonth,
    required bool isSelected,
    required bool isToday,
    required bool hasLessons,
    required ColorScheme colorScheme,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: isCurrentMonth ? onTap : null,
      child: Container(
        margin: const EdgeInsets.all(2),
        height: 40,
        decoration: BoxDecoration(
          color: isSelected
              ? colorScheme.primaryContainer
              : isToday
                  ? colorScheme.primaryContainer.withOpacity(0.3)
                  : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: isToday && !isSelected
              ? Border.all(
                  color: colorScheme.primary,
                  width: 2,
                )
              : null,
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Число дня
            Text(
              day.day.toString(),
              style: TextStyle(
                fontSize: 14,
                fontWeight: isSelected || isToday
                    ? FontWeight.bold
                    : FontWeight.w500,
                color: isCurrentMonth
                    ? (isSelected
                        ? colorScheme.onPrimaryContainer
                        : isToday
                            ? colorScheme.primary
                            : colorScheme.onSurface)
                    : colorScheme.onSurface.withOpacity(0.3),
              ),
            ),
            // Индикатор занятий
            if (hasLessons && isCurrentMonth)
              Positioned(
                bottom: 4,
                child: Container(
                  width: 4,
                  height: 4,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? colorScheme.onPrimaryContainer
                        : colorScheme.primary,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}


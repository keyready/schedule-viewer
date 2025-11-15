import 'package:flutter/material.dart';
import 'skeleton_loader.dart';

/// Скелетон для карточки расписания
/// Точная копия структуры ScheduleCard для единообразного отображения
class SkeletonScheduleCard extends StatelessWidget {
  const SkeletonScheduleCard({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: SkeletonLoader(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Заголовок с датой (точно как в ScheduleCard)
            Padding(
              padding: const EdgeInsets.only(top: 12, left: 12, right: 12, bottom: 8),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Дата
                  SkeletonText(width: 140, height: 20), // fontSize: 18, bold
                  const SizedBox(height: 4),
                  // Группа
                  SkeletonText(width: 100, height: 16), // fontSize: 14
                ],
              ),
            ),
            // Заголовки колонок (точно как в ScheduleCard)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  SkeletonText(width: 80, height: 13), // "Дисциплина" fontSize: 11
                  SkeletonText(width: 70, height: 13), // "Аудитория" fontSize: 11
                ],
              ),
            ),
            // Список занятий (4 занятия, как обычно)
            // Структура точно как в _LessonItem
            ...List.generate(4, (index) {
              final isLast = index == 3;
              return Container(
                decoration: BoxDecoration(
                  border: isLast ? null : Border(
                    bottom: BorderSide(
                      color: colorScheme.outline.withOpacity(0.2),
                      width: 1,
                    ),
                  ),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Дисциплина
                        Expanded(
                          child: SkeletonText(width: double.infinity, height: 15), // fontSize: 13
                        ),
                        const SizedBox(width: 8),
                        // Аудитория
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            SkeletonText(width: 50, height: 15), // fontSize: 13
                            const SizedBox(width: 6),
                            // Иконка chevron_down
                            SkeletonBox(width: 16, height: 16, borderRadius: 4),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
            // Небольшой отступ снизу (как в ScheduleCard)
            const SizedBox(height: 4),
          ],
        ),
      ),
    );
  }
}


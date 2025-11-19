import 'package:flutter/material.dart';
import 'skeleton_schedule_card.dart';
import '../utils/grid_utils.dart';

/// Скелетон для списка карточек расписания
class SkeletonScheduleList extends StatelessWidget {
  final int itemCount;

  const SkeletonScheduleList({
    super.key,
    this.itemCount = 3,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Используем те же параметры, что и в реальном grid
        const spacing = 12.0;
        const minCardWidth = 280.0;
        
        // Вычисляем оптимальное количество колонок (как в CommonScheduleView)
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
          padding: const EdgeInsets.all(20),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            childAspectRatio: aspectRatio,
            crossAxisSpacing: spacing,
            mainAxisSpacing: spacing,
          ),
          itemCount: itemCount,
          itemBuilder: (context, index) {
            return const SkeletonScheduleCard();
          },
        );
      },
    );
  }
}


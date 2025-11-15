import 'package:flutter/material.dart';

class CourseFilter extends StatelessWidget {
  final List<String> availableCourses;
  final String? selectedCourse;
  final ValueChanged<String?> onCourseSelected;

  const CourseFilter({
    super.key,
    required this.availableCourses,
    this.selectedCourse,
    required this.onCourseSelected,
  });

  @override
  Widget build(BuildContext context) {
    if (availableCourses.isEmpty) {
      return const SizedBox.shrink();
    }

    final colorScheme = Theme.of(context).colorScheme;

    return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Курс:',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              // Кнопка "Все"
              FilterChip(
                label: const Text('Все'),
                selected: selectedCourse == null,
                onSelected: (selected) {
                  if (selected) {
                    onCourseSelected(null);
                  }
                },
              ),
              // Кнопки курсов
              ...availableCourses.map((course) {
                return FilterChip(
                  label: Text('$course курс'),
                  selected: selectedCourse == course,
                  onSelected: (selected) {
                    onCourseSelected(selected ? course : null);
                  },
                );
              }),
            ],
          ),
        ],
      );
  }
}


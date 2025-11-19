import 'package:flutter/material.dart';
import 'skeleton_loader.dart';

/// Скелетон для панели фильтров
class SkeletonFilters extends StatelessWidget {
  const SkeletonFilters({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        width: 320,
        padding: const EdgeInsets.all(20),
        child: SkeletonLoader(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Заголовок
              SkeletonText(width: 100, height: 24),
              const SizedBox(height: 20),
              // Поиск
              _buildSection(
                label: SkeletonText(width: 60, height: 14),
                child: SkeletonBox(height: 48, borderRadius: 12),
              ),
              const SizedBox(height: 16),
              // Фильтр по курсу
              _buildSection(
                label: SkeletonText(width: 50, height: 14),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: List.generate(3, (index) {
                    return SkeletonBox(
                      width: 80,
                      height: 32,
                      borderRadius: 16,
                    );
                  }),
                ),
              ),
              const SizedBox(height: 16),
              // Фильтр по кафедре
              _buildSection(
                label: SkeletonText(width: 70, height: 14),
                child: SkeletonBox(height: 48, borderRadius: 12),
              ),
              const SizedBox(height: 16),
              // Фильтр по аудитории
              _buildSection(
                label: SkeletonText(width: 80, height: 14),
                child: SkeletonBox(height: 48, borderRadius: 12),
              ),
              const SizedBox(height: 16),
              // Фильтр по дате
              _buildSection(
                label: SkeletonText(width: 40, height: 14),
                child: SkeletonBox(height: 48, borderRadius: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection({
    required Widget label,
    required Widget child,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        label,
        const SizedBox(height: 8),
        child,
      ],
    );
  }
}


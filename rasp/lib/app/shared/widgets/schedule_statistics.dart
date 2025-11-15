import 'package:flutter/material.dart';
import 'animations/fade_slide_transition.dart';

class ScheduleStatistics extends StatelessWidget {
  final Map<String, dynamic> statistics;

  const ScheduleStatistics({
    super.key,
    required this.statistics,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        FadeSlideTransition(
          delay: Duration.zero,
          duration: const Duration(milliseconds: 300),
          offset: const Offset(-10, 0),
          child: Text(
            'Статистика:',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: colorScheme.onSurface,
            ),
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.only(left: 8),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  FadeSlideTransition(
                    delay: const Duration(milliseconds: 50),
                    duration: const Duration(milliseconds: 400),
                    offset: const Offset(0, 10),
                    child: _StatItem(
                      icon: Icons.event,
                      label: 'Занятий',
                      value: statistics['totalLessons']?.toString() ?? '0',
                    ),
                  ),
                  FadeSlideTransition(
                    delay: const Duration(milliseconds: 100),
                    duration: const Duration(milliseconds: 400),
                    offset: const Offset(0, 10),
                    child: _StatItem(
                      icon: Icons.groups,
                      label: 'Групп',
                      value: statistics['groupsCount']?.toString() ?? '0',
                    ),
                  ),
                  FadeSlideTransition(
                    delay: const Duration(milliseconds: 150),
                    duration: const Duration(milliseconds: 400),
                    offset: const Offset(0, 10),
                    child: _StatItem(
                      icon: Icons.calendar_today,
                      label: 'Дней',
                      value: statistics['daysCount']?.toString() ?? '0',
                    ),
                  ),
                ],
              ),
              if (statistics['topSubjects'] != null &&
                  (statistics['topSubjects'] as List).isNotEmpty) ...[
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 8),
                FadeSlideTransition(
                  delay: const Duration(milliseconds: 200),
                  duration: const Duration(milliseconds: 300),
                  offset: const Offset(-10, 0),
                  child: Text(
                    'Популярные предметы:',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: (statistics['topSubjects'] as List)
                      .asMap()
                      .entries
                      .map<Widget>((entry) {
                    final index = entry.key;
                    final item = entry.value;
                    return FadeSlideTransition(
                      delay: Duration(milliseconds: 250 + (index * 30)),
                      duration: const Duration(milliseconds: 300),
                      offset: const Offset(0, 5),
                      child: Chip(
                        label: Text('${item['name']} (${item['count']})'),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _StatItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Column(
      children: [
        Icon(icon, color: colorScheme.primary, size: 32),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: colorScheme.primary,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
      ],
    );
  }
}


import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class LastUpdateIndicator extends StatelessWidget {
  final DateTime? lastUpdate;
  final bool isOnline;

  const LastUpdateIndicator({
    super.key,
    this.lastUpdate,
    this.isOnline = true,
  });

  @override
  Widget build(BuildContext context) {
    if (lastUpdate == null) {
      return const SizedBox.shrink();
    }

    final timeFormat = DateFormat('HH:mm');
    final dateFormat = DateFormat('dd.MM.yyyy');
    final timeStr = timeFormat.format(lastUpdate!);
    final dateStr = dateFormat.format(lastUpdate!);
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isOnline 
            ? colorScheme.primaryContainer.withOpacity(0.3)
            : colorScheme.errorContainer.withOpacity(0.3),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isOnline ? Icons.cloud_done : Icons.cloud_off,
            size: 16,
            color: isOnline 
                ? colorScheme.primary
                : colorScheme.error,
          ),
          const SizedBox(width: 8),
          Text(
            'Обновлено: $timeStr, $dateStr',
            style: TextStyle(
              fontSize: 12,
              color: colorScheme.onSurface.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
}


import 'package:flutter/material.dart';

class FavoriteGroups extends StatelessWidget {
  final List<String> groups;
  final List<String> favorites;
  final ValueChanged<String> onToggleFavorite;
  final ValueChanged<String> onSelect;

  const FavoriteGroups({
    super.key,
    required this.groups,
    required this.favorites,
    required this.onToggleFavorite,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    if (favorites.isEmpty) {
      return const SizedBox.shrink();
    }

    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Избранные группы:',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: favorites.map((group) {
              return GestureDetector(
                onTap: () => onSelect(group),
                child: Chip(
                  label: Text(group),
                  avatar: const Icon(Icons.star, size: 18, color: Colors.amber),
                  deleteIcon: const Icon(Icons.close, size: 18),
                  onDeleted: () => onToggleFavorite(group),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}


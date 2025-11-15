import 'package:flutter/material.dart';

class GroupSearchBar extends StatelessWidget {
  final String? hintText;
  final ValueChanged<String> onChanged;
  final VoidCallback? onClear;

  const GroupSearchBar({
    super.key,
    this.hintText,
    required this.onChanged,
    this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: TextField(
        onChanged: onChanged,
        decoration: InputDecoration(
          hintText: hintText ?? 'Поиск...',
          prefixIcon: Icon(Icons.search, color: colorScheme.primary),
          suffixIcon: onClear != null
              ? IconButton(
                  icon: Icon(Icons.clear, color: colorScheme.primary),
                  onPressed: onClear,
                )
              : null,
        ),
      ),
    );
  }
}


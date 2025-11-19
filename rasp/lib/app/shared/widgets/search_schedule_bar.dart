import 'package:flutter/material.dart';

class SearchScheduleBar extends StatefulWidget {
  final String? hintText;
  final ValueChanged<String> onChanged;
  final VoidCallback? onClear;
  final String searchQuery;

  const SearchScheduleBar({
    super.key,
    this.hintText,
    required this.onChanged,
    this.onClear,
    this.searchQuery = '',
  });

  @override
  State<SearchScheduleBar> createState() => _SearchScheduleBarState();
}

class _SearchScheduleBarState extends State<SearchScheduleBar> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.searchQuery);
  }

  @override
  void didUpdateWidget(SearchScheduleBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Обновляем контроллер только если значение изменилось извне (например, при очистке)
    if (widget.searchQuery != _controller.text) {
      _controller.text = widget.searchQuery;
      _controller.selection = TextSelection.fromPosition(
        TextPosition(offset: widget.searchQuery.length),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return TextField(
      controller: _controller,
      textDirection: TextDirection.ltr,
      textAlign: TextAlign.left,
      onChanged: (value) {
        widget.onChanged(value);
      },
      decoration: InputDecoration(
        hintText: widget.hintText ?? 'Поиск по группе или предмету...',
        prefixIcon: Icon(Icons.search, color: colorScheme.primary),
        suffixIcon: (widget.searchQuery.isNotEmpty && widget.onClear != null)
            ? IconButton(
                icon: Icon(Icons.clear, color: colorScheme.primary),
                onPressed: widget.onClear,
              )
            : null,
      ),
    );
  }
}


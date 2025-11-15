import 'package:flutter/material.dart';

/// Виджет для подсветки найденного текста в результатах поиска
class HighlightedText extends StatelessWidget {
  final String text;
  final String highlight;
  final TextStyle? style;
  final int? maxLines;
  final TextOverflow? overflow;

  const HighlightedText({
    super.key,
    required this.text,
    required this.highlight,
    this.style,
    this.maxLines,
    this.overflow,
  });

  @override
  Widget build(BuildContext context) {
    if (highlight.isEmpty || text.isEmpty) {
      return Text(
        text,
        style: style,
        maxLines: maxLines,
        overflow: overflow,
      );
    }

    final colorScheme = Theme.of(context).colorScheme;
    final defaultStyle = style ?? Theme.of(context).textTheme.bodyMedium;
    final highlightStyle = defaultStyle?.copyWith(
      backgroundColor: colorScheme.primaryContainer.withOpacity(0.6),
      fontWeight: FontWeight.bold,
      color: colorScheme.onPrimaryContainer,
    );

    final lowerText = text.toLowerCase();
    final lowerHighlight = highlight.toLowerCase();
    
    if (!lowerText.contains(lowerHighlight)) {
      return Text(
        text,
        style: style,
        maxLines: maxLines,
        overflow: overflow,
      );
    }

    final spans = <TextSpan>[];
    int start = 0;
    
    while (start < text.length) {
      final index = lowerText.indexOf(lowerHighlight, start);
      
      if (index == -1) {
        // Остаток текста без подсветки
        spans.add(TextSpan(
          text: text.substring(start),
          style: defaultStyle,
        ));
        break;
      }
      
      // Текст до найденного фрагмента
      if (index > start) {
        spans.add(TextSpan(
          text: text.substring(start, index),
          style: defaultStyle,
        ));
      }
      
      // Найденный фрагмент с подсветкой
      spans.add(TextSpan(
        text: text.substring(index, index + highlight.length),
        style: highlightStyle,
      ));
      
      start = index + highlight.length;
    }

    return Text.rich(
      TextSpan(children: spans),
      maxLines: maxLines,
      overflow: overflow ?? TextOverflow.clip,
    );
  }
}


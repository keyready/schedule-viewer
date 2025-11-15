import 'package:flutter/material.dart';

class GridUtils {
  /// Вычисляет количество колонок для grid в зависимости от доступной ширины
  /// [availableWidth] - реальная доступная ширина из LayoutBuilder constraints
  /// [minCardWidth] - минимальная ширина карточки
  /// [spacing] - отступ между карточками
  /// На мобильных (ширина < 600px) всегда возвращает 1 колонку
  static int getCrossAxisCount(double availableWidth, {
    double minCardWidth = 280,
    double spacing = 12,
  }) {
    // На мобильных устройствах всегда 1 колонка
    if (availableWidth < 600) {
      return 1;
    }
    // Вычисляем оптимальное количество колонок
    // Используем формулу: columns = (availableWidth + spacing) / (minCardWidth + spacing)
    final columns = (availableWidth + spacing) / (minCardWidth + spacing);
    
    // Округляем вниз для получения целого числа колонок
    int columnCount = columns.floor();
    
    // Проверяем, не слишком ли узкими будут карточки
    // Если при текущем количестве колонок карточки будут уже минимальной ширины,
    // уменьшаем количество колонок
    if (columnCount > 0) {
      final actualCardWidth = (availableWidth - (columnCount - 1) * spacing) / columnCount;
      if (actualCardWidth < minCardWidth * 0.9) {
        // Если карточки будут меньше 90% от минимальной ширины, уменьшаем колонки
        columnCount = ((availableWidth + spacing) / (minCardWidth * 1.1 + spacing)).floor();
      }
    }
    
    // Минимум 1 колонка, максимум 4
    if (columnCount < 1) return 1;
    if (columnCount > 4) return 4;
    
    return columnCount;
  }
  
  /// Устаревший метод для обратной совместимости
  /// Использует MediaQuery, но лучше передавать constraints.maxWidth напрямую
  @Deprecated('Используйте getCrossAxisCount(double availableWidth) вместо этого')
  static int getCrossAxisCountFromContext(BuildContext context, {double minCardWidth = 300}) {
    final width = MediaQuery.of(context).size.width;
    final padding = 40.0; // Отступы слева и справа
    final availableWidth = width - padding;
    return getCrossAxisCount(availableWidth, minCardWidth: minCardWidth);
  }

  /// Вычисляет aspect ratio для карточек
  /// Рассчитывается на основе реальной высоты карточки с учетом количества занятий
  /// [cardWidth] - реальная ширина карточки (для точного расчета)
  /// [lessonsCount] - количество занятий в карточке
  static double getAspectRatio(double cardWidth, {int lessonsCount = 4}) {
    // Точный расчет высоты карточки на основе реальных значений из кода
    // Заголовок: padding top: 12, текст: 18, spacing: 4, группа: 14, padding bottom: 8
    const headerTop = 12.0;
    const headerText = 20.0; // fontSize: 18, fontWeight: bold (с учетом line height)
    const headerSpacing = 4.0; // SizedBox(height: 4)
    const groupText = 16.0; // fontSize: 14 (с учетом line height)
    const headerBottom = 8.0;
    const headerHeight = headerTop + headerText + headerSpacing + groupText + headerBottom;
    
    // Заголовки колонок: padding vertical: 6*2, текст: 11
    const columnHeadersVertical = 6.0 * 2;
    const columnHeadersText = 13.0; // fontSize: 11 (с учетом line height)
    const columnHeadersHeight = columnHeadersVertical + columnHeadersText;
    
    // Каждое занятие: padding vertical: 8*2, текст: 13, border
    const lessonPadding = 8.0 * 2;
    const lessonText = 15.0; // fontSize: 13 (с учетом line height)
    const lessonBorder = 1.0;
    const lessonHeight = lessonPadding + lessonText + lessonBorder;
    
    // Отступ снизу
    const cardBottomPadding = 4.0;
    
    // Итоговая высота с запасом для grid и предотвращения переполнения
    final totalHeight = headerHeight + 
                       columnHeadersHeight + 
                       (lessonsCount * lessonHeight) + 
                       cardBottomPadding +
                       35.0 + // Дополнительный запас для grid (30px)
                       10.0; // Запас 10px для предотвращения переполнения
    
    // Возвращаем aspect ratio (width / height)
    return cardWidth / totalHeight;
  }
  
  /// Вычисляет примерную высоту карточки на основе количества занятий
  static double getEstimatedCardHeight(int lessonsCount) {
    const headerHeight = 60.0;
    const columnHeadersHeight = 30.0;
    const lessonHeight = 45.0;
    const padding = 20.0;
    
    return headerHeight + columnHeadersHeight + (lessonsCount * lessonHeight) + padding;
  }
}


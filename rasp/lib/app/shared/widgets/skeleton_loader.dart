import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

/// Базовый виджет для создания скелетонов с shimmer эффектом
class SkeletonLoader extends StatelessWidget {
  final Widget child;
  final Color? baseColor;
  final Color? highlightColor;

  const SkeletonLoader({
    super.key,
    required this.child,
    this.baseColor,
    this.highlightColor,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    
    return Shimmer.fromColors(
      baseColor: baseColor ?? colorScheme.surfaceContainerHighest,
      highlightColor: highlightColor ?? colorScheme.surfaceContainer,
      period: const Duration(milliseconds: 1500),
      child: child,
    );
  }
}

/// Скелетон для прямоугольника
class SkeletonBox extends StatelessWidget {
  final double? width;
  final double? height;
  final double borderRadius;

  const SkeletonBox({
    super.key,
    this.width,
    this.height,
    this.borderRadius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
    );
  }
}

/// Скелетон для текста
class SkeletonText extends StatelessWidget {
  final double? width;
  final double height;
  final double borderRadius;

  const SkeletonText({
    super.key,
    this.width,
    this.height = 16,
    this.borderRadius = 4,
  });

  @override
  Widget build(BuildContext context) {
    return SkeletonBox(
      width: width,
      height: height,
      borderRadius: borderRadius,
    );
  }
}


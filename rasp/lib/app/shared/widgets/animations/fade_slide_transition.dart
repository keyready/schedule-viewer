import 'package:flutter/material.dart';

/// Виджет для плавного появления с fade и slide эффектом
class FadeSlideTransition extends StatelessWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;
  final Offset offset;
  final Curve curve;

  const FadeSlideTransition({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 400),
    this.delay = Duration.zero,
    this.offset = const Offset(0, 20),
    this.curve = Curves.easeOutCubic,
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: duration + delay,
      curve: Interval(
        delay.inMilliseconds / (duration + delay).inMilliseconds,
        1.0,
        curve: curve,
      ),
      builder: (context, value, child) {
        return Transform.translate(
          offset: offset * (1 - value),
          child: Opacity(
            opacity: value,
            child: child,
          ),
        );
      },
      child: child,
    );
  }
}

/// Виджет для масштабирования с fade эффектом
class ScaleFadeTransition extends StatelessWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;
  final double beginScale;
  final Curve curve;

  const ScaleFadeTransition({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 300),
    this.delay = Duration.zero,
    this.beginScale = 0.8,
    this.curve = Curves.easeOutCubic,
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: beginScale, end: 1.0),
      duration: duration + delay,
      curve: Interval(
        delay.inMilliseconds / (duration + delay).inMilliseconds,
        1.0,
        curve: curve,
      ),
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: Opacity(
            opacity: (value - beginScale) / (1.0 - beginScale),
            child: child,
          ),
        );
      },
      child: child,
    );
  }
}

/// Stagger анимация для списка элементов
class StaggeredList extends StatelessWidget {
  final List<Widget> children;
  final Duration baseDuration;
  final Duration staggerDelay;
  final Widget Function(BuildContext, int, Widget) builder;

  const StaggeredList({
    super.key,
    required this.children,
    this.baseDuration = const Duration(milliseconds: 300),
    this.staggerDelay = const Duration(milliseconds: 50),
    required this.builder,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: children.asMap().entries.map((entry) {
        final index = entry.key;
        final child = entry.value;
        return builder(
          context,
          index,
          FadeSlideTransition(
            delay: staggerDelay * index,
            duration: baseDuration,
            child: child,
          ),
        );
      }).toList(),
    );
  }
}


class SubjectModel {
  final String abbr;
  final String title;
  final int lectern;
  final String trainer;

  SubjectModel({
    required this.abbr,
    required this.title,
    required this.lectern,
    required this.trainer,
  });

  factory SubjectModel.fromJson(Map<String, dynamic> json) {
    return SubjectModel(
      abbr: json['abbr']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      lectern: json['lectern'] is int 
          ? json['lectern'] 
          : int.tryParse(json['lectern']?.toString() ?? '0') ?? 0,
      trainer: json['trainer']?.toString() ?? 'Не указан',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'abbr': abbr,
      'title': title,
      'lectern': lectern,
      'trainer': trainer,
    };
  }
}


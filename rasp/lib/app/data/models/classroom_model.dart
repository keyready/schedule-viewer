class ClassroomModel {
  final String id;
  final String title;
  final String? kafTitle;

  ClassroomModel({
    required this.id,
    required this.title,
    this.kafTitle,
  });

  factory ClassroomModel.fromJson(Map<String, dynamic> json) {
    return ClassroomModel(
      id: json['_id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      kafTitle: json['kafTitle']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      if (kafTitle != null) 'kafTitle': kafTitle,
    };
  }
}


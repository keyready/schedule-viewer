class LecternModel {
  final String id;
  final String title;
  final List<String>? audsIds;

  LecternModel({
    required this.id,
    required this.title,
    this.audsIds,
  });

  factory LecternModel.fromJson(Map<String, dynamic> json) {
    return LecternModel(
      id: json['_id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      audsIds: json['audsIds'] is List
          ? (json['audsIds'] as List).map((e) => e.toString()).toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      if (audsIds != null) 'audsIds': audsIds,
    };
  }
}


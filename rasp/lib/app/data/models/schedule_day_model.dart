class ScheduleDayModel {
  final DateTime date;
  final List<String> jobs;
  final String? groupName;

  ScheduleDayModel({
    required this.date,
    required this.jobs,
    this.groupName,
  });

  factory ScheduleDayModel.fromJson(Map<String, dynamic> json) {
    DateTime date;
    if (json['date'] is String) {
      final dateString = json['date'] as String;
      if (dateString.isEmpty) {
        date = DateTime.now();
      } else {
        try {
          date = DateTime.parse(dateString);
        } catch (e) {
          date = DateTime.now();
        }
      }
    } else if (json['date'] is int) {
      // Excel date serial number (если сервер вернет число)
      date = DateTime.fromMillisecondsSinceEpoch(
        ((json['date'] as int) - (25567 + 2)) * 86400 * 1000,
      );
    } else {
      date = DateTime.now();
    }

    return ScheduleDayModel(
      date: date,
      jobs: json['jobs'] is List
          ? List<String>.from(json['jobs'])
          : [],
      groupName: json['groupName']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'jobs': jobs,
      'groupName': groupName,
    };
  }
}


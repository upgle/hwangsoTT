module.exports = class Course {
  constructor(id, subject, professor, classroom, times) {
      this.id = id;
      this.subject = subject;
      this.professor = professor;
      this.classroom = classroom;
      this.times = times;
      this.addTime.bind(this);
  }

  addTime(time) {
    this.times.push(time);
  }
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Mail, Phone, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StudentList({ teacherData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  const students = teacherData?.students || [];
  const courses = teacherData?.courses || [];

  // =========================
  // FIXED FILTER LOGIC
  // =========================
  const filteredStudents = (() => {
    let baseStudents = [];

    if (selectedClass === 'all') {
      baseStudents = students;
    } else {
      const selectedCourse = courses.find(
        (c) => c.course._id === selectedClass
      );
      baseStudents = selectedCourse?.students || [];
    }

    return baseStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  })();

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>View and manage all your students</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">

            {/* SEARCH */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* COURSE BUTTONS */}
            <div className="flex gap-2 flex-wrap">

              <button
                onClick={() => setSelectedClass('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClass === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Classes
              </button>

              {courses?.length > 0 &&
                courses.map((course) => (
                  <button
                    key={course.course._id}
                    onClick={() => setSelectedClass(course.course._id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedClass === course.course._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {course.course.name}
                  </button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STUDENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {filteredStudents.map((student, index) => (
          <Card key={student._id || index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  {/* <CardDescription>Roll No: {student.rollNo || 'N/A'}</CardDescription> */}
                </div>
                {getTrendIcon(student.trend)}
              </div>

              <div className="flex gap-2 mt-2">
                <Badge variant="outline">Student</Badge>
                <Badge variant="secondary">{student.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{student.email || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{student.contact || 'N/A'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Attendance</p>
                  <p className="text-lg font-bold text-green-600">
                    {student.attendance || 0}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg Grade</p>
                  <p className="text-lg font-bold text-blue-600">
                    {student.avgGrade || 0}%
                  </p>
                </div>
              </div>

              <button className="w-full mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                View Details
              </button>

            </CardContent>
          </Card>
        ))}

      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No students found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
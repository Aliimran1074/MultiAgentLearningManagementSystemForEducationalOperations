import { useState,useEffect } from 'react';
import axios from 'axios';

import { 
  Search, 
  Filter, 
  User, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  Clock,
  Award,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export default function StudentProgress({ selectedSession }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [counselingFilter, setCounselingFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
const [studentData, setStudentData] = useState([]);
const [loading, setLoading] = useState(true);

const instituteId = "6a02e3cf54202521c3af340e";

useEffect(() => {
  const getStudentProgress = async () => {
    try {
      const response = await axios.get(
        `https://univeristy-management-system.vercel.app/api/studentProgress/${instituteId}`
      );

      console.log("========== Student Progress API ==========");
      console.log(response);
      console.log("Response Data:", response.data);
      console.log("Student Array:", response.data.data.students);

      setStudentData(response.data.data.students || []);
    } catch (error) {
      console.log("Student Progress Error");
      console.log(error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Backend Response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  getStudentProgress();
}, []);
  // Filter students
  const filteredStudents = studentData.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.program.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCounseling = 
      counselingFilter === 'all' || 
      (counselingFilter === 'flagged' && student.currentAverage < 50) ||
      (counselingFilter === 'no-action' && student.currentAverage >= 50);
    
    const matchesPerformance =
      performanceFilter === 'all' ||
      (performanceFilter === 'below-50' && student.currentAverage < 50) ||
      (performanceFilter === '50-70' && student.currentAverage >= 50 && student.currentAverage < 70) ||
      (performanceFilter === 'above-70' && student.currentAverage >= 70);
    
    return matchesSearch && matchesCounseling && matchesPerformance;
  });

  // Get counseling status badge
  const getCounselingBadge = (status) => {
    switch(status) {
      case 'Urgent - No Meeting':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-300',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case 'Intervention Required':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-300',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case 'Meeting Scheduled':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-300',
          icon: <Clock className="w-4 h-4" />
        };
      case 'No Action Needed':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-300',
          icon: <CheckCircle className="w-4 h-4" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  // Get performance color
  const getPerformanceColor = (average) => {
    if (average >= 70) return 'text-green-600';
    if (average >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Summary stats
  const stats = {
    totalStudents: studentData.length,
    belowThreshold: studentData.filter(s => s.currentAverage < 50).length,
    meetingsScheduled: studentData.filter(s => s.nextMeeting && s.nextMeeting !== 'Not scheduled').length,
    avgAttendance: Math.round(studentData.reduce((sum, s) => sum + s.attendance, 0) / studentData.length)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Progress (Session-Wise)</h2>
        <p className="text-sm text-gray-600 mt-1">
          Detailed student data for {selectedSession}
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Below 50%</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.belowThreshold}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Meetings Scheduled</p>
            {/* <Calendar className="w-5 h-5 text-blue-600" /> */}
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.meetingsScheduled}</p>
        </div>

         {/* <div className="bg-white rounded-lg border border-gray-200 p-4"> */}
          {/* <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
            <Award className="w-5 h-5 text-green-600" />
          </div> */}
          {/* <p className="text-2xl font-bold text-green-600">{stats.avgAttendance}%</p> */}
        {/* </div> */}
      </div> 

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Counseling Filter */}
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <select
              value={counselingFilter}
              onChange={(e) => setCounselingFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Counseling Status</option>
              <option value="flagged">Flagged (&lt;50%)</option>
              <option value="no-action">No Action Needed</option>
            </select>
          </div>

          {/* Performance Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Performance</option>
              <option value="below-50">Below 50%</option>
              <option value="50-70">50% - 70%</option>
              <option value="above-70">Above 70%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Student
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Program
                </th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Attendance
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Current Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Counseling Status
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Next Meeting
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const counselingBadge = getCounselingBadge(student.counselingStatus);
                const trendPositive = student.trend > 0;
                // const completionRate = Math.round((student.completedAssignments / student.totalAssignments) * 100);
               const completionRate = 75; 
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-600">{student.enrollmentId}</p>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{student.program}</p>
                      <p className="text-xs text-gray-600">{student.coursesEnrolled} courses enrolled</p>
                    </td> */}
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[60px]">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                student.attendance >= 90 ? 'bg-green-500' : 
                                student.attendance >= 75 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.attendance}%</span>
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
  <span 
    className={`text-lg font-bold ${
      getPerformanceColor(student.currentAverage)
    }`}
  >
    {student.currentAverage || 0}%
  </span>
</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Assignments</span>
                          <span className="text-xs font-medium text-gray-900">{completionRate}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {student.completedAssignments}/{student.totalAssignments} completed
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${counselingBadge.bg} ${counselingBadge.text} ${counselingBadge.border}`}>
                        {counselingBadge.icon}
                        <span className="text-xs font-medium">{student.counselingStatus}</span>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      {student.nextMeeting ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{student.nextMeeting}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No students found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      {filteredStudents.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredStudents.length} of {studentData.length} students
        </div>
      )}
    </div>
  );
}
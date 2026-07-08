import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, BookOpen, Calendar, TrendingUp, Award, Clock } from 'lucide-react';

export default function DashboardOverview({ dashboardData }) {
  
  const totalStudents = dashboardData?.summary?.totalStudents || 0
  const activeClasses = dashboardData?.summary?.totalCourses || 0
  const avgGrade = dashboardData?.courses?.length
  ? "Calculating..."
  : "0%"
const pendingCount =
  dashboardData?.appointments?.filter(a => a.status === "pending").length || 0;
  const stats = [
  {
    title: 'Total Students',
    value: dashboardData?.summary?.totalStudents || 0,
    description: 'Across all classes',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Active Classes',
    value: dashboardData?.summary?.totalCourses || 0,
    description: 'Assigned courses',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Pending Assignments',
    value: dashboardData?.summary?.totalAssignmentSubmissions || 0,
    description: 'Need to be checked',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Appointments Today',
    value: dashboardData?.summary?.pendingAppointments || 0,
    description: `${pendingCount} pending`,
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Attendance Rate',
    value: dashboardData?.summary?.attendance?.length || 0 + '%',
    description: 'Last 7 days',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    title: 'Average Grade',
    value: dashboardData?.summary?.totalQuizSubmissions || 0,
    description: 'This semester',
    icon: Award,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  }
]

  const recentActivity = [
    { type: 'assignment', student: 'John Smith', action: 'submitted Biology Assignment', time: '10 mins ago' },
    { type: 'appointment', student: 'Emma Wilson', action: 'requested an appointment', time: '1 hour ago' },
    { type: 'quiz', student: 'Michael Brown', action: 'completed Chemistry Quiz #5', time: '2 hours ago' },
    { type: 'assignment', student: 'Sarah Davis', action: 'submitted Chemistry Assignment', time: '3 hours ago' },
    { type: 'attendance', student: 'Class 9 Biology', action: '30/32 students present', time: '5 hours ago' }
  ];

  const upcomingTasks = [
    { task: 'Grade Biology Assignment #8', deadline: 'Today, 4:00 PM', priority: 'high' },
    { task: 'Prepare Chemistry Quiz #6', deadline: 'Tomorrow, 9:00 AM', priority: 'medium' },
    { task: 'Update course content for Class 10', deadline: 'Feb 6, 2026', priority: 'low' },
    { task: 'Parent-Teacher meeting', deadline: 'Feb 7, 2026', priority: 'medium' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.student}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Upcoming Tasks */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Things you need to complete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-gray-600 mt-1">{item.deadline}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium">Create Assignment</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Clock className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium">Mark Attendance</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium">Schedule Class</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium">Message Students</p>
            </button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

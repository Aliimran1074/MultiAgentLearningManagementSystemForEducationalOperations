import axios from "axios";
import {useEffect,useState} from "react";
import { 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  FileText,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';

export default function MasterContentLibrary({ selectedSession }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contentLibrary,setContentLibrary]=useState([]);
const [loading,setLoading]=useState(true);


const instituteId =
"6a02e3cf54202521c3af340e";

useEffect(()=>{


const getContent=async()=>{


try{


const response =
await axios.get(
`http://localhost:4000/api/masterContent/${instituteId}`
);


console.log(
"Master Content:",
response.data
);



setContentLibrary(
response.data.data
);


}
catch(error){

console.log(
"Content Error",
error
);


}
finally{

setLoading(false);

}


}


getContent();


},[]);

  // Filter content based on search and status
  const filteredContent = contentLibrary.filter(item => {
    const matchesSearch = 
      item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.lifecycleStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Live':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'Processing by AI':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          icon: <Clock className="w-4 h-4 animate-spin" />
        };
      case 'Draft':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: <FileText className="w-4 h-4" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: <FileText className="w-4 h-4" />
        };
    }
  };

  // Summary statistics
  const stats = {
    total: contentLibrary.length,
    live: contentLibrary.filter(c => c.lifecycleStatus === 'Live').length,
    processing: contentLibrary.filter(c => c.lifecycleStatus === 'Processing by AI').length,
    draft: contentLibrary.filter(c => c.lifecycleStatus === 'Draft').length
  };

  if(loading){

return <h1>Loading Content...</h1>

}
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Master Content Library</h2>
        <p className="text-sm text-gray-600 mt-1">
          All courses and materials for {selectedSession}
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Content</p>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Live</p>
            <Play className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.live}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Processing</p>
            <Pause className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Draft</p>
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course, code, or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Live">Live</option>
              <option value="Processing by AI">Processing</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Content Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Lifecycle Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  AI Processing
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Student Access
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContent.map((item) => {
                const statusBadge = getStatusBadge(item.lifecycleStatus);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.courseTitle}</p>
                        <p className="text-xs text-gray-600">{item.courseCode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{item.teacher}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{item.contentType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        {statusBadge.icon}
                        <span className="text-xs font-medium">{item.lifecycleStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{item.aiProcessingTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{item.studentAccess}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{item.lastUpdated}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredContent.length === 0 && (
            <div className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No content found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 text-center">
        Showing {filteredContent.length} of {contentLibrary.length} content items
      </div>
    </div>
  );
}
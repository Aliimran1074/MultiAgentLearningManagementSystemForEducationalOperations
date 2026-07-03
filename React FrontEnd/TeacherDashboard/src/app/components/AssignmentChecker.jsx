import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Eye, Download, GraduationCap, X, Sparkles } from 'lucide-react';

export default function AssignmentChecker({ teacherData }) {
  const [selectedTab, setSelectedTab] = useState('unchecked');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // =========================
  // FIXED DATA INTEGRATION
  // =========================
  const assignments = useMemo(() => {
    if (!teacherData?.assignments) return [];

    return teacherData.assignments.map(a => ({
      id: a._id,
      title: a.title || "No Title",
      studentName: a.student?.name || a.studentName || "Unknown Student",
      class: a.course?.class || "",
      submittedDate: a.createdAt || "",
      status: a.status || "unchecked",
      aiChecked: a.aiChecked || false,
      aiGrade: a.aiGrade || 0,
      aiComments: a.aiComments || ""
    }));
  }, [teacherData]);

  // =========================
  // FILTERS
  // =========================
  const uncheckedAssignments = useMemo(
    () => assignments.filter(a => a.status === 'unchecked'),
    [assignments]
  );

  const aiCheckedAssignments = useMemo(
    () => assignments.filter(a => a.status === 'ai-checked'),
    [assignments]
  );

  const checkedAssignments = useMemo(
    () => assignments.filter(a => a.status === 'checked'),
    [assignments]
  );

  // =========================
  // GRADE SUBMIT (LOCAL ONLY)
  // =========================
  const handleGradeSubmit = (id, grade, comments) => {
    setSelectedAssignment(null);
    // backend update yahan add karna hoga agar needed
  };

  // =========================
  // MODAL
  // =========================
  const GradeModal = ({ assignment, onClose }) => {
    const [grade, setGrade] = useState(
      assignment.grade || assignment.aiGrade || ''
    );
    const [comments, setComments] = useState(
      assignment.comments || assignment.aiComments || ''
    );

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border-none shadow-2xl">
          
          <CardHeader className="sticky top-0 bg-white z-10 border-b flex flex-row justify-between items-center">
            <div>
              <CardTitle>Review Submission</CardTitle>
              <CardDescription>
                {assignment.studentName} • {assignment.title}
              </CardDescription>
            </div>

            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">

            {/* AI BOX */}
            {assignment.aiChecked && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="font-bold text-blue-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> AI Suggestion
                </p>
                <p className="text-sm mt-2">
                  Score: {assignment.aiGrade}/100
                </p>
                <p className="text-sm text-blue-600">
                  {assignment.aiComments}
                </p>
              </div>
            )}

            {/* INPUTS */}
            <div>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter grade"
              />

              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full mt-3 p-3 border rounded-lg"
                placeholder="Feedback"
              />
            </div>

            <button
              onClick={() => handleGradeSubmit(assignment.id, grade, comments)}
              className="w-full bg-blue-600 text-white p-3 rounded-lg"
            >
              Submit
            </button>

          </CardContent>
        </Card>
      </div>
    );
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      <h1 className="text-3xl font-bold">Assignment Checker</h1>

      {/* TABS */}
      <div className="flex gap-6 border-b">
        {['unchecked', 'ai-checked', 'checked'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`pb-2 ${
              selectedTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {(selectedTab === 'unchecked'
          ? uncheckedAssignments
          : selectedTab === 'ai-checked'
          ? aiCheckedAssignments
          : checkedAssignments
        ).map(a => (
          <Card key={a.id}>
            <CardContent className="p-4 flex justify-between items-center">

              <div>
                <h2 className="font-bold">{a.title}</h2>
                <p className="text-sm text-gray-500">
                  {a.studentName} • Class {a.class}
                </p>
              </div>

              <button
                onClick={() => setSelectedAssignment(a)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Grade
              </button>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      {selectedAssignment && (
        <GradeModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
}


// is ko test karna hai 
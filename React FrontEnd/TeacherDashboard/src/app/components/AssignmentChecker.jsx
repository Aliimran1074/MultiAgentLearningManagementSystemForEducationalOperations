import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FileText, X } from 'lucide-react';

export default function AssignmentChecker({ teacherData }) {

  const [selectedTab, setSelectedTab] = useState('unchecked');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // =========================
  // DEBUG: RAW DATA CHECK
  // =========================
  useEffect(() => {
    console.log("🔥 teacherData FULL:", teacherData);
    console.log("🔥 assignments RAW:", teacherData?.assignments);
  }, [teacherData]);

  // =========================
  // SAFE DATA MAPPING + DEBUG
  // =========================
  const assignments = useMemo(() => {

    console.log("⚙️ useMemo triggered");

    if (!teacherData?.assignments) {
      console.log("❌ No assignments found in teacherData");
      return [];
    }

    console.log("📦 assignments count:", teacherData.assignments.length);

    const mapped = teacherData.assignments.map((a, index) => {

      console.log(`➡️ assignment[${index}] raw:`, a);

      const submissionCount = a?.submissions?.length || 0;

      return {
        id: a._id,
        title: `Assignment ${index + 1}`,
        course: a.course,
        status: submissionCount > 0
          ? a.submissions[0]?.status || "unchecked"
          : "unchecked",

        submissions: a.submissions || [],
        totalSubmissions: a.totalSubmissions || 0,
        checkedSubmissions: a.checkedSubmissions || 0,
      };
    });

    console.log("✅ FINAL MAPPED ASSIGNMENTS:", mapped);

    return mapped;

  }, [teacherData]);

  // =========================
  // FILTERS (WITH DEBUG)
  // =========================
  const uncheckedAssignments = useMemo(() => {
    const data = assignments.filter(a => a.status !== 'checked');
    console.log("🟡 unchecked:", data);
    return data;
  }, [assignments]);

  const checkedAssignments = useMemo(() => {
    const data = assignments.filter(a => a.status === 'checked');
    console.log("🟢 checked:", data);
    return data;
  }, [assignments]);

  // =========================
  // UI DEBUG CHECK
  // =========================
  useEffect(() => {
    console.log("🎯 CURRENT TAB:", selectedTab);
  }, [selectedTab]);

  // =========================
  // MAIN RENDER
  // =========================
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Assignment Checker
      </h1>

      {/* TABS */}
      <div className="flex gap-6 border-b">
        {['unchecked', 'checked'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`pb-2 ${
              selectedTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : ''
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
          : checkedAssignments
        ).map((a, i) => {

          console.log("🧾 rendering assignment:", a);

          return (
            <Card key={a.id || i}>
              <CardContent className="p-4 flex justify-between items-center">

                <div>
                  <h2 className="font-bold">
                    {a.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Course: {a.course}
                  </p>

                  <p className="text-xs text-gray-400">
                    Status: {a.status}
                  </p>
                </div>

                <button
                  onClick={() => {
                    console.log("📌 selected assignment:", a);
                    setSelectedAssignment(a);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Open
                </button>

              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <Card className="w-full max-w-xl">

            <CardHeader className="flex justify-between">
              <CardTitle>Assignment Debug View</CardTitle>

              <button onClick={() => setSelectedAssignment(null)}>
                <X />
              </button>
            </CardHeader>

            <CardContent className="space-y-2">

              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(selectedAssignment, null, 2)}
              </pre>

            </CardContent>

          </Card>

        </div>
      )}

    </div>
  );
}
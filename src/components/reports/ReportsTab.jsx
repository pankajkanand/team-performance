// src/components/reports/ReportsTab.js
import React, { useState } from "react";
import { FileText, Download, Filter, Calendar, User } from "lucide-react";
import FeedbackItem from "../feedback/FeedbackItem";

const ReportsTab = ({ teamMembers, feedbacks, userRole, userData }) => {
  const [filters, setFilters] = useState({
    memberUid: "",
    type: "",
    status: "",
    dateRange: "all",
  });
  const [reportGenerated, setReportGenerated] = useState(false);

  const getFilteredFeedbacks = () => {
    let filtered = feedbacks;

    if (filters.memberUid) {
      filtered = filtered.filter((f) => f.memberUid === filters.memberUid);
    }

    if (filters.type) {
      filtered = filtered.filter((f) => f.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter((f) => f.status === filters.status);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }

      filtered = filtered.filter((f) => {
        const feedbackDate = f.createdAt?.seconds
          ? new Date(f.createdAt.seconds * 1000)
          : new Date(f.createdAt);
        return feedbackDate >= filterDate;
      });
    }

    return filtered;
  };

  const generateReport = () => {
    setReportGenerated(true);
  };

  const exportToCsv = () => {
    const filteredFeedbacks = getFilteredFeedbacks();

    const csvContent = [
      "Member Name,Role,Position,Project,Feedback Type,Status,Reviewer,Description,Action Items,Date",
      ...filteredFeedbacks.map((feedback) => {
        const member = teamMembers.find((m) => m.uid === feedback.memberUid);
        const date = feedback.createdAt?.seconds
          ? new Date(feedback.createdAt.seconds * 1000).toLocaleDateString()
          : typeof feedback.createdAt === "string"
          ? new Date(feedback.createdAt).toLocaleDateString()
          : "Unknown";

        return [
          feedback.memberName || member?.name || "Unknown",
          member?.role || "Unknown",
          member?.position || "Unknown",
          feedback.project,
          feedback.type,
          feedback.status,
          feedback.reviewer,
          `"${feedback.description.replace(/"/g, '""')}"`,
          `"${(feedback.actionItems || "").replace(/"/g, '""')}"`,
          date,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const reportName =
      userRole === "team_member"
        ? `my_performance_report_${new Date().toISOString().split("T")[0]}.csv`
        : `performance_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.download = reportName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredFeedbacks = getFilteredFeedbacks();

  const getReportTitle = () => {
    return userRole === "team_member"
      ? "My Performance Reports"
      : "Performance Reports";
  };

  const getReportDescription = () => {
    return userRole === "team_member"
      ? "View and export your personal performance feedback and progress"
      : "Generate comprehensive reports for team performance analysis";
  };

  // Filter team members for dropdown (exclude admins)
  const availableMembers = teamMembers.filter(m => m.role !== 'admin');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {getReportTitle()}
          </h2>
          <p className="text-gray-600 mt-2">{getReportDescription()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-400" size={20} />
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Filter Options
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Team Member Filter - Hide for team members */}
          {userRole !== "team_member" && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Team Member
              </label>
              <select
                value={filters.memberUid}
                onChange={(e) =>
                  setFilters({ ...filters, memberUid: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">All Members</option>
                {availableMembers.map((member) => (
                  <option key={member.uid} value={member.uid}>
                    {member.name} - {member.position}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Feedback Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
            >
              <option value="">All Types</option>
              <option value="positive">Positive Only</option>
              <option value="improvement">Improvements Only</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="open">Open Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Time Period
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={generateReport}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <FileText size={18} />
          Generate Report
        </button>
        <button
          onClick={exportToCsv}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <Download size={18} />
          Export to CSV
        </button>
      </div>

      {/* Report Results */}
      {reportGenerated && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {userRole === "team_member"
              ? "My Performance Report"
              : "Performance Report"}
          </h3>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredFeedbacks.length}
              </div>
              <div className="text-blue-800 font-semibold">Total Feedbacks</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredFeedbacks.filter((f) => f.type === "positive").length}
              </div>
              <div className="text-green-800 font-semibold">Positive</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {
                  filteredFeedbacks.filter((f) => f.type === "improvement")
                    .length
                }
              </div>
              <div className="text-orange-800 font-semibold">Improvements</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredFeedbacks.filter((f) => f.status === "open").length}
              </div>
              <div className="text-red-800 font-semibold">Open Items</div>
            </div>
          </div>

          {/* Performance Summary for Team Members */}
          {userRole === "team_member" && filteredFeedbacks.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                My Performance Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">
                    Strengths
                  </h5>
                  <div className="text-sm text-gray-600">
                    {filteredFeedbacks.filter((f) => f.type === "positive")
                      .length > 0
                      ? `You've received ${
                          filteredFeedbacks.filter((f) => f.type === "positive")
                            .length
                        } positive feedbacks, highlighting your strong performance.`
                      : "No positive feedback in the selected period."}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">
                    Areas for Growth
                  </h5>
                  <div className="text-sm text-gray-600">
                    {filteredFeedbacks.filter((f) => f.status === "open")
                      .length > 0
                      ? `You have ${
                          filteredFeedbacks.filter((f) => f.status === "open")
                            .length
                        } open improvement items to focus on.`
                      : "Great job! No open improvement items."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Feedback List */}
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Detailed Feedback
          </h4>
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <h5 className="text-lg font-semibold text-gray-700 mb-2">
                No Feedback Found
              </h5>
              <p className="text-gray-500">
                No feedback matches your current filter criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback) => {
                const member = teamMembers.find(
                  (m) => m.uid === feedback.memberUid
                );
                return (
                  <FeedbackItem
                    key={feedback.id}
                    feedback={feedback}
                    member={member}
                    onToggleStatus={null} // No toggle in reports view
                    userRole={userRole}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="text-lg font-semibold text-blue-800 mb-3">
          How to Use Reports
        </h4>
        <div className="text-sm text-blue-700 space-y-2">
          {userRole === "team_member" ? (
            <>
              <p>
                • Use filters to view feedback from specific time periods or
                projects
              </p>
              <p>
                • Export your performance data to track your growth over time
              </p>
              <p>
                • Focus on open improvement items to enhance your performance
              </p>
              <p>
                • Celebrate your positive feedback and use it for motivation
              </p>
            </>
          ) : (
            <>
              <p>
                • Filter by team member to generate individual performance
                reports
              </p>
              <p>• Use date ranges to track performance trends over time</p>
              <p>
                • Export data for further analysis in spreadsheet applications
              </p>
              <p>• Monitor open improvement items to ensure team development</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
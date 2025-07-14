// src/components/reports/ReportsTab.js
import React, { useState } from "react";
import { FileText, Download, Filter, Calendar, User, Search, CheckCircle } from "lucide-react";
import FeedbackItem from "../feedback/FeedbackItem";

const ReportsTab = ({ teamMembers, feedbacks, userRole, userData, onToggleStatus }) => {
  const [filters, setFilters] = useState({
    memberUid: "",
    type: "",
    status: "",
    dateRange: "all",
    searchTerm: "",
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

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((f) => 
        f.project?.toLowerCase().includes(searchLower) ||
        f.description?.toLowerCase().includes(searchLower) ||
        f.actionItems?.toLowerCase().includes(searchLower) ||
        f.reviewer?.toLowerCase().includes(searchLower) ||
        f.memberName?.toLowerCase().includes(searchLower)
      );
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
      "Member Name,Role,Position,Project,Feedback Type,Status,Reviewer,Description,Action Items,Improvement Deadline,Date",
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
          feedback.improvementDeadline || "",
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

  // Check if user can toggle status (admin or reviewer)
  const canToggleStatus = (userRole === 'admin' || userRole === 'reviewer') && onToggleStatus;

  return (
    <div>
      {/* Responsive Heading and Date */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          {getReportTitle()}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
          <p className="text-gray-600 text-base sm:text-lg text-center sm:text-left">{getReportDescription()}</p>
          <div className="flex items-center gap-2 justify-center sm:justify-end mt-2 sm:mt-0">
            <Calendar className="text-gray-400" size={18} />
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Filter */}
          <div className="lg:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Search Feedback
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                placeholder="Search by project, description, reviewer, or member name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>

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

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilters({ ...filters, status: 'open', type: 'improvement' })}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
          >
            🔓 Open Improvements
          </button>
          <button
            onClick={() => setFilters({ ...filters, status: 'closed', type: 'improvement' })}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors"
          >
            ✅ Completed Improvements
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'positive' })}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
          >
            🌟 Positive Feedback
          </button>
          <button
            onClick={() => setFilters({ ...filters, memberUid: '', type: '', status: '', dateRange: 'all', searchTerm: '' })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            🗑️ Clear Filters
          </button>
        </div>
      </div>

      {/* Responsive Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={generateReport}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
        >
          <FileText size={18} />
          Generate Report
        </button>
        <button
          onClick={exportToCsv}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
        >
          <Download size={18} />
          Export to CSV
        </button>
        {canToggleStatus && (
          <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl w-full sm:w-auto justify-center sm:justify-start">
            <CheckCircle className="text-orange-600" size={18} />
            <span className="text-orange-700 font-semibold text-sm">
              Mark as Complete enabled
            </span>
          </div>
        )}
      </div>

      {/* Quick Open Items Management - Only for admins/reviewers */}
      {canToggleStatus && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-red-600" size={24} />
            <h3 className="text-xl font-bold text-red-800">Quick Open Items Management</h3>
          </div>
          <p className="text-red-700 mb-4">
            Quickly find and manage open improvement items. Use the filters above to narrow down results, then mark items as complete directly from this view.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'open', type: 'improvement' });
                setReportGenerated(true);
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              🔓 Show Open Improvements
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'open', type: 'improvement', dateRange: 'month' });
                setReportGenerated(true);
              }}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-semibold hover:bg-orange-200 transition-colors flex items-center gap-2"
            >
              📅 Recent Open Items
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'open', type: 'improvement', searchTerm: '' });
                setReportGenerated(true);
              }}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition-colors flex items-center gap-2"
            >
              🔍 All Open Items
            </button>
          </div>
          
          <div className="text-sm text-red-600">
            💡 <strong>Tip:</strong> Use the search box above to find specific feedback by project name, description, or team member name.
          </div>
        </div>
      )}

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
            Detailed Feedback ({filteredFeedbacks.length} items)
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
                    onToggleStatus={canToggleStatus ? onToggleStatus : null}
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
              <p>• Use the search function to quickly find specific feedback</p>
              <p>• Mark improvement items as complete directly from the reports view</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
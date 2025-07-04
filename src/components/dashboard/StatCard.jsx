// components/dashboard/StatCard.js
import React from "react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-center shadow-lg">
    <Icon className={`mx-auto mb-3 ${color}`} size={32} />
    <div className="text-3xl font-bold text-indigo-600 mb-2">{value}</div>
    <div className="text-gray-600 font-semibold">{label}</div>
  </div>
);

export default StatCard;

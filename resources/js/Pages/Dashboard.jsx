import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { memo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Memoized metric card component
const MetricCard = memo(({ icon, badge, value, label, description, bgColor, badgeColor }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${bgColor} rounded-xl`}>{icon}</div>
                <span className={`text-xs font-semibold ${badgeColor} px-3 py-1 rounded-full`}>
                    {badge}
                </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    </div>
));

MetricCard.displayName = "MetricCard";

// Memoized recent registration item
const RecentRegistrationItem = memo(({ record }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
                {record.first_name?.charAt(0)}{record.last_name?.charAt(0)}
            </span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
                {record.first_name} {record.last_name}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
                Age: {record.age} • {record.age_group}
            </p>
            <p className="text-xs text-gray-500 mt-1">
                {new Date(record.date_of_registration).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                })}
            </p>
        </div>
        <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
            </span>
        </div>
    </div>
));

RecentRegistrationItem.displayName = "RecentRegistrationItem";

export default function Dashboard({ stats }) {
    // Prepare data for charts
    const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
    
    const ageData = stats?.age_distribution?.map(item => ({
        name: item.age_group || 'Unknown',
        value: parseInt(item.count)
    })) || [];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthNames.map((name, index) => {
        const monthData = stats?.monthly_registrations?.find(m => parseInt(m.month) === index + 1);
        return {
            name: name,
            registrations: monthData ? parseInt(monthData.count) : 0
        };
    });

    const statusData = [
        { name: 'Active Pregnancies', value: stats?.active_pregnancies || 0, color: '#ec4899' },
        { name: 'Completed 4PNC', value: stats?.completed_4pnc || 0, color: '#10b981' },
        { name: 'Pending', value: (stats?.total_records || 0) - (stats?.active_pregnancies || 0) - (stats?.completed_4pnc || 0), color: '#f59e0b' }
    ].filter(item => item.value > 0);

    const smsData = [
        { name: 'Sent', value: stats?.sms_stats?.total_sent || 0, color: '#10b981' },
        { name: 'Failed', value: stats?.sms_stats?.total_failed || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);

    const contentData = [
        { name: 'Videos', active: stats?.educational_content?.active_videos || 0, total: stats?.educational_content?.videos || 0 },
        { name: 'Articles', active: stats?.educational_content?.active_articles || 0, total: stats?.educational_content?.articles || 0 }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Analytics Dashboard</h2>
                    <span className="text-sm text-gray-500">Real-time Statistics & Insights</span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <MetricCard
                            icon={
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            badge="Total"
                            value={stats?.total_records || 0}
                            label="Maternal Records"
                            description="All registered patients"
                            bgColor="bg-indigo-100"
                            badgeColor="text-indigo-600 bg-indigo-50"
                        />
                        <MetricCard
                            icon={
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            }
                            badge="Active"
                            value={stats?.active_pregnancies || 0}
                            label="Active Pregnancies"
                            description="Ongoing care required"
                            bgColor="bg-pink-100"
                            badgeColor="text-pink-600 bg-pink-50"
                        />
                        <MetricCard
                            icon={
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            badge="Complete"
                            value={stats?.completed_4pnc || 0}
                            label="Completed 4PNC"
                            description="Postnatal care finished"
                            bgColor="bg-green-100"
                            badgeColor="text-green-600 bg-green-50"
                        />
                        <MetricCard
                            icon={
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            }
                            badge="SMS"
                            value={stats?.sms_stats?.this_month || 0}
                            label="Messages Sent"
                            description="This month"
                            bgColor="bg-blue-100"
                            badgeColor="text-blue-600 bg-blue-50"
                        />
                    </div>

                    {/* Charts Row 1 - Age Distribution & Patient Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Age Distribution Pie Chart */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
                                <h3 className="text-lg font-bold text-white">Age Distribution</h3>
                                <p className="text-purple-100 text-sm">Patient age groups</p>
                            </div>
                            <div className="p-6">
                                {ageData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={ageData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {ageData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        No data available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Patient Status Pie Chart */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
                                <h3 className="text-lg font-bold text-white">Patient Status</h3>
                                <p className="text-pink-100 text-sm">Current care status</p>
                            </div>
                            <div className="p-6">
                                {statusData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        No data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 - Monthly Registrations Line Chart */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                            <h3 className="text-lg font-bold text-white">Monthly Registrations Trend</h3>
                            <p className="text-blue-100 text-sm">New patient registrations this year</p>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Charts Row 3 - SMS & Content Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* SMS Statistics */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
                                <h3 className="text-lg font-bold text-white">SMS Statistics</h3>
                                <p className="text-green-100 text-sm">Message delivery status</p>
                            </div>
                            <div className="p-6">
                                {smsData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={smsData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, value }) => `${name}: ${value}`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {smsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        No SMS data available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Educational Content Statistics */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                                <h3 className="text-lg font-bold text-white">Educational Content</h3>
                                <p className="text-orange-100 text-sm">Active vs total content</p>
                            </div>
                            <div className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={contentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="active" fill="#10b981" name="Active" />
                                        <Bar dataKey="total" fill="#f59e0b" name="Total" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <a href={route('parent.maternal-care.register')} className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200">
                                <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span className="text-sm font-semibold text-blue-900">Add Patient</span>
                            </a>
                            <a href={route('sms.index')} className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200">
                                <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className="text-sm font-semibold text-purple-900">Send SMS</span>
                            </a>
                            <a href={route('parent.maternal-care')} className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200">
                                <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-semibold text-green-900">View Records</span>
                            </a>
                            <a href={route('child.immunization.index')} className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 border border-orange-200">
                                <svg className="w-8 h-8 text-orange-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="text-sm font-semibold text-orange-900">Immunization</span>
                            </a>
                        </div>
                    </div>

                    {/* Recent Registrations */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                            <h3 className="text-lg font-bold text-white">Recent Registrations</h3>
                            <p className="text-indigo-100 text-sm">Latest maternal care records</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {stats?.recent_registrations && stats.recent_registrations.length > 0 ? (
                                    stats.recent_registrations.map((record) => (
                                        <RecentRegistrationItem key={record.id} record={record} />
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-900 font-semibold mb-2">No records yet</p>
                                        <p className="text-sm text-gray-500">Start by adding your first maternal care record</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

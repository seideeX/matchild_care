import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Send, Users, MessageSquare, History, CheckCircle, XCircle, Clock, Sparkles, FileText, Eye, Search, Filter } from 'lucide-react';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function SmsNotifications({ templates, patients, recentLogs }) {
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [customData, setCustomData] = useState({});
    const [previewMessage, setPreviewMessage] = useState('');
    const [isBulk, setIsBulk] = useState(false);
    const [searchPatient, setSearchPatient] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingSendData, setPendingSendData] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: '',
        patient_ids: [],
        template_id: '',
        custom_data: {},
    });

    const handleTemplateChange = (templateId) => {
        const template = templates.find(t => t.id === parseInt(templateId));
        setSelectedTemplate(template);
        setData('template_id', templateId);
        
        if (template) {
            updatePreview(template, customData, isBulk ? selectedPatients[0] : data.patient_id);
        }
    };

    const handlePatientChange = (patientId) => {
        setData('patient_id', patientId);
        if (selectedTemplate) {
            const patient = patients.find(p => p.id === parseInt(patientId));
            updatePreview(selectedTemplate, customData, patient);
        }
    };

    const handleCustomDataChange = (key, value) => {
        const newData = { ...customData, [key]: value };
        setCustomData(newData);
        setData('custom_data', newData);
        
        if (selectedTemplate) {
            const patientId = isBulk ? selectedPatients[0] : data.patient_id;
            updatePreview(selectedTemplate, newData, patientId);
        }
    };

    const updatePreview = (template, customValues, patientId) => {
        if (!template) return;
        
        const patient = patients.find(p => p.id === parseInt(patientId));
        if (!patient) return;

        let message = template.template;
        const allData = {
            patient_name: patient.full_name,
            username: patient.username,
            sender_name: 'Matcare',
            login_url: window.location.origin,
            ...customValues
        };

        Object.keys(allData).forEach(key => {
            message = message.replace(new RegExp(`{${key}}`, 'g'), allData[key]);
        });

        setPreviewMessage(message);
    };

    const handlePatientSelect = (patientId) => {
        const id = parseInt(patientId);
        if (selectedPatients.includes(id)) {
            setSelectedPatients(selectedPatients.filter(p => p !== id));
        } else {
            setSelectedPatients([...selectedPatients, id]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!data.template_id) {
            alert('Please select a template');
            return;
        }
        
        if (isBulk) {
            if (selectedPatients.length === 0) {
                alert('Please select at least one patient');
                return;
            }
            
            // Store data and show modal
            setPendingSendData({ type: 'bulk', count: selectedPatients.length });
            setShowConfirmModal(true);
        } else {
            if (!data.patient_id) {
                alert('Please select a patient');
                return;
            }
            
            // Get patient name for modal
            const patient = patients.find(p => p.id === parseInt(data.patient_id));
            setPendingSendData({ type: 'single', patientName: patient?.full_name || 'Unknown' });
            setShowConfirmModal(true);
        }
    };

    const confirmSend = () => {
        setShowConfirmModal(false);
        
        if (pendingSendData.type === 'bulk') {
            post(route('sms.send-bulk'), {
                data: { ...data, patient_ids: selectedPatients },
                onSuccess: () => {
                    reset();
                    setSelectedPatients([]);
                    setCustomData({});
                    setPreviewMessage('');
                    setSelectedTemplate('');
                },
                onError: (errors) => {
                    console.error('SMS sending failed:', errors);
                }
            });
        } else {
            post(route('sms.send-to-patient'), {
                onSuccess: () => {
                    reset();
                    setCustomData({});
                    setPreviewMessage('');
                    setSelectedTemplate('');
                },
                onError: (errors) => {
                    console.error('SMS sending failed:', errors);
                }
            });
        }
        
        setPendingSendData(null);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-600" />;
        }
    };

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.full_name.toLowerCase().includes(searchPatient.toLowerCase()) ||
                            (p.contact_number && p.contact_number.includes(searchPatient));
        return matchesSearch && p.contact_number;
    });

    const filteredLogs = recentLogs.filter(log => {
        if (filterStatus === 'all') return true;
        return log.status === filterStatus;
    });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl mr-3">
                                <MessageSquare className="w-7 h-7 text-white" />
                            </div>
                            SMS Notifications
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 ml-14">Send SMS messages to your patients</p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href={route('sms.templates')}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center font-medium"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Manage Templates
                        </a>
                        <a
                            href={route('sms.logs')}
                            className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center font-medium"
                        >
                            <History className="w-4 h-4 mr-2" />
                            View Logs
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="SMS Notifications" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Patients</p>
                                    <p className="text-3xl font-bold mt-1">{patients.length}</p>
                                </div>
                                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                    <Users className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Active Templates</p>
                                    <p className="text-3xl font-bold mt-1">{templates.filter(t => t.is_active).length}</p>
                                </div>
                                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                    <FileText className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Recent SMS</p>
                                    <p className="text-3xl font-bold mt-1">{recentLogs.length}</p>
                                </div>
                                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Send SMS Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                            <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                                            Compose Message
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">Create and send SMS to your patients</p>
                                    </div>
                                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setIsBulk(false)}
                                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                                !isBulk 
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                                                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            <Users className="w-4 h-4 inline-block mr-2" />
                                            Single
                                        </button>
                                        <button
                                            onClick={() => setIsBulk(true)}
                                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                                isBulk 
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                                                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            <Users className="w-4 h-4 inline-block mr-2" />
                                            Bulk
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Template Selection */}
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200">
                                        <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                            <FileText className="w-4 h-4 mr-2 text-purple-600" />
                                            Select Message Template *
                                        </label>
                                        <select
                                            value={data.template_id}
                                            onChange={(e) => handleTemplateChange(e.target.value)}
                                            className="w-full rounded-xl border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base py-3"
                                            required
                                        >
                                            <option value="">Choose a template...</option>
                                            {templates.map(template => (
                                                <option key={template.id} value={template.id}>
                                                    {template.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.template_id && <p className="mt-2 text-sm text-red-600 font-medium">{errors.template_id}</p>}
                                    </div>

                                    {/* Patient Selection */}
                                    {!isBulk ? (
                                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                                            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-blue-600" />
                                                Select Patient *
                                            </label>
                                            <select
                                                value={data.patient_id}
                                                onChange={(e) => handlePatientChange(e.target.value)}
                                                className="w-full rounded-xl border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3"
                                                required
                                            >
                                                <option value="">Choose a patient...</option>
                                                {patients.map(patient => (
                                                    <option key={patient.id} value={patient.id}>
                                                        {patient.full_name} - {patient.contact_number || 'No phone'}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.patient_id && <p className="mt-2 text-sm text-red-600 font-medium">{errors.patient_id}</p>}
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="block text-sm font-semibold text-gray-900 flex items-center">
                                                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                                                    Select Patients *
                                                </label>
                                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                                                    {selectedPatients.length} selected
                                                </span>
                                            </div>
                                            
                                            {/* Search */}
                                            <div className="mb-3 relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search patients..."
                                                    value={searchPatient}
                                                    onChange={(e) => setSearchPatient(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 text-sm"
                                                />
                                            </div>
                                            
                                            <div className="max-h-56 overflow-y-auto bg-white border border-blue-300 rounded-xl p-3 space-y-2">
                                                {filteredPatients.map(patient => (
                                                    <label key={patient.id} className="flex items-center space-x-3 hover:bg-blue-50 p-3 rounded-lg cursor-pointer transition-colors group">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPatients.includes(patient.id)}
                                                            onChange={() => handlePatientSelect(patient.id)}
                                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{patient.full_name}</p>
                                                            <p className="text-xs text-gray-500">{patient.contact_number}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Custom Variables */}
                                    {selectedTemplate && selectedTemplate.variables && (
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                                                <Sparkles className="w-4 h-4 mr-2 text-amber-600" />
                                                Fill in Message Details
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedTemplate.variables.filter(v => 
                                                    !['patient_name', 'username', 'sender_name', 'login_url'].includes(v)
                                                ).map(variable => (
                                                    <div key={variable}>
                                                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                                                            {variable.replace(/_/g, ' ').toUpperCase()}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={customData[variable] || ''}
                                                            onChange={(e) => handleCustomDataChange(variable, e.target.value)}
                                                            className="w-full rounded-lg border-amber-300 text-sm py-2.5 focus:border-amber-500 focus:ring-amber-500"
                                                            placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {previewMessage && (
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 shadow-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-bold text-green-900 flex items-center">
                                                    <Eye className="w-5 h-5 mr-2" />
                                                    Message Preview
                                                </h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    previewMessage.length <= 160 
                                                        ? 'bg-green-200 text-green-800' 
                                                        : 'bg-orange-200 text-orange-800'
                                                }`}>
                                                    {previewMessage.length} / 160 chars
                                                </span>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 shadow-inner border border-green-200">
                                                <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">{previewMessage}</p>
                                            </div>
                                            {previewMessage.length > 160 && (
                                                <p className="text-xs text-orange-600 mt-3 font-medium flex items-center">
                                                    <span className="bg-orange-100 rounded-full p-1 mr-2">⚠️</span>
                                                    Message will be sent as {Math.ceil(previewMessage.length / 160)} SMS
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing || (!isBulk && !data.patient_id) || (isBulk && selectedPatients.length === 0)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        {processing ? 'Sending...' : (isBulk ? `Send to ${selectedPatients.length} Patients` : 'Send SMS Now')}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                        <History className="w-5 h-5 mr-2 text-gray-600" />
                                        Recent Activity
                                    </h3>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="text-xs rounded-lg border-gray-300 py-1 px-2"
                                    >
                                        <option value="all">All</option>
                                        <option value="sent">Sent</option>
                                        <option value="failed">Failed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {filteredLogs.length > 0 ? (
                                        filteredLogs.map(log => (
                                            <div key={log.id} className={`border-l-4 pl-4 py-3 rounded-r-lg transition-all duration-200 hover:shadow-md ${
                                                log.status === 'sent' ? 'border-green-500 bg-green-50 hover:bg-green-100' :
                                                log.status === 'failed' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                                                'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                                            }`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {log.user?.name || 'Unknown'}
                                                        </p>
                                                        <p className="text-xs text-gray-600 flex items-center mt-1">
                                                            <MessageSquare className="w-3 h-3 mr-1" />
                                                            {log.phone_number}
                                                        </p>
                                                        <p className="text-xs text-gray-700 mt-2 line-clamp-2 leading-relaxed">{log.message}</p>
                                                    </div>
                                                    <div className="ml-3 flex-shrink-0">
                                                        {getStatusIcon(log.status)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(log.created_at).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                        log.status === 'sent' ? 'bg-green-200 text-green-800' :
                                                        log.status === 'failed' ? 'bg-red-200 text-red-800' :
                                                        'bg-yellow-200 text-yellow-800'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500 font-medium">No recent activity</p>
                                            <p className="text-xs text-gray-400 mt-1">SMS logs will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setPendingSendData(null);
                }}
                onConfirm={confirmSend}
                title="Confirm SMS Sending"
                confirmText="Yes, Send SMS"
                confirmColor="blue"
            >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                        {pendingSendData?.type === 'bulk' 
                            ? `Send SMS to ${pendingSendData.count} patients?`
                            : `Send SMS to ${pendingSendData?.patientName}?`
                        }
                    </p>
                    {previewMessage && (
                        <div className="bg-white rounded-lg p-3 mt-3">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Message Preview:</p>
                            <p className="text-sm text-gray-900">{previewMessage}</p>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 text-center">
                    This action cannot be undone. The SMS will be sent immediately.
                </p>
            </ConfirmationModal>
        </AuthenticatedLayout>
    );
}

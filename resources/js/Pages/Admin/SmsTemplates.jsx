import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { FileText, Edit, Save, X, Plus, ToggleLeft, ToggleRight, ArrowLeft, AlertTriangle, Info, CheckCircle2, Eye } from 'lucide-react';

export default function SmsTemplates({ templates }) {
    const [editingId, setEditingId] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showPreview, setShowPreview] = useState(null);
    const [previewText, setPreviewText] = useState('');

    const { data: editData, setData: setEditData, put, processing: editProcessing } = useForm({
        template: '',
        label: '',
        description: '',
        is_active: true,
    });

    const { data: createData, setData: setCreateData, post, processing: createProcessing, reset } = useForm({
        name: '',
        label: '',
        template: '',
        description: '',
        variables: [],
    });

    const startEdit = (template) => {
        setEditingId(template.id);
        setEditData({
            template: template.template,
            label: template.label,
            description: template.description || '',
            is_active: template.is_active,
        });
        updatePreview(template.template);
    };

    const updatePreview = (message) => {
        const sampleData = {
            patient_name: 'Maria Santos',
            username: 'maria.santos',
            sender_name: 'Matcare',
            login_url: window.location.origin,
            password: 'sample123',
            appointment_date: 'August 15, 2026',
            appointment_time: '9:00 AM',
            visit_number: '3',
            next_visit_date: 'September 15, 2026',
            custom_message: 'Your test results are ready',
            child_name: 'Juan Santos',
            vaccine_name: 'BCG',
            scheduled_date: 'August 20, 2026',
        };

        let preview = message;
        Object.keys(sampleData).forEach(key => {
            preview = preview.replace(new RegExp(`{${key}}`, 'g'), sampleData[key]);
        });
        
        setPreviewText(preview);
    };

    const handleTemplateChange = (value) => {
        setEditData('template', value);
        updatePreview(value);
    };

    const validateTemplate = (template) => {
        const errors = [];
        
        // Check if template is empty
        if (!template || template.trim() === '') {
            errors.push('Message cannot be empty');
        }
        
        // Check for unmatched brackets
        const openBrackets = (template.match(/{/g) || []).length;
        const closeBrackets = (template.match(/}/g) || []).length;
        if (openBrackets !== closeBrackets) {
            errors.push('Unmatched curly brackets { }');
        }
        
        // Check length
        if (template.length > 500) {
            errors.push('Message is too long (max 500 characters)');
        }
        
        return errors;
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({
            template: '',
            label: '',
            description: '',
            is_active: true,
        });
    };

    const handleUpdate = (templateId) => {
        const errors = validateTemplate(editData.template);
        
        if (errors.length > 0) {
            alert('Template errors:\n' + errors.join('\n'));
            return;
        }
        
        if (!confirm('Are you sure you want to update this template? This will affect future SMS messages.')) {
            return;
        }
        
        put(route('sms.update-template', templateId), {
            onSuccess: () => cancelEdit(),
        });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        
        // Extract variables from template
        const variables = [...createData.template.matchAll(/\{(\w+)\}/g)].map(match => match[1]);
        
        post(route('sms.create-template'), {
            data: { ...createData, variables },
            onSuccess: () => {
                reset();
                setShowCreate(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            <FileText className="inline-block w-6 h-6 mr-2" />
                            SMS Message Templates
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your SMS message templates safely</p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={route('sms.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to SMS
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="SMS Templates" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Help Info Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">How to Use Templates</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Edit the <strong>message text</strong> to change what patients receive</li>
                                    <li>• Words in <span className="bg-yellow-100 px-1 rounded">yellow boxes</span> are automatic - they fill in patient information</li>
                                    <li>• <strong>Don't remove</strong> the words in curly brackets like {'{patient_name}'} - these are needed!</li>
                                    <li>• Turn templates <strong>ON/OFF</strong> to control which ones you can use</li>
                                    <li>• <strong>Preview</strong> shows you exactly how the message will look</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showCreate && (
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Create New Template</h3>
                                <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 flex items-center">
                                    <AlertTriangle className="w-4 h-4 text-yellow-700 mr-2" />
                                    <span className="text-sm text-yellow-800">Advanced Feature - Ask IT support if needed</span>
                                </div>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Template Name (Unique Identifier) *
                                        </label>
                                        <input
                                            type="text"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="e.g., custom_reminder"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Display Label *
                                        </label>
                                        <input
                                            type="text"
                                            value={createData.label}
                                            onChange={(e) => setCreateData('label', e.target.value)}
                                            className="w-full rounded-lg border-gray-300"
                                            placeholder="e.g., Custom Reminder"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Template Message * <span className="text-xs text-gray-500">(Use {'{variable_name}'} for dynamic content)</span>
                                    </label>
                                    <textarea
                                        value={createData.template}
                                        onChange={(e) => setCreateData('template', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                        rows="4"
                                        placeholder="Hi {patient_name}, this is a reminder... - {sender_name}"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Available variables: patient_name, username, sender_name, login_url, and any custom variables you define
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={createData.description}
                                        onChange={(e) => setCreateData('description', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                        rows="2"
                                        placeholder="Describe when this template should be used..."
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={createProcessing}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                                    >
                                        <Save className="inline-block w-4 h-4 mr-1" />
                                        Create Template
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreate(false);
                                            reset();
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                        <X className="inline-block w-4 h-4 mr-1" />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Templates List */}
                    <div className="space-y-4">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white rounded-xl shadow-lg p-6">
                                {editingId === template.id ? (
                                    // Edit Mode - User Friendly
                                    <div className="space-y-4">
                                        {/* Warning Banner */}
                                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                            <div className="flex items-start">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-yellow-900">Be Careful When Editing!</h4>
                                                    <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                                                        <li>• Don't delete words in <span className="bg-yellow-200 px-1 rounded">{'{curly brackets}'}</span> - they're automatic fields</li>
                                                        <li>• You can change regular words and add your own text</li>
                                                        <li>• Preview your changes before saving</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Template Name (what you'll see in the list)
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.label}
                                                onChange={(e) => setEditData('label', e.target.value)}
                                                className="w-full rounded-lg border-gray-300"
                                                placeholder="e.g., Appointment Reminder"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                                                <span>Message Text</span>
                                                <span className="text-xs text-gray-500">{editData.template.length} characters</span>
                                            </label>
                                            <textarea
                                                value={editData.template}
                                                onChange={(e) => handleTemplateChange(e.target.value)}
                                                className="w-full rounded-lg border-gray-300 font-mono text-sm"
                                                rows="5"
                                                placeholder="Type your message here..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                💡 Tip: Keep under 160 characters for one SMS
                                            </p>
                                        </div>

                                        {/* Live Preview */}
                                        {previewText && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Preview (How Maria Santos will see it):
                                                </p>
                                                <div className="bg-white rounded-lg p-3 border border-blue-300">
                                                    <p className="text-sm text-gray-900">{previewText}</p>
                                                </div>
                                                <p className="text-xs text-blue-600 mt-2">
                                                    {previewText.length > 160 ? (
                                                        <span className="text-orange-600 font-medium">⚠️ Over 160 chars - will send as 2 SMS</span>
                                                    ) : (
                                                        <span className="text-green-600 font-medium">✓ Good length</span>
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notes (optional - for your reference)
                                            </label>
                                            <textarea
                                                value={editData.description}
                                                onChange={(e) => setEditData('description', e.target.value)}
                                                className="w-full rounded-lg border-gray-300"
                                                rows="2"
                                                placeholder="e.g., Use this for reminding patients about their next checkup"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editData.is_active}
                                                    onChange={(e) => setEditData('is_active', e.target.checked)}
                                                    className="w-5 h-5 rounded border-gray-300 text-purple-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {editData.is_active ? 'Template is ON (you can use it)' : 'Template is OFF (hidden from list)'}
                                                </span>
                                            </label>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t">
                                            <button
                                                onClick={() => handleUpdate(template.id)}
                                                disabled={editProcessing}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium flex items-center"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium flex items-center"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode - User Friendly
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {template.label}
                                                    </h3>
                                                    {template.is_active ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                {template.description && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        <Info className="inline-block w-4 h-4 mr-1" />
                                                        {template.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        updatePreview(template.template);
                                                        setShowPreview(template.id);
                                                    }}
                                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Preview
                                                </button>
                                                <button
                                                    onClick={() => startEdit(template)}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit Message
                                                </button>
                                            </div>
                                        </div>

                                        {/* Message Content */}
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-3 border border-gray-200">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Message:</p>
                                            <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">{template.template}</p>
                                        </div>

                                        {/* Preview Popup */}
                                        {showPreview === template.id && (
                                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-lg font-semibold text-gray-900">Message Preview</h4>
                                                        <button
                                                            onClick={() => setShowPreview(null)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                        <p className="text-xs text-blue-600 mb-2">This is how the message will look to Maria Santos:</p>
                                                        <p className="text-sm text-gray-900 leading-relaxed">{previewText}</p>
                                                        <p className="text-xs text-blue-600 mt-2">Characters: {previewText.length}/160</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowPreview(null)}
                                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Close Preview
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Automatic Fields */}
                                        {template.variables && template.variables.length > 0 && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-yellow-800 mb-2 flex items-center">
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    Automatic Fields (Don't Remove These!)
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {template.variables.map(variable => (
                                                        <span key={variable} className="px-3 py-1 bg-yellow-100 text-yellow-900 text-xs rounded-full font-medium">
                                                            {'{' + variable + '}'} = {
                                                                variable === 'patient_name' ? 'Patient\'s Name' :
                                                                variable === 'username' ? 'Login Username' :
                                                                variable === 'sender_name' ? 'Your Health Center' :
                                                                variable === 'password' ? 'Login Password' :
                                                                variable === 'appointment_date' ? 'Appointment Date' :
                                                                variable === 'appointment_time' ? 'Appointment Time' :
                                                                variable === 'visit_number' ? 'Visit Number' :
                                                                variable === 'next_visit_date' ? 'Next Visit Date' :
                                                                variable === 'custom_message' ? 'Your Custom Text' :
                                                                variable
                                                            }
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React from 'react'
import { Icon } from '@iconify/react'

interface AnalyticsExportProps {
    /** Callback function triggered when export is requested */
    onExport: (format: 'pdf' | 'excel' | 'csv') => void
    /** Indicates if an export operation is in progress */
    loading: boolean
    /** Current selected period for the export */
    period: string
}

export default function AnalyticsExport({ onExport, loading, period }: AnalyticsExportProps) {
    // ─── Configuration ───────────────────────────────────────────────

    const formats = [
        { 
            id: 'pdf' as const, 
            label: 'PDF', 
            icon: 'mdi:file-pdf-box', 
            color: '#FF5A5A',
            description: 'Professional report'
        },
        { 
            id: 'excel' as const, 
            label: 'Excel', 
            icon: 'mdi:file-excel', 
            color: '#10B981',
            description: 'Spreadsheet format'
        },
        { 
            id: 'csv' as const, 
            label: 'CSV', 
            icon: 'mdi:file-delimited', 
            color: '#3B82F6',
            description: 'Comma separated values'
        },
    ]

    // ─── Helper Functions ────────────────────────────────────────────

    /**
     * Gets the loading spinner icon for the export button
     * Used when a specific format is being exported
     */
    const getLoadingSpinner = () => (
        <svg 
            className="animate-spin h-4 w-4" 
            viewBox="0 0 24 24"
        >
            <circle 
                className="opacity-25" 
                cx="12" cy="12" r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" 
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
        </svg>
    )

    // ─── Render ──────────────────────────────────────────────────────

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left side - Title and description */}
                <div>
                    <h3 className="text-sm font-medium text-white">Export Analytics</h3>
                    <p className="text-xs text-[#9A9A9A] mt-0.5">
                        Export your financial data for the selected period
                    </p>
                    <p className="text-[10px] text-[#6B7280] mt-1">
                        Period: <span className="text-[#9A9A9A]">{period.replace('_', ' ')}</span>
                    </p>
                </div>

                {/* Right side - Export buttons */}
                <div className="flex flex-wrap gap-2">
                    {formats.map((format) => (
                        <button
                            key={format.id}
                            onClick={() => onExport(format.id)}
                            disabled={loading}
                            className="group relative flex items-center gap-2 px-4 py-2 bg-[#171717] border border-[#242424] rounded-lg hover:border-[#5CB85C] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            title={format.description}
                        >
                            {/* Icon with tooltip-like behavior */}
                            <Icon 
                                icon={format.icon} 
                                className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" 
                                style={{ color: format.color }} 
                            />
                            <span className="text-sm text-white">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        {getLoadingSpinner()}
                                        Exporting...
                                    </span>
                                ) : (
                                    format.label
                                )}
                            </span>
                            
                            {/* Download badge */}
                            {!loading && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#5CB85C] animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer note */}
            <div className="mt-4 pt-4 border-t border-[#242424] flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280]">
                    📄 Exports include all data within the selected period
                </span>
                <span className="text-[10px] text-[#6B7280]">
                    {loading ? 'Processing...' : 'Ready to export'}
                </span>
            </div>
        </div>
    )
}
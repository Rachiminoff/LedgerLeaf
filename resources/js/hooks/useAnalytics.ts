// resources/js/hooks/useAnalytics.ts
import { useState } from 'react'
import axios from 'axios'

const API_URL = '/api'

export function useAnalytics() {
    // ─── State ──────────────────────────────────────────────────────

    /** Indicates if analytics data is currently being fetched */
    const [loading, setLoading] = useState(false)

    /** Indicates if an export operation is in progress */
    const [exporting, setExporting] = useState(false)

    /** Financial overview data (income, expenses, savings, remaining) */
    const [overview, setOverview] = useState(null)

    /** Daily spending trend data for the selected period */
    const [spendingTrend, setSpendingTrend] = useState([])

    /** Monthly comparison data (income vs expenses vs savings) */
    const [monthlyComparison, setMonthlyComparison] = useState([])

    /** Pocket breakdown data for spending distribution */
    const [pocketBreakdown, setPocketBreakdown] = useState({ data: [], total: 0 })

    /** Savings performance data (goals, progress, rate) */
    const [savingsPerformance, setSavingsPerformance] = useState(null)

    /** Generated financial insights based on user data */
    const [insights, setInsights] = useState([])

    /** Quick statistics (transactions, averages, extremes) */
    const [quickStats, setQuickStats] = useState(null)

    // ─── API Methods ─────────────────────────────────────────────────

    /**
     * Fetches analytics data from the server with optional filters
     * 
     * @param params - Filter parameters
     * @param params.period - Date range preset ('this_week', 'this_month', 'last_3_months', 'this_year', 'custom')
     * @param params.start_date - Start date for custom range (YYYY-MM-DD)
     * @param params.end_date - End date for custom range (YYYY-MM-DD)
     * @returns The analytics data from the server
     * @throws Error if the request fails
     */
    const fetchAnalytics = async (params: any = {}) => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/analytics/data`, { params })
            const data = response.data

            // Update all state variables with fetched data
            setOverview(data.overview)
            setSpendingTrend(data.spending_trend || [])
            setMonthlyComparison(data.monthly_comparison || [])
            setPocketBreakdown(data.pocket_breakdown || { data: [], total: 0 })
            setSavingsPerformance(data.savings_performance)
            setInsights(data.insights || [])
            setQuickStats(data.quick_stats)

            return data
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    /**
     * Exports analytics data in the specified format
     * 
     * @param format - Export format: 'pdf', 'excel', or 'csv'
     * @param params - Filter parameters to apply to the export
     * @param params.period - Date range preset
     * @param params.start_date - Start date for custom range
     * @param params.end_date - End date for custom range
     * @returns True if export was successful
     * @throws Error if the request fails
     */
    const exportData = async (format: 'pdf' | 'excel' | 'csv', params: any = {}) => {
        setExporting(true)
        try {
            // Build query string from filter parameters
            const queryParams = new URLSearchParams()
            
            if (params.period) {
                queryParams.append('period', params.period)
            }
            if (params.start_date) {
                queryParams.append('start_date', params.start_date)
            }
            if (params.end_date) {
                queryParams.append('end_date', params.end_date)
            }

            const queryString = queryParams.toString()
            const url = `${API_URL}/analytics/export/${format}${queryString ? `?${queryString}` : ''}`
            
            // Trigger download by opening in new tab
            // The server responds with the file as an attachment
            window.open(url, '_blank')
            
            return true
        } catch (error) {
            console.error(`Failed to export as ${format}:`, error)
            throw error
        } finally {
            setExporting(false)
        }
    }

    // ─── Return ──────────────────────────────────────────────────────

    return {
        // State
        loading,
        exporting,
        overview,
        spendingTrend,
        monthlyComparison,
        pocketBreakdown,
        savingsPerformance,
        insights,
        quickStats,

        // Methods
        fetchAnalytics,
        exportData,
    }
}
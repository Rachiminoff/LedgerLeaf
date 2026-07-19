import { useState } from 'react'
import axios from 'axios'

const API_URL = '/api'

export function useSavings() {
    const [goals, setGoals] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState(null)

    const fetchGoals = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/savings-goals`)
            setGoals(response.data.goals || [])
            setSummary(response.data.summary || null)
            setTransactions(response.data.recent_transactions || [])
        } catch (error) {
            console.error('Failed to fetch savings goals:', error)
        } finally {
            setLoading(false)
        }
    }

    const createGoal = async (data: any) => {
        const response = await axios.post(`${API_URL}/savings-goals`, data)
        return response.data
    }

    const updateGoal = async (id: number, data: any) => {
        const response = await axios.put(`${API_URL}/savings-goals/${id}`, data)
        return response.data
    }

    const archiveGoal = async (id: number) => {
        const response = await axios.patch(`${API_URL}/savings-goals/${id}/archive`)
        return response.data
    }

    const deleteGoal = async (id: number) => {
        const response = await axios.delete(`${API_URL}/savings-goals/${id}`)
        return response.data
    }

    const depositFunds = async (id: number, data: any) => {
        const response = await axios.post(`${API_URL}/savings-goals/${id}/deposit`, data)
        return response.data
    }

    const withdrawFunds = async (id: number, data: any) => {
        const response = await axios.post(`${API_URL}/savings-goals/${id}/withdraw`, data)
        return response.data
    }

    const fetchTransactions = async (filters: any = {}) => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/savings-goals/transactions`, { params: filters })
            setTransactions(response.data.data || [])
            return response.data
        } catch (error) {
            console.error('Failed to fetch transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        goals,
        transactions,
        loading,
        summary,
        fetchGoals,
        createGoal,
        updateGoal,
        archiveGoal,
        deleteGoal,
        depositFunds,
        withdrawFunds,
        fetchTransactions,
    }
}
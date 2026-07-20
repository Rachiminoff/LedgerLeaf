import React from 'react';
import { Icon } from '@iconify/react';

interface Summary {
    total: number;
    unread: number;
    budget_alerts: number;
    savings_milestones: number;
    monthly_insights: number;
}

interface Props {
    summary: Summary;
    unreadCount: number;
}

export default function NotificationSummary({ summary, unreadCount }: Props) {
    const stats = [
        {
            label: 'Unread',
            value: unreadCount,
            icon: 'mdi:email-open',
            color: '#5CB85C',
        },
        {
            label: 'Budget Alerts',
            value: summary.budget_alerts,
            icon: 'mdi:alert-circle',
            color: '#EF4444',
        },
        {
            label: 'Savings Updates',
            value: summary.savings_milestones,
            icon: 'mdi:target',
            color: '#8B5CF6',
        },
        {
            label: 'Monthly Insights',
            value: summary.monthly_insights,
            icon: 'mdi:calendar-month',
            color: '#F59E0B',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-[#111111] border border-[#242424] rounded-xl p-4"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <Icon
                            icon={stat.icon}
                            className="w-4 h-4"
                            style={{ color: stat.color }}
                        />
                        <span className="text-xs text-[#9A9A9A]">{stat.label}</span>
                    </div>
                    <p className="text-xl font-semibold text-white">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
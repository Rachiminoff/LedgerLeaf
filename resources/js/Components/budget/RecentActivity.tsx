interface RecentActivityProps {
    activities: any[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
                <p className="text-sm text-[#9A9A9A] text-center">No recent activity</p>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
            <h3 className="text-sm font-medium text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-[#242424] last:border-0">
                        <div className="flex-1">
                            <p className="text-sm text-white">{activity.description}</p>
                            <p className="text-xs text-[#9A9A9A]">
                                {new Date(activity.created_at).toLocaleString('en-PH', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-medium ${
                                activity.type === 'allocate' || activity.type === 'transfer_in'
                                    ? 'text-[#5CB85C]'
                                    : activity.type === 'transfer_out'
                                    ? 'text-[#F4B400]'
                                    : 'text-[#FF5A5A]'
                            }`}>
                                {activity.type === 'allocate' || activity.type === 'transfer_in' ? '+' : '-'}
                                {formatCurrency(activity.amount)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
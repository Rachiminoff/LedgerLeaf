export const actionLabels: Record<string, string> = {
    // Pocket Actions
    'create_pocket': 'Pocket Created',
    'update_pocket': 'Pocket Updated',
    'archive_pocket': 'Pocket Archived',
    'delete_pocket': 'Pocket Deleted',
    'restore_pocket': 'Pocket Restored',
    'refund_pocket': 'Pocket Refunded',
    'allocate_funds': 'Funds Allocated',
    'transfer_funds': 'Funds Transferred',
    'deduct_pocket': 'Pocket Deducted',

    // Expense Actions
    'create_expense': 'Expense Created',
    'update_expense': 'Expense Updated',
    'delete_expense': 'Expense Deleted',
    'archive_expense': 'Expense Archived',
    'restore_expense': 'Expense Restored',

    // Savings Actions (NEW)
    'create_savings_goal': 'Savings Goal Created',
    'update_savings_goal': 'Savings Goal Updated',
    'archive_savings_goal': 'Savings Goal Archived',
    'restore_savings_goal': 'Savings Goal Restored',
    'delete_savings_goal': 'Savings Goal Deleted',
    'deposit_savings': 'Savings Deposit',
    'withdraw_savings': 'Savings Withdrawal',

    // Account Actions
    'deposit': 'Fund Deposit',
    'update_profile': 'Profile Updated',
    'change_password': 'Password Changed',
};

export const actionCategories = [
    {
        id: 'pocket',
        label: 'Pocket Actions',
        actions: [
            'create_pocket',
            'update_pocket',
            'archive_pocket',
            'delete_pocket',
            'restore_pocket',
            'refund_pocket',
            'allocate_funds',
            'transfer_funds',
            'deduct_pocket',
        ],
    },
    {
        id: 'expense',
        label: 'Expense Actions',
        actions: [
            'create_expense',
            'update_expense',
            'delete_expense',
            'archive_expense',
            'restore_expense',
        ],
    },
    {
        id: 'savings',
        label: 'Savings Actions',
        actions: [
            'create_savings_goal',
            'update_savings_goal',
            'archive_savings_goal',
            'restore_savings_goal',
            'delete_savings_goal',
            'deposit_savings',
            'withdraw_savings',
        ],
    },
    {
        id: 'account',
        label: 'Account Actions',
        actions: [
            'deposit',
            'update_profile',
            'change_password',
        ],
    },
];

export const getActionBadgeColor = (action: string): string => {
    const colors: Record<string, string> = {
        // Pocket - Green tones
        'create_pocket': 'bg-[#5CB85C]/20 text-[#5CB85C]',
        'update_pocket': 'bg-[#3B82F6]/20 text-[#3B82F6]',
        'archive_pocket': 'bg-[#F59E0B]/20 text-[#F59E0B]',
        'delete_pocket': 'bg-[#EF4444]/20 text-[#EF4444]',
        'restore_pocket': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
        'refund_pocket': 'bg-[#10B981]/20 text-[#10B981]',
        'allocate_funds': 'bg-[#5CB85C]/20 text-[#5CB85C]',
        'transfer_funds': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
        'deduct_pocket': 'bg-[#EF4444]/20 text-[#EF4444]',

        // Expense - Red tones
        'create_expense': 'bg-[#EF4444]/20 text-[#EF4444]',
        'update_expense': 'bg-[#3B82F6]/20 text-[#3B82F6]',
        'delete_expense': 'bg-[#EF4444]/20 text-[#EF4444]',
        'archive_expense': 'bg-[#F59E0B]/20 text-[#F59E0B]',
        'restore_expense': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',

        // Savings - Purple/Blue tones
        'create_savings_goal': 'bg-[#5CB85C]/20 text-[#5CB85C]',
        'update_savings_goal': 'bg-[#3B82F6]/20 text-[#3B82F6]',
        'archive_savings_goal': 'bg-[#F59E0B]/20 text-[#F59E0B]',
        'restore_savings_goal': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
        'delete_savings_goal': 'bg-[#EF4444]/20 text-[#EF4444]',
        'deposit_savings': 'bg-[#5CB85C]/20 text-[#5CB85C]',
        'withdraw_savings': 'bg-[#F59E0B]/20 text-[#F59E0B]',

        // Account - Green tones
        'deposit': 'bg-[#5CB85C]/20 text-[#5CB85C]',
        'update_profile': 'bg-[#3B82F6]/20 text-[#3B82F6]',
        'change_password': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
    };

    return colors[action] || 'bg-[#242424]/20 text-[#9A9A9A]';
};
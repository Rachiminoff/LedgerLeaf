<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

/**
 * SummarySheet exports the financial summary data.
 */
class SummarySheet implements FromArray, WithHeadings, WithTitle
{
    /** @var array The export data */
    protected array $data;

    /**
     * Create a new SummarySheet instance.
     *
     * @param array $data The data to export
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Get the array representation of the summary data.
     *
     * @return array
     */
    public function array(): array
    {
        return [
            ['LedgerLeaf Analytics Report'],
            [''],
            ['Period', $this->data['period']['start'] . ' - ' . $this->data['period']['end']],
            ['Generated', $this->data['generated_at']],
            [''],
            ['Financial Summary'],
            ['Metric', 'Amount'],
            ['Total Income', number_format($this->data['summary']['total_income'] ?? 0, 2)],
            ['Total Expenses', number_format($this->data['summary']['total_expenses'] ?? 0, 2)],
            ['Total Savings', number_format($this->data['summary']['total_savings'] ?? 0, 2)],
            ['Safe Balance', number_format($this->data['summary']['safe_balance'] ?? 0, 2)],
            ['Net Balance', number_format($this->data['summary']['net_balance'] ?? 0, 2)],
        ];
    }

    /**
     * Get the sheet title.
     *
     * @return string
     */
    public function title(): string
    {
        return 'Summary';
    }

    /**
     * Get the column headings.
     *
     * @return array
     */
    public function headings(): array
    {
        return ['Metric', 'Amount'];
    }
}
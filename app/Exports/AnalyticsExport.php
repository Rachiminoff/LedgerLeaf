<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

/**
 * AnalyticsExport handles multi-sheet Excel exports for analytics data.
 */
class AnalyticsExport implements WithMultipleSheets
{
    /** @var array The export data */
    protected array $data;

    /**
     * Create a new AnalyticsExport instance.
     *
     * @param array $data The data to export
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Get the sheets for the export.
     *
     * @return array
     */
    public function sheets(): array
    {
        return [
            new SummarySheet($this->data),
            new ExpensesSheet($this->data),
            new SavingsSheet($this->data),
        ];
    }
}
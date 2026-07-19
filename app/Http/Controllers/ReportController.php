<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Redirect to Analytics page
     */
    public function index(Request $request)
    {
        return redirect()->route('analytics.index');
    }

    // Keep other methods if needed
    public function monthly(Request $request)
    {
        return redirect()->route('analytics.index');
    }

    public function yearly(Request $request)
    {
        return redirect()->route('analytics.index');
    }

    public function category(Request $request)
    {
        return redirect()->route('analytics.index');
    }

    public function exportCsv(Request $request)
    {
        // Keep CSV export logic
    }

    public function exportPdf(Request $request)
    {
        // Keep PDF export logic
    }
}
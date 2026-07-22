<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>LedgerLeaf Financial Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        
        .header h1 {
            font-size: 24px;
            color: #2c3e50;
            margin: 0 0 5px 0;
            font-weight: bold;
        }
        
        .header .subtitle {
            font-size: 14px;
            color: #7f8c8d;
            margin: 3px 0;
        }
        
        .header .period {
            font-size: 13px;
            color: #34495e;
            margin: 3px 0;
            font-weight: bold;
        }
        
        .header .user-info {
            font-size: 12px;
            color: #7f8c8d;
            margin: 3px 0;
        }
        
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            background-color: #f8f9fa;
            padding: 8px 12px;
            border-bottom: 2px solid #dee2e6;
            margin-bottom: 12px;
            color: #2c3e50;
        }
        
        .section-title .icon {
            margin-right: 8px;
        }
        
        .grid-4 {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        
        .grid-3 {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        
        .grid-2 {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        
        .stat-card {
            display: table-cell;
            background: #f8f9fa;
            padding: 10px 12px;
            border: 1px solid #dee2e6;
            vertical-align: top;
        }
        
        .grid-4 .stat-card {
            width: 25%;
        }
        
        .grid-3 .stat-card {
            width: 33.33%;
        }
        
        .grid-2 .stat-card {
            width: 50%;
        }
        
        .stat-label {
            font-size: 11px;
            color: #7f8c8d;
            margin-bottom: 3px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .stat-value {
            font-size: 16px;
            font-weight: bold;
        }
        
        .text-positive, .green {
            color: #27ae60;
        }
        
        .text-negative, .red {
            color: #e74c3c;
        }
        
        .text-neutral, .orange {
            color: #f39c12;
        }
        
        .blue {
            color: #3498db;
        }
        
        .gray {
            color: #6b7280;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .text-danger {
            color: #e74c3c;
        }
        
        .text-success {
            color: #27ae60;
        }
        
        .text-warning {
            color: #f39c12;
        }
        
        .font-bold {
            font-weight: bold;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        
        table th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #dee2e6;
            font-size: 11px;
            color: #2c3e50;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        table td {
            padding: 6px 10px;
            border: 1px solid #dee2e6;
            font-size: 12px;
        }
        
        table tr:nth-child(even) {
            background-color: #fafafa;
        }
        
        table tr:hover {
            background-color: #f0f0f0;
        }
        
        .total-row {
            font-weight: bold;
            background-color: #f8f9fa !important;
        }
        
        .total-row td {
            border-top: 2px solid #2c3e50;
        }
        
        .badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
        }
        
        .badge-success, .badge-completed {
            background: #d4edda;
            color: #155724;
        }
        
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .badge-danger {
            background: #f8d7da;
            color: #721c24;
        }
        
        .badge-healthy {
            background: #d4edda;
            color: #155724;
        }
        
        .badge-in-progress {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .color-dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 3px;
            margin-right: 5px;
            vertical-align: middle;
        }
        
        .text-muted {
            color: #7f8c8d;
        }
        
        .chart-container {
            padding: 15px 0;
        }
        
        .chart-bars {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 200px;
            padding: 10px 0;
        }
        
        .chart-bar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            height: 100%;
        }
        
        .chart-bar {
            width: 30px;
            min-height: 4px;
            border-radius: 3px;
            margin-top: auto;
            transition: height 0.3s ease;
        }
        
        .chart-bar-value {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 4px;
        }
        
        .chart-bar-label {
            font-size: 11px;
            color: #6b7280;
            margin-top: 6px;
            font-weight: 600;
        }
        
        .footer {
            text-align: center;
            font-size: 10px;
            color: #7f8c8d;
            border-top: 1px solid #dee2e6;
            padding-top: 15px;
            margin-top: 30px;
        }
        
        @media print {
            body {
                padding: 10px;
            }
            .stat-card {
                background: #f8f9fa !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .badge {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .color-dot {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .chart-bar {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LedgerLeaf Financial Report</h1>
        <p class="subtitle">Generated on: {{ $generated_at ?? now()->format('F j, Y g:i A') }}</p>
        <p class="period">Period: {{ $period['start'] ?? '' }} - {{ $period['end'] ?? '' }}</p>
        <p class="user-info">User: {{ $user->name ?? '' }} ({{ $user->email ?? '' }})</p>
    </div>

    @yield('content')

    <div class="footer">
        <p>Generated by LedgerLeaf Financial Management System</p>
        <p style="font-size: 9px; color: #adb5bd; margin-top: 5px;">
            This report is automatically generated and contains sensitive financial information.
            Please handle with care.
        </p>
    </div>
</body>
</html>
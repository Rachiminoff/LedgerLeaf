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
            font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #e5e7eb;
            padding: 30px 35px;
            background: #000000;
        }
        
        /* ===== HEADER ===== */
        .header {
            text-align: center;
            padding-bottom: 24px;
            margin-bottom: 32px;
            border-bottom: 1px solid #242424;
            position: relative;
        }
        
        .header .logo {
            font-size: 28px;
            font-weight: 300;
            color: #ffffff;
            letter-spacing: -0.5px;
            margin: 0;
        }
        
        .header .logo span {
            color: #5CB85C;
            font-weight: 500;
        }
        
        .header .tagline {
            font-size: 12px;
            color: #6B7280;
            margin: 2px 0 10px 0;
            font-weight: 300;
            letter-spacing: 1px;
        }
        
        .header .divider {
            width: 48px;
            height: 2px;
            background: #5CB85C;
            margin: 10px auto 14px auto;
            border-radius: 1px;
        }
        
        .header .meta-grid {
            display: table;
            width: 100%;
            max-width: 650px;
            margin: 10px auto 0 auto;
            border-collapse: collapse;
        }
        
        .header .meta-grid .meta-item {
            display: table-cell;
            padding: 8px 12px;
            text-align: center;
            font-size: 11px;
            color: #9A9A9A;
            background: #111111;
            border-radius: 8px;
            border: 1px solid #242424;
        }
        
        .header .meta-grid .meta-item .label {
            font-weight: 500;
            display: block;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #6B7280;
            margin-bottom: 2px;
        }
        
        .header .meta-grid .meta-item .value {
            font-weight: 500;
            font-size: 12px;
            color: #ffffff;
        }
        
        /* ===== SECTIONS ===== */
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 15px;
            font-weight: 500;
            color: #ffffff;
            padding: 8px 0 10px 0;
            border-bottom: 1px solid #242424;
            margin-bottom: 16px;
            letter-spacing: 0.3px;
        }
        
        .section-title .title-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            background: #5CB85C;
            color: #000000;
            border-radius: 4px;
            text-align: center;
            line-height: 24px;
            font-size: 12px;
            margin-right: 8px;
            font-weight: 700;
        }
        
        /* ===== STAT CARDS ===== */
        .stats-grid {
            display: table;
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px 0;
            margin: -5px 0 10px -5px;
        }
        
        .stats-grid-4 .stat-card {
            display: table-cell;
            width: 25%;
            padding: 14px 16px;
            background: #111111;
            border-radius: 10px;
            border: 1px solid #242424;
            vertical-align: top;
        }
        
        .stats-grid-3 .stat-card {
            display: table-cell;
            width: 33.33%;
            padding: 14px 16px;
            background: #111111;
            border-radius: 10px;
            border: 1px solid #242424;
            vertical-align: top;
        }
        
        .stats-grid-2 .stat-card {
            display: table-cell;
            width: 50%;
            padding: 14px 16px;
            background: #111111;
            border-radius: 10px;
            border: 1px solid #242424;
            vertical-align: top;
        }
        
        .stat-card .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #6B7280;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .stat-card .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
        }
        
        .stat-card .stat-value .currency {
            font-size: 14px;
            font-weight: 400;
            color: #6B7280;
        }
        
        /* ===== COLORS ===== */
        .text-positive, .green { color: #5CB85C; }
        .text-negative, .red { color: #FF5A5A; }
        .text-neutral, .orange { color: #FFB74D; }
        .blue { color: #3B82F6; }
        .gray { color: #6B7280; }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-danger { color: #FF5A5A; }
        .text-success { color: #5CB85C; }
        .text-warning { color: #FFB74D; }
        .font-bold { font-weight: 600; }
        
        /* ===== TABLE ===== */
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        
        table thead th {
            background: #111111;
            color: #9A9A9A;
            font-weight: 500;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 10px 12px;
            text-align: left;
            border: 1px solid #242424;
            border-bottom: 2px solid #242424;
        }
        
        table tbody td {
            padding: 9px 12px;
            border: 1px solid #242424;
            vertical-align: middle;
            color: #e5e7eb;
        }
        
        table tbody tr:nth-child(even) {
            background: #0a0a0a;
        }
        
        table tbody tr:hover {
            background: #1a1a1a;
        }
        
        table tbody tr.total-row {
            background: #111111 !important;
            font-weight: 600;
        }
        
        table tbody tr.total-row td {
            border-top: 2px solid #5CB85C;
            padding: 10px 12px;
            color: #ffffff;
        }
        
        .table-wrapper {
            overflow-x: auto;
            border-radius: 10px;
            border: 1px solid #242424;
        }
        
        /* ===== BADGES ===== */
        .badge {
            display: inline-block;
            padding: 2px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 500;
            text-align: center;
            letter-spacing: 0.3px;
        }
        
        .badge-success, .badge-completed {
            background: rgba(92, 184, 92, 0.15);
            color: #5CB85C;
        }
        
        .badge-warning {
            background: rgba(255, 183, 77, 0.15);
            color: #FFB74D;
        }
        
        .badge-danger {
            background: rgba(255, 90, 90, 0.15);
            color: #FF5A5A;
        }
        
        .badge-healthy {
            background: rgba(92, 184, 92, 0.15);
            color: #5CB85C;
        }
        
        .badge-in-progress {
            background: rgba(59, 130, 246, 0.15);
            color: #3B82F6;
        }
        
        /* ===== COLOR DOT ===== */
        .color-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
            vertical-align: middle;
            border: 1px solid rgba(255,255,255,0.05);
        }
        
        /* ===== CHART ===== */
        .chart-container {
            padding: 10px 0 5px 0;
        }
        
        .chart-bars {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 200px;
            padding: 10px 0;
            gap: 4px;
        }
        
        .chart-bar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            height: 100%;
        }
        
        .chart-bar {
            width: 28px;
            min-height: 4px;
            border-radius: 4px 4px 0 0;
            margin-top: auto;
            transition: height 0.3s ease;
            background: #5CB85C;
        }
        
        .chart-bar-value {
            font-size: 10px;
            color: #6B7280;
            margin-bottom: 4px;
            font-weight: 500;
        }
        
        .chart-bar-label {
            font-size: 10px;
            color: #6B7280;
            margin-top: 6px;
            font-weight: 500;
        }
        
        /* ===== EMPTY STATE ===== */
        .empty-state {
            text-align: center;
            padding: 30px 20px;
            color: #6B7280;
            background: #111111;
            border-radius: 10px;
            border: 1px dashed #242424;
        }
        
        .empty-state .empty-icon {
            font-size: 24px;
            margin-bottom: 8px;
            color: #6B7280;
        }
        
        .empty-state .empty-text {
            font-size: 13px;
            color: #9A9A9A;
        }
        
        /* ===== FOOTER ===== */
        .footer {
            margin-top: 30px;
            padding-top: 24px;
            border-top: 1px solid #242424;
            text-align: center;
        }
        
        .footer .footer-brand {
            font-weight: 500;
            font-size: 14px;
            color: #ffffff;
            letter-spacing: 0.3px;
        }
        
        .footer .footer-brand span {
            color: #5CB85C;
            font-weight: 600;
        }
        
        .footer .footer-divider {
            width: 32px;
            height: 2px;
            background: #242424;
            margin: 8px auto;
            border-radius: 1px;
        }
        
        .footer .footer-text {
            font-size: 10px;
            color: #6B7280;
            margin-top: 4px;
            line-height: 1.8;
        }
        
        .footer .footer-text .highlight {
            color: #9A9A9A;
        }
        
        /* ===== PRINT ===== */
        @media print {
            body { 
                padding: 15px; 
                background: #000000;
                color: #e5e7eb;
            }
            .stat-card { 
                background: #111111 !important; 
                border-color: #242424 !important;
            }
            .badge, .color-dot, .chart-bar { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
            }
            .section { page-break-inside: avoid; }
            table thead th { 
                background: #111111 !important; 
                border-color: #242424 !important;
            }
            table tbody td { border-color: #242424 !important; }
            .header .meta-grid .meta-item {
                background: #111111 !important;
                border-color: #242424 !important;
            }
            .table-wrapper { border-color: #242424 !important; }
        }
        
        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .stats-grid-4 .stat-card,
            .stats-grid-3 .stat-card,
            .stats-grid-2 .stat-card {
                display: block;
                width: 100%;
                margin-bottom: 8px;
            }
            .header .meta-grid .meta-item {
                display: block;
                width: 100%;
                padding: 4px 0;
            }
            .chart-bar { width: 20px; }
        }
    </style>
</head>
<body>
    {{-- Header --}}
    <div class="header">
        <h1 class="logo">Ledger<span>Leaf</span></h1>
        <p class="tagline">Smart Budgeting Made Simple</p>
        <div class="divider"></div>
        
        <div class="meta-grid">
            <div class="meta-item">
                <span class="label">Generated</span>
                <span class="value">{{ $generated_at ?? now()->format('F j, Y g:i A') }}</span>
            </div>
            <div class="meta-item">
                <span class="label">Period</span>
                <span class="value">{{ $period['start'] ?? '' }} - {{ $period['end'] ?? '' }}</span>
            </div>
            <div class="meta-item">
                <span class="label">Report For</span>
                <span class="value">{{ $user->name ?? 'User' }}</span>
            </div>
        </div>
    </div>

    {{-- Content --}}
    @yield('content')

    {{-- Footer --}}
    <div class="footer">
        <div class="footer-brand">Ledger<span>Leaf</span></div>
        <div class="footer-divider"></div>
        <div class="footer-text">
            This report is automatically generated and contains sensitive financial information.<br>
            <span class="highlight">Confidential &bull; For authorized use only</span>
        </div>
    </div>
</body>
</html>
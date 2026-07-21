<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="utf-8">
    <x-styles/>
    <style>
        body {
            padding: 0;
            margin: 0;
            font-family: 'Cairo', Roboto, sans-serif !important;
            direction: rtl;
            height: auto !important;
            display: block !important;
        }
        .certificate {
            /*height: 95mm;*/
            page-break-inside: avoid;
            padding: 5mm;
            box-sizing: border-box;
            border-bottom: 1px dashed #ccc;
            display: flex;
            flex-direction: column;
            gap:5mm;
        }
        .page-break {
            page-break-before: always;
            height: 0;
        }
        .certificate:last-child {
            border-bottom: none;
        }
        .cert-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px double black;
            padding-bottom: 3mm;
        }
        .cert-school-data {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .cert-school-data span {
            font-weight: bold;
            font-size: 11px;
            line-height: 1.3;
        }
        .cert-logo {
            flex: 1;
            text-align: left;
        }
        .cert-logo img {
            height: 32px;
            width: 32px;
        }
        .cert-student-name {
            text-align: center;
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 1mm;
        }
        .cert-table {
            width: 100%;
            border-collapse: collapse;
        }
        .cert-table th {
            background-color: #e0e0e0;
            font-size: 10px;
            padding: 1mm 2mm !important;
            border: 1px solid #666;
            text-align: center;
            font-weight: bold;
        }
        .cert-table td {
            font-size: 10px;
            padding: 0.8mm 2mm !important;
            border: 1px solid #666;
            text-align: center;
        }
        .cert-result {
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            margin-top: 1mm;
            padding: 1mm;
            border-top: 1px solid #999;
        }
        @media print {
            .certificate {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    @foreach ($students as $index => $student)
        @if ($index > 0 && $index % 3 === 0)
            <div class="page-break"></div>
        @endif
        <div class="certificate">
            <div class="cert-header">
                <div class="cert-school-data">
                    <span>{{ config('app.school_data.governorate') }}</span>
                    <span>{{ config('app.school_data.administration') }}</span>
                    <span>{{ config('app.school_data.name') }}</span>
                </div>
                <div style="flex:1;text-align:center;font-weight:bold;font-size:14px">شهادة درجات</div>
                <div class="cert-logo">
                    @php $logo = public_path('logo.svg'); @endphp
                    @inlinedImage($logo)
                </div>
            </div>

            <div class="cert-student-name">
                الطالب / {{ $student['name'] }}
                <span style="display:block;font-size:11px;font-weight:normal;color:#555;margin-top:2mm">
                    {{ $student['grade_name'] }} — {{ $student['classroom_name'] ?? '—' }}
                </span>
                <span style="display:block;font-size:10px;font-weight:normal;color:#777;margin-top:1mm">
                    العام الدراسي: {{ $student['academic_year'] }}
                    | رقم الجلوس: {{ $student['seat_number'] ?? '—' }}
                    | التقدير: {{ $student['grade_label'] }}
                </span>
            </div>

            @php
                $mainSubjects = collect($student['subjects'])->where('added_to_total', true)->values();
                $extraSubjects = collect($student['subjects'])->where('added_to_total', false)->values();
                $isBoth = ($semester ?? 'both') === 'both';
            @endphp
            <table class="cert-table">
                <thead>
                    <tr>
                        <th style="width:26%">المادة</th>
                        @foreach ($mainSubjects as $subject)
                            <th colspan="{{ $isBoth ? 2 : 1 }}">{{ $subject['name'] }}</th>
                        @endforeach
                        <th style="background-color:#f0f0f0">المجموع</th>
                        @foreach ($extraSubjects as $subject)
                            <th colspan="{{ $isBoth ? 2 : 1 }}">{{ $subject['name'] }}</th>
                        @endforeach
                    </tr>
                    @if ($isBoth)
                    <tr>
                        <th style="width:26%;font-size:9px;color:#555">الفصل الدراسي</th>
                        @foreach ($mainSubjects as $subject)
                            <th style="font-size:9px;color:#555">الأول</th>
                            <th style="font-size:9px;color:#555">الثاني</th>
                        @endforeach
                        <th style="background-color:#f0f0f0"></th>
                        @foreach ($extraSubjects as $subject)
                            <th style="font-size:9px;color:#555">الأول</th>
                            <th style="font-size:9px;color:#555">الثاني</th>
                        @endforeach
                    </tr>
                    @endif
                </thead>
                <tbody>
                    <tr>
                        <th style="background-color:#f0f0f0;font-weight:bold">الدرجة الصغرى</th>
                        @foreach ($mainSubjects as $subject)
                            @if ($isBoth)
                                <td>{{ $subject['first']['min'] }}</td>
                                <td>{{ $subject['second']['min'] }}</td>
                            @else
                                <td>{{ $subject['min'] }}</td>
                            @endif
                        @endforeach
                        <th style="background-color:#f0f0f0;font-weight:bold">{{ $student['total_min'] }}</th>
                        @foreach ($extraSubjects as $subject)
                            @if ($isBoth)
                                <td>{{ $subject['first']['min'] }}</td>
                                <td>{{ $subject['second']['min'] }}</td>
                            @else
                                <td>{{ $subject['min'] }}</td>
                            @endif
                        @endforeach
                    </tr>
                    <tr>
                        <th style="background-color:#f0f0f0;font-weight:bold">الدرجة العظمى</th>
                        @foreach ($mainSubjects as $subject)
                            @if ($isBoth)
                                <td>{{ $subject['first']['max'] }}</td>
                                <td>{{ $subject['second']['max'] }}</td>
                            @else
                                <td>{{ $subject['max'] }}</td>
                            @endif
                        @endforeach
                        <th style="background-color:#f0f0f0;font-weight:bold">{{ $student['total_max'] }}</th>
                        @foreach ($extraSubjects as $subject)
                            @if ($isBoth)
                                <td>{{ $subject['first']['max'] }}</td>
                                <td>{{ $subject['second']['max'] }}</td>
                            @else
                                <td>{{ $subject['max'] }}</td>
                            @endif
                        @endforeach
                    </tr>
                    <tr>
                        <th style="background-color:#f0f0f0;font-weight:bold">الدرجة</th>
                        @foreach ($mainSubjects as $subject)
                            @if ($isBoth)
                                <td style="font-weight:bold">{{ $subject['first']['marks'] ?? '—' }}</td>
                                <td style="font-weight:bold">{{ $subject['second']['marks'] ?? '—' }}</td>
                            @else
                                <td style="font-weight:bold">{{ $subject['marks'] ?? '—' }}</td>
                            @endif
                        @endforeach
                        <th style="background-color:#f0f0f0;font-weight:bold">{{ $student['total_marks'] }}</th>
                        @foreach ($extraSubjects as $subject)
                            @if ($isBoth)
                                <td style="font-weight:bold">{{ $subject['first']['marks'] ?? '—' }}</td>
                                <td style="font-weight:bold">{{ $subject['second']['marks'] ?? '—' }}</td>
                            @else
                                <td style="font-weight:bold">{{ $subject['marks'] ?? '—' }}</td>
                            @endif
                        @endforeach
                    </tr>
                    <tr>
                        <th style="background-color:#f0f0f0;font-weight:bold">التقدير</th>
                        @foreach ($mainSubjects as $subject)
                            @if ($isBoth)
                                <td style="font-weight:bold">{{ $subject['first']['grade_label'] }}</td>
                                <td style="font-weight:bold">{{ $subject['second']['grade_label'] }}</td>
                            @else
                                <td style="font-weight:bold">{{ $subject['grade_label'] }}</td>
                            @endif
                        @endforeach
                        <th style="background-color:#f0f0f0;font-weight:bold">{{ $student['grade_label'] }}</th>
                        @foreach ($extraSubjects as $subject)
                            @if ($isBoth)
                                <td style="font-weight:bold">{{ $subject['first']['grade_label'] }}</td>
                                <td style="font-weight:bold">{{ $subject['second']['grade_label'] }}</td>
                            @else
                                <td style="font-weight:bold">{{ $subject['grade_label'] }}</td>
                            @endif
                        @endforeach
                    </tr>
                </tbody>
            </table>

            @if (($semester ?? 'both') !== 'الأول' && $student['category'] !== 'graduated')
            <div class="cert-result">
                {{ $student['category_text'] }}
            </div>
            @endif
        </div>
    @endforeach
</body>
</html>

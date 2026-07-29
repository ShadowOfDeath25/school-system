@php
    $isExcel = $excel ?? false;
    $isDetailed = $detailed ?? true;
    $marksColumns = $isDetailed
        ? collect($subjects)->sum(fn ($subject) => count($subject['components'])) * 2
        : count($subjects) * 2;
    $border = $isExcel ? 'border:1px solid #999;' : '';
@endphp

<table @if ($isExcel) style="border-collapse:collapse;border:1px solid #999" @else class="table table-bordered" style="margin-top:10px;font-size:11px" @endif>
    <thead>
        <tr>
            <th colspan="{{ 3 + $marksColumns }}" style="font-weight:bold;text-align:center;{{ $border }}{{ $isExcel ? 'background-color:#d0d0d0;' : '' }}">{{ $reportTitle }} — نسخة أسماء الألوان</th>
        </tr>
        <tr>
            <th rowspan="2" style="vertical-align:middle;{{ $border }}">الطالب</th>
            <th rowspan="2" style="vertical-align:middle;{{ $border }}">رقم الجلوس</th>
            <th rowspan="2" style="vertical-align:middle;{{ $border }}">الفصل الدراسي</th>
            @foreach ($subjects as $subject)
                @if ($isDetailed)
                    <th colspan="{{ count($subject['components']) * 2 }}" style="{{ $border }}">{{ $subject['name'] }} ({{ $subject['max'] }})</th>
                @else
                    <th colspan="2" style="{{ $border }}">{{ $subject['name'] }} ({{ $subject['max'] }})</th>
                @endif
            @endforeach
        </tr>
        <tr>
            @foreach ($subjects as $subject)
                @if ($isDetailed)
                    @foreach ($subject['components'] as $component)
                        <th style="{{ $border }}">{{ $component['name'] }} ({{ $component['marks'] }})</th>
                        <th style="{{ $border }}">اللون</th>
                    @endforeach
                @else
                    <th style="{{ $border }}">الدرجة</th>
                    <th style="{{ $border }}">اللون</th>
                @endif
            @endforeach
        </tr>
    </thead>
    <tbody>
        @forelse ($students as $student)
            <tr>
                <td style="{{ $border }}">{{ $student['name'] }}</td>
                <td style="text-align:center;{{ $border }}">{{ $student['seat_number'] ?? '—' }}</td>
                <td style="text-align:center;{{ $border }}">{{ $student['classroom_name'] ?? '—' }}</td>
                @foreach ($student['marks'] as $mark)
                    <td style="text-align:center;font-weight:bold;{{ $border }}">{{ $mark['display'] }}</td>
                    <td style="text-align:center;font-weight:bold;{{ $border }}">{{ $mark['color_name'] }}</td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ 3 + $marksColumns }}" style="text-align:center;color:#7f8c8d;{{ $border }}">لا توجد بيانات</td>
            </tr>
        @endforelse
    </tbody>
</table>

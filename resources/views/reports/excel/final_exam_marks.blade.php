<table style="border-collapse:collapse;border:1px solid #999">
    <thead>
        <tr>
            <th colspan="{{ $totals['columns_count'] ?? count($subjects) + 2 }}" style="font-weight:bold;background-color:#d0d0d0;text-align:center;border:1px solid #999">
                نتائج امتحانات نهاية الفصل — {{ $grade_name }} — {{ $language }}
                — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
                — {{ $academic_year }}
            </th>
        </tr>
        <tr>
            <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">الطالب</th>
            <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">رقم الجلوس</th>
            <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">الفصل الدراسي</th>
            @foreach ($subjects as $subj)
                <th colspan="{{ count($subj['components']) }}" style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">{{ $subj['name'] }}</th>
            @endforeach
        </tr>
        <tr>
            <th style="border:1px solid #999"></th>
            <th style="border:1px solid #999"></th>
            <th style="border:1px solid #999"></th>
            @foreach ($subjects as $subj)
                @foreach ($subj['components'] as $comp)
                    <th style="font-weight:bold;text-align:center;background-color:#f0f0f0;border:1px solid #999">{{ $comp['name'] }} ({{ $comp['marks'] }})</th>
                @endforeach
            @endforeach
        </tr>
    </thead>
    <tbody>
        @forelse ($students as $student)
            <tr>
                <td style="border:1px solid #999">{{ $student['name'] }}</td>
                <td style="text-align:center;border:1px solid #999">{{ $student['seat_number'] ?? '—' }}</td>
                <td style="text-align:center;border:1px solid #999">{{ $student['classroom_name'] ?? '—' }}</td>
                @foreach ($student['marks'] as $mark)
                    <td style="text-align:center;background-color:{{ $mark['color'] }};color:#fff;font-weight:bold;border:1px solid #999">{{ $mark['display'] }}</td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ $totals['columns_count'] ?? count($subjects) + 2 }}" style="text-align:center;color:#999;border:1px solid #999">لا توجد بيانات</td>
            </tr>
        @endforelse
    </tbody>
</table>

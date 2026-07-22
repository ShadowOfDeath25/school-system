<table style="border-collapse:collapse;border:1px solid #999">
    <thead>
        <tr>
            <th colspan="{{ count($subjects) * 3 + 2 }}" style="font-weight:bold;background-color:#d0d0d0;text-align:center;border:1px solid #999">
                احصائيات الفصول — {{ $grade_name }} — {{ $language }}
                — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
                — {{ $academic_year }}
            </th>
        </tr>
        <tr>
            <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">الفصل</th>
            <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">مقيد</th>
            @foreach ($subjects as $subj)
                <th colspan="3" style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999;text-align:center">{{ $subj['name'] }} ({{ $subj['max'] }})</th>
            @endforeach
        </tr>
        <tr>
            <th style="border:1px solid #999"></th>
            <th style="border:1px solid #999"></th>
            @foreach ($subjects as $subj)
                <th style="font-weight:bold;text-align:center;background-color:#f0f0f0;border:1px solid #999">حاضر</th>
                <th style="font-weight:bold;text-align:center;background-color:#f0f0f0;border:1px solid #999">ناجح</th>
                <th style="font-weight:bold;text-align:center;background-color:#f0f0f0;border:1px solid #999">نسبة النجاح</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @forelse ($classrooms as $classroom)
            <tr>
                <td style="border:1px solid #999">{{ $classroom['name'] }}</td>
                <td style="text-align:center;border:1px solid #999">{{ $classroom['total_students'] }}</td>
                @foreach ($classroom['subject_stats'] as $stat)
                    <td style="text-align:center;border:1px solid #999">{{ $stat['attempted'] }}</td>
                    <td style="text-align:center;border:1px solid #999">{{ $stat['succeeded'] }}</td>
                    <td style="text-align:center;font-weight:bold;border:1px solid #999">{{ $stat['percentage'] }}%</td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ count($subjects) * 3 + 2 }}" style="text-align:center;color:#999;border:1px solid #999">لا توجد بيانات</td>
            </tr>
        @endforelse
        @if (isset($totals_row))
            <tr style="font-weight:bold;background:#f0f0f0">
                <td style="border:1px solid #999">{{ $totals_row['name'] }}</td>
                <td style="text-align:center;border:1px solid #999">{{ $totals_row['total_students'] }}</td>
                @foreach ($totals_row['subject_stats'] as $stat)
                    <td style="text-align:center;border:1px solid #999">{{ $stat['attempted'] }}</td>
                    <td style="text-align:center;border:1px solid #999">{{ $stat['succeeded'] }}</td>
                    <td style="text-align:center;font-weight:bold;border:1px solid #999">{{ $stat['percentage'] }}%</td>
                @endforeach
            </tr>
        @endif
    </tbody>
</table>

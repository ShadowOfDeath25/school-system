<table style="border-collapse:collapse;border:1px solid #999">
    <thead>
        <tr>
            <th colspan="6" style="font-weight:bold;background-color:#d0d0d0;text-align:center;border:1px solid #999">
                جدول امتحانات نهاية الفصل — {{ $language }}
                — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
                — {{ $academic_year }}
            </th>
        </tr>
    </thead>
    <tbody>
        @forelse ($grades as $grade)
            <tr>
                <td colspan="6" style="font-weight:bold;text-align:right;border:1px solid #999;background-color:#f0f0f0">
                    {{ $grade['grade_name'] }} — إجمالي الامتحانات: {{ $grade['total_exams'] }}
                </td>
            </tr>
            <tr>
                <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999;text-align:center">م</th>
                <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999;text-align:center">المادة</th>
                <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999;text-align:center">التاريخ</th>
                <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999;text-align:center">اليوم</th>
                <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999;text-align:center">الوقت</th>
                <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999;text-align:center">المدة (ساعات)</th>
            </tr>
            @foreach ($grade['exams'] as $exam)
                <tr>
                    <td style="text-align:center;border:1px solid #999">{{ $exam['index'] }}</td>
                    <td style="text-align:center;border:1px solid #999">{{ $exam['subject_name'] }}</td>
                    <td style="text-align:center;border:1px solid #999">{{ \Carbon\Carbon::parse($exam['date'])->format('Y-m-d') }}</td>
                    <td style="text-align:center;border:1px solid #999">{{ $exam['day'] }}</td>
                    <td style="text-align:center;border:1px solid #999">{{ $exam['time'] }}</td>
                    <td style="text-align:center;border:1px solid #999">{{ number_format($exam['duration'], 1) }}</td>
                </tr>
            @endforeach
        @empty
            <tr>
                <td colspan="6" style="text-align:center;color:#999;border:1px solid #999">لا توجد بيانات</td>
            </tr>
        @endforelse
    </tbody>
</table>

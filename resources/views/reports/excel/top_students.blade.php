<table style="border-collapse:collapse;border:1px solid #999">
    <tr>
        <th colspan="5" style="font-weight:bold;background-color:#d0d0d0;text-align:center;border:1px solid #999;font-size:16px">
            أوائل الطلاب — {{ $level }} — {{ $language }}
            @if ($semester !== 'both')
                — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
            @endif
            — {{ $academic_year }}
        </th>
    </tr>
</table>

@forelse ($grades as $gradeData)
    <table style="border-collapse:collapse;border:1px solid #999;margin-top:10px">
        <tr>
            <th colspan="5" style="font-weight:bold;background-color:#e0e0e0;text-align:center;border:1px solid #999;font-size:14px">
                {{ $gradeData['grade_name'] }} — المجموع الكلي: {{ $gradeData['max_score'] }}
            </th>
        </tr>
        <tr>
            <th style="font-weight:bold;background-color:#f0f0f0;border:1px solid #999;width:50px">الرتبة</th>
            <th style="font-weight:bold;background-color:#f0f0f0;border:1px solid #999">اسم الطالب</th>
            <th style="font-weight:bold;background-color:#f0f0f0;border:1px solid #999;width:80px">رقم الجلوس</th>
            <th style="font-weight:bold;background-color:#f0f0f0;border:1px solid #999;width:100px">الفصل</th>
            <th style="font-weight:bold;background-color:#f0f0f0;border:1px solid #999;width:100px">المجموع / {{ $gradeData['max_score'] }}</th>
        </tr>
        @foreach ($gradeData['students'] as $student)
            <tr>
                <td style="text-align:center;border:1px solid #999;font-weight:bold">{{ $student['rank'] }}@if($student['is_repeated'] ?? false) (مكرر)@endif</td>
                <td style="border:1px solid #999">{{ $student['name'] }}</td>
                <td style="text-align:center;border:1px solid #999">{{ $student['seat_number'] ?? '—' }}</td>
                <td style="text-align:center;border:1px solid #999">{{ $student['classroom_name'] ?? '—' }}</td>
                <td style="text-align:center;border:1px solid #999;font-weight:bold">{{ $student['total_score'] }}</td>
            </tr>
        @endforeach
    </table>
@empty
    <table style="border-collapse:collapse;border:1px solid #999;margin-top:10px">
        <tr>
            <td style="text-align:center;color:#999;border:1px solid #999;padding:20px">لا توجد بيانات</td>
        </tr>
    </table>
@endforelse

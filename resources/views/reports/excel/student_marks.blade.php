<table style="border-collapse:collapse;border:1px solid #999">
    <thead>
        <tr>
            <th colspan="{{ count($subjects) + 2 }}" style="font-weight:bold;background-color:#d0d0d0;text-align:center;border:1px solid #999">
                كشف درجات الطلاب — {{ $grade_name }} — {{ $language }}
                @if ($semester !== 'both')
                    — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
                @endif
                — {{ $academic_year }}
            </th>
        </tr>
        <tr>
            <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">الطالب</th>
            <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">رقم الجلوس</th>
            @foreach ($subjects as $subj)
                <th style="font-weight:bold;background-color:#e0e0e0;border:1px solid #999">{{ $subj['name'] }}</th>
            @endforeach
        </tr>
        <tr>
            <th style="border:1px solid #999"></th>
            <th style="border:1px solid #999"></th>
            @foreach ($subjects as $subj)
                <th style="font-weight:bold;text-align:center;background-color:#f0f0f0;border:1px solid #999">{{ $subj['max'] }}</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @forelse ($students as $student)
            <tr>
                <td style="border:1px solid #999">{{ $student['name'] }}</td>
                <td style="text-align:center;border:1px solid #999">{{ $student['seat_number'] ?? '—' }}</td>
                @foreach ($student['marks'] as $mark)
                    <td style="text-align:center;background-color:{{ $mark['color'] }};color:#fff;font-weight:bold;border:1px solid #999">{{ $mark['display'] }}</td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ count($subjects) + 2 }}" style="text-align:center;color:#999;border:1px solid #999">لا توجد بيانات</td>
            </tr>
        @endforelse
    </tbody>
</table>

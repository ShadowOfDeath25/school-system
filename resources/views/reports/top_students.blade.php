<x-styles/>

<x-pdf-header>
    <h3>أوائل الطلاب</h3>
    <p style="margin:4px 0 0;font-size:13px">
        {{ $level }} — {{ $language }}
        @if ($semester !== 'both')
            — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
        @endif
        — العام: {{ $academic_year }}
    </p>
</x-pdf-header>

@forelse ($grades as $gradeData)
    <div style="margin-top:20px">
        <h4 style="margin:0 0 8px;font-size:14px">
            {{ $gradeData['grade_name'] }} — المجموع الكلي: {{ $gradeData['max_score'] }}
        </h4>

        <table class="table table-bordered" style="font-size:12px">
            <thead>
                <tr>
                    <th style="width:50px">الرتبة</th>
                    <th>اسم الطالب</th>
                    <th style="width:80px">رقم الجلوس</th>
                    <th style="width:100px">الفصل</th>
                    <th style="width:100px">المجموع / {{ $gradeData['max_score'] }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($gradeData['students'] as $student)
                    <tr>
                        <td style="text-align:center;font-weight:bold">{{ $student['rank'] }}@if($student['is_repeated'] ?? false) <small style="color:#e74c3c">(مكرر)</small>@endif</td>
                        <td>{{ $student['name'] }}</td>
                        <td style="text-align:center">{{ $student['seat_number'] ?? '—' }}</td>
                        <td style="text-align:center">{{ $student['classroom_name'] ?? '—' }}</td>
                        <td style="text-align:center;font-weight:bold">{{ $student['total_score'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@empty
    <p style="text-align:center;color:#7f8c8d;margin-top:40px">لا توجد بيانات</p>
@endforelse

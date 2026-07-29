<x-styles/>

<x-pdf-header>
    <h3>جدول امتحانات نهاية الفصل</h3>
    <p style="margin:4px 0 0;font-size:13px">
        {{ $language }}
        — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
        — العام: {{ $academic_year }}
    </p>
</x-pdf-header>

@forelse ($grades as $grade)
    <div style="font-weight:bold;font-size:15px;text-align:right;padding:8px;margin-top:15px;">
        {{ $grade['grade_name'] }} — إجمالي الامتحانات: {{ $grade['total_exams'] }}
    </div>
    <table class="table table-bordered" style="margin-top:5px;font-size:12px">
        <thead>
            <tr>
                <th style="width:40px">م</th>
                <th>المادة</th>
                <th style="width:100px">التاريخ</th>
                <th style="width:80px">اليوم</th>
                <th style="width:70px">الوقت</th>
                <th style="width:80px">المدة (ساعات)</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($grade['exams'] as $exam)
                <tr>
                    <td style="text-align:center">{{ $exam['index'] }}</td>
                    <td>{{ $exam['subject_name'] }}</td>
                    <td style="text-align:center">{{ \Carbon\Carbon::parse($exam['date'])->format('Y-m-d') }}</td>
                    <td style="text-align:center">{{ $exam['day'] }}</td>
                    <td style="text-align:center">{{ $exam['time'] }}</td>
                    <td style="text-align:center">{{ number_format($exam['duration'], 1) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@empty
    <table class="table table-bordered" style="margin-top:10px;font-size:12px">
        <tbody>
            <tr>
                <td style="text-align:center;color:#7f8c8d">
                    لا توجد بيانات
                </td>
            </tr>
        </tbody>
    </table>
@endforelse

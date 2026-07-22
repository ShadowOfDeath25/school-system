<x-styles/>

<x-pdf-header>
    <h3>احصائيات الفصول</h3>
    <p style="margin:4px 0 0;font-size:13px">
        {{ $grade_name }} — {{ $language }}
        — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
        — العام: {{ $academic_year }}
    </p>
</x-pdf-header>

<table class="table table-bordered" style="margin-top:10px;font-size:12px">
    <thead>
        <tr>
            <th rowspan="2" style="vertical-align:middle">الفصل</th>
            <th rowspan="2" style="vertical-align:middle">مقيد</th>
            @foreach ($subjects as $subj)
                <th colspan="3" style="text-align:center">
                    {{ $subj['name'] }}<br><small>({{ $subj['max'] }})</small>
                </th>
            @endforeach
        </tr>
        <tr>
            @foreach ($subjects as $subj)
                <th style="font-size:11px">حاضر</th>
                <th style="font-size:11px">ناجح</th>
                <th style="font-size:11px">%</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @forelse ($classrooms as $classroom)
            <tr>
                <td>{{ $classroom['name'] }}</td>
                <td style="text-align:center">{{ $classroom['total_students'] }}</td>
                @foreach ($classroom['subject_stats'] as $stat)
                    <td style="text-align:center">{{ $stat['attempted'] }}</td>
                    <td style="text-align:center">{{ $stat['succeeded'] }}</td>
                    <td style="text-align:center;font-weight:bold">{{ $stat['percentage'] }}%</td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ count($subjects) * 3 + 2 }}" style="text-align:center;color:#7f8c8d">
                    لا توجد بيانات
                </td>
            </tr>
        @endforelse
        @if (isset($totals_row))
            <tr style="font-weight:bold;background:#f0f0f0">
                <td>{{ $totals_row['name'] }}</td>
                <td style="text-align:center">{{ $totals_row['total_students'] }}</td>
                @foreach ($totals_row['subject_stats'] as $stat)
                    <td style="text-align:center">{{ $stat['attempted'] }}</td>
                    <td style="text-align:center">{{ $stat['succeeded'] }}</td>
                    <td style="text-align:center;font-weight:bold">{{ $stat['percentage'] }}%</td>
                @endforeach
            </tr>
        @endif
    </tbody>
</table>

<x-styles/>

<x-pdf-header>
    <h3>كشف درجات الطلاب</h3>
    <p style="margin:4px 0 0;font-size:13px">
        {{ $grade_name }} — {{ $language }}
        @if ($semester !== 'both')
            — الفصل {{ $semester === 'الأول' ? 'الدراسي الأول' : 'الدراسي الثاني' }}
        @endif
        — العام: {{ $academic_year }}
    </p>
</x-pdf-header>

<table class="table table-bordered" style="margin-top:10px;font-size:12px">
    <thead>
        @if ($detailed ?? false)
            <tr>
                <th rowspan="2" style="vertical-align:middle">الطالب</th>
                <th rowspan="2" style="vertical-align:middle">رقم الجلوس</th>
                <th rowspan="2" style="vertical-align:middle">الفصل الدراسي</th>
                @foreach ($subjects as $subj)
                    <th colspan="{{ count($subj['components']) }}">
                        {{ $subj['name'] }}<br><small>({{ $subj['max'] }})</small>
                    </th>
                @endforeach
            </tr>
            <tr>
                @foreach ($subjects as $subj)
                    @foreach ($subj['components'] as $comp)
                        <th>{{ $comp['name'] }}<br><small>({{ $comp['marks'] }})</small></th>
                    @endforeach
                @endforeach
            </tr>
        @else
            <tr>
                <th rowspan="2" style="vertical-align:middle">الطالب</th>
                <th rowspan="2" style="vertical-align:middle">رقم الجلوس</th>
                @foreach ($subjects as $subj)
                    <th>{{ $subj['name'] }}<br><small>({{ $subj['max'] }})</small></th>
                @endforeach
            </tr>
        @endif
    </thead>
    <tbody>
        @forelse ($students as $student)
            <tr>
                <td>{{ $student['name'] }}</td>
                <td style="text-align:center">{{ $student['seat_number'] ?? '—' }}</td>
                <td style="text-align:center">{{ $student['classroom_name'] ?? '—' }}</td>
                @foreach ($student['marks'] as $mark)
                    <td style="text-align:center;color:{{ $mark['color'] }};font-weight:bold">
                        {{ $mark['display'] }}
                    </td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ $totals['columns_count'] ?? count($subjects) + 2 }}" style="text-align:center;color:#7f8c8d">
                    لا توجد بيانات
                </td>
            </tr>
        @endforelse
    </tbody>
</table>

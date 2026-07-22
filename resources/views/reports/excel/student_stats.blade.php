<table class="table table-bordered">
    <thead>
        <tr>
            <th colspan="9" style="font-weight: bold; background-color: #d0d0d0; text-align: center;">{{$title}}</th>
        </tr>
        <tr>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">الفصل</th>
            <th colspan="3" style="font-weight:bold; background-color:#e0e0e0;">بنين</th>
            <th colspan="3" style="font-weight:bold; background-color:#e0e0e0;">بنات</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">الجملة العامة</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">باقي</th>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#e0e0e0;">جملة</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">مسيحي</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">مسلم</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">جملة</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">مسيحي</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">مسلم</th>
        </tr>
    </thead>
    <tbody>
        @php
            $gradeTotal = [
                'total_count' => 0,
                'male_count' => 0,
                'male_muslim' => 0,
                'male_christian' => 0,
                'female_count' => 0,
                'female_muslim' => 0,
                'female_christian' => 0,
                'remaining_count' => 0,
            ];
        @endphp

        @foreach($classrooms as $classroom)
            @php
                $gradeTotal['total_count'] += $classroom['total_count'];
                $gradeTotal['male_count'] += $classroom['male_count'];
                $gradeTotal['male_muslim'] += $classroom['male_muslim'];
                $gradeTotal['male_christian'] += $classroom['male_christian'];
                $gradeTotal['female_count'] += $classroom['female_count'];
                $gradeTotal['female_muslim'] += $classroom['female_muslim'];
                $gradeTotal['female_christian'] += $classroom['female_christian'];
                $gradeTotal['remaining_count'] += $classroom['remaining_count'];
            @endphp
            <tr>
                <td>{{ $classroom['classroom_name'] }}</td>
                <td style="text-align: center;">{{ $classroom['male_count'] }}</td>
                <td style="text-align: center;">{{ $classroom['male_christian'] }}</td>
                <td style="text-align: center;">{{ $classroom['male_muslim'] }}</td>
                <td style="text-align: center;">{{ $classroom['female_count'] }}</td>
                <td style="text-align: center;">{{ $classroom['female_christian'] }}</td>
                <td style="text-align: center;">{{ $classroom['female_muslim'] }}</td>
                <td style="text-align: center;">{{ $classroom['total_count'] }}</td>
                <td style="text-align: center;">{{ $classroom['remaining_count'] }}</td>
            </tr>
        @endforeach

        <tr>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeLabel }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['male_count'] }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['male_christian'] }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['male_muslim'] }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['female_count'] }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['female_christian'] }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['female_muslim'] }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['total_count'] }}</td>
            <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeTotal['remaining_count'] }}</td>
        </tr>
    </tbody>
</table>

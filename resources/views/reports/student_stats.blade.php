<x-styles/>

<x-pdf-header>
    <h3>{{$title}}</h3>
</x-pdf-header>

<table class="table table-bordered" style="margin-top:10px">
    <thead>
        <tr>
            <th rowspan="2">الفصل</th>
            <th colspan="3">بنين</th>
            <th colspan="3">بنات</th>
            <th rowspan="2">الجملة العامة</th>
            <th rowspan="2">باقي</th>
        </tr>
        <tr>
            <th>جملة</th>
            <th>مسيحي</th>
            <th>مسلم</th>
            <th>جملة</th>
            <th>مسيحي</th>
            <th>مسلم</th>
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

        <tr style="background-color: #cbcbcb; font-weight: bold;">
            <td style="text-align: center;">{{ $gradeLabel }}</td>
            <td style="text-align: center;">{{ $gradeTotal['male_count'] }}</td>
            <td style="text-align: center;">{{ $gradeTotal['male_christian'] }}</td>
            <td style="text-align: center;">{{ $gradeTotal['male_muslim'] }}</td>
            <td style="text-align: center;">{{ $gradeTotal['female_count'] }}</td>
            <td style="text-align: center;">{{ $gradeTotal['female_christian'] }}</td>
            <td style="text-align: center;">{{ $gradeTotal['female_muslim'] }}</td>
            <td style="text-align: center;">{{ $gradeTotal['total_count'] }}</td>
            <td style="text-align: center;">{{ $gradeTotal['remaining_count'] }}</td>
        </tr>
    </tbody>
</table>

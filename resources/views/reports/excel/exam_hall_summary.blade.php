<table>
    <thead>
        <tr>
            <th colspan="8" style="font-weight: bold; background-color: #d0d0d0; text-align: center;">
                كشف إحصائي للجان - {{ $academicYear }}
            </th>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#e0e0e0;">م</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الفصل</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">رقم اللجنة</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">عدد البنين</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">عدد البنات</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">دمج</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">مسلم</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">مسيحي</th>
        </tr>
    </thead>
    <tbody>
        @foreach($halls as $index => $hall)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $hall['classroom_name'] }}</td>
                <td style="text-align: center;">{{ $hall['exam_hall_number'] }}</td>
                <td style="text-align: center;">{{ $hall['boys'] }}</td>
                <td style="text-align: center;">{{ $hall['girls'] }}</td>
                <td style="text-align: center;">{{ $hall['damg'] }}</td>
                <td style="text-align: center;">{{ $hall['muslims'] }}</td>
                <td style="text-align: center;">{{ $hall['christians'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

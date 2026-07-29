<x-styles/>

<x-pdf-header>
    <h3>كشف إحصائي للجان - {{ $academicYear }}</h3>
</x-pdf-header>

<table class="table table-bordered">
    <thead>
        <tr>
            <th>م</th>
            <th>الفصل</th>
            <th>رقم اللجنة</th>
            <th>عدد البنين</th>
            <th>عدد البنات</th>
            <th>دمج</th>
            <th>مسلم</th>
            <th>مسيحي</th>
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

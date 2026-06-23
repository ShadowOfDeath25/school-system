<x-styles/>

<x-pdf-header>
    <h3>{{$title}}</h3>
</x-pdf-header>

<table class="table table-bordered" style="margin-top:10px">
    <thead>
        <tr>
            <th>م</th>
            <th>الاسم</th>
            <th>الرقم القومى</th>
            <th>تاريخ الميلاد</th>
            <th>السن</th>
            <th>تاريخ الدخول</th>
            <th>الحالة</th>
            <th>النوع</th>
            <th>الديانة</th>
            <th>الفصل</th>
            <th>ولى الامر</th>
            <th>التليفون</th>
        </tr>
    </thead>
    <tbody>
        @foreach($rows as $index => $student)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $student['name_in_arabic'] }}</td>
                <td style="text-align: center;">{{ $student['nid'] }}</td>
                <td style="text-align: center;">{{ $student['birth_date_display'] }}</td>
                <td style="text-align: center;">{{ $student['age_display'] }}</td>
                <td style="text-align: center;">{{ $student['entry_date'] }}</td>
                <td style="text-align: center;">{{ $student['status'] }}</td>
                <td style="text-align: center;">{{ $student['gender'] === 'male' ? 'ذكر' : 'انثى' }}</td>
                <td style="text-align: center;">{{ $student['religion'] }}</td>
                <td>{{ $student['classroom_name'] }}</td>
                <td>{{ $student['guardian_name'] }}</td>
                <td style="text-align: center;">{{ $student['guardian_phone'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

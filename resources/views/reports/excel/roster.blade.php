<table>
    <thead>
        <tr>
            <th colspan="14" style="font-weight: bold; background-color: #d0d0d0; text-align: center;">{{ $title }}</th>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#e0e0e0;">م</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الاسم</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الاسم بالانجليزية</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الرقم القومى</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">تاريخ الميلاد</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">السن</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">تاريخ الدخول</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الحالة</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">النوع</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الديانة</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الفصل</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">ولى الامر</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الوظيفة</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">التليفون</th>
        </tr>
    </thead>
    <tbody>
        @foreach($rows as $index => $student)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $student['name_in_arabic'] }}</td>
                <td>{{ $student['name_in_english'] }}</td>
                <td>{{ $student['nid'] }}</td>
                <td style="text-align: center;">{{ $student['birth_date_display'] }}</td>
                <td style="text-align: center;">{{ $student['age_display'] }}</td>
                <td style="text-align: center;">{{ $student['entry_date'] }}</td>
                <td style="text-align: center;">{{ $student['status'] }}</td>
                <td style="text-align: center;">{{ $student['gender'] === 'male' ? 'ذكر' : 'انثى' }}</td>
                <td style="text-align: center;">{{ $student['religion'] }}</td>
                <td>{{ $student['classroom_name'] }}</td>
                <td>{{ $student['guardian_name'] }}</td>
                <td>{{ $student['guardian_job'] }}</td>
                <td>{{ $student['guardian_phone'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

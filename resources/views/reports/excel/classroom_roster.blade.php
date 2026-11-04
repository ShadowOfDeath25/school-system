<table>
    <thead>
        <tr>
            <th colspan="4" style="font-weight: bold; background-color: #d0d0d0; text-align: center; font-size: 14px;">
                {{ $title }} - العام الدراسي: {{ $academic_year }}
            </th>
        </tr>
    </thead>
    <tbody>
        @foreach($classrooms as $item)
            <tr>
                <td colspan="4" style="font-weight: bold; background-color: #cfe2ff; text-align: right;">
                    الفصل: {{ $item['classroom']->name }}
                    | المرحلة: {{ $item['classroom']->level }}
                    | الصف: {{ \App\Enums\Grade::tryFrom((int)$item['classroom']->grade)?->label() ?? $item['classroom']->grade }}
                    | عدد الطلاب: {{ $item['students_count'] }}
                </td>
            </tr>
            <tr style="font-weight: bold; background-color: #e0e0e0; text-align: center;">
                <th>م</th>
                <th>رقم القيد</th>
                <th>اسم الطالب</th>
                <th>الديانة</th>
            </tr>
            @forelse($item['students'] as $index => $student)
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td style="text-align: center;">{{ $student['reg_number'] }}</td>
                    <td>{{ $student['name_in_arabic'] }}</td>
                    <td style="text-align: center;">{{ $student['religion'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align: center;">
                        لا يوجد طلاب في هذا الفصل
                    </td>
                </tr>
            @endforelse
            <tr>
                <td colspan="4"></td>
            </tr>
        @endforeach
    </tbody>
</table>

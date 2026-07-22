<table>
    <thead>
        <tr>
            <th colspan="{{ count($data['days']) + 2 }}" style="font-weight: bold; background-color: #d0d0d0; text-align: center; font-size: 14px;">
                {{ $title }}
            </th>
        </tr>
    </thead>
    <tbody>
        @foreach($data['classrooms'] as $classroom)
            <tr>
                <td colspan="{{ count($data['days']) + 2 }}" style="font-weight: bold; background-color: #e0e0e0;">
                    الفصل: {{ $classroom->name }}
                    | العام الدراسي: {{ $classroom->academic_year }}
                    | عدد الطلاب: {{ $classroom->students->count() }}
                    @if($classroom->max_capacity)
                        | الطاقة الاستيعابية: {{ $classroom->max_capacity }}
                    @endif
                </td>
            </tr>
            <tr>
                <th rowspan="2" style="font-weight:bold; background-color:#d0d0d0; text-align:center;">الطالب</th>
                <th rowspan="2" style="font-weight:bold; background-color:#d0d0d0; text-align:center;">الفصل</th>
                @foreach($data['days'] as $day)
                    <th style="font-weight:bold; background-color:#d0d0d0; text-align:center;">{{ $day['name'] }}</th>
                @endforeach
            </tr>
            <tr>
                @foreach($data['days'] as $day)
                    <th style="font-weight:bold; background-color:#e0e0e0; text-align:center;">{{ $day['number'] }}</th>
                @endforeach
            </tr>
            @foreach($classroom->students as $student)
                <tr>
                    <td style="text-align:center;">{{ $student->name_in_arabic }}</td>
                    <td style="text-align:center;">{{ $classroom->name }}</td>
                    @foreach($data['days'] as $day)
                        <td style="text-align:center;"></td>
                    @endforeach
                </tr>
            @endforeach
            @if(!$loop->last)
                <tr><td colspan="{{ count($data['days']) + 2 }}"></td></tr>
            @endif
        @endforeach
    </tbody>
</table>

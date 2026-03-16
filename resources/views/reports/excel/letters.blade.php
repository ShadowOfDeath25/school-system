<table>
    <thead>
        <tr>
            <th style="font-weight:bold; background-color:#d0d0d0; width:30px;">الطالب</th>
            <th style="font-weight:bold; background-color:#d0d0d0; width:15px;">الفصل</th>
            <th style="font-weight:bold; background-color:#d0d0d0; width:15px;">العام الدراسي</th>
            <th style="font-weight:bold; background-color:#d0d0d0; width:30px;">السيد ولي أمر التلميذ</th>
            <th style="font-weight:bold; background-color:#d0d0d0; width:80px;">نص الرسالة</th>
        </tr>
    </thead>
    <tbody>
        @foreach($studentsByClassrooms as $classroom)
            @foreach($classroom["students"] as $chunk)
                @foreach($chunk as $student)
                <tr>
                    <td>{{$student->name_in_arabic}}</td>
                    <td style="text-align:center">{{$classroom['classroom']?->name ?? 'الغير مقيدون'}}</td>
                    <td style="text-align:center">{{$classroom['classroom']?->academic_year ?? 'N/A'}}</td>
                    <td>{{$student->name_in_arabic}}</td>
                    <td>{{$letter}}</td>
                </tr>
                @endforeach
            @endforeach
        @endforeach
    </tbody>
</table>

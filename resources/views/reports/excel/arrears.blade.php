<table class="table">
@foreach($classrooms as $classroom)
    @php
        $i = 1;
        $totalRemaining = 0;
        foreach($classroom['students'] as $c) {
            foreach($c as $s) {
                $totalRemaining += ($s->total_sum ?? 0) - ($s->paid_sum ?? 0);
            }
        }
    @endphp
    <thead>
        <tr>
            <td colspan="4" style="font-weight: bold; background-color: #e0e0e0;">
                الفصل: {{ $classroom['classroom']->name ?? "الغير مقيدون"}} |
                العام الدراسي: {{ $classroom['classroom']->academic_year ?? "N/A" }}
            </td>
            <td colspan="{{ request()->boolean('show_notes') ? 5 : 4 }}" style="font-weight: bold; background-color: #e0e0e0;">
                الطاقة الاستيعابية: {{ $classroom['classroom']->max_capacity ?? 'N/A' }} |
                الطاقة الفعلية: {{ $classroom['classroom']->students_count ?? "N/A" }}
            </td>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#d0d0d0;">م</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">رقم القيد</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">الاسم</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">قيمة المصروفات</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">المدفوع</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">اعفائات</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">المتبقي</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">المحمول</th>
            @if(request()->boolean("show_notes"))
                <th style="font-weight:bold; background-color:#d0d0d0;">علامة مميزة</th>
            @endif
        </tr>
    </thead>
    <tbody>
        @foreach($classroom['students'] as $chunk)
            @foreach($chunk as $student)
                <tr>
                    <td>{{ $i++ }}</td>
                    <td>{{ $student->reg_number }}</td>
                    <td>{{ $student->name_in_arabic }}</td>
                    <td>{{ ($student->total_sum ?? 0) + ($student->exemption_amount ?? 0) }}</td>
                    <td>{{ $student->paid_sum ?? 0 }}</td>
                    <td>{{ $student->exemption_amount ?? 0 }}</td>
                    <td>{{ ($student->total_sum ?? 0) - ($student->paid_sum ?? 0) }}</td>
                    <td>
                        @foreach($student->guardians as $guardian)
                            {{ $guardian->phone_number }}@if(!$loop->last)/@endif
                        @endforeach
                    </td>
                    @if(request()->boolean("show_notes"))
                        <td>{{$student->note ?? "لا يوجد"}}</td>
                    @endif
                </tr>
            @endforeach
        @endforeach
    </tbody>
    <tfoot>
        <tr style="background-color: #f8f9fa; font-weight: bold;">
            <td colspan="6" style="text-align: center;">إجمالي المتبقي للفصل</td>
            <td colspan="{{ request()->boolean('show_notes') ? 3 : 2 }}" style="text-align: center;">{{ $totalRemaining }}</td>
        </tr>
        <tr><td colspan="{{ request()->boolean('show_notes') ? 9 : 8 }}"></td></tr>
    </tfoot>
@endforeach
</table>

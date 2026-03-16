<table class="table table-bordered">
@foreach($payments as $recipientId => $group)
    @php
        $i = 1;
        $recipientTotal = $group->flatten(1)->sum('value');
        $recipientName = $group->first()->first()->recipient?->name ?? 'غير معرف';
    @endphp
    <thead>
        <tr>
            <td colspan="5" style="font-weight: bold; background-color: #e0e0e0;">
                المستلم: {{ $recipientName }} | 
                اليوم: {{ $date->dayName ?? 'غير معرف' }} | 
                الموافق: {{$date->format('Y/m/d') ?? "غير معرف" }}
            </td>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#d0d0d0;">رقم الإيصال</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">القيمة</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">اسم التلميذ</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">الفصل</th>
            <th style="font-weight:bold; background-color:#d0d0d0;">المرحلة</th>
        </tr>
    </thead>
    <tbody>
        @foreach($group as $chunk)
            @foreach($chunk as $payment)
                @php
                    $classroomNumber = "غير مقيد";
                    $classroomLevel = "غير مقيد";
                    if($payment->student->classroom_id){
                        $parts = explode(' ',$payment->student->classroom->name,2);
                        $classroomNumber = $parts[0] ?? "غير مقيد";
                        $classroomLevel = $parts[1] ?? "غير مقيد";
                    }
                @endphp
                <tr>
                    <td style="text-align:center;">{{$payment->id}}</td>
                    <td style="text-align:center;">{{$payment->value}}</td>
                    <td>{{$payment->student->name_in_arabic}}</td>
                    <td style="text-align:center">{{$classroomNumber}}</td>
                    <td style="text-align:center">{{$classroomLevel}}</td>
                </tr>
            @endforeach
        @endforeach
    </tbody>
    <tfoot>
        <tr style="font-weight:bold;background-color:#f0f0f0;">
            <td colspan="4" style="text-align:right; ">إجمالي المستلم ({{ $recipientName }})</td>
            <td style="text-align:center;">{{ $recipientTotal }}</td>
        </tr>
        <tr><td colspan="5"></td></tr>
    </tfoot>
@endforeach
    <tfoot>
        <tr style="font-weight:bold; background-color:#a0a0a0;">
            <td colspan="4" style="text-align:right;">إجمالي اليوم</td>
            <td style="text-align:center;">{{ $payments->flatten(2)->sum('value') }}</td>
        </tr>
    </tfoot>
</table>

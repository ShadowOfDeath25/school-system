<table class="table" style="direction: rtl;">
    <thead>
        <tr>
            <th colspan="2" style="font-weight: bold; background-color: #d0d0d0; text-align: center;">
                @if($start_date != $end_date)
                    صافي الدخل في الفترة من {{$start_date}} إلي {{$end_date}}
                @else
                    صافي الدخل في يوم {{$start_date}}
                @endif
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" style="font-weight: bold; background-color: #e0e0e0; text-align: center;">المدخلات</td>
        </tr>
        <tr>
            <td style="font-weight: bold; text-align: center; background-color: #f0f0f0;">النوع</td>
            <td style="font-weight: bold; text-align: center; background-color: #f0f0f0;">القيمة</td>
        </tr>
        @php $incomeSum = 0; $expenseSum = 0; @endphp
        @foreach($incomes as $key=>$value)
            <tr>
                <td>{{$key}}</td>
                <td style="text-align: left;">{{$value+0}}</td>
            </tr>
            @php $incomeSum+=$value; @endphp
        @endforeach
        <tr style="font-weight: bold; background-color: #f8f9fa;">
            <td>إجمالي المدخلات</td>
            <td style="text-align: left;">{{$incomeSum}}</td>
        </tr>
        <tr><td colspan="2"></td></tr>

        <tr>
            <td colspan="2" style="font-weight: bold; background-color: #e0e0e0; text-align: center;">المصروفات</td>
        </tr>
        <tr>
            <td style="font-weight: bold; text-align: center; background-color: #f0f0f0;">النوع</td>
            <td style="font-weight: bold; text-align: center; background-color: #f0f0f0;">القيمة</td>
        </tr>
        <tr>
            <td>واردات الكتب</td>
            <td style="text-align: left;">{{$expenses['books']+0}}</td>
        </tr>
        @php $expenseSum += $expenses['books']; @endphp
        <tr>
            <td>واردات الزي</td>
            <td style="text-align: left;">{{$expenses['uniforms']+0}}</td>
        </tr>
        @php $expenseSum += $expenses['uniforms']; @endphp
        @foreach($expenses['expenses'] as $type => $value)
            <tr>
                <td>{{ $type }}</td>
                <td style="text-align: left;">{{$value+0}}</td>
            </tr>
            @php $expenseSum += $value; @endphp
        @endforeach
        <tr style="font-weight: bold; background-color: #f8f9fa;">
            <td>إجمالي المصروفات</td>
            <td style="text-align: left;">{{$expenseSum}}</td>
        </tr>
        <tr><td colspan="2"></td></tr>
        <tr style="font-weight: bold; background-color: #c0c0c0;">
            <td>صافي الدخل</td>
            <td style="text-align: left;">{{$incomeSum-$expenseSum}}</td>
        </tr>
    </tbody>
</table>

<x-styles/>
<x-pdf-header/>
<div class="title">
    @if($start_date !=$end_date)
        <span>صافي الدخل في الفترة</span>
        <span>من {{$start_date}} إلي {{$end_date}}</span>
    @else
        <span>صافي الدخل في يوم</span>
        <span>{{$start_date}}</span>
    @endif
</div>
<hr>
<h3 class="table-title">المدخلات</h3>
@php
    $incomeSum= 0;
    $expenseSum=0;
    $expenseTypes = [
        "expenses"=>"مصروفات متنوعة",
        "books"=>"واردات الكتب",
        "uniforms"=>"واردات الزي"
];
@endphp
<table>
    <thead>
        <tr>
            <th>النوع</th>
            <th>القيمة</th>
        </tr>
    </thead>
    <tbody>

        @foreach($incomes as $key=>$value)
            <tr>
                <td>{{$key}}</td>
                <td class="value">{{$value+0}}</td>
            </tr>
            @php
                $incomeSum+=$value;
            @endphp
        @endforeach
        <tr class="total">
            <td>الإجمالي</td>
            <td class="value">{{$incomeSum}}</td>
        </tr>
    </tbody>
</table>
<hr>

<h3 class="table-title">المصروفات</h3>

<table>
    <thead>
        <tr>
            <th>النوع</th>
            <th>القيمة</th>
        </tr>
    </thead>
    <tbody>

        @foreach($expenses as $key=>$value)
            <tr>
                <td>{{$expenseTypes[$key]}}</td>
                <td class="value">{{$value+0}}</td>
            </tr>
            @php
                $expenseSum+=$value;
            @endphp
        @endforeach
        <tr class="total">
            <td>الإجمالي</td>
            <td class="value">{{$expenseSum}}</td>
        </tr>
    </tbody>
</table>
<hr>
<div class="net-income">
    <span>صافي الدخل</span>
    <span>{{$incomeSum-$expenseSum}} ج.م</span>
</div>

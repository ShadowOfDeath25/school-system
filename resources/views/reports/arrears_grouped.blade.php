<x-styles/>

<x-pdf-header>
    <h3>{{$title}}</h3>
</x-pdf-header>

<table class="table table-bordered" style="margin-top:10px">
    <thead>
        <tr>
            <th>الصف / الفصل</th>
            <th>عدد الفصول</th>
            <th>السعة</th>
            <th>العدد الفعلي</th>
            <th>إجمالي المصروفات</th>
            <th>إجمالي المدفوع</th>
            <th>إجمالي الإعفاءات</th>
            <th>إجمالي المتبقي</th>
        </tr>
    </thead>
    <tbody>
        @foreach($grades as $gradeData)
            @foreach($gradeData['classrooms'] as $classroom)
                <tr>
                    <td>
                        {{ $classroom['name'] }}
                        {{$classroom["language"]==="لغات"?"(لغات)":null}}
                    </td>
                    <td></td>
                    <td style="text-align: center;">{{ $classroom['max_capacity'] }}</td>
                    <td style="text-align: center;">{{ $classroom['students_count'] }}</td>
                    <td>{{ number_format($classroom['required_sum'], 2) }}</td>
                    <td>{{ number_format($classroom['paid_sum'], 2) }}</td>
                    <td>{{ number_format($classroom['exemption_sum'], 2) }}</td>
                    <td>{{ number_format($classroom['remaining_sum'], 2) }}</td>
                </tr>
            @endforeach
            <tr style="background-color: #cbcbcb; font-weight: bold;">
                <td style="text-align: center;">
                    الصف
                    {{ \App\Enums\Grade::from($gradeData['grade'])->label() }}
                </td>
                <td style="text-align: center;">{{$gradeData["totals"]['classrooms_count']}}</td>
                <td style="text-align: center;">{{ number_format($gradeData['totals']['max_capacity']) }}</td>
                <td style="text-align: center;">{{ number_format($gradeData['totals']['students_count']) }}</td>
                <td>{{ number_format($gradeData['totals']['required_sum'], 2) }}</td>
                <td>{{ number_format($gradeData['totals']['paid_sum'], 2) }}</td>
                <td>{{ number_format($gradeData['totals']['exemption_sum'], 2) }}</td>
                <td>{{ number_format($gradeData['totals']['remaining_sum'], 2) }} ج.م</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        @php
            $grandTotalMaxCapacity = 0;
            $grandTotalStudentsCount = 0;
            $grandTotalRequired = 0;
            $grandTotalPaid = 0;
            $grandTotalExemption = 0;
            $grandTotalRemaining = 0;
            foreach($grades as $g) {
                $grandTotalMaxCapacity += $g['totals']['max_capacity'];
                $grandTotalStudentsCount += $g['totals']['students_count'];
                $grandTotalRequired += $g['totals']['required_sum'];
                $grandTotalPaid += $g['totals']['paid_sum'];
                $grandTotalExemption += $g['totals']['exemption_sum'];
                $grandTotalRemaining += $g['totals']['remaining_sum'];
            }
        @endphp

    </tfoot>
</table>

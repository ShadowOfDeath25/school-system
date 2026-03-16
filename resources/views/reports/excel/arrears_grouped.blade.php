<table class="table table-bordered">
    <thead>
        <tr>
            <th colspan="8" style="font-weight: bold; background-color: #d0d0d0; text-align: center;">{{$title}}</th>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#e0e0e0;">الصف / الفصل</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">عدد الفصول</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">السعة</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">العدد الفعلي</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">إجمالي المصروفات</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">إجمالي المدفوع</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">إجمالي الإعفاءات</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">إجمالي المتبقي</th>
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
                    <td>{{ $classroom['required_sum'] }}</td>
                    <td>{{ $classroom['paid_sum'] }}</td>
                    <td>{{ $classroom['exemption_sum'] }}</td>
                    <td>{{ $classroom['remaining_sum'] }}</td>
                </tr>
            @endforeach
            <tr style="background-color: #cbcbcb; font-weight: bold;">
                <td style="text-align: center;">
                    الصف
                    {{ \App\Enums\Grade::from($gradeData['grade'])->label() }}
                </td>
                <td style="text-align: center;">{{$gradeData["totals"]['classrooms_count']}}</td>
                <td style="text-align: center;">{{ $gradeData['totals']['max_capacity'] }}</td>
                <td style="text-align: center;">{{ $gradeData['totals']['students_count'] }}</td>
                <td>{{ $gradeData['totals']['required_sum'] }}</td>
                <td>{{ $gradeData['totals']['paid_sum'] }}</td>
                <td>{{ $gradeData['totals']['exemption_sum'] }}</td>
                <td>{{ $gradeData['totals']['remaining_sum'] }}</td>
            </tr>
            <tr><td colspan="8"></td></tr>
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
        <tr style="background-color: #a0a0a0; font-weight: bold;">
            <td colspan="2" style="text-align: center;">الإجمالي العام</td>
            <td style="text-align: center;">{{ $grandTotalMaxCapacity }}</td>
            <td style="text-align: center;">{{ $grandTotalStudentsCount }}</td>
            <td>{{ $grandTotalRequired }}</td>
            <td>{{ $grandTotalPaid }}</td>
            <td>{{ $grandTotalExemption }}</td>
            <td>{{ $grandTotalRemaining }}</td>
        </tr>
    </tfoot>
</table>

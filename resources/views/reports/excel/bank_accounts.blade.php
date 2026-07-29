<table>
    <thead>
        <tr>
            <th colspan="7" style="font-weight:bold;text-align:center;background-color:#d0d0d0">
                تقرير حركات الحسابات البنكية — {{ $academic_year }}
                @if ($formatted_start_date || $formatted_end_date)
                    — من {{ $formatted_start_date ?? 'البداية' }} إلى {{ $formatted_end_date ?? 'النهاية' }}
                @endif
            </th>
        </tr>
        <tr>
            <th style="font-weight:bold;background-color:#e0e0e0">رقم الحركة</th>
            <th style="font-weight:bold;background-color:#e0e0e0">التاريخ</th>
            <th style="font-weight:bold;background-color:#e0e0e0">نوع العملية</th>
            <th style="font-weight:bold;background-color:#e0e0e0">الإيداع</th>
            <th style="font-weight:bold;background-color:#e0e0e0">السحب</th>
            <th style="font-weight:bold;background-color:#e0e0e0">اسم المسؤول</th>
            <th style="font-weight:bold;background-color:#e0e0e0">ملاحظات</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($transactions as $transaction)
            <tr>
                <td>{{ $transaction['id'] }}</td>
                <td>{{ \Carbon\Carbon::parse($transaction['date'])->format('d/m/Y') }}</td>
                <td>{{ $transaction['type'] }}</td>
                <td>{{ $transaction['deposit'] ?: null }}</td>
                <td>{{ $transaction['withdrawal'] ?: null }}</td>
                <td>{{ $transaction['manager_name'] }}</td>
                <td>{{ $transaction['notes'] }}</td>
            </tr>
        @empty
            <tr><td colspan="7">لا توجد حركات</td></tr>
        @endforelse
        <tr style="font-weight:bold;background-color:#e0e0e0">
            <td colspan="3">الإجمالي</td>
            <td>{{ $totals['deposits'] }}</td>
            <td>{{ $totals['withdrawals'] }}</td>
            <td colspan="2">الصافي: {{ $totals['net'] }}</td>
        </tr>
        <tr style="font-weight:bold;background-color:#e0e0e0">
            <td colspan="5">صافي الخزنة (إجمالي المبالغ المسحوبة)</td>
            <td colspan="2">{{ $totals['treasury_net'] }}</td>
        </tr>
    </tbody>
</table>

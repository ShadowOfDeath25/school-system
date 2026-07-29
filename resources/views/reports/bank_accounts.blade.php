<x-styles/>

<x-pdf-header>
    <h3>تقرير حركات الحسابات البنكية</h3>
    <p style="margin:4px 0 0;font-size:13px">
        العام الدراسي: {{ $academic_year }}
        @if ($formatted_start_date || $formatted_end_date)
            — الفترة من {{ $formatted_start_date ?? 'البداية' }} إلى {{ $formatted_end_date ?? 'النهاية' }}
        @endif
    </p>
</x-pdf-header>

<table class="table table-bordered" style="margin-top:10px;font-size:12px">
    <thead>
        <tr>
            <th>رقم الحركة</th>
            <th>التاريخ</th>
            <th>نوع العملية</th>
            <th>الإيداع</th>
            <th>السحب</th>
            <th>اسم المسؤول</th>
            <th>ملاحظات</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($transactions as $transaction)
            <tr>
                <td style="text-align:center">{{ $transaction['id'] }}</td>
                <td style="text-align:center">{{ \Carbon\Carbon::parse($transaction['date'])->format('d/m/Y') }}</td>
                <td style="text-align:center">{{ $transaction['type'] }}</td>
                <td style="text-align:center">{{ $transaction['deposit'] ? number_format($transaction['deposit'], 2) : '—' }}</td>
                <td style="text-align:center">{{ $transaction['withdrawal'] ? number_format($transaction['withdrawal'], 2) : '—' }}</td>
                <td>{{ $transaction['manager_name'] }}</td>
                <td>{{ $transaction['notes'] }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="7" style="text-align:center;color:#7f8c8d">لا توجد حركات</td>
            </tr>
        @endforelse
    </tbody>
    <tfoot>
        <tr style="font-weight:bold;background:#f0f0f0">
            <td colspan="3">الإجمالي</td>
            <td style="text-align:center">{{ number_format($totals['deposits'], 2) }}</td>
            <td style="text-align:center">{{ number_format($totals['withdrawals'], 2) }}</td>
            <td colspan="2">الصافي: {{ number_format($totals['net'], 2) }}</td>
        </tr>
    </tfoot>
</table>

<p style="margin-top:10px;font-size:13px;font-weight:bold">
    صافي الخزنة (إجمالي المبالغ المسحوبة): {{ number_format($totals['treasury_net'], 2) }}
</p>

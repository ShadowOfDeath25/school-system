<x-styles/>

@foreach($classrooms as $classroom)
    @php
        $i = 1;
    @endphp
    @foreach($classroom['students'] as $chunk)
        <x-pdf-header>
            <h3>متأخرات {{$type}}</h3>
        </x-pdf-header>
        <div style="margin-bottom: 20px;">
            <h3>{{ $classroom['classroom']->name ?? 'Classroom' }}</h3>
            <p>
                <strong>العام الدراسي:</strong> {{ $classroom['classroom']->academic_year }} |
                <strong>الطاقة الاستيعابية:</strong> {{ $classroom['classroom']->max_capacity ?? 'N/A' }} |
                <strong>الطاقة الفعلية:</strong> {{ $classroom['classroom']->students_count }}
            </p>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>م</th>
                    <th>رقم القيد</th>
                    <th>الاسم</th>
                    <th>قيمة المصروفات</th>
                    <th>المدفوع</th>
                    <th>اعفائات</th>
                    <th>المتبقي</th>
                    <th>المحمول</th>
                </tr>
            </thead>
            <tbody>
                @foreach($chunk as $student)
                    <tr>
                        <td>{{ $i++ }}</td>
                        <td>{{ $student->reg_number }}</td>
                        <td>{{ $student->name_in_arabic }}</td>
                        <td>{{ number_format(($student->total_sum ?? 0) + ($student->exemption_amount ?? 0), 2) }}</td>
                        <td>{{ number_format($student->paid_sum ?? 0, 2) }}</td>
                        <td>{{ number_format($student->exemption_amount ?? 0, 2) }}</td>
                        <td>{{ number_format(($student->total_sum ?? 0) - ($student->paid_sum ?? 0), 2) }}</td>
                        <td>
                            @foreach($student->guardians as $guardian)
                                {{ $guardian->phone_number }}@if(!$loop->last)
                                    /
                                @endif
                            @endforeach
                        </td>
                    </tr>
                @endforeach
                @if($loop->last)
                    @php
                        $totalRemaining = 0;
                        foreach($classroom['students'] as $c) {
                            foreach($c as $s) {
                                $totalRemaining += ($s->total_sum ?? 0) - ($s->paid_sum ?? 0);
                            }
                        }
                    @endphp
                    <tr style="background-color: #f8f9fa; font-weight: bold;">
                        <td colspan="6" style="text-align: center;">إجمالي المتبقي للفصل</td>
                        <td colspan="2">{{ number_format($totalRemaining, 2) }}</td>

                    </tr>
                @endif
            </tbody>
        </table>

        @if(!$loop->parent->last || !$loop->last)
            <div style="page-break-after: always;"></div>
        @endif
    @endforeach
@endforeach

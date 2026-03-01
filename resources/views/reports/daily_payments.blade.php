<x-styles/>

@foreach($payments as $chunk)
    @php
        $i = 1;
    @endphp
    <x-pdf-header>
        <h3>{{$title}}</h3>
        <h3>{{$type}}</h3>
    </x-pdf-header>
    <div class="classroom-data">
        <div>
                <span>
                <strong>العام الدراسي: </strong> {{ request()->input('academic_year')??"N/A" }}
                </span>
            |
            <span>
                <strong>اليوم: </strong> {{ $date->dayName ?? 'N/A' }}
                </span>
            |
            <span>
                <strong>الموافق: </strong> {{$date->format('Y/m/d') ?? "N/A" }}
                </span>
        </div>

    </div>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>رقم الإيصال</th>
                <th>القيمة</th>
                <th>اسم التلميذ</th>
                <th colspan="2">بيانات الدراسة</th>
            </tr>
        </thead>
        <tbody>
            @foreach($chunk as $payment)
                @php
                    [$classroomNumber,$classroomLevel] = explode(' ',$payment->student->classroom->name,2)
                @endphp
                <tr>
                    <td>{{$payment->id}}</td>
                    <td>{{$payment->value}}</td>
                    <td>{{$payment->student->name_in_arabic}}</td>
                    <td>{{$classroomNumber}}</td>
                    <td>{{$classroomLevel}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @if(!$loop->last)
        <div style="page-break-after: always;"></div>
    @endif
@endforeach

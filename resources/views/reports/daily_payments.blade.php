<x-styles/>

@php $dayTotal = $payments->flatten(2)->sum('value'); @endphp

@foreach($payments as $group)
    @php
        $i = 1;
        $recipientTotal = $group->flatten(1)->sum('value');
    @endphp
    @foreach($group as $chunk)

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
                <strong>اليوم: </strong> {{ $date->dayName ?? 'غير معرف' }}
                </span>
                |
                <span>
                <strong>الموافق: </strong> {{$date->format('Y/m/d') ?? "غير معرف" }}
                </span>
                |
                <span>
                <strong>المستلم: </strong> {{ $chunk->first()?->recipient?->name ?? 'غير معرف' }}
            </span>
            </div>

        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>رقم الإيصال</th>
                    <th>القيمة</th>
                    <th>اسم التلميذ</th>
                    <th colspan="2">بيانات الفصل</th>
                </tr>
            </thead>
            <tbody>
                @foreach($chunk as $payment)
                    @php
                        if($payment->student->classroom_id){
                        [$classroomNumber,$classroomLevel] = explode(' ',$payment->student->classroom->name,2);
                        }
                    @endphp
                    <tr>
                        <td style="text-align:center;width:120px">{{$payment->id}}</td>
                        <td style="text-align:center;width:50px">{{$payment->value}}</td>
                        <td>{{$payment->student->name_in_arabic}}</td>
                        <td style="text-align:center">{{$classroomNumber??"غير مقيد"}}</td>
                        <td style="text-align:center">{{$classroomLevel??"غير مقيد"}}</td>
                    </tr>
                @endforeach
            </tbody>
            @if($loop->last)
                <tfoot>
                    <tr style="font-weight:bold;background-color:#f0f0f0;">
                        <td colspan="4" style="text-align:right; ">إجمالي المستلم
                            ({{ $chunk->first()?->recipient?->name ?? 'غير معرف' }})
                        </td>
                        <td style="text-align:center;">{{ $recipientTotal }}</td>
                    </tr>

                    <tr style="font-weight:bold; background-color:#f0f0f0;">
                        <td colspan="4" style="text-align:right;">إجمالي اليوم</td>
                        <td style="text-align:center;">{{ $dayTotal }}</td>
                    </tr>

                </tfoot>
            @endif
        </table>

        @if(!$loop->parent->last || !$loop->last)
            <div style="page-break-after: always;"></div>
        @endif
    @endforeach
@endforeach


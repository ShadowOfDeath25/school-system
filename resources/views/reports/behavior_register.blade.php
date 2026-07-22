<x-styles/>
<style>
    .vertical-day {
        writing-mode: vertical-lr;
        -webkit-writing-mode: vertical-lr;
        -ms-writing-mode: tb-lr;
        font-size: 6px;
        font-weight: bold;
        white-space: nowrap;
        height: 55px;
        padding: 2px;
        text-align: center;
    }
    .day-num {
        font-size: 7px;
        font-weight: bold;
        text-align: center;
        padding: 2px;
    }
    .empty-cell {
        height: 20px;
    }
    .student-name {
        font-size: 10px;
        padding: 2px 6px;
    }
    .classroom-name {
        font-size: 10px;
        text-align: center;
        padding: 2px 6px;
    }
    .classroom-header {
        margin-bottom: 8px;
    }
    .classroom-header h3 {
        margin: 0;
        font-size: 14px;
    }
    .classroom-header .info {
        font-size: 10px;
        color: #555;
    }
    .table td, .table th {
        border: 1px solid #333;
    }
    .table thead th {
        background-color: #f0f0f0;
    }
    .page-break {
        page-break-after: always;
    }
</style>

@foreach($data['classrooms'] as $classroom)
    @if(!$loop->first)
        <div class="page-break"></div>
    @endif

    <x-pdf-header>
        <h3>{{$title}}</h3>
    </x-pdf-header>

    <div class="classroom-header">
        <h3>{{ $classroom->name }}</h3>
        <div class="info">
            <span><strong>العام الدراسي: </strong>{{ $classroom->academic_year }}</span>
            |
            <span><strong>عدد الطلاب: </strong>{{ $classroom->students->count() }}</span>
            @if($classroom->max_capacity)
                |
                <span><strong>الطاقة الاستيعابية: </strong>{{ $classroom->max_capacity }}</span>
            @endif
        </div>
    </div>

    <table class="table table-bordered" dir="rtl">
        <thead>
            <tr>
                <th rowspan="2" style="text-align:center;vertical-align:middle;font-size:10px;padding:4px;width:50px">الطالب</th>
                <th rowspan="2" style="text-align:center;vertical-align:middle;font-size:10px;padding:4px;width:25px">الفصل</th>
                @foreach($data['days'] as $day)
                    <th class="vertical-day">{{ $day['name'] }}</th>
                @endforeach
            </tr>
            <tr>
                @foreach($data['days'] as $day)
                    <th class="day-num">{{ $day['number'] }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($classroom->students as $student)
                <tr>
                    <td class="student-name">{{ $student->name_in_arabic }}</td>
                    <td class="classroom-name">{{ $classroom->name }}</td>
                    @foreach($data['days'] as $day)
                        <td class="empty-cell"></td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
@endforeach

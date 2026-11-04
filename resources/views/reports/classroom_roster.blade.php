<x-styles/>
<style>
    @page {
        size: landscape;
    }
    .classroom-header-box {
        margin-top: 15px;
        margin-bottom: 10px;
        padding: 8px 14px;
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .classroom-header-box h3 {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
    }
    .classroom-meta {
        font-size: 12px;
        color: #374151;
        display: flex;
        gap: 15px;
    }
    .table-roster {
        width: 100%;
        border-collapse: collapse;
        margin-top: 6px;
        font-size: 13px;
    }
    .table-roster th, .table-roster td {
        border: 1px solid #374151;
        padding: 8px 10px;
        text-align: center;
    }
    .table-roster th {
        background-color: #e5e7eb;
        font-weight: bold;
    }
    .table-roster td.student-name {
        text-align: right;
        font-weight: 500;
        padding-right: 14px;
    }
    .page-break {
        page-break-after: always;
    }
</style>

@foreach($classrooms as $item)
    @if(!$loop->first)
        <div class="page-break"></div>
    @endif

    <x-pdf-header>
        <h3>{{ $title }}</h3>
    </x-pdf-header>

    <div class="classroom-header-box">
        <h3>الفصل: {{ $item['classroom']->name }}</h3>
        <div class="classroom-meta">
            <span><strong>العام الدراسي: </strong>{{ $item['classroom']->academic_year }}</span>
            <span><strong>المرحلة: </strong>{{ $item['classroom']->level }}</span>
            <span><strong>الصف: </strong>{{ \App\Enums\Grade::tryFrom((int)$item['classroom']->grade)?->label() ?? $item['classroom']->grade }}</span>
            <span><strong>عدد الطلاب: </strong>{{ $item['students_count'] }}</span>
        </div>
    </div>

    <table class="table-roster">
        <thead>
            <tr>
                <th style="width: 45px;">م</th>
                <th style="width: 120px;">رقم القيد</th>
                <th style="text-align: right; padding-right: 14px;">اسم الطالب</th>
                <th style="width: 100px;">الديانة</th>
            </tr>
        </thead>
        <tbody>
            @forelse($item['students'] as $index => $student)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $student['reg_number'] ?: '—' }}</td>
                    <td class="student-name">{{ $student['name_in_arabic'] }}</td>
                    <td>{{ $student['religion'] ?: '—' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="padding: 15px; color: #6b7280;">
                        لا يوجد طلاب في هذا الفصل
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endforeach

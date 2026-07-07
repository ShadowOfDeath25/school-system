<x-styles/>

<x-pdf-header>
    <h3>كشف اللجان</h3>
</x-pdf-header>

@foreach($classrooms as $group)
    @php $hallLabel = $group['classroom_name'] . ($group['exam_hall_number'] ? ' - لجنة '.$group['exam_hall_number'] : ''); @endphp
    <div style="font-weight:bold; font-size:14px; text-align:right; padding:8px; margin-top:10px;">
        {{ $hallLabel }}
    </div>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>م</th>
                <th>الاسم</th>
                <th>رقم الجلوس</th>
            </tr>
        </thead>
        <tbody>
            @foreach($group['assignments'] as $index => $assignment)
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td>{{ $assignment->student->name_in_arabic }}</td>
                    <td style="text-align: center;">{{ $assignment->assigned_number }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endforeach

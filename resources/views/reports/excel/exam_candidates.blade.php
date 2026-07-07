<table>
    <thead>
        <tr>
            <th colspan="3" style="font-weight: bold; background-color: #d0d0d0; text-align: center;">
                كشف اللجان - {{ $academicYear }}
            </th>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#e0e0e0;">م</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">الاسم</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">رقم الجلوس</th>
        </tr>
    </thead>
    <tbody>
        @foreach($classrooms as $group)
            @php $hallLabel = $group['classroom_name'] . ($group['exam_hall_number'] ? ' - لجنة '.$group['exam_hall_number'] : ''); @endphp
            <tr>
                <td colspan="3" style="font-weight:bold; text-align:right; background-color:#f0f0f0;">
                    {{ $hallLabel }}
                </td>
            </tr>
            @foreach($group['assignments'] as $index => $assignment)
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td>{{ $assignment->student->name_in_arabic }}</td>
                    <td style="text-align: center;">{{ $assignment->assigned_number }}</td>
                </tr>
            @endforeach
        @endforeach
    </tbody>
</table>

<table class="table table-bordered">
    <thead>
        <tr>
            <th colspan="11" style="font-weight: bold; background-color: #d0d0d0; text-align: center;">{{$title}}</th>
        </tr>
        <tr>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">اسم الفصل</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">عدد الفصول</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">السعة</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">بنين</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">بنات</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">مسلم</th>
            <th rowspan="2" style="font-weight:bold; background-color:#e0e0e0;">مسيحي</th>
            <th colspan="2" style="font-weight:bold; background-color:#e0e0e0;">مسلم</th>
            <th colspan="2" style="font-weight:bold; background-color:#e0e0e0;">مسيحي</th>
        </tr>
        <tr>
            <th style="font-weight:bold; background-color:#e0e0e0;">بنين</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">بنات</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">بنين</th>
            <th style="font-weight:bold; background-color:#e0e0e0;">بنات</th>
        </tr>
    </thead>
    <tbody>
        @foreach($levels as $levelData)
            @foreach($levelData['grades'] as $gradeData)
                @foreach($gradeData['classrooms'] as $classroom)
                    <tr>
                        <td>
                            {{ $classroom['name'] }}
                            {{ $classroom['language'] === 'لغات' ? '(لغات)' : '' }}
                        </td>
                        <td style="text-align: center;"></td>
                        <td style="text-align: center;">{{ $classroom['total_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['male_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['female_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['muslim_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['christian_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['muslim_male_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['muslim_female_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['christian_male_count'] }}</td>
                        <td style="text-align: center;">{{ $classroom['christian_female_count'] }}</td>
                    </tr>
                @endforeach

                <tr>
                    @php
                        $gradeLabel = \App\Enums\Grade::from($gradeData['grade'])->label();
                    @endphp
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeLabel }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['classrooms_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['total_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['male_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['female_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['muslim_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['christian_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['muslim_male_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['muslim_female_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['christian_male_count'] }}</td>
                    <td style="text-align: center; background-color: #cbcbcb; font-weight: bold;">{{ $gradeData['totals']['christian_female_count'] }}</td>
                </tr>
            @endforeach

            <tr>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['level'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['classrooms_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['total_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['male_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['female_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['muslim_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['christian_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['muslim_male_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['muslim_female_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['christian_male_count'] }}</td>
                <td style="text-align: center; background-color: #a0a0a0; font-weight: bold;">{{ $levelData['totals']['christian_female_count'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

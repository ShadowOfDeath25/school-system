<x-styles/>

<x-pdf-header>
    <h3>{{$title}}</h3>
</x-pdf-header>

<table class="table table-bordered" style="margin-top:10px">
    <thead>
        <tr>
            <th rowspan="2">اسم الفصل</th>
            <th rowspan="2">عدد الفصول</th>
            <th rowspan="2">السعة</th>
            <th rowspan="2">بنين</th>
            <th rowspan="2">بنات</th>
            <th rowspan="2">مسلم</th>
            <th rowspan="2">مسيحي</th>
            <th colspan="2">مسلم</th>
            <th colspan="2">مسيحي</th>
        </tr>
        <tr>
            <th>بنين</th>
            <th>بنات</th>
            <th>بنين</th>
            <th>بنات</th>
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

                <tr style="background-color: #cbcbcb; font-weight: bold;">
                    <td style="text-align: center;">
                        {{ \App\Enums\Grade::from($gradeData['grade'])->label() }}
                    </td>
                    <td style="text-align: center;">{{ $gradeData['totals']['classrooms_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['total_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['male_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['female_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['muslim_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['christian_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['muslim_male_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['muslim_female_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['christian_male_count'] }}</td>
                    <td style="text-align: center;">{{ $gradeData['totals']['christian_female_count'] }}</td>
                </tr>
            @endforeach

            <tr style="background-color: #a0a0a0; font-weight: bold;">
                <td style="text-align: center;">
                    {{ $levelData['level'] }}
                </td>
                <td style="text-align: center;">{{ $levelData['totals']['classrooms_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['total_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['male_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['female_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['muslim_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['christian_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['muslim_male_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['muslim_female_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['christian_male_count'] }}</td>
                <td style="text-align: center;">{{ $levelData['totals']['christian_female_count'] }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

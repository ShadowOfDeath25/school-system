<link rel="stylesheet" href="{{ public_path('css/app.css') }}">
<div class="letters">

    @foreach($studentsByClassrooms as $classroom)
        @foreach($classroom["students"] as $chunk)
            @foreach($chunk as $student)

                <x-letter
                    :academic-year="$classroom['classroom']?->academic_year ?? 'N/A'"
                    :letter="$letter"
                    :student="$student->name_in_arabic"
                    :classroom="$classroom['classroom']?->name ?? 'الغير مقيدون'"
                >
                </x-letter>
            @endforeach
        @endforeach
    @endforeach
</div>

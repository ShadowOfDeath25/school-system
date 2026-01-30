@vite("resources/css/app.css")
<div class="letters">
@foreach($studentsByClassrooms as $classroom)
{{--    @dd($classroom)--}}
    @foreach($classroom["students"] as $chunk)
        @foreach($chunk as $student)
            <x-letter
                :academic-year="$classroom['academic_year']"
                :letter="$letter"
                :student="$student['name_in_arabic']"
                :classroom="$classroom['classroom_name']"
            >
            </x-letter>
        @endforeach
    @endforeach
@endforeach
</div>

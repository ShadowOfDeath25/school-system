@props([
    'academicYear'=>"2025/2024",
    'classroom'=>"1/1 اعدادي",
    'letter'=>"تحية طيبة و بعد نرجوا من سيادتكم سداد ما تبقي من القسط الاول من المصروفات الدراسية المقررة علي نجلكم وذلك لضمان استمراره في الدراسة و عدم حرمانه من الحضور و المواظبة في حالة عدم السداد",
    'student'=>'احمد محمد احمد'
])
@vite("resources/css/app.css")
<link rel="stylesheet" href="{{ public_path('css/pdf-fonts.css') }}">
<div class="letterContainer">
    <x-pdf-header>
        <div class="academic-year">
            <span>العام الدراسي</span>
            <span>{{$academicYear}}</span>
        </div>
        <span>الفصل: {{$classroom}}</span>
    </x-pdf-header>
    <div class="student-name">
        <span>السيد ولي امر التلميذ/</span>
        <span>{{$student}}</span>
    </div>
    <span class="greeting">بعد التحية...</span>
    <p>{{$letter}}</p>
    <span>إدارة المدرسة</span>
</div>

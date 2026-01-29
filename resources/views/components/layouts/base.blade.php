@props([
    'title'=>'تقرير',
    'headerTitle'=>'',
    'pageNumber'=>1
])
    <!DOCTYPE html>
<html>
    <head>
        @vite(["resources/css/app.css"])
        <meta charset="utf-8">
        <title>@yield('title', 'Report')</title>
    </head>
    <body>
        <x-pdf-header :title="$headerTitle"/>
        <div class="page">
            {{$slot}}
        </div>

        <div class="footer">
            صفحة <span class="pageNumber">{{$pageNumber}}</span>
        </div>

    </body>
</html>

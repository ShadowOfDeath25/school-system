<div class="header">
    <div class="school-data">
        <span>{{config("app.school_data.governorate")}}</span>
        <span>{{config("app.school_data.administration")}}</span>
        <span>{{config("app.school_data.name")}}</span>
    </div>
    <div class="children">
        {{$slot}}
    </div>
    <div class="image-wrapper">
        @php
            $logo = public_path('logo.svg');
        @endphp

        @inlinedImage($logo)

    </div>
</div>

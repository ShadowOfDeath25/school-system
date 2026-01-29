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
        <img src="{{public_path("logo.svg") ?? "logo.svg"}}" alt="school-logo"/>
    </div>
</div>

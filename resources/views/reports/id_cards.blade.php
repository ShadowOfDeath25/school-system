<x-styles/>

<style>
    @font-face {
        font-family: 'readex-pro';
        src: url('{{ public_path("fonts/Readex_Pro/ReadexPro-VariableFont_HEXP,wght.ttf") }}') format('truetype');
        font-weight: 100 900;
        font-style: normal;
    }

    @page {
        size: A4 portrait;
        margin: 0;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'readex-pro', sans-serif !important;
    }

    html, body {
        width: 210mm !important;
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        direction: rtl !important;
        background-color: #ffffff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .page {
        width: 210mm !important;
        height: 297mm !important;
        box-sizing: border-box !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
        break-after: page !important;
        break-inside: avoid !important;
        display: block !important;
        overflow: hidden !important;
        position: relative !important;
    }

    .page:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
    }

    .grid-layout {
        width: 178mm;
        margin: 14mm auto 0 auto;
        display: grid;
        grid-template-columns: 85.6mm 85.6mm;
        grid-template-rows: repeat(4, 54mm);
        column-gap: 6.8mm;
        row-gap: 5mm;
        justify-content: center;
        direction: rtl;
    }

    .single-layout {
        width: 210mm;
        height: 297mm;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }

    .card {
        width: 85.6mm;
        height: 54mm;
        border: 1px solid #334155;
        border-radius: 2.5mm;
        overflow: hidden;
        padding: 2mm 2.5mm;
        position: relative;
        background: #ffffff;
        box-sizing: border-box;
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.5px solid #cbd5e1;
        padding-bottom: 1mm;
        margin-bottom: 1.5mm;
        height: 8mm;
    }

    .header-info {
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 1mm;
    }

    .header-info .school-name {
        font-size: 6.5pt;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.2;
    }

    .header-info .school-admin {
        font-size: 4.8pt;
        color: #64748b;
        line-height: 1.2;
    }

    .card-logo {
        width: 7mm;
        height: 7mm;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-logo svg,
    .card-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .card-body {
        display: flex;
        gap: 2.5mm;
        align-items: flex-start;

        height: 39mm;
    }

    .photo-section {
        width: 22mm;
        height: 28mm;
        border: 0.5px solid #cbd5e1;
        border-radius: 1.5mm;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8fafc;
        flex-shrink: 0;
    }

    .photo-section img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .placeholder-photo {
        width: 100%;
        height: 100%;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .placeholder-photo svg {
        width: 12mm;
        height: 12mm;
        fill: #94a3b8;
    }

    .info-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.2mm;
        padding-top: 2.5mm;

    }

    .info-row {
        display: flex;
        align-items: baseline;
        font-size: 5.5pt;
        line-height: 1.3;
    }

    .info-row.name-row {
        margin-bottom: 0.5mm;
    }

    .info-label {
        font-weight: 700;
        min-width: 14mm;
        color: #475569;
        flex-shrink: 0;
    }

    .info-value {
        color: #0f172a;
        font-weight: 500;
        word-break: break-word;
    }

    .info-value.name-value {
        font-weight: 700;
        font-size: 6.2pt;
        color: #0f172a;
    }

    .qr-container {
        position: absolute;
        bottom: 2mm;
        left: 2mm;
        width: 13.5mm;
        height: 13.5mm;
        background: #ffffff;
        padding: 0.5mm;
        border: 0.5px solid #cbd5e1;
        border-radius: 1mm;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    .qr-container img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }
</style>

@php
    $cardsPerPage = $layout === 'grid' ? 8 : 1;
    $chunks = $students->chunk($cardsPerPage);
@endphp

@foreach($chunks as $chunk)
    <div class="page">
        <div class="{{ $layout === 'grid' ? 'grid-layout' : 'single-layout' }}">
            @foreach($chunk as $student)
                <div class="card">
                    <div class="card-header">
                        <div class="card-logo">
                            @php
                                $logo = public_path('logo.svg');
                            @endphp
                            @if(file_exists($logo))
                                @inlinedImage($logo)
                            @endif
                        </div>
                        <div class="header-info">
                            <div class="school-name">{{ $schoolName }}</div>
                            @if(!empty($administration))
                                <div class="school-admin">{{ $administration }}</div>
                            @endif
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="photo-section">
                            @if($student->photo_url && file_exists($student->photo_url))
                                <img src="{{ $student->photo_url }}" alt="صورة الطالب">
                            @else
                                <div class="placeholder-photo">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                </div>
                            @endif
                        </div>
                        <div class="info-section">
                            <div class="info-row name-row">
                                <span class="info-label">الاسم:</span>
                                <span class="info-value name-value">{{ $student->name_in_arabic }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">الرقم القومي:</span>
                                <span class="info-value">{{ $student->nid }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">رقم القيد:</span>
                                <span class="info-value">{{ $student->reg_number }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">تاريخ الميلاد:</span>
                                <span class="info-value">{{ \Carbon\Carbon::parse($student->birth_date)->format('Y/m/d') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="qr-container">
                        <img src="data:image/svg+xml;base64,{{ $student->qr_svg }}" alt="QR">
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endforeach

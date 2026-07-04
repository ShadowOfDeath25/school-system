export const getMarkPerformanceColor = (marks, maxMarks) => {
    if (marks === null || marks === undefined || marks === '') return '#7f8c8d';
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return '#2ecc71';
    if (percentage >= 70) return '#3498db';
    if (percentage >= 50) return '#f39c12';
    return '#e74c3c';
};

export const getMarkPerformanceLabel = (marks, maxMarks) => {
    if (marks === null || marks === undefined || marks === '') return 'غير مسجل';
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'ممتاز';
    if (percentage >= 70) return 'جيد جداً';
    if (percentage >= 50) return 'مقبول';
    return 'ضعيف';
};

export const MarksHelper = {
    FIELDS: {
        EXAM_ID: {
            name: 'exam_id',
            label: 'الامتحان',
            type: 'select',
            placeholder: 'اختر الامتحان',
            required: true,
        },
        STUDENT_ID: {
            name: 'student_id',
            label: 'الطالب',
            type: 'select',
            placeholder: 'اختر الطالب',
            required: true,
        },
        COMPONENT_ID: {
            name: 'component_id',
            label: 'المكون',
            type: 'select',
            placeholder: 'اختر المكون',
            required: true,
        },
        MARKS: {
            name: 'marks',
            label: 'الدرجة',
            type: 'number',
            placeholder: 'درجة الطالب',
            min: 0,
        },
        ACADEMIC_YEAR: {
            name: 'academic_year',
            label: 'العام الدراسي',
            type: 'select',
            required: true,
            placeholder: 'اختر العام الدراسي',
        },
    },
};

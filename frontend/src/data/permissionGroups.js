export const PERMISSION_GROUPS = [
    {
        key: "students",
        title: "group.students",
        models: [
            "students",
            "student-enrollments",
            "student-transfers",
            "student-seat-assignments",
            "student-secret-assignments",
            "guardians",
            "guardian-students",
            "grades",
            "grade-ages",
            "subjects",
            "subject-types",
            "grade-subjects",
            "promotion-batches",
            "promotion-batch-students",
            "seat-numbers",
            "secret-numbers",
            "exemptions",
            "note-types",
        ],
    },
    {
        key: "finance",
        title: "group.finance",
        models: [
            "incomes",
            "income-types",
            "expenses",
            "expense-types",
            "bank-accounts",
            "payment-values",
            "extra-dues",
            "payments",
            "payment-reports",
        ],
    },
    {
        key: "exams",
        title: "group.exams",
        models: [
            "exams",
            "exam-halls",
            "marks",
        ],
    },
    {
        key: "store",
        title: "group.store",
        models: [
            "books",
            "book-purchases",
            "uniforms",
            "uniform-purchases",
        ],
    },
    {
        key: "buildings",
        title: "group.buildings",
        models: [
            "buildings",
            "floors",
            "classrooms",
            "buses",
            "stations",
        ],
    },
    {
        key: "reports",
        title: "group.reports",
        models: [
            "financial-reports",
            "student-reports",
            "net-income",
            "dashboard",
            "activity-logs",
        ],
    },
    {
        key: "academic",
        title: "group.academic",
        models: [
            "academic-years",
        ],
    },
    {
        key: "users",
        title: "group.users",
        models: [
            "users",
            "roles",
        ],
    },

];

export const OTHER_GROUP_KEY = "group.other";

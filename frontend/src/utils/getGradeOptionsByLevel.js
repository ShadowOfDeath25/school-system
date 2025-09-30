export const getGradeOptionsByLevel = (FormData) => {
    const gradeOptionsByLevel = {
        "رياض اطفال": [
            {label: "الأول", value: 1},
            {label: "الثاني", value: 2},
        ],
        "ابتدائي": [
            {label: "الاول", value: 1},
            {label: "الثاني", value: 2},
            {label: "الثالث", value: 3},
            {label: "الرابع", value: 4},
            {label: "الخامس", value: 5},
            {label: "السادس", value: 6},
        ],
        "اعدادي": [
            {label: "الأول", value: 1},
            {label: "الثاني", value: 2},
            {label: "الثالث", value: 3},
        ],
    };
    return gradeOptionsByLevel[FormData?.level] || [];
}

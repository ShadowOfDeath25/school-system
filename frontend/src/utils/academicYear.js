export const getAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    return [
        `${currentYear - 1}/${currentYear}`,
        `${currentYear}/${currentYear + 1}`
    ]
}

export const useAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    return [
        `${currentYear - 1}/${currentYear}`,
        `${currentYear}/${currentYear + 1}`
    ]
}

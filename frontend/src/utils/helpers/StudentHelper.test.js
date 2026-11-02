import { describe, it, expect } from 'vitest';
import { StudentHelper } from './StudentHelper.js';

describe('StudentHelper.getClassroomOptions - Academic Year Filtering', () => {
    const mockClassrooms = [
        {
            id: 1,
            name: '1/1 ابتدائي عربي (2024/2025)',
            academic_year: '2024/2025',
            grade: 3,
            language: 'عربي',
            capacity: 20,
            max_capacity: 30,
            is_active: false,
        },
        {
            id: 2,
            name: '1/1 ابتدائي عربي (2025/2026)',
            academic_year: '2025/2026',
            grade: 3,
            language: 'عربي',
            capacity: 25,
            max_capacity: 30,
            is_active: false,
        },
        {
            id: 3,
            name: '1/2 ابتدائي عربي (2025/2026)',
            academic_year: '2025/2026',
            grade: 3,
            language: 'عربي',
            capacity: 28,
            max_capacity: 30,
            is_active: false,
        },
        {
            id: 4,
            name: '1/1 ابتدائي عربي (2026/2027)',
            academic_year: '2026/2027',
            grade: 3,
            language: 'عربي',
            capacity: 10,
            max_capacity: 30,
            is_active: true,
        },
        {
            id: 5,
            name: '1/2 ابتدائي عربي (2026/2027)',
            academic_year: '2026/2027',
            grade: 3,
            language: 'عربي',
            capacity: 30,
            max_capacity: 30,
            is_active: true,
        },
    ];

    it('strictly filters candidate classrooms to the student current classroom academic year', () => {
        // Student is assigned to classroom 2 (2025/2026)
        const formData = {
            classroom_id: 2,
            grade: 3,
            language: 'عربي',
        };

        const options = StudentHelper.getClassroomOptions(formData, mockClassrooms, '2026/2027');

        // Only classrooms from 2025/2026 should be returned (id 2 and id 3)
        expect(options).toHaveLength(2);
        expect(options.map(o => o.value)).toEqual([2, 3]);
        expect(options.some(o => o.value === 1)).toBe(false); // 2024/2025 excluded
        expect(options.some(o => o.value === 4)).toBe(false); // 2026/2027 excluded
    });

    it('strictly filters candidate classrooms to active academic year when student is unassigned', () => {
        // Student is not assigned to any classroom
        const formData = {
            classroom_id: '',
            grade: 3,
            language: 'عربي',
            academic_year: 'غير مقيد',
        };

        const options = StudentHelper.getClassroomOptions(formData, mockClassrooms, '2026/2027');

        // Only classrooms from the active year 2026/2027 should be returned (id 4 and id 5)
        expect(options).toHaveLength(2);
        expect(options.map(o => o.value)).toEqual([4, 5]);
        expect(options.some(o => o.value === 1)).toBe(false);
        expect(options.some(o => o.value === 2)).toBe(false);
        expect(options.some(o => o.value === 3)).toBe(false);
    });

    it('resolves active academic year from is_active property on classrooms if activeYear is not passed', () => {
        const formData = {
            classroom_id: null,
            grade: 3,
            language: 'عربي',
        };

        const options = StudentHelper.getClassroomOptions(formData, mockClassrooms);

        // Fallback resolves to 2026/2027 because id 4 and 5 have is_active: true
        expect(options).toHaveLength(2);
        expect(options.map(o => o.value)).toEqual([4, 5]);
    });

    it('marks full classrooms as disabled while keeping the student current classroom enabled', () => {
        const formData = {
            classroom_id: 5, // Student is in full classroom 5
            grade: 3,
            language: 'عربي',
        };

        const options = StudentHelper.getClassroomOptions(formData, mockClassrooms, '2026/2027');

        const option4 = options.find(o => o.value === 4);
        const option5 = options.find(o => o.value === 5);

        expect(option4.disabled).toBe(false);
        // Classroom 5 is at 30/30 but it is the student's current classroom, so it must not be disabled
        expect(option5.disabled).toBe(false);
    });

    it('disables full classrooms for students moving into them', () => {
        const formData = {
            classroom_id: 4, // Student is in classroom 4
            grade: 3,
            language: 'عربي',
        };

        const options = StudentHelper.getClassroomOptions(formData, mockClassrooms, '2026/2027');

        const option5 = options.find(o => o.value === 5); // 30/30
        expect(option5.disabled).toBe(true);
        expect(option5.label).toContain('ممتلئ');
    });
});

import {CLASSROOMS} from "@constants/classrooms.js";

export const getGradeOptionsByLevel = (arg) => {
    let level;
    if (typeof arg === 'string') {
        level = arg;
    } else if (typeof arg === 'object' && arg !== null) {
        level = arg.level;
    }
    return CLASSROOMS.GRADES[level] || [];
}

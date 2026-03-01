import styles from './styles.module.css';
import RadioField from "@ui/RadioField/RadioField.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useGetAll} from "@hooks/api/useCrud.js";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import InputField from "@ui/InputField/InputField.jsx";
import TextArea from "@ui/TextArea/TextArea.jsx";
import {Activity} from "react";


export default function TuitionReports({formData, setFormData, academicYears, reportSubType}) {

    const {data: classrooms} = useGetAll("classrooms", {
        all: "true",
        academic_year: formData.academic_year,
        language: formData.language === "الكل" ? null : formData.language,
        level: formData.level,
        grade: formData.grade
    }, {
        disabled: !(formData.level && formData.grade && formData.language && formData.academic_year)
    });
    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
    }
    return (
        <div className={styles.container}>

            <SelectField
                label={"العام الدراسي"}
                options={academicYears}
                placeholder={"اختر العام الدراسي"}
                value={formData.academic_year}
                handleChange={handleChange}
                name={"academic_year"}
            />
            <SelectField
                label={"اللغة"}
                options={[
                    "عربي", "لغات", "الكل"
                ]}
                placeholder={"اختر اللغة"}
                value={formData.language}
                handleChange={handleChange}
                name={"language"}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.LEVEL}
                value={formData.level}
                handleChange={handleChange}
                name={"level"}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.GRADE}
                options={ClassroomHelper.getGradeOptionsByLevel(formData.level)}
                disabled={!formData.level}
                value={formData.grade}
                handleChange={handleChange}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.CLASSROOM}
                value={formData.classroom_id}
                name={"classroom_id"}
                disabled={!(formData.level && formData.grade && formData.language && formData.academic_year)}
                options={
                    classrooms?.data?.map(classroom => ({label: classroom.name, value: classroom.id}))
                }
                handleChange={handleChange}
            />
            <InputField
                type={"number"}
                min={0}
                label={"الحد الادني"}
                value={formData.min}
                name={"min"}
                handleChange={handleChange}
                placeholder={"الحد الادني"}
            />
            <SelectField
                label={"ترتيب / فرز"}
                value={formData.sorting}
                placeholder={"ترتيب / فرز"}
                handleChange={handleChange}
                name={"sorting"}
                options={[{label: "البنين اولًا", value: "maleFirst"}, {label: "البنات اولًا", value: "femaleFirst"}]}
            />

            <Activity
                mode={(reportSubType === "letters" || reportSubType === "arrearsLetters") ? "visible" : "hidden"}>
                <label htmlFor="letter">الخطاب</label>
                <textarea
                    id={"letter"}
                    name={"letter"}
                    value={formData.letter}
                    onChange={handleChange}
                    placeholder={"الخطاب"}
                />
            </Activity>
        </div>
    );
}


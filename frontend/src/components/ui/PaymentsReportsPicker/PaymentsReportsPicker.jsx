import styles from './styles.module.css';
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useState} from "react";
import RadioField from "@ui/RadioField/RadioField.jsx";
import {useGetAll} from "@hooks/api/useCrud.js";

import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import InputField from "@ui/InputField/InputField.jsx";
import TextArea from "@ui/TextArea/TextArea.jsx";

export default function PaymentsReportsPicker() {

    const {data: academicYears = []} = useGetAll('academic-years');
    const {data: classrooms} = useGetAll("classrooms", {all: "true"});
    const [formData, setFormData] = useState({
        reportType: "",
        reportSubType: "",
        academicYear: "",
        language: "",
        level: "",
        grade: "",
        classroom: "",
        min:"",
        letter:"",
        sorting:""
    })

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
    }
    return (
        <>
            <div className={styles.container}>
                <h4 className={styles.title}>خيارات العرض</h4>
                <div className={styles.body}>
                    <SelectField
                        label={"نوع التقرير"}
                        options={[
                            {
                                label: "المصروفات الدراسية",
                                value: "tuition"
                            }
                        ]
                        }
                        placeholder={"اختر نوع التقرير"}
                        value={formData.reportType}
                        handleChange={handleChange}
                        name={"reportType"}
                    />
                    <RadioField
                        name={"reportSubType"}
                        label={"التقرير"}
                        value={formData.reportSubType}
                        handleChange={handleChange}
                        options={[
                            {
                                label: "سجلات المصروفات",
                                value: "tuition records"
                            },
                            {
                                label: "متأخرات المصروفات",
                                value: "arrears"
                            },
                            {
                                label: "خطابات متأخرات المصروفات",
                                value: "arrearsLetters"
                            },
                            {
                                label: "خطابات",
                                value: "letters"
                            },
                            {
                                label: "احصائيات المصروفات",
                                value: "stats"
                            },
                            {
                                label: "الاحصائيات اليومية",
                                value: "dailyStats"
                            }

                        ]}
                    />
                    <div className={styles.mainInputs}>
                        <SelectField
                            label={"العام الدراسي"}
                            options={academicYears}
                            placeholder={"اختر العام الدراسي"}
                            value={formData.academicYear}
                            handleChange={handleChange}
                            name={"academicYear"}
                        />
                        <SelectField
                            label={"اللغة"}
                            name={"language"}
                            placeholder={"اختر اللغة"}
                            options={["عربي", "لغات", "الكل"]}
                            value={formData.language}
                            handleChange={handleChange}
                        />
                        <SelectField
                            {...ClassroomHelper.FIELDS.LEVEL}
                            value={formData.level}
                            handleChange={handleChange}
                        />

                        <SelectField
                            {...ClassroomHelper.FIELDS.GRADE}
                            disabled={formData.level === ""}
                            options={ClassroomHelper.getGradeOptionsByLevel(formData.level) || []}
                            value={formData.grade}
                            handleChange={handleChange}
                        />
                        <SelectField
                            {...ClassroomHelper.FIELDS.CLASSROOM}
                            disabled={formData.level === "" || formData.grade === ""}
                            options={[
                                ...new Set(
                                    classrooms?.data
                                        ?.filter(classroom => classroom.grade === formData.grade && classroom.level === formData.level)
                                        .map(classroom => ({
                                                label: classroom.name + " " + classroom.language,
                                                value: classroom.id
                                            })
                                        )),{label: "الكل", value: "all"}]}
                            value={formData.classroom}
                            handleChange={handleChange}
                            multiple={false}
                        />
                        <InputField
                            type={"number"}
                            name={"min"}
                            value={formData.min}
                            handleChange={handleChange}
                            label={"الحد الأدنى"}
                            placeholder={"ادخل الحد الادني"}
                        />
                        <SelectField
                            name={"sorting"}
                            label={"ترتيب / فرز"}
                            options={[{label:"البنين اولًا",value:"maleFirst"},{label:"البنات اولًا",value:"femaleFirst"}]}
                            placeholder={"ترتيب / فرز"}
                            value={formData.sorting}
                            handleChange={handleChange}
                            multiple={false}
                        />
                    </div>
                    {formData.reportSubType === "letters" &&
                        <TextArea
                            value={formData.letter}
                            handleChange={handleChange}
                            name={"letter"}
                            label={"الخطاب"}
                            placeholder={"الخطاب"}

                        />

                    }
                </div>

                <div className={styles.actions}></div>
            </div>
        </>
    );
}


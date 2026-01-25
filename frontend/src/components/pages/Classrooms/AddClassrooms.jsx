import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@utils/helpers/ClassroomHelper.js";


export default function AddClassrooms() {
    const creationMutation = useCreate("classrooms");
    const {data: academicYears = []} = useGetAll('academic-years');
    const {data: buildings = []} = useGetAll('buildings');
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState(null);


    const onFormSubmit = (data, formActions) => {
        setServerErrors(null);
        creationMutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم إضافة الفصل بنجاح");
                formActions.resetForm();
                setServerErrors(null);
            },
            onError: (error) => {
                showSnackbar("حدث خطأ أثناء إضافة الفصل", "error");
                if (error?.response?.data?.errors) {
                    setServerErrors(error.response.data.errors);
                }
            }
        });
    };

    return (
        <Page>
            <Form
                fields={
                    [
                        ...ClassroomHelper.getAllFields().filter(field => field.name !== 'classroom')
                            .map(field => field.name === 'academic_year' ? {...field, options: academicYears} : field),
                        {
                            name: "building",
                            type: "select",
                            options: buildings?.data?.map(building => ({
                                label: building.name,
                                value: buildings.data.indexOf(building)
                            })),
                            required: true,
                            label: "المبني",
                            placeholder: "اختر المبني"
                        },
                        {
                            name: "floor_id",
                            type: "select",
                            options: (buildingIndex) => buildings?.data?.[buildingIndex]?.floors?.map(floor => ({
                                label: floor.name,
                                value: floor.id
                            })),
                            dependency: "building",
                            required: true,
                            label: "الطابق",
                            placeholder: "اختر الطابق",
                            disabled: (buildingIndex) => (buildingIndex ==="")
                        }

                    ]}
                onFormSubmit={onFormSubmit}
                serverErrors={serverErrors}
            />
        </Page>
    );
}

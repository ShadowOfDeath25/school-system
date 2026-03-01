import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import { useCurrentUser } from "@hooks/api/auth.js";
import Table from "@ui/Table/Table.jsx";
import { useCreate, useGetAll } from '@hooks/api/useCrud.js'
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useState } from "react";

export default function Stations() {
    const { data: user } = useCurrentUser()
    const userCanCreate = user?.role.includes("Super Admin") || user.permissions.includes('create stations')
    const mutation = useCreate('stations');
    const { showSnackbar } = useSnackbar();
    const { data: academicYears = [] } = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    });
    const [serverErrors, setServerErrors] = useState();
    const onSubmit = (data, actions) => {
        const normalizedData = {}
        for (const item in data) {
            if (data[item] !== "") {
                normalizedData[item] = data[item];
            }
        }
        mutation.mutate(normalizedData, {
            onSuccess: () => {
                showSnackbar("تم اضافة المحطة بنجاح");
                actions.resetForm()
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar(error?.response?.data?.message, "error");
            }
        })
    }
    return (
        <>
            <Page>
                <Form
                    onFormSubmit={onSubmit}
                    serverErrors={serverErrors}
                    fields={[
                        { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears },
                        {
                            name: "city",
                            label: "المدينة",
                            required: true,
                            placeholder: "المدينة",
                            type: "text"
                        },
                        {
                            name: "neighborhood",
                            label: "المنطقة",
                            required: true,
                            placeholder: "المنطقة",
                            type: "text"
                        },
                        {
                            name: "value",
                            label: "القيمة",
                            required: false,
                            placeholder: "القيمة",
                            type: "number"
                        }
                    ]}
                />
                <Table
                    resource={"stations"}
                    editable={false}
                    fields={[
                        { name: "city" }, { name: "neighborhood" }, { name: "academic_year" }, { name: "value" }
                    ]}
                />
            </Page>
        </>
    );
}


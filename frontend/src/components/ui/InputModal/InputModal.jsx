import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import styles from './styles.module.css';
import Form from "@ui/Form/Form.jsx";
import {useMemo, useState} from "react";
import checkRequiredFields from "@utils/checkRequiredFields.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";

export default function InputModal({
                                       open,
                                       onCancel,
                                       fields,
                                       item,
                                       onSave,
                                       isLoading,
                                       serverErrors,
                                       buttonText = "حفظ التغييرات",

                                   }) {
    const {showSnackbar} = useSnackbar();

    const isSectioned = fields.length > 0 && fields[0].hasOwnProperty('fields');

    const fieldsWithValues = useMemo(() => {
        if (!item) return fields;


        if (isSectioned) {
            return fields.map(section => ({
                ...section,
                fields: section.fields.map(field => ({
                    ...field,
                    value: item[field.name] ?? field.value ?? ''
                }))
            }));
        }

        return fields.map(field => ({
            ...field,
            value: item[field.name] ?? field.value ?? item.permissions?.[field.name] ?? ''
        }));
    }, [fields, item]);
    const values = useMemo(() => {
        const temp = {}
        const assignValue = (field) => {
            if (field.type === 'age') {
                temp[`${field.name}_years`] = item?.[`${field.name}_years`] ?? '';
                temp[`${field.name}_months`] = item?.[`${field.name}_months`] ?? '';
            } else {
                temp[field.name] = field.value ?? '';
            }
        }
        if (isSectioned) {
            fieldsWithValues.forEach(section => {
                section.fields.forEach(assignValue)
            })
        } else {
            fieldsWithValues.forEach(assignValue)
        }
        return temp;
    }, [fieldsWithValues, isSectioned, item])

    const [formValues, setFormValues] = useState(values);

    const allFields = useMemo(() => {
        return isSectioned ? fields.flatMap(section => section.fields) : fields;
    }, [fields]);

    const areAllRequiredFieldsFilled = useMemo(() => {
        return checkRequiredFields(formValues, allFields);
    }, [formValues, allFields]);


    const handleFormSubmit = (formData) => {

        if (onSave && item) {
            onSave({...formData, id: item.id});
        } else if (onSave) {
            if (checkRequiredFields(formData, allFields)) {
                onSave({...formData})
            } else {
                showSnackbar("يرجى ملء جميع الحقول المطلوبة", "error");
            }
        }
    };
    return (
        <>
            <Dialog
                open={open}
                onClose={onCancel}
                className={`${styles.editModal} editModal `}
                disableEscapeKeyDown={isLoading}
                fullWidth
                maxWidth="sm"

            >
                <DialogContent className={styles.editModalContent}>

                    <Form
                        isModal={true}
                        id="input-form"
                        fields={fieldsWithValues}
                        onFormSubmit={handleFormSubmit}
                        serverErrors={serverErrors}
                        hideSubmitButton={true}
                        values={formValues}
                        setValues={setFormValues}
                    />

                </DialogContent>
                <DialogActions className={styles.actions}>
                    <Button onClick={onCancel} sx={{color: 'var(--btn-ghost-text)'}}
                            disabled={isLoading}>إلغاء</Button>
                    <Button form="input-form" type="submit" autoFocus variant="contained" color="primary"
                            disabled={isLoading || !areAllRequiredFieldsFilled}>
                        {isLoading ? 'جاري الحفظ...' : buttonText}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

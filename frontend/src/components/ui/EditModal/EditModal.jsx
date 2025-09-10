import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import styles from './styles.module.css';
import Form from "@ui/Form/Form.jsx";
import {useMemo} from "react";

export default function EditModal({open, onCancel, fields, item, onSave, isLoading, serverErrors}) {


    const fieldsWithValues = useMemo(() => {
        if (!item) return fields;
        return fields.map(field => ({
            ...field,
            value: item[field.name] ?? field.value ?? ''
        }));
    }, [fields, item]);


    const handleFormSubmit = (formData) => {
        if (onSave) {
            onSave({...formData, id: item.id});
        }
        console.log(formData)
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
                            id="edit-form"
                            fields={fieldsWithValues}
                            onFormSubmit={handleFormSubmit}
                            serverErrors={serverErrors}
                            hideSubmitButton={true}
                        />

                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} sx={{color: 'var(--primary-text-color)'}} disabled={isLoading}>إلغاء</Button>
                    <Button form="edit-form" type="submit" autoFocus variant="contained" color="primary"
                            disabled={isLoading}>
                        {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

import {useState, useCallback, useEffect} from "react";

const useForm = ({initialValues, fields, onSubmit, serverErrors}) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const resetForm = useCallback(() => {
        setFormData(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    useEffect(() => {
        if (serverErrors && Object.keys(serverErrors).length > 0) {
            const newErrors = {};
            for (const fieldName in serverErrors) {
                if (initialValues.hasOwnProperty(fieldName)) {
                    newErrors[fieldName] = serverErrors[fieldName][0];
                }
            }
            setErrors(prev => ({...prev, ...newErrors}));

            if (initialValues.hasOwnProperty('password')) {
                setFormData(prev => ({
                    ...prev,
                    password: "",
                    password_confirmation: ""
                }));
            }
        }
    }, [serverErrors, initialValues]);

    const validateField = useCallback((name, value, currentFormData) => {
        const field = fields.find(f => f.name === name);
        if (!field?.validator) return null;

        const isValid = name === 'password_confirmation'
            ? field.validator(currentFormData.password, value)
            : field.validator(value);

        return isValid ? null : (field.error || 'Invalid field');
    }, [fields]);

    const handleChange = useCallback((e) => {
        const {name, value} = e.target;
        setFormData(prevData => {
            const newFormData = {...prevData, [name]: value};

            if (touched[name]) {
                const error = validateField(name, value, newFormData);
                setErrors(prevErrors => ({...prevErrors, [name]: error}));
            }

            if (name === 'password' && newFormData.password_confirmation !== undefined && (touched.password_confirmation || errors.password_confirmation)) {
                const confirmError = validateField('password_confirmation', newFormData.password_confirmation, newFormData);
                setErrors(prevErrors => ({...prevErrors, password_confirmation: confirmError}));
            }

            return newFormData;
        });
    }, [validateField, touched, errors.password_confirmation]);

    const handleBlur = useCallback((e) => {
        const {name, value} = e.target;
        if (!touched[name]) {
            setTouched(prev => ({...prev, [name]: true}));
        }
        const error = validateField(name, value, formData);
        setErrors(prev => ({...prev, [name]: error}));
    }, [validateField, formData, touched]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setTouched(fields.reduce((acc, field) => ({...acc, [field.name]: true}), {}));

        let isFormValid = true;
        const newErrors = {};
        for (const field of fields) {
            const error = validateField(field.name, formData[field.name], formData);
            newErrors[field.name] = error;
            if (error) {
                isFormValid = false;
            }
        }

        setErrors(newErrors);

        if (isFormValid) {
            onSubmit(formData, { resetForm });
        } else {
            console.log("Form is invalid, please check the errors.");
        }
    };
    const setFieldValue = useCallback((name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // When a field's value is set programmatically (e.g., a reset),
        // clear any existing error and touched state for it.
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[name];
            return newErrors;
        });
        setTouched(prev => {
            const newTouched = {...prev};
            delete newTouched[name];
            return newTouched;
        });
    }, []);

    return {formData, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue};
};

export default useForm;

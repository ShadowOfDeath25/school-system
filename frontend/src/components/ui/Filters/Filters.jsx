import styles from './styles.module.css'
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useFilters} from "@hooks/api/useCrud.js";
import {useTranslation} from "react-i18next";
import RadioField from "@ui/RadioField/RadioField.jsx";
import InputField from "@ui/InputField/InputField.jsx";

export default function Filters({onSubmit, resource, fields = [], additionalFields = [], labels: labels = {}}) {
    const {data: fieldsData, isLoading} = useFilters(resource);
    const [filters, setFilters] = useState({});

    const {t} = useTranslation();
    const handleChange = (event) => {
        const {name, value} = event.target;

        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };


    const handleReset = () => {
        setFilters({});
        onSubmit({});
    };

    const handleSubmit = () => {
        onSubmit(filters);
    };
    const renderField = (field) => {
        const commonProps = {
            ...field,
            value: filters[field.name],
            handleChange: handleChange,
            options: typeof field.options === 'function'
                ? field.dependency
                    ? Array.isArray(field.dependency)
                        ? field.options(field.dependency.map(d => filters[d]))
                        : field.options(filters[field.dependency])
                    : field.options(filters)
                : field.options,
            disabled: typeof field.disabled === 'function'
                ? field.dependency
                    ? field.disabled(Array.isArray(field.dependency) ? field.dependency.map(d => filters[d]) : filters[field.dependency])
                    : field.disabled(filters)
                : field.disabled,
        };
        switch (field.type) {
            case 'select':
                return <SelectField key={field.id || field.name} {...commonProps} />;
            case 'radio':
                return <RadioField key={field.id || field.name} {...commonProps} />;
            default:
                return <InputField key={field.id || field.name} {...commonProps} />;
        }

    }

    const allCustomFields = [...fields, ...additionalFields];
    const customFieldNames = new Set(allCustomFields.map(f => f.name));

    const finalFields = [
        ...Object.keys(fieldsData || {})
            .filter(fieldName => !customFieldNames.has(fieldName))
            .map(fieldName => {
                const label = t(labels[fieldName]) || t(fieldName);
                return {
                    name: fieldName,
                    label: label,
                    id: fieldName,
                    type: 'select',
                    multiple: true,
                    options: fieldsData[fieldName],
                    placeholder: `اختر ${label}`
                };
            }),
        ...allCustomFields
    ];

    return (
        <div className={styles.container}>
            <h3>خيارات العرض</h3>
            {isLoading ? <LoadingScreen/> :
                <div className={styles.filtersContainer}>
                    {finalFields.map(renderField)}
                </div>
            }
            <div className={styles.actions}>
                <button onClick={handleSubmit}>عرض</button>
                <button onClick={handleReset}>إعادة تعيين</button>
            </div>
        </div>
    );
}

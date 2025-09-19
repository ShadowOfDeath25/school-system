import styles from './styles.module.css'
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useFilters} from "@hooks/api/useCrud.js";
import {useTranslation} from "react-i18next";
import RadioField from "@ui/RadioField/RadioField.jsx";
import InputField from "@ui/InputField/InputField.jsx";

export default function Filters({onSubmit, resource, fields = []}) {
    const {data: fieldsData, isLoading} = useFilters(resource);
    const [filters, setFilters] = useState({});

    const {t, i18n} = useTranslation();
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
            options: typeof field.options === 'function' ? field.options(filters[field.dependency]) : field.options,
            disabled: typeof field.disabled === 'function' ? field.disabled(filters[field.dependency]) : field.disabled,
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

    const propFieldNames = new Set(fields.map(f => f.name));

    return (
        <div className={styles.container}>
            <h3>خيارات العرض</h3>
            {isLoading ? <LoadingScreen/> :
                <div className={styles.filtersContainer}>
                    {Object.keys(fieldsData || {})
                        .filter(fieldName => !propFieldNames.has(fieldName))
                        .map(field => (
                            <SelectField
                                key={field}
                                name={field}
                                label={t(field)}
                                id={field}
                                multiple={true}
                                options={fieldsData[field]}
                                placeholder={`اختر ${t(field)}`}
                                handleChange={handleChange}
                                value={filters[field] || []}
                            />
                        ))}
                    {fields.map(renderField)}
                </div>
            }
            <div className={styles.actions}>
                <button onClick={handleSubmit}>عرض</button>
                <button onClick={handleReset}>إعادة تعيين</button>
            </div>
        </div>
    );
}

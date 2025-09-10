import styles from './styles.module.css'
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useCallback, useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useFilters} from "@hooks/api/useCrud.js";
import {useTranslation} from "react-i18next";

export default function Filters({onSubmit, resource}) {
    const {data: fieldsData, isLoading} = useFilters(resource);
    const [filters, setFilters] = useState({});

    const {t, i18n} = useTranslation();
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };
        console.log(filters)

    const handleReset = () => {
        setFilters({});
        onSubmit({});
    };

    const handleSubmit = () => {
        onSubmit(filters);
    };

    return (
        <div className={styles.container}>
            <h3>خيارات العرض</h3>
            {isLoading ? <LoadingScreen/> :
                <div className={styles.filtersContainer}>
                    {Object.keys(fieldsData || {}).map(field => (
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
                </div>
            }
            <div className={styles.actions}>
                <button onClick={handleSubmit}>عرض</button>
                <button onClick={handleReset}>إعادة تعيين</button>
            </div>
        </div>
    );
}

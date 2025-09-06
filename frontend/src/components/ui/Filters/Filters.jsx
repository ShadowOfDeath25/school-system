import styles from './styles.module.css'
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useCallback, useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useFilters} from "@hooks/api/useCrud.js";

export default function Filters({onSubmit, resource, fields}) {
    const {data: fieldsData, isLoading} = useFilters(resource);
    const [filters, setFilters] = useState({});

    const handleChange = useCallback((e) => {
        const {name, value} = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    }, []);

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
                            label={fields[field]}
                            id={field}
                            options={fieldsData[field].map(option => ({label: option, value: option}))}
                            placeholder={`اختر ${fields[field]}`}
                            handleChange={handleChange}
                            value={filters[field] || ''}
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

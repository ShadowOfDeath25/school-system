import styles from './styles.module.css'
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useState} from "react";

export default function Filters({fields,onSubmit}) {

    return (
        <div className={styles.container}>
            <h3>خيارات العرض</h3>
            <div className={styles.filtersContainer}>
                {fields.map((field, index) => {
                    return <SelectField
                        key={index}
                        name={field.name}
                        label={field.label}
                        id={field.id}
                        options={field.options}
                        placeholder={field.placeholder}
                    />
                })}
            </div>
            <button>عرض</button>
        </div>
    );
}


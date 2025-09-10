import styles from './styles.module.css';
import {FormHelperText, MenuItem, Select} from '@mui/material';

export default function SelectField({
                                        name,
                                        label,
                                        id,
                                        value,
                                        handleChange,
                                        handleBlur,
                                        isValid,
                                        error,
                                        placeholder,
                                        options = [],
                                        multiple = false,
                                    }) {
    const isInvalid = isValid === false;

    const selectValue = multiple ? (Array.isArray(value) ? value : []) : value ?? '';

    // For multiple select, we need to define how to render the selected values,
    // especially to show a placeholder when no options are selected.
    const renderMultipleValue = (selected) => {
        if (selected.length === 0) {
            // When nothing is selected, show the placeholder.
            return placeholder ? <em>{placeholder}</em> : null;
        }
        // Otherwise, show the labels of the selected options.
        return selected.map((val) => options.find((opt) => opt.value === val)?.label || val).join(', ');
    };


    return (
        <div className={styles.inputWrapper}>
            <label for={id}>{label}</label>
            <div className={styles.selectContainer}>
                <Select
                    className={styles.selectField}
                    id={id}
                    name={name}
                    value={selectValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiple={multiple}
                    error={isInvalid}
                    displayEmpty={!!placeholder}
                    variant={"filled"}
                    dir={"ltr"}
                    renderValue={multiple ? renderMultipleValue : undefined}
                >
                    {placeholder && !multiple && (
                        <MenuItem value="" disabled>
                            <em>{placeholder}</em>
                        </MenuItem>
                    )}
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value} disabled={option.disabled === true}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                {isInvalid && <FormHelperText error>{error}</FormHelperText>}
            </div>

        </div>
    );
}

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
                                        disabled = false,
                                    }) {
    const isInvalid = isValid === false;

    const selectValue = multiple ? (Array.isArray(value) ? value : []) : value ?? '';
    const renderMultipleValue = (selected) => {
        if (selected.length === 0) {

            return placeholder ? <em>{placeholder}</em> : null;
        }

        return selected.map((val) => options.find((opt) => opt.value === val)?.label || val).join(' ، ');
    };


    return (
        <div className={`${styles.inputWrapper} ${label ? '' : styles.noLabel}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <div className={styles.selectContainer}>
                <Select
                    sx={{
                        borderRadius: "5px",
                        "&:before": {borderBottom: "none"},
                        "&:after": {borderBottom: "none"},
                        "&:hover:not(.Mui-disabled):before": {borderBottom: "none"},
                    }}
                    className={styles.selectField}
                    id={id}
                    name={name}
                    value={selectValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiple={multiple}
                    error={isInvalid}
                    disabled={disabled}
                    displayEmpty={!!placeholder}
                    variant={"filled"}
                    dir={"rtl"}
                    renderValue={multiple ? renderMultipleValue : undefined}
                >
                    {placeholder && !multiple && (
                        <MenuItem value="" disabled>
                            <em>{placeholder}</em>
                        </MenuItem>
                    )}
                    {options.map((option) => (
                        <MenuItem
                            key={option.value === undefined ? option : option.value}
                            value={option.value === undefined ? option : option.value}
                            disabled={option.disabled ?? false}>
                            {option.label ?? option}
                        </MenuItem>
                    ))}
                </Select>
                {isInvalid && <FormHelperText error>{error}</FormHelperText>}
            </div>

        </div>
    );
}

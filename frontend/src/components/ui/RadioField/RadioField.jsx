import styles from './styles.module.css';
import {FormControlLabel, FormHelperText, Radio, RadioGroup} from '@mui/material';

export default function RadioField({
                                       name, label, id, value, handleChange, handleBlur, isValid, error, options = [],
                                   }) {
    const isInvalid = isValid === false;

    return (<div className={styles.inputWrapper}>
        <label id={`${id}-label`}>{label}</label>
        <div className={styles.radioContainer}>
            <RadioGroup
                row
                aria-labelledby={`${id}-label`}
                name={name}
                value={value ?? ''}
                onChange={handleChange}
                onBlur={handleBlur}
                id={id}
                className={styles.radioGroup}
            >
                {options.map((option) => (<FormControlLabel
                    key={option.value === undefined ? option : option.value}
                    value={option.value === undefined ? option : option.value}
                    control={<Radio/>}
                    label={option.label || option}
                    disabled={option.disabled === true}
                />))}
            </RadioGroup>
            {isInvalid && <FormHelperText error>{error}</FormHelperText>}
        </div>
    </div>);
}

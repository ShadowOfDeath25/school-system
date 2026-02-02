import styles from './styles.module.css';
import {FormControlLabel, FormHelperText, Radio, RadioGroup} from '@mui/material';
import {Activity} from "react";
import {useWindowSize} from "@hooks/useWindowSize.js";

export default function RadioField({
                                       name, label, id, value, handleChange, handleBlur, isValid, error, options = [],
                                   }) {
    const isInvalid = isValid === false;
    const {width} = useWindowSize();
    return (<div className={styles.inputWrapper}>
        <Activity mode={label ? "visible" : "hidden"}>
            <label id={`${id}-label`}>{label}</label>
        </Activity>
        <div className={`${styles.radioContainer} ${label ? "" : styles.fullWidth}`}>
            <RadioGroup
                row={(width > 768)}
                sx={{width: label ? "" : "100% !important"}}
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
                    sx={{width: "20%"}}
                    label={option.label || option}
                    disabled={option.disabled === true}

                />))}
            </RadioGroup>
            {isInvalid && <FormHelperText error>{error}</FormHelperText>}
        </div>
    </div>);
}

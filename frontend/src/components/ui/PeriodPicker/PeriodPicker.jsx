import { useState } from 'react';
import styles from './styles.module.css';
import SelectField from '../SelectField/SelectField';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { getAcademicYears } from "@utils/getAcademicYears.js";
import { usePersistedState } from "@hooks/usePersistedState.js";

export default function PeriodPicker({ onSubmit }) {
    const academicYearOptions = getAcademicYears();
    const [academicYear, setAcademicYear] = usePersistedState(academicYearOptions[1]);
    const [viewType, setViewType] = useState('period');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = () => {
        if (onSubmit) {
            switch (viewType) {
                case 'period':
                    onSubmit({
                        startDate: startDate,
                        endDate: endDate
                    })
                    break;
                case 'day':
                    onSubmit({
                        startDate: startDate,
                        endDate: endDate,
                    })
                    break;
                case 'year': {
                    const [startYear, endYear] = academicYear.split('/');
                    onSubmit({
                        startDate: `${startYear}-09-01`,
                        endDate: `${endYear}-08-31`
                    })
                }
            }
        }
    };

    const handleViewTypeChange = (event) => {
        setViewType(event.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span>خيارات العرض</span>
                </div>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.row}>
                    <label className={styles.label}>العام الدراسي</label>
                    <div className={styles.selectContainer}>
                        <SelectField
                            name="academicYear"
                            id="academicYear"
                            value={academicYear}
                            handleChange={(e) => setAcademicYear(e.target.value)}
                            options={academicYearOptions}
                            placeholder="اختر العام"
                            label=""
                        />
                    </div>
                </div>

                <div className={styles.row} style={{ alignItems: 'flex-start', }}>
                    <label className={styles.label} style={{ marginTop: '10px' }}>عرض بواسطة</label>

                    <RadioGroup
                        row
                        name="viewType"
                        value={viewType}
                        onChange={handleViewTypeChange}
                        className={styles.radioGroup}
                    >
                        <div className={styles.radioOptionWrapper}>
                            <FormControlLabel
                                value="period"
                                control={<Radio sx={{
                                    color: 'var(--secondary-color)',
                                    '&.Mui-checked': { color: 'var(--secondary-color)' }
                                }} />}
                                label="فترة زمنية"
                                sx={{ color: 'var(--primary-text-color)' }}
                            />
                            {viewType === 'period' && (
                                <div className={styles.dateInputs}>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <span style={{ margin: '0 5px' }}>الى</span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.radioOptionWrapper}>
                            <FormControlLabel
                                value="day"
                                control={<Radio sx={{
                                    color: 'var(--secondary-color)',
                                    '&.Mui-checked': { color: 'var(--secondary-color)' }
                                }} />}
                                label="اليوم"
                                sx={{ color: 'var(--primary-text-color)' }}
                            />
                            {viewType === 'day' && (
                                <div className={styles.dateInputs}>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            )}
                        </div>


                        <FormControlLabel
                            value="year"
                            control={<Radio sx={{
                                color: 'var(--secondary-color)',
                                '&.Mui-checked': { color: 'var(--secondary-color)' }
                            }} />}
                            label="طوال العام"
                            sx={{ color: 'var(--primary-text-color)' }}
                        />
                    </RadioGroup>
                </div>
                <div className={styles.actions}>
                    <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleSubmit}>
                        عرض
                    </button>
                    <button className={`${styles.button} ${styles.secondaryButton}`}>
                        طباعة
                    </button>
                </div>
            </div>
        </div>
    );
}

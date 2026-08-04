import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import SearchIcon from '@mui/icons-material/Search';
import CustomAccordion from "@ui/Accordion/CustomAccordion.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import {PERMISSION_GROUPS, OTHER_GROUP_KEY} from "../../../data/permissionGroups.js";
import styles from "./styles.module.css";

export default function PermissionSelector({
                                               permissions = {},
                                               value = [],
                                               onChange,
                                               groups = PERMISSION_GROUPS,
                                           }) {
    const {t} = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [collapsed, setCollapsed] = useState(() => new Set());

    const normalizedTerm = searchTerm.trim().toLowerCase();

    const matchesSearch = (model) => {
        if (!normalizedTerm) return true;
        const actions = permissions[model] || [];
        const haystack = [
            t(model),
            model,
            ...actions,
            ...actions.map(action => t(action)),
            ...actions.map(action => `${action} ${model}`),
        ].join(" ").toLowerCase();
        return haystack.includes(normalizedTerm);
    };

    const allGroups = useMemo(() => {
        const mapped = groups.map(group => ({
            ...group,
            models: group.models.filter(model => permissions[model]),
        }));

        const mappedModels = new Set(groups.flatMap(group => group.models));
        const otherModels = Object.keys(permissions).filter(model => !mappedModels.has(model));

        return [...mapped, ...(otherModels.length ? [{
            key: "other",
            title: OTHER_GROUP_KEY,
            models: otherModels,
        }] : [])]
            .filter(group => group.models.length > 0);
    }, [groups, permissions]);

    const filteredGroups = useMemo(() => allGroups
        .map(group => ({
            ...group,
            models: group.models.filter(matchesSearch),
        }))
        .filter(group => group.models.length > 0),
    [allGroups, normalizedTerm, t, permissions]);

    const getModelSelections = (model) => value.filter(v => v.endsWith(` ${model}`));

    const handleModelChange = (model, modelValues) => {
        const others = value.filter(v => !v.endsWith(` ${model}`));
        onChange([...others, ...modelValues]);
    };

    const toggleAccordion = (key) => {
        setCollapsed(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const groupSelectedCount = (group) => (
        group.models.reduce((count, model) => count + getModelSelections(model).length, 0)
    );

    return (
        <div className={styles.permissionSelector}>
            <div className={styles.searchContainer}>
                <SearchIcon className={styles.searchIcon}/>
                <input
                    type="text"
                    placeholder={t("permissionSearch")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {filteredGroups.length === 0 && (
                <p className={styles.emptyState}>{t("permissionNoResults")}</p>
            )}

            {filteredGroups.map(group => {
                const expanded = normalizedTerm ? true : !collapsed.has(group.key);
                const selectedCount = groupSelectedCount(group);
                return (
                    <CustomAccordion
                        key={group.key}
                        header={`${t(group.title)}${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
                        expanded={expanded}
                        onChange={() => toggleAccordion(group.key)}
                    >
                        <div className={styles.permissionGrid}>
                            {group.models.map(model => {
                                const actions = permissions[model] || [];
                                const options = actions.map(action => ({
                                    label: t(action),
                                    value: `${action} ${model}`,
                                }));
                                return (
                                    <SelectField
                                        key={model}
                                        name={model}
                                        label={t(model)}
                                        value={getModelSelections(model)}
                                        options={options}
                                        multiple
                                        placeholder={t("permissionNone") || "لا صلاحية"}
                                        isModal
                                        handleChange={(e) => handleModelChange(model, e.target.value)}
                                    />
                                );
                            })}
                        </div>
                    </CustomAccordion>
                );
            })}
        </div>
    );
}
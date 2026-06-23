import StatCard from "@ui/StatCard/StatCard.jsx";
import GroupsIcon from '@mui/icons-material/Groups';
import WcIcon from '@mui/icons-material/Wc';
import MosqueIcon from '@mui/icons-material/Mosque';
import ChurchIcon from '@mui/icons-material/Church';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export default function RosterSummaryCards({ summary }) {
    if (!summary) return null;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
        }}>
            <StatCard
                stat={summary.total}
                label="الإجمالي"
                icon={<GroupsIcon />}
                backgroundColor="#1b223c"
            />
            <StatCard
                stat={summary.new_count}
                label="مستجد"
                icon={<PersonAddIcon />}
                backgroundColor="#2e7d32"
            />
            <StatCard
                stat={summary.registered_count}
                label="مقيد"
                icon={<HowToRegIcon />}
                backgroundColor="#1565c0"
            />
            <StatCard
                stat={summary.male_count}
                label="ذكور"
                icon={<WcIcon />}
                backgroundColor="#6a1b9a"
            />
            <StatCard
                stat={summary.female_count}
                label="إناث"
                icon={<WcIcon />}
                backgroundColor="#c62828"
            />
            <StatCard
                stat={summary.muslim_count}
                label="مسلم"
                icon={<MosqueIcon />}
                backgroundColor="#4e342e"
            />
            <StatCard
                stat={summary.christian_count}
                label="مسيحي"
                icon={<ChurchIcon />}
                backgroundColor="#37474f"
            />
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.watermark} aria-hidden="true">
        ممنوع
      </div>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>403</h1>
        <div className={styles.divider} />
        <h2 className={styles.heading}>غير مصرح بالوصول</h2>
        <p className={styles.description}>
          لا تملك الصلاحية للوصول إلى هذه الصفحة.
          <br />
          يرجى التواصل مع المسؤول إذا كان هذا خطأ.
        </p>
        <button
          className={styles.button}
          onClick={() => navigate('/')}
          type="button"
        >
          العودة إلى الرئيسية
        </button>
      </div>
    </div>
  );
}

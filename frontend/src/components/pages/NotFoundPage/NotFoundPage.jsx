import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.watermark} aria-hidden="true">
        غائب
      </div>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <div className={styles.divider} />
        <h2 className={styles.heading}>الصفحة غير موجودة</h2>
        <p className={styles.description}>
          ربما تم نقل الصفحة أو حذفها.
          <br />
          تحقق من الرابط أو عد إلى الصفحة الرئيسية.
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

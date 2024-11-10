import styles from './InfoDivided.module.css';

export interface InfoDividedProps {
  label?: string;
  value?: string | number;
}

export const InfoDivided = ({ label, value }: InfoDividedProps) => {
  if (!label || !value) return null;
  return (
    <div className={styles.InfoDividedContainer}>
      <p className={styles.InfoDividedLabel}>{label}</p>
      <div className={styles.InfoDividedDivider} />
      <p className={styles.InfoDividedValue}>{value}</p>
    </div>
  );
};

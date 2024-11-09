import { useEffect, useState } from 'react';

import styles from './Select.module.css';
import { useUXClose } from '../../shared/hooks/useUXClose';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  className?: string;
  options?: Option[];
  onSelect?: (value: string, label: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  options = [],
  onSelect,
  className,
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleChange = (option: Option, index: number) => {
    setSelectedOptionIndex(index);
    onSelect?.(option.value, option.label);
  };

  useEffect(() => {
    setSelectedOptionIndex(0);
  }, [options]);

  useUXClose(isOpen, setIsOpen);
  return (
    <div
      className={
        styles.SelectContainer +
        (isOpen ? ' ' + styles.SelectContainer_open : '') +
        ' ' +
        className
      }>
      <button
        className={styles.SelectValue}
        onClick={() => {
          setIsOpen(true);
        }}>
        {options[selectedOptionIndex].label}
      </button>

      <ul className={styles.SelectOptions}>
        {options.map((option, i) => (
          <li key={option.value} className={styles.SelectOption}>
            <button
              className={styles.SelectOptionButton}
              onClick={() => handleChange(option, i)}>
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

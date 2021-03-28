import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export const Header: React.FC = () => {
  return (
    <header className={`${commonStyles.container} ${styles.headerContainer}`}>
      <Link href="/">
        <a>
          <img src="/images/logo.svg" alt="Spacetraveling" />
        </a>
      </Link>
    </header>
  );
};

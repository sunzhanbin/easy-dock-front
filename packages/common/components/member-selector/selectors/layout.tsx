import { memo, ReactNode } from 'react';
import classnames from 'classnames';
import { Input } from 'antd';
import { debounce } from 'lodash';
import useMemoCallback from '../../../hooks/use-memo-callback';
import styles from '../index.module.scss';

interface LayoutProps {
  className?: string;
  children?: ReactNode;
  onKeywordChange(keyword: string): void;
  keywordPlaceholder: string;
}

function Layout(props: LayoutProps) {
  const { className, children, onKeywordChange, keywordPlaceholder } = props;

  const handleKeywordChange = useMemoCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      onKeywordChange(inputValue.trim());
    }, 300),
  );

  return (
    <div className={classnames(styles.selector, className)}>
      <Input placeholder={keywordPlaceholder} className={styles.search} onChange={handleKeywordChange} size="large" />

      {children}
    </div>
  );
}

export default memo(Layout);

import { FC, memo, useMemo, useCallback } from 'react';
import { Form } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { layoutSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { moveIndex } from '@/features/bpm-editor/form-design/formdesign-slice';
import emptyImage from '@assets/drag.png';
import styles from './index.module.scss';
import { Card, CardProps } from '@/components/card';
import { useDrop } from 'react-dnd';

const FormZone: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const layout = useAppSelector(layoutSelector);
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (dragIndex !== -1) dispatch(moveIndex({ dragIndex, hoverIndex }));
    },
    [dispatch],
  );
  const [, drop] = useDrop(
    () => ({
      accept: 'toolItem',
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [],
  );
  const renderCard = (card: CardProps, index: number) => {
    return <Card row={card.row} key={JSON.stringify(card.row)} rowIndex={index} moveCard={card.moveCard}></Card>;
  };
  const content = useMemo(() => {
    return (
      <div className={styles.form_design} ref={drop}>
        {layout && layout.length > 0 ? (
          <Form layout="vertical" autoComplete="off">
            {layout.map((row, rowIndex) => renderCard({ row, rowIndex, moveCard }, rowIndex))}
          </Form>
        ) : (
          <div className={styles.empty_tip}>
            <img src={emptyImage} className={styles.image} alt="empty" />
            <div className={styles.text}>拖动或点击左侧控件到这里</div>
          </div>
        )}
      </div>
    );
  }, [layout, drop, moveCard]);
  return (
    <div className={styles.container}>
      <div className={styles.form_zone}>{content}</div>
    </div>
  );
};

export default memo(FormZone);

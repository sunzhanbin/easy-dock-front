import { FC, memo, useMemo, useCallback } from 'react';
import SourceBox from '@/components/source-box';
import { Row, Col } from 'antd';
import { selectField } from '../../formdesign-slice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  layoutSelector,
  componentPropsSelector,
  selectedFieldSelector,
} from '@/features/bpm-editor/form-design/formzone-reducer';
import { moveIndex } from '@/features/bpm-editor/form-design/formdesign-slice';
import { MoveConfig } from '@/type';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import emptyImage from '@assets/drag.png';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Card, CardProps } from '@/components/card';

const spaceMap = {
  1: 6,
  2: 12,
  3: 18,
  4: 24,
};

const FormZone: FC<{}> = () => {
  const dispatch = useAppDispatch();
  const layout = useAppSelector(layoutSelector);
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = layout[dragIndex];
      dispatch(moveIndex({ dragIndex, hoverIndex }));
    },
    [layout],
  );
  const renderCard = (card: CardProps, index: number) => {
    return <Card row={card.row} key={JSON.stringify(card.row)} rowIndex={index} moveCard={card.moveCard}></Card>;
  };
  const content = useMemo(() => {
    return (
      <div className={styles.form_design}>
        {layout && layout.length > 0 ? (
          layout.map((row, rowIndex) => renderCard({ row, rowIndex, moveCard }, rowIndex))
        ) : (
          <div className={styles.empty_tip}>
            <img src={emptyImage} className={styles.image} alt="empty" />
            <div className={styles.text}>拖动或点击左侧控件到这里</div>
          </div>
        )}
      </div>
    );
  }, [layout]);
  return (
    <div className={styles.container}>
      <div className={styles.form_zone}>{content}</div>
    </div>
  );
};

export default memo(FormZone);

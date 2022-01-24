import { FC, useRef, useCallback, useMemo } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import { Row, Col } from "antd";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectField } from "@/features/bpm-editor/form-design/formdesign-slice";
import {
  layoutSelector,
  componentPropsSelector,
  selectedFieldSelector,
  errorSelector,
} from "@/features/bpm-editor/form-design/formzone-reducer";
import { MoveConfig } from "@/type";
import SourceBox from "@/components/source-box";

const spaceMap = {
  1: 6,
  2: 12,
  3: 18,
  4: 24,
};

// const style = {
//   border: '1px dashed gray',
//   padding: '0.5rem 1rem',
//   marginBottom: '.5rem',
//   backgroundColor: 'white',
//   cursor: 'move',
// };

export interface CardProps {
  rowIndex: number;
  row: string[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  rowIndex: number;
  id: string;
}

export const Card: FC<CardProps> = ({ rowIndex, row, moveCard }) => {
  const selectedField = useAppSelector(selectedFieldSelector);
  const dispatch = useAppDispatch();
  const layout = useAppSelector(layoutSelector);
  const byId = useAppSelector(componentPropsSelector);
  const errors = useAppSelector(errorSelector);
  const errorIdList = useMemo(() => (errors || []).map(({ id }) => id), [errors]);
  const handleSelect = useCallback(
    (id) => {
      dispatch(selectField({ id }));
    },
    [dispatch],
  );
  const getColSpace = useCallback(
    (id) => {
      const space = byId[id]?.colSpace || 4;
      if (space) {
        return spaceMap[space];
      }
    },
    [byId],
  );
  const getMoveConfig = useCallback(
    (rowIndex, colIndex, flag?) => {
      const config: MoveConfig = { up: true, down: false, left: true, right: true };
      if (rowIndex === 0 || layout[rowIndex - 1].length > 3) {
        config.up = false;
      }
      if (layout[rowIndex].length > 1) {
        config.down = true;
      }
      if (colIndex === 0) {
        config.left = false;
      }
      if (colIndex === layout[rowIndex].length - 1) {
        config.right = false;
      }
      return config;
    },
    [layout],
  );
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop(
    {
      accept: ["toolItem", "card"],
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        };
      },
      drop: (item: DragItem, monitor: DropTargetMonitor) => {
        return { ...item, hoverIndex: rowIndex };
      },
      hover(item: DragItem, monitor: DropTargetMonitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.rowIndex;
        const hoverIndex = rowIndex;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex === -1 || (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)) {
          return;
        }

        // Dragging upwards
        if (dragIndex === -1 || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
          return;
        }

        // Time to actually perform the action
        moveCard(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.rowIndex = hoverIndex;
      },
    },
    [rowIndex, row],
  );

  const [{ isDragging }, drag] = useDrag(
    {
      type: "card",
      item: () => {
        return { rowIndex, id: JSON.stringify(row) };
      },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [rowIndex, row],
  );

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    row && (
      <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
        <Row className="form_row" key={rowIndex}>
          {row.map((id, colIndex) => (
            <Col
              key={id}
              className={classNames(
                "form_item",
                id === selectedField ? "active" : "",
                errorIdList.includes(id) ? "error" : "",
              )}
              onClick={() => {
                handleSelect(id);
              }}
              span={getColSpace(id)}
            >
              <SourceBox
                type={id ? byId?.[id]?.type : ""}
                config={byId[id]}
                moveConfig={getMoveConfig(rowIndex, colIndex)}
                id={id}
                rowIndex={rowIndex}
              />
            </Col>
          ))}
        </Row>
      </div>
    )
  );
};

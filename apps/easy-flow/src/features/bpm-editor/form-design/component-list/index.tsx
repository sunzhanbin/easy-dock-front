import React, { FC, memo } from 'react';
import styled from 'styled-components';
import TargetBox from '@/components/target-box';
import { useAppSelector } from '@app/hooks';
import { toolboxSelector } from '../toolbox-reducer';
import Loading from '@components/loading';
import { map } from 'lodash';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const ComponentListContainer = styled.div`
  width: 275px;
  padding:57px 20px;
  height: calc(100vh - 64px);
  background: #fff;
	.component_list{
		display:flex;
		flex-wrap:wrap;
		justify-content: space-between;
    font-size: 14px;
	}
`;
const ToolboxGroup = styled.div`
  width: 100%;
  background: #fff;
  padding: 30px 10px;
  .groupTitle {
    font-size: 16px;
    font-weight: 600;
    padding: 0px 10px 20px 10px;
  }
  .componentContainer {
    display: flex;
    justify-content: space-between;
    align-content: space-around;
    padding: 0px 20px;
  }
`;

const ComponentList: FC<{}> = () => {
	const components = useAppSelector(toolboxSelector);
	const comGroups = map(components, (value, key) => {
		return (
			<ToolboxGroup key={key}>
				<div className="groupTitle">{key}</div>
				<div className="componentContainer">
					{map(value, (tool, index) => {
						const { name, icon, type } = tool;
						// return <TargetBox icon={icon} displayName={name} type={type} key={type}></TargetBox>;
						return (
							<Draggable draggableId={type} index={+index} key={name}>
								{
									(dragProvided) => (
										<div
											ref={dragProvided.innerRef}
											{...dragProvided.draggableProps}
											{...dragProvided.dragHandleProps}
										>
											<TargetBox
												icon={icon}
												displayName={name}
												type={type}
											></TargetBox>
										</div>
									)
								}
							</Draggable>

						);
					})}
				</div>
			</ToolboxGroup>
		);
	});
	if (!comGroups) return <Loading></Loading>;
	return (
		<ComponentListContainer>
			<Droppable droppableId="component_zone">
				{
					(dropProvided) => (
						<div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
							<div>{comGroups}</div>
							{dropProvided.placeholder}
						</div>
					)
				}
			</Droppable>
		</ComponentListContainer>
	);
};

export default memo(ComponentList);

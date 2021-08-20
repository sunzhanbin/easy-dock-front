import { memo, useMemo } from 'react';
import Selector, { MemberSelectorProps as SelectorProps } from '@components/member-selector';
import { UserNode } from '@type/flow';
import { useSubAppDetail } from '@app/app';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { flowDataSelector, setCacheMembers } from '../../../flow-slice';

interface MemberSelectorProps {
  value?: UserNode['correlationMemberConfig'];
  onChange?(value: this['value']): void;
}

function MemberSelector(props: MemberSelectorProps) {
  const { cacheMembers } = useAppSelector(flowDataSelector);
  const { value, onChange } = props;
  const dispatch = useAppDispatch();
  const { data: subAppDetail } = useSubAppDetail();
  const showValue: NonNullable<SelectorProps['value']> = useMemo(() => {
    const { members = [], departs = [] } = value!;

    return {
      departs: departs.map((id) => ({ id, ...cacheMembers[id] })),
      members: members.map((id) => {
        return {
          id,
          ...cacheMembers[id],
        };
      }),
    };
  }, [value, cacheMembers]);

  const handleChange = (value: NonNullable<SelectorProps['value']>) => {
    dispatch(
      setCacheMembers(
        [...value.members, ...value.departs].reduce((curr, next) => {
          curr[next.id] = {
            ...next,
            avatar: next.avatar,
          };

          return curr;
        }, {} as Parameters<typeof setCacheMembers>[number]),
      ),
    );

    if (onChange) {
      onChange({
        members: value.members.map((member) => member.id),
        departs: value.departs.map((depart) => depart.id),
      });
    }
  };

  return <Selector projectId={subAppDetail?.app.project.id} value={showValue} onChange={handleChange} />;
}

export default memo(MemberSelector);

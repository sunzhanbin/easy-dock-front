import { memo, useMemo } from 'react';
import { MemberSelector as Selector, MemberSelectorProps as SelectorProps } from '@common/components';
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
    const { members = [], depts = [] } = value!;

    return {
      depts: depts.map((id) => ({ ...cacheMembers[id] })),
      members: members.map((id) => {
        return {
          ...cacheMembers[id],
        };
      }),
    };
  }, [value, cacheMembers]);

  const handleChange = (value: NonNullable<SelectorProps['value']>) => {
    dispatch(
      setCacheMembers(
        [...value.members, ...value.depts].reduce((curr, next) => {
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
        depts: value.depts.map((depart) => depart.id),
      });
    }
  };

  return <Selector projectId={subAppDetail?.app.project.id} value={showValue} onChange={handleChange} strictDept />;
}

export default memo(MemberSelector);

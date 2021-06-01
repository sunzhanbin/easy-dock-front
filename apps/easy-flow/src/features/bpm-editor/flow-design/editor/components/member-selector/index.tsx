import { memo, useMemo } from 'react';
import Selector, { MemberSelectorProps as SelectorProps } from '@components/member-selector';
import { flowDataSelector, setCacheMembers } from '../../../flow-slice';
import { UserNode } from '../../../types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

interface MemberSelectorProps {
  value?: UserNode['correlationMemberConfig'];
  onChange?(value: this['value']): void;
}

function MemberSelector(props: MemberSelectorProps) {
  const { cacheMembers } = useAppSelector(flowDataSelector);
  const { value, onChange } = props;
  const dispatch = useAppDispatch();
  const showValue: NonNullable<SelectorProps['value']> = useMemo(() => {
    const { members } = value!;

    return {
      members: members.map((loginName) => {
        return cacheMembers[loginName];
      }),
    };
  }, [value, cacheMembers]);

  const handleChange = (value: NonNullable<SelectorProps['value']>) => {
    dispatch(
      setCacheMembers(
        value.members.reduce((curr, next) => {
          curr[next.loginName] = {
            ...next,
            avatar: next.avatar,
          };

          return curr;
        }, {} as Parameters<typeof setCacheMembers>[number]),
      ),
    );

    if (onChange) {
      onChange({
        members: value.members.map((member) => member.loginName),
      });
    }
  };

  return <Selector value={showValue} onChange={handleChange} />;
}

export default memo(MemberSelector);

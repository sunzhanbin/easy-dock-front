import PubSub from 'pubsub-js';
import { useCallback } from 'react';
import { useContainerContext } from './context';

const EventHoc = ({children}: {children: React.ReactNode}) => {

  const { fieldName } = useContainerContext();

  const handleBlur = useCallback((event) => {
    const { type, target} = event;
    PubSub.publish(`${fieldName}-${type }`, target.value);

    console.log('eventHoc::', `${fieldName}-${type }`, event.type, event.target.value);
  }, [])

  return (
    <div onBlur={handleBlur}>
      {children}
    </div>
  )
}

export default EventHoc;
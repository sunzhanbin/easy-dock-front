import { useRef } from 'react';

export default function useTruely(value: boolean) {
  const valueRef = useRef(value);

  if (valueRef.current) {
    return true;
  } else if (value) {
    valueRef.current = true;
  }

  return valueRef.current || value;
}

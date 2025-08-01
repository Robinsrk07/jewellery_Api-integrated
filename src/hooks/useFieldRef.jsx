import { useRef } from 'react';

const useFieldRefs = (fieldNames) => {
  const refs = useRef({});

  fieldNames.forEach(field => {
    if (!refs.current[field]) {
      refs.current[field] = { current: null }; 
    }
  });

  return refs.current;
};

export default useFieldRefs;

import React, { useState } from 'react';
import { createReference } from '../services/referenceService';

const CreateReference = () => {
  const [referenceCode, setReferenceCode] = useState('');

  const handleCreateReference = async () => {
    try {
      const response = await createReference();
      setReferenceCode(response.data.code);
    } catch (error) {
      console.error('Error creating reference:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateReference}>Create Reference</button>
      {referenceCode && (
        <div>
          <p>Reference Code: {referenceCode}</p>
        </div>
      )}
    </div>
  );
};

export default CreateReference;

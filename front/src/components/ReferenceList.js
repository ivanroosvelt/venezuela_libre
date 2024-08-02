import React, { useEffect, useState } from 'react';
import { listReferences, deleteReference } from '../services/referenceService';

const ReferenceList = () => {
  const [references, setReferences] = useState([]);

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    try {
      const response = await listReferences();
      setReferences(response.data);
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  };

  const handleDeleteReference = async (referenceId) => {
    try {
      await deleteReference(referenceId);
      fetchReferences();
    } catch (error) {
      console.error('Error deleting reference:', error);
    }
  };

  return (
    <div>
      <h2>References</h2>
      <ul>
        {references.map(ref => (
          <li key={ref.id}>
            <p>Code: {ref.code}</p>
            <p>Used: {ref.used ? 'Yes' : 'No'}</p>
            {ref.used && <p>Used by: {ref.usedByUser?.username}</p>}
            <button onClick={() => handleDeleteReference(ref.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferenceList;

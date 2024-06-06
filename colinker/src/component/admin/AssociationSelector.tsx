import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useAssociation } from '../../context/AssociationContext';
import { getUserAdminAssociation } from '../../service/associationService';

interface Association {
  id: string;
  name: string;
}

const { Option } = Select;

const AssociationSelector: React.FC = () => {
  const { setSelectedAssociationId, selectedAssociationId } = useAssociation();
  
  const [associations, setAssociations] = useState<Association[]>([]);

  useEffect(() => {
    const loadAssociations = async () => {
      try {
        const data = await getUserAdminAssociation(localStorage.getItem('username'));
        if (data && !Array.isArray(data)) {
          setAssociations([{ id: data._id, name: data.name }]);
        } else if (Array.isArray(data)) {
          setAssociations(data.map(assoc => ({ id: assoc._id, name: assoc.name })));
        }
      } catch (error) {
        console.error('Failed to fetch associations', error);
      }
    };

    loadAssociations();
  }, []);

  const handleChange = (value: string | undefined) => {
    setSelectedAssociationId(value ? value : null);
  };

  return (
    <Select
      showSearch
      placeholder="Sélectionner une association"
      style={{ width: 200 }}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option?.children ? option.children.toString().toLowerCase().includes(input.toLowerCase()) : false
      }
      onChange={handleChange}
      value={selectedAssociationId}
      allowClear
    >
      {associations.map(association => (
        <Option key={association.id} value={association.id}>{association.name}</Option>
      ))}
    </Select>
  );
};

export default AssociationSelector;

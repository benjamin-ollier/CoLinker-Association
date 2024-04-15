import React from 'react';
import { Select } from 'antd';
import { useAssociation } from '../../context/AssociationContext';

const { Option } = Select;

const AssociationSelector: React.FC = () => {
  const { associations, setSelectedAssociationId, selectedAssociationId } = useAssociation();

  const handleChange = (value: string | undefined) => {
    if (value) {
      setSelectedAssociationId(value);
    } else {
      setSelectedAssociationId(null);
    }
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

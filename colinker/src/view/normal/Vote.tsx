import React, { useState } from 'react';
import { Radio, Button, Spin } from 'antd';



const Vote = () => {
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(false);

  const onChange = e => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const onVoteSubmit = () => {
    setLoading(true);
    console.log("c'est selectionné", value);
    
    setTimeout(() => {
      setLoading(false); 
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center h-screen mx-10">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full mt-16">
        <h2 className="text-lg font-semibold mb-2">Titre du Vote</h2>
        <p>Description du vote, incluant des détails sur ce pour quoi vous votez et pourquoi c'est important.</p>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 w-full my-10">
        <h2 className="text-lg font-semibold mb-2">Type de vote</h2>
        <p>Description du vote, incluant des détails sur ce pour quoi vous votez et pourquoi c'est important.</p>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 w-full my-10">
        <h2 className="text-lg font-semibold mb-2">Options de vote</h2>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>Option 1</Radio>
          <Radio value={2}>Option 2</Radio>
          <Radio value={3}>Option 3</Radio>
          <Radio value={4}>Option 4</Radio>
        </Radio.Group>
      </div>

      <div className="mt-4">
          <Button type="primary" onClick={onVoteSubmit} disabled={loading}>Envoyer</Button>
          <Spin className='ms-2' spinning={loading}></Spin>
        </div>
    </div>
  );
};

export default Vote;

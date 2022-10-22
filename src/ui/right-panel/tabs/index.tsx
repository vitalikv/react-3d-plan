import React, { useState } from 'react';
import { CSSProperties } from 'react';

let style: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'content',
  fontSize: '14px',
  color: '#666',
  background: '#fff',
  border: '1px solid #ccc',
  borderBottom: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',
};

export default function Tabs() {
  const data: { name: string }[] = [{ name: 'план' }, { name: 'каталог' }, { name: 'смета' }];
  const [items, setItem] = useState(data);

  function click(e: React.MouseEvent<HTMLElement>) {
    if (e.target instanceof HTMLElement) console.log(e.target.innerText);

    let items2 = [...items];
    items2[0].name = '1';
    setItem(items2);
  }

  return (
    <div nameid="tabs" style={{ display: 'flex', marginTop: '10px', borderBottom: '1px solid #ccc', userSelect: 'none' }}>
      <div style={{ display: 'flex', width: '100%', height: '30px', margin: '0 10px' }}>
        {items.map((item, index) => {
          return (
            <div style={style} onClick={click} key={index}>
              <div>{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

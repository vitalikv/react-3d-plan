import { MouseEvent, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'ui/store/hook';
import { select } from 'ui/store/slice/slice-level-list';
import './list.scss';
import { level } from 'three-scene/index';

export default function ListFloor() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.listL);

  useEffect(() => {
    //console.log('useEffect', items);
  });

  function clickItem({ event, id }: { event: MouseEvent; id: number }) {
    let name = event.currentTarget.textContent ? event.currentTarget.textContent : '';
    dispatch(select(id));
    level.changeLevelAct({ id });
  }

  return (
    <div nameid="listFloor" className="listFloor">
      {items.map((item, index) => {
        return (
          <div
            className="item"
            key={index}
            onClick={(event) => {
              clickItem({ event, id: index });
            }}
            style={item.act ? { backgroundColor: 'rgb(167, 207, 242)' } : { backgroundColor: '#ffffff' }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
}

// старая версия с useState
function ListFloor2() {
  let arr = [
    { name: '1 level', act: true },
    { name: '2 level', act: false },
    { name: '3 level', act: false },
  ];

  const [items, setItem] = useState(arr);

  useEffect(() => {
    //changeLeval();
  });

  function clickItem({ event, id }: { event: MouseEvent; id: number }) {
    console.log(event.currentTarget.textContent);
    setItem(
      items.map((item, index) => {
        item.act = false;
        if (item.name === event.currentTarget.textContent) {
          item.act = true;
        }
        return item;
      })
    );
  }

  return (
    <div nameid="listFloor" className="listFloor">
      {items.map((item, index) => {
        return (
          <div
            className="item"
            key={index}
            onClick={(event) => {
              clickItem({ event, id: index });
            }}
            style={item.act ? { backgroundColor: 'rgb(167, 207, 242)' } : { backgroundColor: '#ffffff' }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
}

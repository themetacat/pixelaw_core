import React, { useEffect } from 'react';
import style from './index.module.css';
import downPoint from '../../images/xialajiantou.png';
import upPoint from '../../images/shanglajiantou.png';
import rightIcon from '../../images/duihao.png';
// import  {imageIconData} from '../imageIconData'

type Props = {
  md:any
  setvgf:any
};

export default function Select({md,setvgf}:Props) {
  const [selectedOption, setSelectedOption] = React.useState('');
  const [downPointType, setDownPointType] = React.useState(true);


  const changeType = (newType: string,item:any,key) => {
  
    
    setDownPointType(true)
    setSelectedOption(newType);
    console.log(key,item)
    setvgf({key,item});
  };

  useEffect(() => {
    if (md && Object.keys(md).length > 0) {
      console.log(md);
      const firstNonEmptyItem = Object.values(md).find(item => item.name);
      const firstNonEmptyItemEntry = Object.entries(md).find(([key, item]) => 
      setvgf({key,item})
    );
   
    if (firstNonEmptyItem) {
      const [key, item] = Object.entries(md).find(([key, item]) => item === firstNonEmptyItem);
    
      const firstNonEmptyItemEntry = { [key]: item };
      console.log(firstNonEmptyItemEntry);
      setvgf({key,item});
    }  

      if (!selectedOption && firstNonEmptyItem) {
        setSelectedOption(firstNonEmptyItem.name); 
      }
    }
  }, []);

  return (
    <div>
      <div className={style.customSelect}>
        <div className={style.selectTrigger}>
          <img
            src={Object.values(md).find(item => item.name === selectedOption)?.src}
            style={{
              width: '28px',
              height: '28px',
              border: "1px solid #2F0C42",
            }}
          />
          <span style={{fontSize:"11px"}}>{selectedOption}</span>
          <img src={downPointType === true?downPoint:upPoint} alt="" className={style.downPoint} onClick={()=>{
            setDownPointType(!downPointType)
          }}/>
        </div>
        {
          downPointType === false?
          <div id="customSelectDropdown" className={style.selectOptions}>
          {Object.entries(md).map(([key, item], index) => (

         <div key={index} onClick={() => changeType(item.name,item,key)} className={style.selectOptionsItem}>
              <img
                src={item.src}
                style={{
                  width: '28px',
                  height: '28px',
                  border: "1px solid #2F0C42",
                }}
              />
              <span style={{fontSize:"10px"}}>{item.name}</span>
              {selectedOption === item.name && <img src={rightIcon} alt="" style={{width:"16px",height:"16px",marginTop:"5px" }}/>} 
            </div>
          ))}
        </div>:null
        }
     
      </div>
    </div>
  );
}

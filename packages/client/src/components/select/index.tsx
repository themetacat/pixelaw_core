import React, { useEffect } from 'react';
import style from './index.module.css';
import downPoint from '../../images/xialajiantou.png';
import upPoint from '../../images/shanglajiantou.png';
import rightIcon from '../../images/duihao.png';
import  {imageIconData} from '../imageIconData'

// type Props = {
//   imageIconData: { label: string, img?: string }[];
// };

export default function Select() {
  const [selectedOption, setSelectedOption] = React.useState('');
  const [downPointType, setDownPointType] = React.useState(true);

  const changeType = (newType: string) => {
    setDownPointType(true)
    setSelectedOption(newType);
  };

  useEffect(()=>{
    if (!selectedOption && imageIconData.length > 0) {
      setSelectedOption(imageIconData[0].label); // 将selectedOption设置为第一个选项的label
    }
  },[])


  return (
    <div>
      <div className={style.customSelect}>
        <div className={style.selectTrigger} onClick={() => document?.getElementById('customSelectDropdown').classList.toggle(style.show)}>
          <img
            src={imageIconData.find(item => item.label === selectedOption)?.src}
            style={{
              width: '28px',
              height: '28px',
              border: "1px solid #2F0C42",
            }}
          />
          <span>{selectedOption }</span>
          <img src={downPointType === true?downPoint:upPoint} alt="" className={style.downPoint} onClick={()=>{
            setDownPointType(!downPointType)
          }}/>
        </div>
        {
          downPointType === false?
          <div id="customSelectDropdown" className={style.selectOptions}>
          {imageIconData.map((item, index) => (

         
            <div key={index} onClick={() => changeType(item.label)} className={style.selectOptionsItem}>
              <img
                src={item.src}
                style={{
                  width: '28px',
                  height: '28px',
                  border: "1px solid #2F0C42",
                }}
              />
              <span>{item.label}</span>
              {selectedOption === item.label && <img src={rightIcon} alt="" style={{width:"16px",height:"16px",marginTop:"5px" }}/>} 
            </div>
          ))}
        </div>:null
        }
     
      </div>
    </div>
  );
}

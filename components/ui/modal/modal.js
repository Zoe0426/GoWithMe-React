import React, { useState } from 'react';
import Styles from './modal.module.css';
import MainBtn from '@/components/ui/buttons/MainBtn';
import SecondaryBtn from '@/components/ui/buttons/SecondaryBtn';

export default function Modal({
  btnType = 'main',
  btnText = '',
  title = '標題',
  mainBtnText = '確認',
  subBtnText = '取消',
  content = <></>,
  confirmHandler = () => {},
}) {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const confirmBtn = () => {
    confirmHandler();
    setModal(!modal);
  };

  return (
    <>
      {btnType === 'main' ? (
        <MainBtn clickHandler={toggleModal} text={btnText} />
      ) : (
        <span onClick={toggleModal} className={Styles.edit}>
          {btnText}
        </span>
      )}

      {modal && (
        <>
          <div onClick={toggleModal} className={Styles.overlay}></div>
          <div className={Styles.modal}>
            <div className={Styles.modal_card}>
              <h2 className={Styles.modal_title}>{title}</h2>
              <div className={Styles.modal_content}>{content}</div>

              <div className={Styles.line}></div>
              <div className={Styles.btn_group}>
                <SecondaryBtn text={subBtnText} clickHandler={toggleModal} />
                <MainBtn clickHandler={confirmBtn} text={mainBtnText} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

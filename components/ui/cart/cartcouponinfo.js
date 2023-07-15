import React from 'react';
import style from './cartcouponinfo.module.css';

export default function CartCouponInfo({
  coupon_send_sid = '',
  exp_date = '',
  name = '',
  price = 0,
  selected = false,
}) {
  return (
    <div className={style.info}>
      <div className={style.details}>
        <p>{name}</p>
        <p className={style.expDate}>
          使用期限&nbsp;&nbsp;
          <span className={style.expDate}>{exp_date}</span>
        </p>
      </div>
      <div>
        <span className={style.postPrice}>-${price}&nbsp;&nbsp;</span>
        <span className={style.edit}>編輯</span>
      </div>
    </div>
  );
}

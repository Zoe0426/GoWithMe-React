import React from 'react';
import style from './orderDetailActivity.module.css';
export default function OrderDetailActivity({
  img = '',
  prodtitle = '',
  prodSubtitle = '',
  adPrice = 0,
  adQty = 0,
  kidPrice = 0,
  kidQty = 0,
}) {
  return (
    <div className={style.productCard}>
      <img src={img} alt="productimg" className={style.prodimg} />
      <div className={style.forRwd}>
        <div className={style.prodname}>
          <p className={style.prodtitle}>{prodtitle}</p>
          <p className={style.prodSubtitle}>{prodSubtitle}</p>
        </div>
        <div className={style.prodDetail}>
          <div className={style.detailblock}>
            <p className={style.times}>大人</p>
            <div className={style.qtyblock}>
              <p className={style.price}>${adPrice}</p>
              <p className={style.times}>*</p>
              <p className={style.qty}>{adQty}</p>
            </div>
          </div>

          <div className={style.detailblock}>
            <p className={style.times}>小孩</p>
            <div className={style.qtyblock}>
              <p className={style.price}>${kidPrice}</p>
              <p className={style.times}>*</p>
              <p className={style.qty}>{kidQty}</p>
            </div>
          </div>
          <p className={style.subtotal}>
            ${adPrice * adQty + kidPrice * kidQty}
          </p>
        </div>
      </div>
    </div>
  );
}
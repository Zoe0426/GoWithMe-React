import styles from './comment-card-no.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function NoCommentCard() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return (
    <div className={styles.comment_card}>
      <div className={styles.card_head}>
        <div>
          <img src={`/product-img/logo.jpg`} alt="corpLog" />
        </div>
        <div>
          <p className={styles.user_name}>狗with咪</p>
          <p className={styles.comment_date}>{`${year}-${month}-${day}`}</p>
        </div>
      </div>
      <div className={styles.card_body}>
        <p className={styles.card_content}>Sorry~尚無相關評論</p>
      </div>
    </div>
  );
}
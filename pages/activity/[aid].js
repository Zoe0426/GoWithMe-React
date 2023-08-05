import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCalendarDays,
  faClock,
  faLocationDot,
  faHeart,
  faUserPlus,
  faFilter,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/activitydetail.module.css';
import NavDetailPage from '@/components/ui/cards/NavDetailPage';
import ActivityFeatureDetail from '@/components/ui/cards/ActivityFeatureDetail';
import IconMainBtn from '@/components/ui/buttons/IconMainBtn';
import IconSeconBtn from '@/components/ui/buttons/IconSeconBtn';
import CommentCard from '@/components/ui/cards/comment-card';
import { Button, Select, ConfigProvider, Row, Col } from 'antd';
import BreadCrumb from '@/components/ui/bread-crumb/breadcrumb';
import IconBtn from '@/components/ui/buttons/IconBtn';
import LikeListDrawer from '@/components/ui/like-list/LikeListDrawer';
import Modal from '@/components/ui/modal/modal';
import ModoalReminder from '@/components/ui/shop/modoal-reminder';
import ActivityCard1 from '@/components/ui/cards/ActivityCard1';
import BGUpperDecoration from '@/components/ui/decoration/bg-upper-decoration';
import ModalWithoutBtn from '@/components/ui/modal/modal-without-btn';

//likelist

// import CommentCard from '@/componets/ui/cards/comment-card.js';

export default function ActivityDetail() {
  // 活動數量 大人/小孩 input用
  const [countAdult, setCountAdult] = useState(1);
  const [countChild, setCountChild] = useState(0);

  const { query, asPath } = useRouter();
  const router = useRouter();

  // 會員登入相關
  const { auth, updateCart } = useContext(AuthContext);
  const authId = auth.id;

  // 新增活動相關
  const [activitySid, setActivitySid] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [successAddToCard, setSuccessAddToCard] = useState(false);

  const [data, setData] = useState({
    actDetailRows: [],
    actImageRows: [],
    actDateRows: [],
    actFeatureRows: [],
    actRatingRows: [],
    actRecommend: [],
    actCartTotalQtyRows:[],
  });

  const [actDetailRows, setActDetailRows] = useState([]);
  const [actImageRows, setActImageRows] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 初始索引為 0 // slider效果
  //const [fadeIn, setFadeIn] = useState(false); // slider效果
  const [actDateRows, setActDateRows] = useState([]);
  const [actFeatureRows, setActFeatureRows] = useState([]);
  const [actRatingRows, setActRatingRows] = useState([]);
  const [actRecommend, setActRecommend] = useState([]);
  const [actCartTotalQtyRows,setActCartTotalQtyRows]=useState([]);

  const totalPrice =
    actDetailRows.price_adult * countAdult +
    (actDetailRows.price_adult / 2) * countChild;

  // 小麵包屑
  const [breadCrubText, setBreadCrubText] = useState([
    {
      id: 'activity',
      text: '活動首頁',
      href: `${process.env.WEB}/activity`,
      show: true,
    },
    { id: 'search', text: '/ 活動列表', href: `${process.env.WEB}/activity/list`, show: true },
    {
      id: 'aid',
      text: '',
      href: '',
      show: true,
    },
  ]);

  // 取得頁面資訊
  useEffect(() => {
    const { aid } = query;

    if (aid) {
      setActivitySid(aid);
      fetch(`${process.env.API_SERVER}/activity-api/activity/${aid}`)
        .then((r) => r.json())
        .then((data) => {
          const {
            actDetailRows,
            actImageRows,
            actDateRows,
            actFeatureRows,
            actRatingRows,
            actRecommend,
            actCartTotalQtyRows,
          } = data;

          // 更新 React 組件的狀態
          if (actDetailRows && actDetailRows.length > 0) {
            setActDetailRows(...actDetailRows);
          }

          if (actImageRows.length > 0) {
            const imageUrls = actImageRows[0].activity_pic.split(',');
            setActImageRows(imageUrls);
          }

          // if (actImageRows && actImageRows.length > 0) {
          //   //setActImageRows(actImageRows);
          //   setActImageRows(actImageRows[0].activity_pic.split(','));
          // }

          console.log(actImageRows); //測試
          // console.log((actImageRows[0].activity_pic).split(',')[0])//測試

          if (actDateRows && actDateRows.length > 0) {
            setActDateRows(actDateRows);
          }

          if (actFeatureRows && actFeatureRows.length > 0) {
            setActFeatureRows(actFeatureRows);
          }

          if (actRatingRows && actRatingRows.length > 0) {
            setActRatingRows(actRatingRows);
          }

          if (actRecommend && actRecommend.length > 0) {
            setActRecommend(actRecommend);
          }


          if (actCartTotalQtyRows && actCartTotalQtyRows.length > 0) {
            setActCartTotalQtyRows(...actCartTotalQtyRows);
          }

          setData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [query]);

  // 新增活動
  const orderActivityClick = async (
    activitySid,
    token,
    authId,
    countAdult,
    countChild,
    selectedDate
  ) => {
    //   console.log('Order activity button clicked!');
    // console.log('selectedDate:', selectedDate);
    // console.log('actDateRows:', actDateRows);

    try {
      if (!token) {
        throw new Error('未找到會員ID');
        // const from = router.asPath;
        // router.push(`/member/sign-in?from=${from}`);
        // return;
      }

      // Find the corresponding activity_group_sid for the selectedDate

      console.log('Order activity button clicked!');
      console.log('selectedDate:', selectedDate);
      console.log('actDateRows:', actDateRows);
      //   const selectedDateObj = actDateRows.find(
      //     (dateRow) => dateRow.date === selectedDate
      //   );
      //   console.log(selectedDateObj);
      // console.log(selectedDateObj.date);

      if (!selectedDate) throw new Error('無效的活動日期');

      const response = await fetch(
        `${process.env.API_SERVER}/activity-api/order-activity/${activitySid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            aid: activitySid,
            member_sid: authId,
            rel_seq_sid: selectedDate,
            adult_qty: countAdult,
            child_qty: countChild,
          }),
        }
      );

      if (!response.ok) throw new Error('加入購物車失敗');

      //購物車小icon立即更新
      updateCart(activitySid, selectedDate, 'add');

      setSuccessAddToCard(true);
      setTimeout(() => {
        setSuccessAddToCard(false);
      }, 1200);
      console.log('加入購物車成功');
    } catch (error) {
      console.error('操作報名失敗:', error);
    }
  };

  const handleOrderActivityClick = async () => {
    await orderActivityClick(
      activitySid,
      auth.token,
      authId,
      countAdult,
      countChild,
      selectedDate
    );

    // Reset values
    setSelectedDate(null);
    setCountAdult(1);
    setCountChild(0);
  };

  //若未登入會員而點擊收藏，要跳轉至會員登入
  const toSingIn = () => {
    const from = router.asPath;
    router.push(`/member/sign-in?from=${process.env.WEB}${from}`);
  };

  //內頁導覽設定--------------------------------------------------
  //設定 目標位置的參考
  const targetRef1 = useRef(null);
  const targetRef2 = useRef(null);
  const targetRef3 = useRef(null);
  const targetRef4 = useRef(null);
  const targetRef5 = useRef(null);

  // 設定 text和對應的目標位置
  const items = [
    { text: '活動內容&行程', targetRef: targetRef1 },
    { text: '活動規範', targetRef: targetRef2 },
    { text: '購買須知&取消政策', targetRef: targetRef3 },
    { text: '顧客評價', targetRef: targetRef4 },
    { text: '為您推薦', targetRef: targetRef5 },
  ];

  // 目標位置的移動處理
  const handleClick = (targetRef) => {
    targetRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div>
      {/* .........上方資訊......... */}
      <div className={styles.bgc}>
        <div className="container-inner">
          <div className={styles.nav_head}>
            {/* <p>TODO: BreadCrumb</p> */}
            <BreadCrumb breadCrubText={breadCrubText} />

            {/* .........收藏列表/進階篩選 btn......... */}
            <div className={styles.btns}>
              <IconBtn
                icon={faHeart}
                text="收藏列表"
                // clickHandler={toggleLikeList}
              />
            </div>
          </div>
        </div>
      </div>
      <BGUpperDecoration />

      <div className="container-inner">
        <div className={styles.card}>
          {/* -------左邊------- */}

          <div className={styles.left}>
            <button
              onClick={() => {
                setCurrentImageIndex((prevIndex) =>
                  prevIndex === 0 ? actImageRows.length - 1 : prevIndex - 1
                );
              }}
              className={styles.overlay_left}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={{ maxWidth: '20px', maxHeight: '20px' }}
              />
            </button>
            {actImageRows.length > 0 && (
              <img
                src={`/activity_img/${actImageRows[currentImageIndex]}`}
                alt="Slider"
                className={styles.image}
              />
            )}
            <button
              onClick={() => {
                setCurrentImageIndex(
                  (prevIndex) => (prevIndex + 1) % actImageRows.length
                );
              }}
              className={styles.overlay_right}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{ maxWidth: '20px', maxHeight: '20px' }}
              />
            </button>

            <div className={styles.feature}>
              {actFeatureRows.map((row, index) => (
                <ActivityFeatureDetail key={index} feature={row.name} />
              ))}
            </div>
          </div>

          {/* -------右邊------- */}
          <div className={styles.right}>
            {/* 標題 */}
            <div className={styles.row_text_title}>
              <p>{actDetailRows.name}</p>
            </div>

            {/* 評分＋總參加人數 */}
            <div className={styles.row}>
              <div className={styles.review}>
                <FontAwesomeIcon
                  icon={faStar}
                  className={styles.star_icon}
                  style={{ maxWidth: '20px', maxHeight: '20px' }}
                />
                <p className={styles.row_text_medium}>
                  {actDetailRows.avg_rating}
                </p>
              </div>

              <div>
                <p className={styles.purchase_count}>(已有{actCartTotalQtyRows.purchase_count}人參加)</p>
              </div>
            </div>

            {/* 日期 */}
            <div className={styles.row}>
              <FontAwesomeIcon
                icon={faCalendarDays}
                className={styles.row_icon}
                style={{ maxWidth: '20px', maxHeight: '20px' }}
              />
              <div>
                <p className={styles.row_text_small}>
                  {actDetailRows.recent_date}~{actDetailRows.farthest_date}
                </p>
              </div>
            </div>

            {/* 時間 */}
            <div className={styles.row}>
              <FontAwesomeIcon
                icon={faClock}
                className={styles.row_icon}
                style={{ maxWidth: '20px', maxHeight: '20px' }}
              />
              <div>
                <p className={styles.row_text_small}>{actDetailRows.time}</p>
              </div>
            </div>

            {/* 地點 */}
            <div className={styles.row}>
              <FontAwesomeIcon
                icon={faLocationDot}
                className={styles.row_icon}
                style={{ maxWidth: '20px', maxHeight: '20px' }}
              />
              <div>
                <p className={styles.row_text_small}>
                  {actDetailRows.city}
                  {actDetailRows.area}
                  {actDetailRows.address}
                </p>
              </div>
            </div>

            {/* 報名日期 */}
            <div className={styles.row}>
              <div className={styles.row_date}>
                <p className={styles.row_text_small}>選擇日期：</p>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#FD8C46',
                      borderRadius: 10,
                      controlHeight: 46,
                      fontSize: 16,
                      // width: 168,
                    },
                  }}
                >
                  <Select
                    value={selectedDate || '選擇活動日期'}
                    onChange={(value) => setSelectedDate(value)}
                  >
                    {actDateRows.map((row, index) => (
                      <Select.Option
                        key={index}
                        value={row.activity_group_sid}
                        className={styles.date_select}
                      >
                        {row.date}
                      </Select.Option>
                    ))}
                  </Select>
                </ConfigProvider>
              </div>
            </div>

            {/* 報名人數 */}
            <div className={styles.ppl_qty}>
              <div className={styles.ppl_qty_title}>
                <p className={styles.row_text_small}>報名人數：</p>
              </div>

              <div>
                <div className={styles.ppl_qty_inner}>
                  <p className={styles.ppl_qty_row}>大人：</p>
                  <p className={styles.row_price}>
                    ${actDetailRows.price_adult}/人
                  </p>
                  <div className={styles.detail_qty}>
                    <div className={styles.numInputBlock}>
                      <button
                        className={styles.minusBtn}
                        onClick={() => {
                          if (countAdult > 1) {
                            setCountAdult(countAdult - 1);
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className={styles.input}
                        value={countAdult}
                        onChange={(e) => {
                          const reisNumber = /[.\d]/;
                          if (reisNumber.test(e.target.value)) {
                            setCountAdult(parseInt(e.target.value));
                          }
                        }}
                      />
                      <button
                        className={styles.addBtn}
                        onClick={() => {
                          setCountAdult(countAdult + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* <input className={styles.ppl_qty_row}></input> */}
                </div>
                <div className={styles.ppl_qty_inner}>
                  <p className={styles.ppl_qty_row}>小孩：</p>
                  <p className={styles.row_price}>
                    ${actDetailRows.price_adult / 2}/人
                  </p>
                  <div className={styles.detail_qty}>
                    <div className={styles.numInputBlock}>
                      <button
                        className={styles.minusBtn}
                        onClick={() => {
                          if (countChild > 0) {
                            setCountChild(countChild - 1);
                          }
                        }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className={styles.input}
                        value={countChild}
                        onChange={(e) => {
                          const reisNumber = /[.\d]/;
                          if (reisNumber.test(e.target.value)) {
                            setCountChild(parseInt(e.target.value));
                          }
                        }}
                      />
                      <button
                        className={styles.addBtn}
                        onClick={() => {
                          setCountChild(countChild + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* <input className={styles.ppl_qty_row}></input> */}
                </div>
              </div>
            </div>

            {/* 第九行 */}
            <div className={styles.row_total_price}>
              <p className={styles.total_price}>總金額：</p>
              <p className={styles.total_price}>
                ${totalPrice.toLocaleString()}
              </p>
            </div>

            {/* 第十行 */}
            <div className={styles.row_btn}>
              <div className={styles.btn}>
                <IconSeconBtn icon={faHeart} text="加入收藏" />
              </div>
              {!auth.token ? (
                <Modal
                  btnType="iconSeconBtn"
                  btnText="加入購物車"
                  title="貼心提醒"
                  content={
                    <ModoalReminder text="登入會員，才能加入購物車喔~" />
                  }
                  mainBtnText="前往登入"
                  subBtnText="暫時不要"
                  confirmHandler={toSingIn}
                  icon={faUserPlus}
                />
              ) : (
                <IconMainBtn
                  icon={faUserPlus}
                  text="加入購物車"
                  clickHandler={handleOrderActivityClick}
                />
              )}
              {successAddToCard && (
                <ModalWithoutBtn text="成功加入購物車!" img="success.svg" />
              )}
            </div>
          </div>
        </div>

        <div className={styles.nav_detail}>
          <NavDetailPage items={items} handleClick={handleClick} />
        </div>
      </div>

      {/* ....銜接處圖片1.... */}
      <img src="/activity_img/detail_bg_8.jpg" alt="Activity" />

      {/* .........下方資訊......... */}
      <div className="container-inner">
        <div className={styles.content}>
          <div ref={targetRef1}>
            <p className={styles.subtitle}>活動內容＆行程：</p>

            <p className={styles.row_text_small}>{actDetailRows.content}</p>
            <br />
            <br />
            <p className={styles.row_text_small}>活動行程：{actDetailRows.schedule}</p>
          </div>

          {/* <img
            className={styles.content_image}
            src="/activity_img/24.jpg"
            alt=""
          /> */}
          {actImageRows.length > 0 && (
            <img
              className={styles.content_image}
              src={`/activity_img/${actImageRows[2]}`}
              alt=""
            />
          )}
        </div>
      </div>

      {/* ....銜接處圖片2.... */}
      <img src="/activity_img/detail_bg_2.jpg" alt="Activity" />

      <div className="container-inner">
        <div className={styles.content}>
          {actImageRows.length > 0 && (
            <img
              className={styles.content_image_reverse}
              src={`/activity_img/${actImageRows[3]}`}
              alt=""
            />
          )}
          <div ref={targetRef2}>
            <p className={styles.subtitle}>活動規範：</p>

            <p className={styles.row_text_small}>{actDetailRows.policy}</p>
          </div>
        </div>
      </div>

      {/* ....銜接處圖片3.... */}
      <img src="/activity_img/detail_bg_3.jpg" alt="Activity" />

      <div className="container-inner">
        <div className={styles.content}>
          <div ref={targetRef3}>
            <p className={styles.subtitle}>購買須知&取消政策：</p>

            <p className={styles.row_text_small}>
              報名前請詳閱活動詳情並確認活動時間。活動地區除遇大豪雨特報或颱風影響宣布停班停課、集會遊行等不可抗力之天災、人為因素、行政院環保署空氣品質指標達危害等級或活動單位公告延期外，其活動皆照常舉行。倘遇上述原因導致活動延期，因而無法參加者，所繳交之報名費，主辦（執行）方應扣除已代辦或支出費用後，將餘額退回。倘遇上述原因導致活動未能舉辦，報名費將以5折退回。如有贈送禮品商，禮品最終材質、尺寸等，可能因製造時程、活動內容規劃等因素而有些許不同，主辦單位保留微調或更換之權利。
            </p>
          </div>

          {actImageRows.length > 0 && (
            <img
              className={styles.content_image}
              src={`/activity_img/${actImageRows[4]}`}
              alt=""
            />
          )}
        </div>
      </div>

      {/* ....銜接處圖片4.... */}
      <img src="/activity_img/detail_bg_6.jpg" alt="Activity" />

      {/* .........顧客評價......... */}

      <div className="container-inner">
        <div className={styles.content}>
          <div ref={targetRef4}>
            <p className={styles.subtitle}>顧客評價：</p>
            <div className={styles.review_big}>
              <FontAwesomeIcon
                icon={faStar}
                className={styles.star_icon_big}
                style={{ maxWidth: '20px', maxHeight: '20px' }}
              />
              <p className={styles.rating}>{actDetailRows.avg_rating}</p>
              <p className={styles.row_text_small}>
                (共{actDetailRows.rating_count}則評價)
              </p>
            </div>

            <div className={styles.comment_cards}>
              {actRatingRows &&
                actRatingRows.map((v) => {
                  const {
                    activity_rating_sid,
                    member_sid,
                    date,
                    star,
                    content,
                    name,
                    profile,
                  } = v;
                  return (
                    <CommentCard
                      key={activity_rating_sid}
                      member_sid={member_sid}
                      date={date}
                      rating={star}
                      content={content}
                      name={name}
                      profile={profile}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* ....銜接處圖片5.... */}
      <img src="/activity_img/detail_bg_7.jpg" alt="Activity" />

      {/* .........推薦商品......... */}

      <div className="container-inner">
        <div className={styles.recommend_section}>
          <div ref={targetRef4}>
            <p className={styles.subtitle}>為您推薦：</p>

            <div className={styles.recommend_cards}>
              {actRecommend.map((i) => {
                const {
                  activity_sid,
                  type_name,
                  activity_pic,
                  name,
                  avg_rating,
                  recent_date,
                  farthest_date,
                  time,
                  city,
                  area,
                  address,
                  feature_names,
                  price_adult,
                } = i;

                return (
                  <ActivityCard1
                    key={activity_sid}
                    activity_sid={activity_sid}
                    type={type_name}
                    image={'/activity_img/' + activity_pic.split(',')[0]}
                    title={name}
                    rating={avg_rating}
                    date_begin={recent_date}
                    date_end={farthest_date}
                    time={time}
                    city={city}
                    area={area}
                    address={address}
                    features={feature_names.split(',')}
                    price={price_adult}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@/context/AuthContext';
import { Fragment } from 'react';
import { useState } from 'react';
import { SlideImage } from '@/components/ui/restaurant/ImageSample';
import Styles from './[rid].module.css';
import IconBtn from '@/components/ui/buttons/IconBtn';
import IconSeconBtn from '@/components/ui/buttons/IconSeconBtn';
import IconMainBtn from '@/components/ui/buttons/IconMainBtn';
import RateStar from '@/components/ui/rateStar/RateStar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faFileLines,
  faPhone,
  faLocationDot,
  faClock,
  faPaw,
  faCalendar,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import Tab from '@/components/ui/restaurant/Tab';
import FeatureCard from '@/components/ui/restaurant/featureCard';
import ActivityCard from '@/components/ui/restaurant/ActivityCard';
import Image from 'next/image';
import CloudTop from '@/assets/cloud_top.svg';
import NotionAreaBgc from '@/components/ui/restaurant/NotionAreaBgc';
import PinkBtn from '@/components/ui/restaurant/PinkBtn';
import { Col, Row, Breadcrumb, ConfigProvider } from 'antd';
import CommentCard from '@/components/ui/cards/comment-card';
import ImageGallary from '../../components/ui/restaurant/ImageGallary';
import catJump from '@/assets/jump_cat.svg';
import LikeListCard from '@/components/ui/restaurant/LikeListCard';
import Likelist from '@/components/ui/like-list/like-list';
import AlertModal from '@/components/ui/restaurant/AlertModal';

export default function RestInfo() {
  const { query, asPath } = useRouter();
  const { auth, setAuth } = useContext(AuthContext);
  const router = useRouter();
  const [restDetailRows, setRestDetailRows] = useState([]);
  const [data, setData] = useState({
    restDetailRows: [],
    imageRows: [],
    ruleRows: [],
    serviceRows: [],
    commentRows: [],
    commentAvgRows: [],
    activityRows: [],
    likeDatas: [],
    menuRows: [],
  });
  const [imageRows, setImageRows] = useState([]);
  const [ruleRows, setRuleRows] = useState([]);
  const [serviceRows, setServiceRows] = useState([]);
  const [commentRows, setCommentRows] = useState([]);
  const [commentAvgRows, setCommentAvgRows] = useState([]);
  const [activityRows, setActivityRows] = useState([]);

  const [likeDatas, setLikeDatas] = useState([]);
  const [showLikeList, setShowLikeList] = useState(false);
  const [menuRows, setMenuRows] = useState([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  useEffect(() => {
    const { rid } = query;

    if (rid) {
      fetch(`http://localhost:3002/restaurant-api/restaurant/${rid}`)
        .then((r) => r.json())
        .then((data) => {
          const {
            restDetailRows,
            imageRows,
            ruleRows,
            serviceRows,
            commentRows,
            commentAvgRows,
            activityRows,
            likeDatas,
            menuRows,
          } = data;

          // 更新 React 組件的狀態
          if (restDetailRows && restDetailRows.length > 0) {
            setRestDetailRows(...restDetailRows);
          }

          if (serviceRows && serviceRows.length > 0) {
            setServiceRows(serviceRows);
          }
          if (ruleRows && ruleRows.length > 0) {
            setRuleRows(ruleRows);
          }

          if (menuRows && menuRows.length > 0) {
            setMenuRows(menuRows);
          }

          console.log(menuRows);
          // if (imageRows && imageRows.length > 0) {
          //   setImageRows(imageRows);
          // }

          const initialImageRows = imageRows.map((v, index) => {
            return {
              ...v,
              display: index === 0, // 第一張照片設為預設顯示
            };
          });
          setImageRows(initialImageRows);

          if (commentRows && commentRows.length > 0) {
            setCommentRows(commentRows);
          }

          if (commentAvgRows && commentAvgRows.length > 0) {
            setCommentAvgRows(...commentAvgRows);
          }
          if (activityRows && activityRows.length > 0) {
            setActivityRows(...activityRows);
          }
          console.log(...activityRows);

          setData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [query]);

  //圖片輪播取照片
  // const toggleDisplayForImg = (imageRows, id) => {
  //   return imageRows.map((v) => {
  //     if (v.rest_sid === id) {
  //       return { ...v, display: true };
  //     } else {
  //       return { ...v, display: false };
  //     }
  //   });
  // };
  //收藏列表相關的函式-------------------------------------------------------
  const openShowLikeList = () => {
    setShowLikeList(true);
  };

  const closeShowLikeList = () => {
    setShowLikeList(false);
  };

  function toggleDisplayForImg(imgUrl) {
    let main = document.getElementById('imageBox');
    main.src = imgUrl;
  }

  //沒登入會員收藏，跳轉登入
  const toSingIn = () => {
    const from = router.query;
    router.push(
      `/member/sign-in?from=http://localhost:3000/restaurant/booking?${new URLSearchParams(
        from
      ).toString()}`
    );
  };

  //給他一個loading的時間
  if (!serviceRows || !restDetailRows) return <p>loading</p>;
  return (
    <>
      <div className={Styles.abc}>
        <div className="container-inner">
          <div className={Styles.bgc}>
            <div className={Styles.breadcrumb}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#FD8C46',
                    colorBgContainer: 'transparent',
                    colorPrimaryTextHover: '#FFEFE8',
                    colorBgTextActive: '#FD8C46',
                    fontSize: 18,
                  },
                }}
              >
                <Breadcrumb
                  items={[
                    {
                      title: '餐廳列表',
                      href: 'http://localhost:3000/restaurant/list',
                    },
                    {
                      title: `${restDetailRows.name}`,
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
            <IconBtn icon={faHeart} text="收藏列表" />
          </div>
        </div>
      </div>
      <div className="container-inner">
        <div className={Styles.rest_detail}>
          <div className={Styles.rest_image}>
            <div className={Styles.rest_image_main}>
              <img
                src={`/rest_image/image/${imageRows[0]?.img_name}`}
                alt={imageRows[0]?.img_name}
                id="imageBox"
              />
            </div>
            <div className={Styles.rest_image_group}>
              <div className={Styles.rest_image_single}>
                <img
                  src={`/rest_image/image/${imageRows[0]?.img_name}`}
                  alt={imageRows[0]?.img_name}
                  onClick={() => {
                    toggleDisplayForImg(
                      `/rest_image/image/${imageRows[0]?.img_name}`
                    );
                  }}
                />
              </div>
              <div className={Styles.rest_image_single}>
                <img
                  src={`/rest_image/image/${imageRows[1]?.img_name}`}
                  alt={imageRows[1]?.img_name}
                  onClick={() => {
                    toggleDisplayForImg(
                      `/rest_image/image/${imageRows[1]?.img_name}`
                    );
                  }}
                />
              </div>
              <div className={Styles.rest_image_single}>
                <img
                  src={`/rest_image/image/${imageRows[2]?.img_name}`}
                  alt={imageRows[2]?.img_name}
                  onClick={() => {
                    toggleDisplayForImg(
                      `/rest_image/image/${imageRows[2]?.img_name}`
                    );
                  }}
                />
              </div>
              <div className={Styles.rest_image_single}>
                <img
                  src={`/rest_image/image/${imageRows[3]?.img_name}`}
                  alt={imageRows[3]?.img_name}
                  onClick={() => {
                    toggleDisplayForImg(
                      `/rest_image/image/${imageRows[3]?.img_name}`
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* <div className={Styles.rest_image}>
            <div className={Styles.rest_image_main}>
              {imageRows.map((v) => {
                return (
                  v.display && (
                    <img
                      key={v.rest_sid}
                      src={`/rest_image/image/${v.img_name}`}
                      alt={v.img_name}
                    />
                  )
                );
              })}
            </div>
            <div className={Styles.rest_image_group}>
              {imageRows
                .filter((v) => !v.display)
                .map((v) => {
                  return (
                    <div className={Styles.rest_image_single} key={v.rest_sid}>
                      {v.img_name && (
                        <div
                          role="presentation"
                          onClick={() => {
                            setImageRows(
                              toggleDisplayForImg(imageRows, v.rest_sid)
                            );
                          }}
                        >
                          <img
                            src={`/rest_image/image/${v.img_name}`}
                            alt={v.img_name}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div> */}

          <div className={Styles.rest_info}>
            <h1 className={Styles.jill_h1}>{restDetailRows.name}</h1>
            <RateStar
              score={commentAvgRows.avg_friendly}
              className={Styles.rate_star}
            />
            <p className={Styles.information}>{restDetailRows.info}</p>

            <div className={Styles.contact_group}>
              <div className={Styles.contact}>
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ maxWidth: '20px', maxHeight: '20px' }}
                  className={Styles.info_icon}
                />
                <p className={Styles.information_detail}>
                  0{restDetailRows.phone}
                </p>
              </div>
              <div className={Styles.contact}>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ maxWidth: '20px', maxHeight: '20px' }}
                  className={Styles.info_icon}
                />
                <p className={Styles.information_detail}>
                  {restDetailRows.city}
                  {restDetailRows.area}
                  {restDetailRows.address}
                </p>
              </div>
              <div className={Styles.contact}>
                <FontAwesomeIcon
                  icon={faClock}
                  className={Styles.info_icon}
                  style={{ maxWidth: '20px', maxHeight: '20px' }}
                />
                <p className={Styles.information_detail}>
                  {restDetailRows.start_at_1}~{restDetailRows.end_at_1}
                </p>
              </div>
              <div className={Styles.contact}>
                <FontAwesomeIcon
                  icon={faPaw}
                  className={Styles.info_icon}
                  style={{ maxWidth: '20px', maxHeight: '20px' }}
                />
                <p className={Styles.information_detail}>
                  {restDetailRows.acceptType}
                </p>
              </div>
            </div>

            {/* button */}
            <div className={Styles.detail_main_buttom}>
              <IconSeconBtn
                icon={faHeart}
                text="收藏餐廳"
                clickHandler={openShowLikeList}
                className={Styles.collect_btn}
              />
              <div className="like">
                {showLikeList && (
                  <Likelist
                    datas={likeDatas}
                    customCard={<LikeListCard datas={likeDatas} />}
                    closeHandler={closeShowLikeList}
                  />
                )}
              </div>
              <ImageGallary data={menuRows} />
              {auth.token ? (
                <IconMainBtn
                  icon={faCalendar}
                  text="我要預約"
                  clickHandler={() => {
                    router.push(`/restaurant/booking`);
                  }}
                />
              ) : (
                <AlertModal
                  btnType="IconMainBtn"
                  btnText="我要預約"
                  icon={faHeart}
                  content="才可預約餐廳"
                  mainBtnText="前往登入"
                  subBtnText="暫時不要"
                  confirmHandler={toSingIn}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container-inner">
        <Tab
          text1="服務項目"
          text2="攜帶規範"
          text3="餐廳特色"
          text4="優惠/活動"
          text5="店家叮嚀"
          text6="饕客評價"
        />
      </div>
      <div className="container-inner">
        <h2 className={Styles.jill_h2}>服務項目</h2>
        <Row gutter={[48, 48]} className={Styles.row_gutter}>
          <Col xl={4} xs={8}>
            <PinkBtn
              text={serviceRows[0]?.service_name}
              img={`/rest_image/service/${serviceRows[0]?.service_icon}`}
            />
          </Col>
          <Col xl={4} xs={8}>
            <PinkBtn
              text={serviceRows[1]?.service_name}
              img={`/rest_image/service/${serviceRows[1]?.service_icon}`}
            />
          </Col>
        </Row>
      </div>
      <div className="container-inner">
        <h2 className={Styles.jill_h2}>攜帶規則</h2>
        <Row gutter={[48, 48]}>
          <Col xl={4} xs={8}>
            <PinkBtn
              text={ruleRows[0]?.rule_name}
              img={`/rest_image/rule/${ruleRows[0]?.rule_icon}`}
            />
          </Col>
          <Col xl={4} xs={8}>
            <PinkBtn
              text={ruleRows[1]?.rule_name}
              img={`/rest_image/rule/${ruleRows[1]?.rule_icon}`}
            />
          </Col>
        </Row>
      </div>
      <div className="container-inner">
        <h2 className={Styles.jill_h2}>餐廳特色</h2>
      </div>
      <FeatureCard
        img={`/rest_image/feature/${restDetailRows.feature_img}`}
        title={restDetailRows.feature_title}
        feature_info={restDetailRows.feature_content}
      />
      <div className="container-inner">
        <h2 className={Styles.jill_h2}>餐廳活動</h2>
      </div>
      <ActivityCard
        img={`/rest_image/activity/${activityRows.img}`}
        title={activityRows.title}
        date={activityRows.date}
        activity_info={activityRows.content}
      />
      <div className={Styles.CloudTop}>
        <Image src={CloudTop} alt="CloudTop" />
      </div>
      <div className={Styles.notion_bgc}>
        <div className="container-inner">
          <div className={Styles.cat_section}>
            <h2 className={Styles.jill_h2_notion}>預約叮嚀</h2>
            <Image src={catJump} alt="catJump" />
          </div>
          <div className={Styles.notion_frame}>
            <p>
              1. 事先了解店家規範：不論是去任何餐廳都應該先詳細了解店內規範。
            </p>
            <p>
              2.
              配合餐廳規範：遵守不同餐廳的寵物規範，避免惡意違規造成店家不好的印象。
            </p>
            <p>
              3.
              保護毛兒安全：保護自己與他人毛兒的安全非常重要，攻擊性強的毛兒要加強管控，要摸別人家毛兒之前也要先問過毛爸媽。
            </p>
            <p>
              4.
              不影響他人用餐：管控好毛兒吠叫問題，也別讓毛兒四處亂跑（是餐廳友善程度而定），避免影響他人用餐。
            </p>
            <p>
              5.
              不共用餐具：為維護他人權益與用餐品質，除非店家有明確說可以，不然別讓毛兒上餐桌，也不要與毛兒共用餐廳餐具。
            </p>
            <p>
              6.
              維護環境整潔：自備毛兒坐墊，自行處理毛兒便溺，共同維護環境整潔。
            </p>
          </div>
        </div>
      </div>
      <NotionAreaBgc />
      <div className="container-inner">
        <h2 className={Styles.jill_h2}>饕客評價</h2>
        <div className={Styles.section_rating}>
          <div className={Styles.avg}>
            <p className={Styles.comment_title}>用餐環境</p>
            <FontAwesomeIcon icon={faStar} className={Styles.star} />
            {commentAvgRows.avg_environment}
          </div>
          <div className={Styles.avg}>
            <p className={Styles.comment_title}>服務</p>
            <FontAwesomeIcon icon={faStar} className={Styles.star} />
            {commentAvgRows.avg_food}
          </div>
          <div className={Styles.avg}>
            <p className={Styles.comment_title}>友善程度</p>
            <FontAwesomeIcon icon={faStar} className={Styles.star} />
            {commentAvgRows.avg_friendly}
          </div>
        </div>
      </div>

      <div className="container-inner">
        <div className={Styles.comment_cards}>
          {commentRows.map((v) => {
            return (
              <CommentCard
                key={v.rest_commtent_id}
                name={v.name}
                rating={v.avg_rating}
                content={v.content}
                date={v.created_at}
                profile={v.profile}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

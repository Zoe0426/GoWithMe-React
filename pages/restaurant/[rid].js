import React, { useEffect, useContext, useRef } from 'react';
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
  faChevronLeft,
  faChevronRight,
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
import LikeListDrawer from '@/components/ui/like-list/LikeListDrawer';
import AlertModal from '@/components/ui/restaurant/AlertModal';
import IconFavBtn from '@/components/ui/restaurant/IconFavBtn';
import NoCommentCard from '@/components/ui/cards/comment-card-no';

export default function RestInfo() {
  const { query, asPath } = useRouter();
  const { auth, setAuth } = useContext(AuthContext);
  const restServiceRule = useRef(null);
  const restSpecial = useRef(null);
  const restAvtivity = useRef(null);
  const restNote = useRef(null);
  const restComment = useRef(null);

  const router = useRouter();
  const [restDetailRows, setRestDetailRows] = useState({ like: false });
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

  //收藏清單
  const [likeDatas, setLikeDatas] = useState([]);
  const [showLikeList, setShowLikeList] = useState(false);
  const [addLikeList, setAddLikeList] = useState([]);
  const [isClickingLike, setIsClickingLike] = useState(false);

  const [menuRows, setMenuRows] = useState([]);

  const [first, setFrist] = useState();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  //控制評論狀態
  const [commentWindowWidth, setCommentWindowWidth] = useState(null);
  const [commentCurrent, setCommentCurrent] = useState(0);
  const [totalCommentPage, setTotalCommentPage] = useState(0);
  const [showCommentCard, setShowCommentCard] = useState([]);
  const [showCommentCardQty, setShowCommentCardQty] = useState(4);
  const [showCommentArrowLeft, setShowCommentArrowLeft] = useState(false);
  const [showCommentArrowRight, setShowCommentArrowRight] = useState(true);
  const [showFullCommentArrowLeft, setShowFullCommentArrowLeft] =
    useState(false);
  const [showFullCommentArrowRight, setShowFullCommentArrowRight] =
    useState(true);
  const [showFullCommentCard, setShowFullCommentCard] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const getData = async (rid = '', token = '') => {
    const restInfo = await fetch(
      `http://localhost:3002/restaurant-api/restaurant/${rid}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const {
      restDetailRows,
      imageRows,
      ruleRows,
      serviceRows,
      commentRows,
      commentAvgRows,
      activityRows,
      menuRows,
    } = await restInfo.json();

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
    console.log(restDetailRows);

    setData(data);

    if (Array.isArray(commentRows)) {
      setDataForComment(commentRows);

      let newCommentEachQty = dataForCommentQty.map((v) => {
        const eachCommentQty =
          v.avg_rating === 6
            ? commentRows.length
            : commentRows.filter((c) => parseInt(c.avg_rating) === v.avg_rating)
                .length;

        return { ...v, count: eachCommentQty };
      });
      setDataForCommentQty(newCommentEachQty);
    }
  };

  useEffect(() => {
    //取得用戶拜訪的特定商品編號
    const { rid } = router.query;

    if (rid) {
      if (auth.token) {
        getData(rid, auth.token);
      } else {
        getData(rid);
      }
      setCommentFilter(6);
    }
  }, [router.query]);

  //照片切換
  function toggleDisplayForImg(imgUrl) {
    let main = document.getElementById('imageBox');
    main.src = imgUrl;
  }
  //收藏列表相關的函式-------------------------------------------------------

  const getLikeList = async (token = '') => {
    const res = await fetch(
      `${process.env.API_SERVER}/restaurant-api/show-like`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const data = await res.json();
    console.log(data);

    if (data.likeDatas.length > 0) {
      setLikeDatas(data.likeDatas);
    }
    console.log(likeDatas);
  };

  //沒登入會員收藏，跳轉登入booking
  const toSingInBook = () => {
    const from = router.query;
    router.push(`/member/sign-in?from=${process.env.WEB}/restaurant/booking`);
  };
  //沒登入會員收藏，跳轉登入likelist
  const toSingIn = () => {
    const from = router.asPath;
    router.push(`/member/sign-in?from=${process.env.WEB}${from}`);
  };

  //卡片愛心收藏的相關函式-------------------------------------------------------
  const addLikeListHandler = () => {
    const timeClick = new Date().getTime();
    const data = [
      {
        rest_sid: router.query.rid,
        time: timeClick,
      },
    ];
    sendLike(data, auth.token);
    setRestDetailRows({
      ...restDetailRows,
      like: true,
    });
  };

  //將資料送到後端
  const sendLike = async (arr, token = '') => {
    const res = await fetch(
      `${process.env.API_SERVER}/restaurant-api/handle-like-list`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: arr }),
      }
    );
    const data = await res.json();

    if (data.success) {
      console.log(data);
    }
  };

  //監看點擊愛心收藏的相關控制
  useEffect(() => {
    if (!isClickingLike && addLikeList.length > 0) {
      sendLike(addLikeList, auth.token).then(() => {
        //在成功送資料到後端後重置addLikeList
        setAddLikeList([]);
      });
    }
  }, [isClickingLike, addLikeList]);

  //展開收藏列表
  const toggleLikeList = () => {
    const newShowLikeList = !showLikeList;
    console.log(newShowLikeList);
    setShowLikeList(newShowLikeList);
    if (newShowLikeList) {
      document.body.classList.add('likeList-open');
      getLikeList(auth.token);
    } else {
      document.body.classList.remove('likeList-open');
    }
  };

  const closeLikeList = () => {
    setShowLikeList(false);
    document.body.classList.remove('likeList-open');
  };

  // 刪除所有收藏
  const removeAllLikeList = (token) => {
    if (likeDatas.length > 0) {
      //將列表顯示為空的
      setLikeDatas([]);
      //將畫面上的愛心按鈕清除
      setRestDetailRows((prevRows) => ({ ...prevRows, like: false }));
      // const newData = data.rows.map((v) => {
      //   return { ...v, like: false };
      // });
      // setData({ ...data, rows: newData });
      //將請求送到後端作業
      removeLikeListToDB('all', token);
    }
  };

  // 更新 like 狀態的函式
  const updateLikeStatus = (newStatus) => {
    setRestDetailRows((prevRestDetailRows) => ({
      ...prevRestDetailRows,
      like: newStatus,
    }));
  };
  // 收藏按鈕/已經收藏按鈕toggle
  const toggleLikeStatus = (rid, token) => {
    if (restDetailRows.like) {
      // 如果已收藏，則取消收藏
      removeLikeListBtn(rid, token);
      updateLikeStatus(false); // 更新狀態為未收藏
    } else {
      // 如果未收藏，則添加收藏
      addLikeListHandler();
      updateLikeStatus(true); // 更新狀態為已收藏
    }
  };

  const removeLikeListBtn = (rid, token = '') => {
    // 將列表該項目刪除
    setLikeDatas((prevLikeDatas) => {
      // 使用 filter 方法來刪除符合條件的項目
      return prevLikeDatas.filter((item) => item.rest_sid !== rid);
    });

    // 將請求送到後端作業
    removeLikeListToDB(rid, token);
  };

  // 刪除單一收藏
  const removeLikeListItem = (rid, token = '') => {
    //將列表該項目刪除
    const newLikeList = likeDatas.filter((arr) => {
      return arr.rest_sid !== rid;
    });
    setLikeDatas(newLikeList);

    //將畫面上的愛心按鈕清除
    setRestDetailRows((prevRows) => ({ ...prevRows, like: false }));
    // const newData = data.rows.map((v) => {
    //   if (v.rest_sid === rid) {
    //     return { ...v, like: false };
    //   } else {
    //     return { ...v };
    //   }
    // });
    // setData({ ...data, rows: newData });
    //將請求送到後端作業
    removeLikeListToDB(rid, token);
  };

  console.log(restDetailRows.like);

  const removeLikeListToDB = async (rid = '', token = '') => {
    try {
      const removeAll = await fetch(
        `${process.env.API_SERVER}/restaurant-api/likelist/${rid}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      const result = await removeAll.json();
      console.log(JSON.stringify(result, null, 4));
      if (rid === 'all') {
        setTimeout(() => {
          toggleLikeList();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function scrollToAnchor(anchorId) {
    const anchorElement = document.getElementById(anchorId);
    if (anchorElement) {
      const navbarHeight = 100; // 替換為您Navbar的高度，單位為像素
      const offset = anchorElement.getBoundingClientRect().top;
      window.scrollBy({
        top: offset - navbarHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  /*用來過濾評價星的，要保持原本的dataForComment*/
  const commentStyle = {
    position: 'relative',
    left: `calc(382px * ${showCommentCardQty} * -${commentCurrent})`,
    transition: '0.3s',
  };
  //後端資料存放
  const [dataForComment, setDataForComment] = useState([]);
  const [dataForCommentQty, setDataForCommentQty] = useState([
    { avg_rating: 6, count: 0 },
    { avg_rating: 5, count: 0 },
    { avg_rating: 4, count: 0 },
    { avg_rating: 3, count: 0 },
    { avg_rating: 2, count: 0 },
    { avg_rating: 1, count: 0 },
  ]);
  const [commentFilter, setCommentFilter] = useState(6); //評論篩選，6為全部，其他為5~1
  const commentFiliterByRating = (dataForComment, type) => {
    switch (type) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return dataForComment.filter((v) => v.avg_rating === type);
      default:
        return dataForComment;
    }
  };
  //處理評論頁碼更動
  useEffect(() => {
    countTotalCommentPage();
  }, [commentFilter, dataForCommentQty, showCommentCardQty]);
  //評價相關的函示-----------------------------------------------------
  //控制顯示全螢幕的單一評價內容，並設定左右箭頭狀態
  const toggleCommentCard = (arr = [], ratingNow = 6, id = '') => {
    const newShowFullCommentCard = !showFullCommentCard;
    if (arr.length > 0 && id) {
      const newArr = commentFiliterByRating(arr, ratingNow).map((v) => {
        if (v.rest_comment_sid === id) {
          return { ...v, display: true };
        } else return { ...v, display: false };
      });
      setShowCommentCard(newArr);
      const currentIndex = newArr.findIndex((v) => v.display === true);
      if (currentIndex === 0) {
        setShowFullCommentArrowLeft(false);
      } else {
        setShowFullCommentArrowLeft(true);
      }
      if (currentIndex < newArr.length - 1) {
        setShowFullCommentArrowRight(true);
      } else {
        setShowFullCommentArrowRight(false);
      }
    }

    setShowFullCommentCard(newShowFullCommentCard);
    if (newShowFullCommentCard) {
      document.body.classList.add('likeList-open');
    } else {
      document.body.classList.remove('likeList-open');
    }
  };

  //轉換到下一張評價卡片
  const slideNextComment = (arr = []) => {
    const currentIndex = arr.findIndex((v) => v.display === true);
    if (currentIndex < arr.length - 1) {
      const newArr = arr.map((v, i) => {
        if (i === currentIndex + 1) {
          return { ...v, display: true };
        } else return { ...v, display: false };
      });
      setShowCommentCard(newArr);
      setShowFullCommentArrowLeft(true);
    }
    if (currentIndex === arr.length - 2) {
      setShowFullCommentArrowRight(false);
    }
  };
  //轉換到上一張評價卡片
  const slidePreComment = (arr = []) => {
    const currentIndex = arr.findIndex((v) => v.display === true);
    if (currentIndex > 0) {
      const newArr = arr.map((v, i) => {
        if (i === currentIndex - 1) {
          return { ...v, display: true };
        } else return { ...v, display: false };
      });
      setShowCommentCard(newArr);
      setShowFullCommentArrowRight(true);
    }
    if (currentIndex <= 1) {
      setShowFullCommentArrowLeft(false);
    }
  };

  //一般顯示區的評價卡相關function
  const countTotalCommentPage = () => {
    const currentCommentCardsQty = dataForCommentQty.filter((v) => {
      return parseInt(v.avg_rating) === parseInt(commentFilter);
    })[0].count;

    const newCommentTotalPage = Math.ceil(
      currentCommentCardsQty / showCommentCardQty
    );
    if (newCommentTotalPage <= 1) {
      setShowCommentArrowRight(false);
    } else {
      setShowCommentArrowRight(true);
    }

    setTotalCommentPage(newCommentTotalPage);
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
                      href: `${process.env.WEB}/restaurant/list`,
                    },
                    {
                      title: `${restDetailRows.name}`,
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
            {auth.token ? (
              <IconBtn
                icon={faHeart}
                text="收藏列表"
                clickHandler={toggleLikeList}
              />
            ) : (
              <AlertModal
                btnType="iconBtn"
                btnText="收藏列表"
                icon={faHeart}
                content="才可查看收藏列表"
                mainBtnText="前往登入"
                subBtnText="暫時不要"
                confirmHandler={toSingIn}
              />
            )}
          </div>
        </div>
      </div>
      {/* 收藏列表畫面 */}
      <div className="container-inner">
        <div className={Styles.like_list}>
          {showLikeList && (
            <LikeListDrawer
              datas={likeDatas}
              customCard={
                <LikeListCard
                  datas={likeDatas}
                  token={auth.token}
                  removeLikeListItem={removeLikeListItem}
                  closeLikeList={closeLikeList}
                />
              }
              closeHandler={toggleLikeList}
              removeAllHandler={() => {
                removeAllLikeList(auth.token);
              }}
            />
          )}
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
              {!auth.token ? (
                <AlertModal
                  btnType="iconSeconBtn"
                  btnText="加入收藏"
                  content="才可收藏餐廳"
                  mainBtnText="前往登入"
                  subBtnText="暫時不要"
                  confirmHandler={toSingIn}
                  icon={faHeart}
                />
              ) : (
                <IconFavBtn
                  icon={faHeart}
                  text={restDetailRows.like ? '已收藏' : '收藏餐廳'}
                  like={restDetailRows.like ? false : true}
                  clickHandler={() =>
                    toggleLikeStatus(router.query.rid, auth.token)
                  }
                />
              )}
              <div className="like"></div>
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
                  icon={faFileLines}
                  content="才可預約餐廳"
                  mainBtnText="前往登入"
                  subBtnText="暫時不要"
                  confirmHandler={toSingInBook}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container-inner">
        <Tab
          text1="服務/攜帶規範"
          text2="餐廳特色"
          text3="餐廳活動"
          text4="店家叮嚀"
          text5="饕客評價"
          clickHandler1={() => scrollToAnchor('serviceSection')}
          clickHandler2={() => scrollToAnchor('feature')}
          clickHandler3={() => scrollToAnchor('activity')}
          clickHandler4={() => scrollToAnchor('note')}
          clickHandler5={() => scrollToAnchor('comment')}
        />
      </div>
      <div className="container-inner" id="serviceSection">
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
      <div className="container-inner" id="feature">
        <h2 className={Styles.jill_h2}>餐廳特色</h2>
      </div>
      <FeatureCard
        img={`/rest_image/feature/${restDetailRows.feature_img}`}
        title={restDetailRows.feature_title}
        feature_info={restDetailRows.feature_content}
      />
      <div className="container-inner" id="activity">
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
        <div className="container-inner" id="note">
          <div className={Styles.cat_section}>
            <h2 className={Styles.jill_h2_notion}>店家叮嚀</h2>
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
      {/* <div className="container-inner">
        <h2 className={Styles.jill_h2}>饕客評價</h2>
        <div className={Styles.section_rating}>
          <div className={Styles.avg}>
            <p className={Styles.comment_title}>用餐環境</p>
            <div>
              <FontAwesomeIcon icon={faStar} className={Styles.star} />
              {commentAvgRows.avg_environment}
            </div>
          </div>
          <div className={Styles.avg}>
            <p className={Styles.comment_title}>服務</p>
            <div>
              <FontAwesomeIcon icon={faStar} className={Styles.star} />
              {commentAvgRows.avg_food}
            </div>
          </div>
          <div className={Styles.avg}>
            <p className={Styles.comment_title}>友善程度</p>
            <div>
              <FontAwesomeIcon icon={faStar} className={Styles.star} />
              {commentAvgRows.avg_friendly}
            </div>
          </div>
        </div>
      </div> */}
      {/* 評價區 */}
      <div className="container-outer">
        <div className="container-inner">
          <div className={Styles.comment_section} id="comment">
            <h4 className={Styles.comment_title}>饕客評價</h4>
            <p>{`(共 ${dataForCommentQty[0].count} 則相關評論)`}</p>
            <div className={Styles.comment_btns}>
              {dataForCommentQty.map((v) => {
                const { avg_rating, count } = v;
                return (
                  <button
                    key={avg_rating}
                    className={
                      commentFilter === avg_rating
                        ? `${Styles.comment_btn} ${Styles.active_comment_btn}`
                        : Styles.comment_btn
                    }
                    onClick={() => {
                      setCommentFilter(avg_rating);
                      setCommentCurrent(0);
                      setShowCommentArrowLeft(false);
                    }}
                  >
                    {avg_rating === 6
                      ? '全部評論'
                      : `${avg_rating}星 (${count})`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className={Styles.shop_container_inner}>
          <div className={Styles.comment_cards_box}>
            {showCommentArrowLeft && (
              <div className={Styles.detail_left_arrow_box}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={Styles.left_arrow}
                  onClick={() => {
                    if (commentCurrent <= 0) {
                      setShowCommentArrowLeft(false);
                    } else if (commentCurrent === 1) {
                      setCommentCurrent(commentCurrent - 1);
                      setShowCommentArrowRight(true);
                      setShowCommentArrowLeft(false);
                    } else {
                      setCommentCurrent(commentCurrent - 1);
                      setShowCommentArrowRight(true);
                    }
                  }}
                />
              </div>
            )}
            {showCommentArrowRight && (
              <div
                className={`${Styles.detail_right_arrow_box} ${Styles.comment_right_arrow_box}`}
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={Styles.right_arrow}
                  onClick={() => {
                    if (commentCurrent === totalCommentPage - 1) {
                      setShowCommentArrowRight(false);
                    } else if (commentCurrent === totalCommentPage - 2) {
                      setCommentCurrent(commentCurrent + 1);
                      setShowCommentArrowLeft(true);
                      setShowCommentArrowRight(false);
                    } else {
                      setCommentCurrent(commentCurrent + 1);
                      setShowCommentArrowLeft(true);
                    }
                  }}
                />
              </div>
            )}
            <div className={Styles.comment_cards} style={commentStyle}>
              {dataForComment &&
              commentFiliterByRating(dataForComment, commentFilter).length <=
                0 ? (
                <NoCommentCard star={commentFilter} />
              ) : (
                commentFiliterByRating(dataForComment, commentFilter).map(
                  (v) => {
                    const {
                      rest_commtent_id,
                      created_at,
                      avg_rating,
                      content,
                      name,
                      profile,
                    } = v;
                    return (
                      <CommentCard
                        key={rest_commtent_id}
                        date={created_at}
                        rating={avg_rating}
                        content={content}
                        name={name}
                        profile={profile}
                        clickHandler={() => {
                          toggleCommentCard(
                            dataForComment,
                            commentFilter,
                            rest_commtent_id
                          );
                        }}
                      />
                    );
                  }
                )
              )}
            </div>
          </div>
        </div>
        <div className="container-inner">
          <ul className={Styles.shop_recommend_pages}>
            {totalCommentPage <= 1 ? (
              <div className={Styles.no_pages}></div>
            ) : (
              Array(totalCommentPage)
                .fill(0)
                .map((v, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        i === commentCurrent
                          ? `${Styles.shop_sliders_pages_bttn} ${Styles.shop_sliders_pages_active}`
                          : Styles.shop_sliders_pages_bttn
                      }
                      onClick={() => {
                        setCommentCurrent(i);
                        if (i === 0) {
                          setShowCommentArrowLeft(false);
                          setShowCommentArrowRight(true);
                        } else if (i === totalCommentPage - 1) {
                          setShowCommentArrowRight(false);
                          setShowCommentArrowLeft(true);
                        } else {
                          setShowCommentArrowLeft(true);
                          setShowCommentArrowRight(true);
                        }
                      }}
                    ></li>
                  );
                })
            )}
          </ul>
        </div>
      </div>
      {/* 全螢幕的評價顯示 */}
      {showFullCommentCard && (
        <div className={Styles.show_full_comment_card}>
          <div
            className={Styles.bgc_comment_card}
            onClick={toggleCommentCard}
          ></div>
          <div className={Styles.comment_card_display}>
            {showFullCommentArrowLeft && (
              <div className={Styles.detail_left_arrow_box}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={Styles.left_arrow}
                  onClick={() => {
                    slidePreComment(showCommentCard);
                  }}
                />
              </div>
            )}
            {showFullCommentArrowRight && (
              <div
                className={`${Styles.detail_right_arrow_box} ${Styles.full_right_arrow_box}`}
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={Styles.right_arrow}
                  onClick={() => {
                    slideNextComment(showCommentCard);
                  }}
                />
              </div>
            )}

            {showCommentCard.map((v) => {
              const {
                rest_commtent_id,
                name,
                avg_rating,
                content,
                created_at,
                profile,
                display,
              } = v;
              return (
                display && (
                  <div className={Styles.test} key={rest_commtent_id}>
                    <CommentCard
                      date={created_at}
                      rating={avg_rating}
                      content={content}
                      name={name}
                      profile={profile}
                      clickHandler={toggleCommentCard}
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}
      {/* 我的評價區 */}
      {/* <div className="container-inner" id="comment">
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
                // clickHandler={toggleCommentCard}
              />
            );
          })}
        </div>
      </div> */}
    </>
  );
}

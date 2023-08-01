import { Fragment, useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '@/context/AuthContext';
import BreadCrumb from '@/components/ui/bread-crumb/breadcrumb';
import Image from 'next/image';
import styles from '@/styles/shop.module.css';
import useLocalStorageJson from '@/hooks/useLocalStorageJson';

/*引用的卡片*/
import CommentCard from '@/components/ui/cards/comment-card';
import NoCommentCard from '@/components/ui/cards/comment-card-no';
import Likelist from '@/components/ui/like-list/LikeListDrawer';
import ShopLikelistCard from '@/components/ui/cards/shop-like-list-card';
import ShopProductCard from '@/components/ui/cards/shop-product-card';

/*引用的按鈕+modal*/
import IconSeconBtn from '@/components/ui/buttons/IconSeconBtn';
import IconBtn from '@/components/ui/buttons/IconBtn';
import MainBtn from '@/components/ui/buttons/MainBtn';
import Modal from '@/components/ui/modal/modal';
import ModalWithoutBtn from '@/components/ui/modal/modal-without-btn';
import ModoalReminder from '@/components/ui/shop/modoal-reminder';
import NumberInput from '@/components/ui/numberInput/numberInput1';

/*引用的背景*/
import BGMiddleDecoration from '@/components/ui/decoration/bg-middle-decoration';
import BGRecomandDecoration from '@/components/ui/decoration/bg-reconmand-decoration';
import BGUpperDecoration from '@/components/ui/decoration/bg-upper-decoration';
import CorpLogo from '@/assets/corpLogo.svg';
import PawWalking from '@/components/ui/shop/pawWalking';

// 引用的icon+圖示
import RateStar from '@/components/ui/rateStar/RateStar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faCartShopping,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

export default function Product() {
  const router = useRouter();
  const productComment = useRef(null);
  const productReturn = useRef(null);
  const productSpecial = useRef(null);
  const { auth, setAuth } = useContext(AuthContext);
  const [first, setFrist] = useState(false);
  const [localStorageHistory, setLocalStorageHistory] = useLocalStorageJson(
    'petProductHistory',
    [],
    true
  );

  const [breadCrubText, setBreadCrubText] = useState([
    {
      id: 'shop',
      text: '商城',
      href: 'http://localhost:3000/product',
      show: true,
    },
    { id: 'search', text: '/ 飼料 /', href: '', show: true },
    {
      id: 'pid',
      text: '',
      href: '',
      show: true,
    },
  ]);
  const [commentFilter, setCommentFilter] = useState(6); //評論篩選，6為全部，其他為5~1
  const [tabActive, setTabActive] = useState('special');

  const [addLikeList, setAddLikeList] = useState([]);
  const [isClickingLike, setIsClickingLike] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState({
    pid: '',
    spec: '',
    unitPrice: 0,
    qty: 1,
  });
  const [successAddToCard, setSuccessAddToCard] = useState(false);
  //用來存放將放入購物車的資料
  const [purchaseQty, setPurchaseQty] = useState(0);
  const [showLikeList, setShowLikeList] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  //後端資料存放
  const [dataForComment, setDataForComment] = useState([]);
  const [dataForCommentQty, setDataForCommentQty] = useState([
    { rating: 6, count: 0 },
    { rating: 5, count: 0 },
    { rating: 4, count: 0 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ]);
  const [datatForProductDetail, setDataForProductDetail] = useState([]);
  const [datatForProductMain, setDataForProductMain] = useState({
    product_sid: '',
    name: '',
    description: '',
    supplier_name: '',
    made_in_where: '',
    avg_rating: null,
    catergory_chinese_name: '',
    catergory_english_name: '',
    like: false,
  });
  const [dataForRecomand, setDataForRecomand] = useState([]);
  const [likeDatas, setLikeDatas] = useState([]);

  //控制主商品照片放大的
  const [countEnterMainPic, setCoutEnterMainPic] = useState(1);
  const [isMouseOverOnMainPic, setIsMouseOverOnMainPic] = useState(false);
  const [mousePositionrOnMainPic, setMousePositionrOnMainPic] = useState({
    x: 0,
    y: 0,
  });

  //控制推薦商品狀態
  const [recommendWindowWidth, setRecommendWindowWidth] = useState(null);
  const [recommendCurrent, setRecommendCurrent] = useState(0);
  const [totalRecommandPage, setTotalRecommandPage] = useState(0);
  const [showRecommandCardQty, setShowRecommandCardQty] = useState(4);
  const recommendStyle = {
    position: 'relative',
    left: `calc(292px * ${showRecommandCardQty} * -${recommendCurrent})`,
    transition: '0.3s',
  };

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
  const commentStyle = {
    position: 'relative',
    left: `calc(382px * ${showCommentCardQty} * -${commentCurrent})`,
    transition: '0.3s',
  };

  const getData = async (pid = '', token = '') => {
    //拿回特定商品的相關資訊 與評價
    const res_productInfo = await fetch(
      `${process.env.API_SERVER}/shop-api/product/${pid}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const {
      shopMainData,
      shopDetailData,
      commentDatas,
      // commentEachQty,
      reccomandData,
    } = await res_productInfo.json();

    if (Array.isArray(shopMainData)) {
      //將進入頁面的都存在localStorage，作為瀏覽紀錄的資料
      if (shopMainData[0].img && first) {
        if (
          localStorageHistory.length &&
          localStorageHistory[0].product_sid === pid
        ) {
          setLocalStorageHistory(localStorageHistory);
        } else {
          if (localStorageHistory.length >= 3) {
            localStorageHistory.pop();
          }
          setLocalStorageHistory([
            {
              product_sid: pid,
              img: shopMainData[0].img,
            },
            ...localStorageHistory,
          ]);
        }
      }
      const innitDescription = shopMainData[0].description;
      const description = innitDescription
        .replace(/\n/g, '<br/>')
        .replace(/amp;/g, '&');
      setDataForProductMain({ ...shopMainData[0], description });

      const newBreadCrubText = breadCrubText.map((v) => {
        if (v.id === 'search') {
          return {
            ...v,
            text: `/ ${shopMainData[0].catergory_chinese_name} /`,
            href: `${process.env.WEB}/product/list?category=${shopMainData[0].catergory_english_name}`,
          };
        }
        if (v.id === 'pid') {
          return { ...v, text: shopMainData[0].name };
        } else return { ...v };
      });
      setBreadCrubText(newBreadCrubText);
    }

    if (Array.isArray(commentDatas)) {
      setDataForComment(commentDatas);

      let newCommentEachQty = dataForCommentQty.map((v) => {
        const eachCommentQty =
          v.rating === 6
            ? commentDatas.length
            : commentDatas.filter((c) => parseInt(c.rating) === v.rating)
                .length;

        return { ...v, count: eachCommentQty };
      });
      setDataForCommentQty(newCommentEachQty);
    }

    if (Array.isArray(shopDetailData)) {
      setDataForProductDetail(
        shopDetailData.map((v, i) => {
          if (i === 0) {
            return { ...v, count: 0, display: true, active: false };
          } else return { ...v, count: 0, display: false, active: false };
        })
      );
      setPurchaseInfo({
        pid: shopMainData[0].product_sid,
        spec: '',
        unitPrice: shopDetailData[0].price,
        qty: 1,
      });
    }

    if (Array.isArray(reccomandData)) {
      setDataForRecomand(reccomandData);
    }
  };

  useEffect(() => {
    setFrist(true);
  }, [localStorageHistory]);

  //監控使用者點擊購買數量
  useEffect(() => {
    setPurchaseInfo({ ...purchaseInfo, qty: purchaseQty });
  }, [purchaseQty]);

  //監看點擊愛心收藏的相關控制
  useEffect(() => {
    if (!isClickingLike && addLikeList.length > 0) {
      sendLike(addLikeList, auth.token).then(() => {
        //在成功送資料到後端後重置addLikeList
        setAddLikeList([]);
      });
    }
  }, [isClickingLike, addLikeList]);

  useEffect(() => {
    //取得用戶拜訪的特定商品編號
    const { pid } = router.query;

    if (pid) {
      if (auth.token) {
        getData(pid, auth.token);
      } else {
        getData(pid);
      }
      setCoutEnterMainPic(1);
      setShowWarning(false);
      setCommentFilter(6);
      setCommentCurrent(0);
      countTotalCommentPage();
      setShowCommentArrowLeft(false);
      setRecommendCurrent(0);
    }
  }, [router.query, first]);

  //處理視窗大小時，商品推薦要顯示多少與頁碼
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        let newWindowWidth = 1280;
        let commentNewWindowWidth = 1280;
        if (window.innerWidth < 1920 && window.innerWidth > 768) {
          newWindowWidth = window.innerWidth * 0.68 + 16 - 40;
          commentNewWindowWidth = window.innerWidth * 0.68 + 32 - 40;
        }
        if (window.innerWidth < 767) {
          newWindowWidth = window.innerWidth * 0.85 + 16 - 40;
          commentNewWindowWidth = window.innerWidth * 0.85 + 32 - 40;
        }
        let showRecommandCardQty = Math.floor(newWindowWidth / 292);
        if (showRecommandCardQty < 1) {
          showRecommandCardQty = 1;
        }
        const newRecommandTotalPage = Math.ceil(24 / showRecommandCardQty);
        setShowRecommandCardQty(showRecommandCardQty);
        setRecommendWindowWidth(newWindowWidth);
        setTotalRecommandPage(newRecommandTotalPage);
        setRecommendCurrent(0);
        setCommentWindowWidth(commentNewWindowWidth);

        let showCommentCardQty = Math.floor(commentNewWindowWidth / 382);

        if (showCommentCardQty <= 1) {
          showCommentCardQty = 1;
        }
        setShowCommentCardQty(showCommentCardQty);
        setCommentCurrent(0);
        setShowCommentArrowLeft(false);
        countTotalCommentPage();
      };

      handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
        // 在元件卸載時清除事件監聽器
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [recommendWindowWidth, commentWindowWidth]);

  //處理評論頁碼更動
  useEffect(() => {
    countTotalCommentPage();
  }, [commentFilter, dataForCommentQty, showCommentCardQty]);

  //監聽使用者目前滑到哪裡，而active tabs
  useEffect(() => {
    // 滾動事件處理函式
    const handleScroll = () => {
      const uls = document.querySelectorAll('ul');
      const divs = document.querySelectorAll('div');
      let activeSectionId = 'special';

      uls.forEach((ul) => {
        // 取得每個區塊的位置資訊
        const rect = ul.getBoundingClientRect();

        // 判斷區塊是否進入使用者的螢幕範圍
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2 &&
          (ul.id === 'special' || ul.id === 'return')
        ) {
          activeSectionId = ul.id;
        }
      });
      divs.forEach((div) => {
        // 取得每個區塊的位置資訊
        const rect = div.getBoundingClientRect();

        // 判斷區塊是否進入使用者的螢幕範圍
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2 &&
          div.id === 'comment'
        ) {
          activeSectionId = div.id;
        }
      });

      setTabActive(activeSectionId);
    };

    // 監聽滾動事件
    window.addEventListener('scroll', handleScroll);

    // 記得在組件解除掛載時移除事件監聽器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //購物車相關函式----------------------------
  const sendToCart = async (obj = {}, token = '') => {
    const res = await fetch(`${process.env.API_SERVER}/shop-api/sent-to-cart`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    const data = await res.json();

    if (data.success) {
      setSuccessAddToCard(true);
      setTimeout(() => {
        setSuccessAddToCard(false);
      }, 1200);
      // console.log(data);
    }
  };

  //轉換圖片顯示
  const toggleDisplayForImg = (datatForProductDetail, id) => {
    return datatForProductDetail.map((v) => {
      if (v.product_detail_sid === id) {
        return { ...v, display: true };
      } else {
        return { ...v, display: false };
      }
    });
  };

  //收藏列表相關的函式-------------------------------------------------------
  //若未登入會員而點擊收藏，要跳轉至會員登入
  const toSingIn = () => {
    const from = router.asPath;
    router.push(`/member/sign-in?from=${process.env.WEB}${from}`);
  };

  //愛心收藏的並將資料送到後端相關函式-------------------------------------------------------
  const clickHeartHandler = (arr = [], id = '', type = '') => {
    setIsClickingLike(true);
    const timeClick = new Date().getTime();
    const newData = arr.map((v) => {
      if (v.product_sid === id) {
        const insideInLikeList = addLikeList.find(
          (item) => item.product_sid === id
        );
        if (insideInLikeList) {
          setAddLikeList((preV) => preV.filter((v2) => v2.product_sid !== id));
        } else {
          setAddLikeList((preV) => [
            ...preV,
            { product_sid: id, time: timeClick },
          ]);
        }
        return { ...v, like: !v.like };
      } else return { ...v };
    });
    if (type === 'recomand') {
      setDataForRecomand(newData);
    }
    if (type === 'main') {
      setDataForProductMain(...newData);
    }

    setTimeout(() => {
      setIsClickingLike(false);
    }, 1500);
  };

  //將資料送到後端
  const sendLike = async (arr, token = '') => {
    const res = await fetch(
      `${process.env.API_SERVER}/shop-api/handle-like-list`,
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

  //取得蒐藏列表資料
  const getLikeList = async (token = '') => {
    const res = await fetch(
      `${process.env.API_SERVER}/shop-api/show-like-list`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    const data = await res.json();

    if (data.likeDatas.length > 0) {
      setLikeDatas(data.likeDatas);
    }
  };

  //控制展開收藏列表
  const toggleLikeList = () => {
    const newShowLikeList = !showLikeList;
    setShowLikeList(newShowLikeList);
    if (newShowLikeList) {
      document.body.classList.add('likeList-open');
      getLikeList(auth.token);
    } else {
      document.body.classList.remove('likeList-open');
    }
  };

  // 刪除所有收藏
  const removeAllLikeList = (token) => {
    if (likeDatas.length > 0) {
      //將畫面的BTN顯示改為加入收藏
      const newData = likeDatas.map((v) => {
        if (router.query.pid === v.product_sid) {
          setDataForProductMain({ ...datatForProductMain, like: false });
        }
      });

      //將列表顯示為空的
      setLikeDatas([]);

      //將請求送到後端作業
      removeLikeListToDB('all', token);
    }
  };

  // 刪除單一收藏
  const removeLikeListItem = (pid, token = '') => {
    //將列表該項目刪除
    const newLikeList = likeDatas.filter((arr) => {
      return arr.product_sid !== pid;
    });
    setLikeDatas(newLikeList);
    //將若取消的為畫面上的，則BTN顯示改為加入收藏

    if (router.query.pid === pid) {
      setDataForProductMain({ ...datatForProductMain, like: false });
    }
    //將請求送到後端作業
    removeLikeListToDB(pid, token);
  };

  //將刪除收藏的請求送到後端作業
  const removeLikeListToDB = async (pid = '', token = '') => {
    try {
      const removeAll = await fetch(
        `${process.env.API_SERVER}/shop-api/likelist/${pid}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      const result = await removeAll.json();
      console.log(JSON.stringify(result, null, 4));
      if (pid === 'all') {
        setTimeout(() => {
          toggleLikeList();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //控制主商品照片放大的函式----------------------------------
  const mouseOnMainPicHandler = () => {
    if (isMouseOverOnMainPic) {
      setCoutEnterMainPic(countEnterMainPic + 1);
    }

    setIsMouseOverOnMainPic(!isMouseOverOnMainPic);
  };

  const mouseOnMainPicMoveHandler = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePositionrOnMainPic({ x: mouseX, y: mouseY });
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    transform:
      isMouseOverOnMainPic && countEnterMainPic > 1
        ? `translate(${-(mousePositionrOnMainPic.x - 256) * 0.5}px, ${
            -(mousePositionrOnMainPic.y - 256) * 0.5
          }px) scale(1.5)`
        : 'none',
    transition: 'transform 0.2s',
  };

  /*用來過濾評價星的，要保持原本的dataForComment*/
  const commentFiliterByRating = (dataForComment, type) => {
    switch (type) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return dataForComment.filter((v) => v.rating === type);
      default:
        return dataForComment;
    }
  };

  //頁內跳轉-----------------------------------------------
  const sccrollToHandler = (place = '', ele) => {
    setTabActive(place);
    const position = ele.current.getBoundingClientRect();
    let offsetTop = window.scrollY + position.top;
    if (place === 'special') {
      offsetTop = offsetTop - 80 - 54;
    } else {
      offsetTop = offsetTop - 80;
    }

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  };

  //評價相關的函示-----------------------------------------------------
  //控制顯示全螢幕的單一評價內容，並設定左右箭頭狀態
  const toggleCommentCard = (arr = [], ratingNow = 6, id = '') => {
    const newShowFullCommentCard = !showFullCommentCard;
    if (arr.length > 0 && id) {
      const newArr = commentFiliterByRating(arr, ratingNow).map((v) => {
        if (v.product_comment_sid === id) {
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
      return parseInt(v.rating) === parseInt(commentFilter);
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

  return (
    <>
      <div className="outer-container">
        <div className={styles.bgc_lightBrown}>
          <div className="container-inner">
            <div className={styles.nav_head}>
              <BreadCrumb breadCrubText={breadCrubText} />
              <div className={styles.btns}>
                {auth.token ? (
                  <IconBtn
                    icon={faHeart}
                    text={'收藏列表'}
                    clickHandler={toggleLikeList}
                  />
                ) : (
                  <Modal
                    btnType="iconBtn"
                    btnText="收藏列表"
                    title="貼心提醒"
                    content={
                      <ModoalReminder text="請先登入會員，才能看收藏列表喔~" />
                    }
                    mainBtnText="前往登入"
                    subBtnText="暫時不要"
                    confirmHandler={toSingIn}
                    icon={faHeart}
                  />
                )}
              </div>
            </div>
            <div className="like">
              {showLikeList && (
                <Likelist
                  datas={likeDatas}
                  customCard={
                    <ShopLikelistCard
                      datas={likeDatas}
                      token={auth.token}
                      removeLikeListItem={removeLikeListItem}
                      closeLikeList={toggleLikeList}
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
        </div>
        <BGUpperDecoration />
        <div className="container-inner">
          <section className={styles.detail_main_box}>
            <div className={styles.detail_img_box}>
              <div
                className={styles.detail_big_img}
                onMouseEnter={mouseOnMainPicHandler}
                onMouseLeave={mouseOnMainPicHandler}
                onMouseMove={mouseOnMainPicMoveHandler}
              >
                {datatForProductDetail.map((v) => {
                  return (
                    v.display && (
                      <img
                        key={v.product_detail_sid}
                        src={`${process.env.WEB}/product-img/${v.img}`}
                        alt={v.img}
                        style={imageStyle}
                      />
                    )
                  );
                })}
              </div>
              <div className={styles.detail_small_boxs}>
                {datatForProductDetail.map((v) => {
                  return (
                    <Fragment key={v.product_detail_sid}>
                      {v.img && (
                        <div
                          className={
                            v.display
                              ? styles.detail_small_img_active
                              : styles.detail_small_img
                          }
                          role="presentation"
                          onClick={() => {
                            setDataForProductDetail(
                              toggleDisplayForImg(
                                datatForProductDetail,
                                v.product_detail_sid
                              )
                            );
                          }}
                        >
                          <img
                            src={`${process.env.WEB}/product-img/${v.img}`}
                            alt={v.img}
                          />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>
            <div className={styles.detail_main_info}>
              <div className="detail_main_upper">
                <h2 className={styles.detail_main_title}>
                  {datatForProductMain.name}
                </h2>
                <RateStar
                  score={datatForProductMain.avg_rating}
                  text={`( 已有${parseInt(
                    datatForProductMain.sales_qty
                  )?.toLocaleString('en-US')}人購買 )`}
                />
                <div className={styles.detail_price_box}>
                  <h5 className={styles.detail_spec_title}>商品價格</h5>
                  <div className={styles.detail_price}>
                    {`$${purchaseInfo.unitPrice.toLocaleString('en-US')}`}
                  </div>
                </div>

                <div className={styles.detail_spec_box}>
                  <h5 className={styles.detail_spec_title}>
                    <span>規格選項</span>
                    {showWarning && (
                      <span className={styles.detail_spec_warning}>
                        &nbsp;(請選擇規格!)
                      </span>
                    )}
                  </h5>
                  {datatForProductDetail.map((v, i) => {
                    return (
                      <button
                        className={
                          i === 0
                            ? styles.detail_spec_btn_none
                            : showWarning
                            ? `${styles.warning_detail_spec_btn} ${styles.detail_spec_btn}`
                            : purchaseInfo.spec === v.product_detail_sid
                            ? `${styles.active_detail_spec_btn} ${styles.detail_spec_btn}`
                            : styles.detail_spec_btn
                        }
                        key={v.product_detail_sid}
                        onClick={() => {
                          setPurchaseInfo({
                            ...purchaseInfo,
                            spec: v.product_detail_sid,
                            unitPrice: v.price,
                          });
                          setShowWarning(false);
                          v.img &&
                            setDataForProductDetail(
                              toggleDisplayForImg(
                                datatForProductDetail,
                                v.product_detail_sid
                              )
                            );
                        }}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
                <div className={styles.detail_qty_box}>
                  <h5 className={styles.detail_title}>數量</h5>
                  <div className={styles.detail_qty}>
                    <NumberInput handleNumber={setPurchaseQty} />
                  </div>
                </div>
                <div>
                  <h5 className={styles.detail_title}>付款方式</h5>
                  <p className={styles.detail_spec_text}>
                    VISA 信用卡 / MASTER 信用卡 / LINE Pay / Google Pay
                  </p>
                </div>
                <div>
                  <h5 className={styles.detail_title}>運送方式</h5>
                  <p className={styles.detail_ship_text}>
                    黑貓宅配 / 7-11取貨 / 全家取貨
                  </p>
                </div>
              </div>
              <div className={styles.detail_main_bottom}>
                {!auth.token ? (
                  <Modal
                    btnType="iconSeconBtn"
                    btnText="加入收藏"
                    title="貼心提醒"
                    content={
                      <ModoalReminder text="登入會員，才能收藏商品喔~" />
                    }
                    mainBtnText="前往登入"
                    subBtnText="暫時不要"
                    confirmHandler={toSingIn}
                    icon={faHeart}
                  />
                ) : (
                  <IconSeconBtn
                    red={datatForProductMain.like}
                    icon={faHeart}
                    text={datatForProductMain.like ? '已收藏' : '加入收藏'}
                    clickHandler={() => {
                      clickHeartHandler(
                        [datatForProductMain],
                        datatForProductMain.product_sid,
                        'main'
                      );
                    }}
                  />
                )}
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
                    icon={faCartShopping}
                  />
                ) : (
                  <IconSeconBtn
                    icon={faCartShopping}
                    text={'加入購物車'}
                    clickHandler={() => {
                      if (purchaseInfo.spec) {
                        sendToCart(purchaseInfo, auth.token);
                      } else {
                        setShowWarning(true);
                      }
                    }}
                  />
                )}
                {successAddToCard && (
                  <ModalWithoutBtn text="成功加入購物車!" img="success.svg" />
                )}
                {!auth.token ? (
                  <Modal
                    btnType="main"
                    btnText="立即購買"
                    title="貼心提醒"
                    content={
                      <ModoalReminder text="登入會員，才能購買商品喔~" />
                    }
                    mainBtnText="前往登入"
                    subBtnText="暫時不要"
                    confirmHandler={toSingIn}
                  />
                ) : (
                  <MainBtn
                    text={'立即購買'}
                    clickHandler={() => {
                      if (purchaseInfo.spec) {
                        sendToCart(purchaseInfo, auth.token);
                        router.push('/cart');
                      } else {
                        setShowWarning(true);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
      <BGMiddleDecoration />
      {/* 商品詳述區 */}
      <div className="container-outer">
        <div className={styles.bgc_lightBrown}>
          <div className="container-inner">
            <ul className={styles.detail_tabs}>
              <li
                className={tabActive === 'special' ? styles.active : ''}
                onClick={() => {
                  sccrollToHandler('special', productSpecial);
                }}
              >
                產品特色
              </li>
              <li
                className={tabActive === 'return' ? styles.active : ''}
                onClick={() => {
                  sccrollToHandler('return', productReturn);
                }}
              >
                退換貨須知
              </li>
              <li
                className={tabActive === 'comment' ? styles.active : ''}
                onClick={() => {
                  sccrollToHandler('comment', productComment);
                }}
              >
                商品評價
              </li>
            </ul>

            <ul
              className={styles.detail_text_box}
              id="special"
              ref={productSpecial}
            >
              <li>
                <h6>品牌:</h6>
                <p>{datatForProductMain.supplier_name}</p>
              </li>
              <li>
                <h6>產地:</h6>
                <p>{datatForProductMain.made_in_where}</p>
              </li>
              <li>
                <h6>商品詳述 :</h6>
                <p
                  dangerouslySetInnerHTML={{
                    __html: datatForProductMain.description,
                  }}
                ></p>
              </li>
            </ul>
            <ul
              className={styles.detail_return_box}
              id="return"
              ref={productReturn}
            >
              <li>
                <h6>退換規定:</h6>
                <p>
                  商品到貨享十天猶豫期之權益（注意！猶豫期非試用期）
                  ，辦理退貨商品必須是全新狀態且包裝完整，商品一經拆封，等同商品價值已受損，僅能以福利品出售，若需退換貨，我方須收取價值損失之費用(回復原狀、整新費)，請先確認商品正確、外觀可接受，再行開機/使用，以免影響您的權利，祝您購物順心
                </p>
              </li>
              <li>
                <h6>特別說明:</h6>
                <ol>
                  <li>
                    本公司收到您下單(要約)後，仍需確認交易條件正確、供貨商品有庫存或服務可提供。如有無法接受訂單之異常情形，或您下單後未能完成正常付款，應視為訂單(買賣契約)全部自始不成立或失效，本公司得於合理期間內通知說明拒絕接受訂單。請您重新依需求下單訂購。
                  </li>
                  <li>
                    本公司對於所販售具遞延性之商品或服務，消費者權益均受保障。如因合作廠商無法提供商品或服務，請與本公司聯繫辦理退貨或換成等值商品。
                  </li>
                </ol>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <PawWalking />
      <div className="container-outer">
        <div className="container-inner">
          <div
            className={styles.comment_section}
            id="comment"
            ref={productComment}
          >
            <h4 className={styles.comment_title}>商品評論</h4>
            <p>{`(共 ${dataForCommentQty[0].count} 則相關評論)`}</p>
            <div className={styles.comment_btns}>
              {dataForCommentQty.map((v) => {
                const { rating, count } = v;
                return (
                  <button
                    key={rating}
                    className={
                      commentFilter === rating
                        ? `${styles.comment_btn} ${styles.active_comment_btn}`
                        : styles.comment_btn
                    }
                    onClick={() => {
                      setCommentFilter(rating);
                      setCommentCurrent(0);
                      setShowCommentArrowLeft(false);
                    }}
                  >
                    {rating === 6 ? '全部評論' : `${rating}星 (${count})`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.shop_container_inner}>
          <div className={styles.comment_cards_box}>
            {showCommentArrowLeft && (
              <div className={styles.detail_left_arrow_box}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={styles.left_arrow}
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
                className={`${styles.detail_right_arrow_box} ${styles.comment_right_arrow_box}`}
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={styles.right_arrow}
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
            <div className={styles.comment_cards} style={commentStyle}>
              {dataForComment &&
              commentFiliterByRating(dataForComment, commentFilter).length <=
                0 ? (
                <NoCommentCard star={commentFilter} />
              ) : (
                commentFiliterByRating(dataForComment, commentFilter).map(
                  (v) => {
                    const {
                      product_comment_sid,
                      member_sid,
                      date,
                      rating,
                      content,
                      nickname,
                      profile,
                    } = v;
                    return (
                      <CommentCard
                        key={product_comment_sid}
                        member_sid={member_sid}
                        date={date}
                        rating={rating}
                        content={content}
                        name={nickname}
                        profile={profile}
                        clickHandler={() => {
                          toggleCommentCard(
                            dataForComment,
                            commentFilter,
                            product_comment_sid
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
          <ul className={styles.shop_recommend_pages}>
            {totalCommentPage <= 1 ? (
              <div className={styles.no_pages}></div>
            ) : (
              Array(totalCommentPage)
                .fill(0)
                .map((v, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        i === commentCurrent
                          ? `${styles.shop_sliders_pages_bttn} ${styles.shop_sliders_pages_active}`
                          : styles.shop_sliders_pages_bttn
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
        <div className={styles.show_full_comment_card}>
          <div
            className={styles.bgc_comment_card}
            onClick={toggleCommentCard}
          ></div>
          <div className={styles.comment_card_display}>
            {showFullCommentArrowLeft && (
              <div className={styles.detail_left_arrow_box}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={styles.left_arrow}
                  onClick={() => {
                    slidePreComment(showCommentCard);
                  }}
                />
              </div>
            )}
            {showFullCommentArrowRight && (
              <div
                className={`${styles.detail_right_arrow_box} ${styles.full_right_arrow_box}`}
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={styles.right_arrow}
                  onClick={() => {
                    slideNextComment(showCommentCard);
                  }}
                />
              </div>
            )}

            {showCommentCard.map((v) => {
              const {
                product_comment_sid,
                member_sid,
                date,
                rating,
                content,
                nickname,
                profile,
                display,
              } = v;
              return (
                display && (
                  <div className={styles.test} key={product_comment_sid}>
                    <CommentCard
                      member_sid={member_sid}
                      date={date}
                      rating={rating}
                      content={content}
                      name={nickname}
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
      <BGRecomandDecoration />
      {/* 商品推薦區 */}
      <div className="container-outer">
        <div className={styles.bgc_lightBrown}>
          <div className="container-inner">
            <section className="recommand-products">
              <div className={styles.reconmand_products_box}>
                <Image
                  src={CorpLogo}
                  className={styles.recomand_img}
                  alt="corpLogo"
                ></Image>
                <p className={styles.reconmand_products_title}>
                  毛孩可能會喜歡...
                </p>
              </div>
            </section>
          </div>
          <div className={styles.shop_container_inner}>
            <div className={styles.detail_left_arrow_box}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={styles.left_arrow}
                onClick={() => {
                  if (recommendCurrent === 0) {
                    setRecommendCurrent(totalRecommandPage - 1);
                  } else {
                    setRecommendCurrent(recommendCurrent - 1);
                  }
                }}
              />
            </div>
            <div className={styles.detail_right_arrow_box}>
              <FontAwesomeIcon
                icon={faChevronRight}
                className={styles.right_arrow}
                onClick={() => {
                  if (recommendCurrent === totalRecommandPage - 1) {
                    setRecommendCurrent(0);
                  } else {
                    setRecommendCurrent(recommendCurrent + 1);
                  }
                }}
              />
            </div>
            <div className={styles.recomand_products_cards_box}>
              <div className={styles.cards_display}>
                <div className={styles.recommand_cards} style={recommendStyle}>
                  {dataForRecomand.map((v) => {
                    const {
                      product_sid,
                      name,
                      img,
                      max_price,
                      min_price,
                      avg_rating,
                      like,
                    } = v;
                    return (
                      <div className={styles.product_card} key={product_sid}>
                        <ShopProductCard
                          product_sid={product_sid}
                          name={name}
                          img={img}
                          max_price={max_price}
                          min_price={min_price}
                          avg_rating={avg_rating}
                          like={like}
                          token={auth.token}
                          clickHandler={() => {
                            clickHeartHandler(
                              dataForRecomand,
                              product_sid,
                              'recomand'
                            );
                          }}
                          singinHandler={toSingIn}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="container-inner">
            <ul className={styles.shop_recommend_pages}>
              {Array(totalRecommandPage)
                .fill(0)
                .map((v, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        i === recommendCurrent
                          ? `${styles.shop_sliders_pages_bttn} ${styles.shop_sliders_pages_active}`
                          : styles.shop_sliders_pages_bttn
                      }
                      onClick={() => {
                        setRecommendCurrent(i);
                      }}
                    ></li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

import { Col, Row } from 'antd';
import HomeShopCard from '@/components/ui/home/homeShopCard';
import style from '@/styles/home.module.css';
import HomeLayout from '@/components/layout/home-layout';
import HashTag from '@/components/ui/hashtag/hashtag';
import MainBtn from '@/components/ui/buttons/MainBtn';
import HomeResCard from '@/components/ui/home/homeResCard';
import HomeEventPhoto from '@/components/ui/home/homeEventPhoto';
import HomeMainText from '@/components/ui/home/homeMainText';
import HomeMainBtns from '@/components/ui/home/homeMainBtns';

//import useLocalStorageJson from '@/hooks/useLocalStorageJson';

export default function Home() {
  const shopCardsData = [
    {
      img: '/home-images/hsprod1.avif',
      type: '服飾類',
      sale: '399',
      name: '搖!搖! 超級水果～酥脆貓零食-鮭魚',
      price: '599',
    },
    {
      img: '/home-images/hsprod1.avif',
      type: '服飾類',
      sale: '399',
      name: '搖!搖! 超級水果～酥脆貓零食-鮭魚',
      price: '599',
    },
    {
      img: '/home-images/hsprod1.avif',
      type: '服飾類',
      sale: '399',
      name: '搖!搖! 超級水果～酥脆貓零食-鮭魚',
      price: '599',
    },
    {
      img: '/home-images/hsprod1.avif',
      type: '服飾類',
      sale: '399',
      name: '搖!搖! 超級水果～酥脆貓零食-鮭魚',
      price: '599',
    },
    {
      img: '/home-images/hsprod1.avif',
      type: '服飾類',
      sale: '399',
      name: '搖!搖! 超級水果～酥脆貓零食-鮭魚',
      price: '599',
    },
    {
      img: '/home-images/hsprod1.avif',
      type: '服飾類',
      sale: '399',
      name: '搖!搖! 超級水果～酥脆貓零食-鮭魚',
      price: '599',
    },
  ];
  const hashShop = [
    '飼料',
    '罐頭',
    '零食',
    '玩具',
    '保健品',
    '服飾',
    '戶外用品',
  ];
  const hashActivity = [
    '狗狗健行趣',
    '寵物瑜伽',
    '喵星人的外星派對',
    '萌寵大對決',
  ];
  const hashForum = ['#討論毛孩大小事', '#各式主題看板', '#專屬毛孩日記'];
  const res1 = ['免費水', '有賣食物', '可自由奔跑'];
  return (
    <>
      <header>
        <main className="container-outer">
          <div className={style.headSection}>
            <div className={style.nextbg}></div>
            <img
              src="/home-images/mainBtnArea/h-road.svg"
              alt=""
              className={style.road}
            />
            <img
              src="/home-images/mainBtnArea/h-pinkRoad.svg"
              alt=""
              className={style.pinkroad}
            />
            <img
              src="/home-images/h-walkingCat.png"
              alt="cat"
              className={style.cat}
            />
            <img
              src="/home-images/h-header-photo.png"
              className={style.gwmphoto}
              alt="gwmphoto"
            />
            <div className={style.gwmtitle}>
              <HomeMainText />
            </div>
            <img
              src="/home-images/h-gwm.png"
              className={style.shoutgwm}
              alt="gowithme"
            />
            <img
              src="/home-images/mainBtnArea/h-smGwm.png"
              className={style.smGwm}
              alt="smShop"
            />

            <img
              src="/home-images/mainBtnArea/h-smShopBtn.svg"
              className={style.smShop}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/h-smEventBtn.svg"
              className={style.smEvent}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/h-smResBtn.svg"
              className={style.smRes}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/h-smforumBtn.svg"
              className={style.smForum}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/road1.svg"
              className={style.r1}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/road1.svg"
              className={style.r2}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/road1.svg"
              className={style.r3}
              alt="smShop"
            />
            <img
              src="/home-images/trafficLight.png"
              className={style.trafficlight1}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/h-dbTree.png"
              className={style.tree1}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/h-trees1.png"
              className={style.tree2}
              alt="smShop"
            />
            <img
              src="/home-images/mainBtnArea/h-tree3.png"
              className={style.tree3}
              alt="smShop"
            />
          </div>
        </main>
      </header>
      <Row className={style.mainBtnSection}>
        <HomeMainBtns />
      </Row>
      <Row className={style.productbg}>
        <Col span={2}></Col>
        <Col span={20}>
          <Row className={style.hSection}>
            <Col className={style.hlCards} xs={24} sm={24} md={14}>
              {shopCardsData.map((p, i) => {
                const { img, type, sale, name, price } = p;
                return (
                  <HomeShopCard
                    key={i}
                    img={img}
                    type={type}
                    sale={sale}
                    name={name}
                    price={price}
                  />
                );
              })}
            </Col>
            <Col className={style.hInfo} xs={24} sm={24} md={10}>
              <article>
                <p className={style.hstitle}>寵物商城</p>
                <p className={style.hetitle}>SHOP WITH ME</p>
                <p className={style.hsubtitle}>
                  毛孩的吃喝玩樂都在寵物商城！ 各大品牌狗貓飼料、用品通通有!
                  毛爸媽安心購買，更別錯過每日特殺活動喔~
                </p>
                <p className={style.hp}>
                  探索我們的寵物商城，為您的毛小孩尋找完美的驚喜！我們提供精選的寵物用品，從食品到玩具，應有盡有。{' '}
                </p>
                <p className={style.hp}>
                  我們致力於提供最高品質的產品，經過嚴格挑選和測試，讓您的寶貝獲得最好的呵護。購物輕鬆方便，讓您和您的寶貝享受無與倫比的購物體驗！
                </p>

                <div className={style.hhashes}>
                  {hashShop.map((h, i) => {
                    return <HashTag key={i} text={h} marginB="mb8" />;
                  })}
                </div>
                <div className={style.shopBtnArea}>
                  <MainBtn text="看更多商品" />
                  <img
                    src="/home-images/catJump.png"
                    className={style.catJump}
                    alt="gowithme"
                  />
                </div>
              </article>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={style.cutbottomLine1}>
        <img src="/home-images/h-wave1.jpg" alt="" className={style.wave} />
      </div>
      <Row className={style.activitybg}>
        <Col span={2}></Col>
        <Col span={20}>
          <Row className={style.hSection}>
            <img
              src="/home-images/h-Lflag.png"
              alt=""
              className={style.lflag}
            />
            <img
              src="/home-images/h-Rflag.png"
              alt=""
              className={style.rflag}
            />
            <Col className={style.hInfo} xs={24} sm={24} md={9}>
              <article>
                <p className={style.hstitle}>寵物活動</p>
                <p className={style.hetitle}>PLAY WITH ME</p>
                <p className={style.hsubtitle}>
                  這裡是專為您和您的毛小孩設計的狂歡天地。
                </p>
                <p className={style.hp}>
                  我們為您提供多元化的寵物活動，包括遠足、比賽、社交聚會和專題工作坊。與其他寵物愛好者一同分享快樂時光，建立友誼和彼此支持。無論您是狗狗、貓咪還是其他寵物的主人，這裡將是您與您的毛小孩共創美好回憶的地方。加入我們，一同體驗無盡的寵物
                  樂趣！
                </p>

                <div className={style.hhashes}>
                  {hashActivity.map((h, i) => {
                    return <HashTag key={i} text={h} marginB="mb8" />;
                  })}
                </div>
                <MainBtn text="看更多活動" />
              </article>
            </Col>
            <Col className={style.hrCards} xs={24} sm={24} md={15}>
              <HomeEventPhoto />
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={style.cutbottomLine2}>
        <img src="/home-images/h-wave2.jpg" alt="" className={style.wave} />
      </div>
      <Row className={style.restaurantbg}>
        <Col span={2}></Col>
        <Col span={20}>
          <Row className={style.hSection}>
            <Col className={style.hlCards} xs={24} sm={24} md={15}>
              <HomeResCard
                stickerText="毛小孩與親子共遊"
                src="/rest_image/sunshine.jpeg"
                resName="陽光莊園"
                cityArea="桃園市 ‧ 大園區"
                resDetail="是一間寵物與親子友善餐廳，地點就在桃園大園區。裡面有大片草地給小朋友..."
                reshash={res1}
              />
              <HomeResCard
                stickerText="毛小孩與親子共遊"
                src="/rest_image/sunshine.jpeg"
                resName="陽光莊園"
                cityArea="桃園市 ‧ 大園區"
                resDetail="是一間寵物與親子友善餐廳，地點就在桃園大園區。裡面有大片草地給小朋友..."
                reshash={res1}
              />
            </Col>
            <Col className={style.hInfo} sxs={24} sm={24} md={9}>
              <article>
                <p className={style.hstitle}>寵物餐廳</p>
                <p className={style.hetitle}>EAT WITH ME</p>
                <ul className={style.hsubtitle}>
                  <li>* 地圖上玲瑯滿目的餐廳讓你們眼花撩亂？</li>
                  <li>* 搜尋寵物友善餐廳，卻找到不相關的訊息?</li>
                  <li>* 找到寵物友善餐廳，卻有好多規則不清楚？</li>
                </ul>

                <p className={style.hp}>
                  狗with咪統整多家寵物友善餐廳並結合預約服務，包含豐富的餐食類別，透過多元的篩選功能（如：餐廳類別、攜帶規範、服務項目以及地區等），找到合適的用餐環境，讓飼主和毛寶貝能夠一起快樂用餐！{' '}
                </p>

                <MainBtn text="看更多餐廳" />
              </article>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className={style.cutbottomLine3}>
        <img src="/home-images/dog.svg" alt="" className={style.dog} />
        <img src="/home-images/h-wave3.jpg" alt="" className={style.wave} />
      </div>
      <Row className={style.forumbg}>
        <Col span={2}></Col>
        <Col span={20}>
          <Row className={style.hSection}>
            <Col className={style.hInfo} xs={24} sm={24} md={10}>
              <article>
                <p className={style.hstitle}>寵物論壇</p>
                <p className={style.hetitle}>CHAT WITH ME</p>
                <p className={style.hsubtitle}>
                  無論是醫療、安親、各式各樣吃喝玩樂，從毛孩出生到衰老，狗with咪開放性寵物論壇，陪你一起討論毛孩大小事。一起解決毛孩各種疑難雜症！
                </p>
                <p className={style.hp}>
                  我們提供一個熱情、友善的平台，讓您和其他寵物家長們共同分享探討飼養訓練、健康和生活等議題。我們鼓勵大家分享故事、提出問題、回答疑惑，一同建立一個充滿愛和關懷的寵物社群。
                </p>
                <p className={style.hp}>
                  加入我們，一起追尋寵物與人類的無限快樂！
                </p>

                <div className={style.hhashes}>
                  {hashForum.map((h, i) => {
                    return <HashTag key={i} text={h} marginB="mb8" />;
                  })}
                </div>
                <MainBtn text="前往論壇" />
              </article>
            </Col>
            <Col className={style.hrCards} xs={24} sm={24} md={14}></Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

Home.getLayout = (page) => <HomeLayout>{page}</HomeLayout>;

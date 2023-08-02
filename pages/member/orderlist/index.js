import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import PageTag from '@/components/ui/pageTag/PageTag';
import OrderSearchBar from '@/components/ui/buttons/OrderSearchBar';
// import SearchBar1 from '@/components/ui/buttons/SearchBar1';
import OrderCard from '@/components/ui/cards/OrderCard';
import MemberCenterLayout from '@/components/layout/member-center-layout';
import AuthContext from '@/context/AuthContext';
import Loading from '@/components/ui/loading/loading';

export default function OrderList() {
  const [pageTag, setPageTag] = useState('shop');
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  const [first, setFirst] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [shop, setShop] = useState(false);
  const [activity, setActivity] = useState(false);
  const router = useRouter();

  const searchBarClickHandler = (keyword) => {
    // console.log(keyword);
    if (shop) {
      console.log('s', keyword);
      router.push(
        `?${new URLSearchParams({
          keywordS: keyword,
        }).toString()}`
      );
    }
    if (activity) {
      router.push(
        `?${new URLSearchParams({
          keywordA: keyword,
        }).toString()}`
      );
    }
  };

  useEffect(() => {
    setFirst(true);
  }, []);

  useEffect(() => {
    if (!auth.id && first) {
      const from = router.asPath;
      router.push(`/member/sign-in?from=${from}`);
    } else if (auth.id) {
      setPageLoading(false);
      if (auth.token) {
        const keywordS = router.query.keywordS;
        const keywordA = router.query.keywordA;
        console.log('router.query', router.query);
        if (keywordS) {
          fetch(
            `${process.env.API_SERVER}/member-api/order?${new URLSearchParams({
              keywordS: keywordS,
            }).toString()}`,
            {
              headers: {
                Authorization: 'Bearer ' + auth.token,
              },
            }
          )
            .then((r) => r.json())
            .then((data) => {
              console.log(data);
              const firstData = data.filter((data) => data.rel_type === 'shop');
              setData(firstData);
              setAllData(data);
              setLoading(false);
            });
        } else if (keywordA) {
          fetch(
            `${process.env.API_SERVER}/member-api/order?${new URLSearchParams({
              keywordA: keywordA,
            }).toString()}`,
            {
              headers: {
                Authorization: 'Bearer ' + auth.token,
              },
            }
          )
            .then((r) => r.json())
            .then((data) => {
              console.log(data);
              const firstData = data.filter(
                (data) => data.rel_type === 'activity'
              );
              setData(firstData);
              setAllData(data);
              setLoading(false);
            });
        } else {
          fetch(`${process.env.API_SERVER}/member-api/order`, {
            headers: {
              Authorization: 'Bearer ' + auth.token,
            },
          })
            .then((r) => r.json())
            .then((data) => {
              console.log(data);
              const firstData = data.filter((data) => data.rel_type === 'shop');
              setData(firstData);
              setAllData(data);
              setLoading(false);
            });
        }
      } else {
        console.log('User is not logged in. Cannot fetch');
      }
    }
  }, [first, router.query]);

  const shopOrder = () => {
    const newData = allData.filter((data) => data.rel_type === 'shop');
    console.log(newData);
    setData(newData);
    setShop(true);
    setActivity(false);
  };

  const actOrder = () => {
    const newData = allData.filter((data) => data.rel_type === 'activity');
    console.log(newData);
    setData(newData);
    setActivity(true);
    setShop(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading component you prefer...
  }

  if (pageLoading) {
    return <Loading />;
  } else if (!pageLoading) {
    return (
      <>
        <div className="orderPageTag">
          <div className="orderTag">
            <PageTag
              title="shop"
              text="商品訂單"
              pageTag={pageTag}
              onClick={() => {
                setPageTag('shop');
                shopOrder();
              }}
            />
            <PageTag
              title="activity"
              text="活動訂單"
              pageTag={pageTag}
              onClick={() => {
                setPageTag('activity');
                actOrder();
              }}
            />
          </div>
          <div className="orderSearch">
            <OrderSearchBar
              placeholder="訂單編號、商品名稱"
              btn_text="搜尋"
              inputText={keyword}
              changeHandler={(e) => {
                setKeyword(e.target.value);
              }}
              clickHandler={() => {
                searchBarClickHandler(keyword);
              }}
            />
          </div>
        </div>
        <div className="content">
          {data.map((data, i) => {
            return (
              <OrderCard
                key={i}
                orderSid={data.order_sid}
                status={data.post_status}
                itemTitle={data.rel_name}
                itemText={data.rel_seqName}
                itemQty={data.product_qty}
                adultQty={data.adult_qty}
                childQty={data.child_qty}
                subTotal={data.orderRelS.toLocaleString()}
                img={data.img}
                actImg={data.activity_pic}
                length={data.order_product}
                type={data.rel_type}
                actAddress={data.actAddress}
              />
            );
          })}
        </div>
      </>
    );
  }
}
OrderList.getLayout = MemberCenterLayout;

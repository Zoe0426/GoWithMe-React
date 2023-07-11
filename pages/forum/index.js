import React from 'react'
import Style from '@/styles/index.module.css'
import PostCard from '@/components/ui/PostCard/postCard'
import PostBanner from '@/components/ui/postBanner/postBanner'
import BoardNav from '@/components/ui/BoardNav/boardNav'
import PostNav from '@/components/ui/postNav/postNav'
import PostPhotoCard from '@/components/ui/postPhotoCard/postPhotoCard'
import PostBottom from '@/components/ui/postBottom/postBottom'
export default function Post() {
  return (
    <>
      <div className="container-outer">
        <div className={Style.body}>
          <PostBanner/>
          <BoardNav/>
          <div className="container-inner">
          <PostNav postNav='熱門文章' optionCh='熱門文章' op1='最新文章'/>
              <PostCard profile='./forum_img/victor-grabarczyk-N04FIfHhv_k-unsplash.jpg' boardName='寵物醫療版' author='莉莉安' postTitle='狗狗奇怪飲食癖' postContent='我最近真的很困擾，我的小狗總是會亂吃自己的大便，請告訴我該如何處理這個小狗飲食問題。非常感謝！' img='./forum_img/chris-smith-vCPF8e_-JPg-unsplash.jpg' likes='100' comments='50' favorites='10'/>
              <PostCard profile='./forum_img/kabo-p6yH8VmGqxo-unsplash.jpg' boardName='友善景點版' author='艾摩斯' postTitle='探索寵物友善的自然樂園
              ' postContent='在寵物友善的自然樂園中，與毛孩共度天倫之樂，放鬆心情，一同探索自然美景。快來享受難忘的時刻吧！' img='./forum_img/狗活動.jpeg' likes='300' comments='100' favorites='30'/>
              <PostCard profile='./forum_img/victor-grabarczyk-N04FIfHhv_k-unsplash.jpg' boardName='寵物醫療版' author='莉莉安' postTitle='狗狗奇怪飲食癖' postContent='我最近真的很困擾，我的小狗總是會亂吃自己的大便，請告訴我該如何處理這個小狗飲食問題。非常感謝！' img='./forum_img/chris-smith-vCPF8e_-JPg-unsplash.jpg' likes='100' comments='50' favorites='10'/>
              <PostCard profile='./forum_img/kabo-p6yH8VmGqxo-unsplash.jpg' boardName='友善景點版' author='艾摩斯' postTitle='探索寵物友善的自然樂園
              ' postContent='在寵物友善的自然樂園中，與毛孩共度天倫之樂，放鬆心情，一同探索自然美景。快來享受難忘的時刻吧！' img='./forum_img/狗活動.jpeg' likes='300' comments='100' favorites='30'/>
              <PostCard profile='./forum_img/victor-grabarczyk-N04FIfHhv_k-unsplash.jpg' boardName='寵物醫療版' author='莉莉安' postTitle='狗狗奇怪飲食癖' postContent='我最近真的很困擾，我的小狗總是會亂吃自己的大便，請告訴我該如何處理這個小狗飲食問題。非常感謝！' img='./forum_img/chris-smith-vCPF8e_-JPg-unsplash.jpg' likes='100' comments='50' favorites='10'/>
              <PostCard profile='./forum_img/kabo-p6yH8VmGqxo-unsplash.jpg' boardName='友善景點版' author='艾摩斯' postTitle='探索寵物友善的自然樂園
              ' postContent='在寵物友善的自然樂園中，與毛孩共度天倫之樂，放鬆心情，一同探索自然美景。快來享受難忘的時刻吧！' img='./forum_img/狗活動.jpeg' likes='300' comments='100' favorites='30'/>
              <PostCard profile='./forum_img/victor-grabarczyk-N04FIfHhv_k-unsplash.jpg' boardName='寵物醫療版' author='莉莉安' postTitle='狗狗奇怪飲食癖' postContent='我最近真的很困擾，我的小狗總是會亂吃自己的大便，請告訴我該如何處理這個小狗飲食問題。非常感謝！' img='./forum_img/chris-smith-vCPF8e_-JPg-unsplash.jpg' likes='100' comments='50' favorites='10'/>
              <PostCard profile='./forum_img/kabo-p6yH8VmGqxo-unsplash.jpg' boardName='友善景點版' author='艾摩斯' postTitle='探索寵物友善的自然樂園
              ' postContent='在寵物友善的自然樂園中，與毛孩共度天倫之樂，放鬆心情，一同探索自然美景。快來享受難忘的時刻吧！' img='./forum_img/狗活動.jpeg' likes='300' comments='100' favorites='30'/>
          </div>
          <PostBottom/>
        </div>
        </div>
    </>
  )
}

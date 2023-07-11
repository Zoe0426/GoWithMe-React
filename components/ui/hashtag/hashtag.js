import React from 'react'
import Styles from './HashTag.module.css'

export default function HashTag({ text = '' }) {
  return (
    <>
      <p className={Styles.hash_tag}>{text}</p>
    </>
  )
}

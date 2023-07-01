import React from 'react'
import Styles from './RateStar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

export default function RateStar({ score = '', text = '' }) {
  return (
    <>
      <div className={Styles.rating}>
        <FontAwesomeIcon icon={faStar} className={Styles.icon} />
        <p className={Styles.rate_score}>{score}</p>
        <p className={Styles.rate_text}>{text}</p>
      </div>
    </>
  )
}

import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styles from './styles.module.css'
import { useClipboard } from 'use-clipboard-copy'

export const MemeGenerated = () => {
    const history = useHistory()
    const location = useLocation()
    const url = new URLSearchParams(location.search).get('url')
    const clipboard = useClipboard()

    const [copied, setCopied] = useState(false)
    const copyLink = () => {
        clipboard.copy(url)
        setCopied(true)
    }

    return (
        <div className={styles.container}>
            <button onClick={() => history.push('/')} className={styles.home}>
                Make more memes
            </button>
            {url && <img src={url} alt="Ready meme" />} 
            <button className={styles.copy} onClick={copyLink}>
                {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
        </div>
    )
}

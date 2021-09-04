import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './styles.module.css'
require('dotenv').config()

const username = process.env.username
const password = process.env.password

export const Meme = () => {
    const [meme, setMeme] = useState([])
    const [memeIndex, setMemeIndex] = useState(0)
    const [captions, setCaptions] = useState([])

    const history = useHistory()

    const updateCaption = (e, index) => {
        const text = e.target.value || ''
        setCaptions(
            captions.map((c, i) => {
                if(index === i) {
                    return text
                } else {
                    return c
                }
            })
        )
    } 

    const generateMeme = () => {
        const currentMeme = meme[memeIndex]
        const formData = new FormData()

        formData.append('username',username)
        formData.append('password',password)
        formData.append('template_id',currentMeme.id)
        captions.forEach((c, index) => formData.append(`boxes[${index}][text]`, c))

        fetch('https://api.imgflip.com/caption_image', {
            method: "POST",
            body: formData
        }).then(res => {
            res.json().then(res => {
                history.push(`/generated?url=${res.data.url}`)
            })
        })
    }

    const shuffleMemes = (array) => {
        for (let i=array.length-1; i>0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }

    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes').then(res => res.json().then(res => {
            const _memes = res.data.memes
            shuffleMemes(_memes)
            setMeme(_memes)
        }))
    },[])

    useEffect(() => {
        if(meme.length){
            setCaptions(Array(meme[memeIndex].box_count).fill(''))
        }
    },[memeIndex, meme])

    return (
        meme.length ? <div className={styles.container}>
            <button className={styles.generate} onClick={generateMeme}>Generate</button>
            <button className={styles.skip} onClick={() => {
                setMemeIndex(memeIndex+1)
            }}>Skip</button>
            {
                captions.map((c, index) => (
                    <input key={index} onChange={(e) => updateCaption(e, index)} />
                ))
            }
            <img src={meme[memeIndex].url} alt="Meme" />
        </div> : <></>
    )
}

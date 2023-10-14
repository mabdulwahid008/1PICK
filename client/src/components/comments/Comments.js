import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../../state/Provider'
import { Link } from 'react-router-dom'
import Blockies from 'react-blockies';
import { minifyAddress } from '../../utills'

function Comments({ event_id }) {
    const { address, setAddress, refresh } = useContext(Context)
    const [comments, setComments] = useState(null)
    const [myBet, setMyBet] = useState(0)
    const [content, setConetnt] = useState('')

    const fetchComments = async() => {
        const response = await fetch(`/comment/${event_id}`, {
            method:'GET',
            headers:{
                'Content-Type':'Application/json'
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setComments(res)
        }
        else
            toast.error(res.message)
    }

    const mybet = async () => {
        if(!address)
            return;
        const response = await fetch(`/event/my-bet/${event_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if (response.status === 200) {
            if(parseInt(res) <= 0){
                document.getElementById('bet-ammount').value = ''
                document.getElementById('bet-ammount').focus = false
            }
            setMyBet(res);
        }
        else if (response.status === 401) {
            setAddress(null)
        }
        else
            toast.error(res.message)

    }

    const postComment = async (e) => {
        e.preventDefault()
        const response = await fetch(`/comment`, {
            method:'POST',
            headers:{
                'Content-Type':'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                content, e_id: event_id
            })
        })
        const res = await response.json()
        if(response.status === 200){
            fetchComments()
        }
        else
            toast.error(res.message)
    }


    useEffect(()=>{
        // mybet()
        fetchComments()
    }, [refresh])
    return (
        <div className='timeline details-box'>
            {address && <form className='comment-field' onSubmit={postComment}>
                <input type='comment' placeholder='Write something...' required onChange={(e) => setConetnt(e.target.value)} />
                <button><img src={require('../../assets/done.png')} /></button>
            </form>}
            <div className='comments'>
            {!comments || comments?.length === 0 && <p>Be the first to comment on it.</p>}
            {comments?.length > 0 && myBet > 0 && <>
                {comments.map((comment, index) =>{
                    <div className='comment' key={index}>
                            <Link to={`/user/${comment.address}`}>
                                <Blockies seed={comment.address} size={4} scale={3} color="#FF385C" bgColor="#00B66D" />
                                {minifyAddress(comment.address)}</Link>
                            <p>{comment.content}</p>
                            <div>
                                <p>{comment.created_on.substr(0, 10)}</p>
                                <div>
                                    <img src={require('../../assets/add_comment.png')} alt='add_comment' />
                                    <p>{comment.replied}</p>
                                </div>
                            </div>
                            <hr />
                            {/* <div className='sub-comment'>
                                <a href={`//etherscan.io/address/${event?.creator}`} target='_blank' rel='noopener noreferrer'>
                                    <Blockies seed={event.creator} size={4} scale={3} color="#FF385C" bgColor="#00B66D" />
                                    {minifyAddress(event?.creator)}</a>
                                <p>Yes</p>
                            </div> */}
                        </div>

                })}
                </>}
            </div>
        </div>
    )
}

export default Comments

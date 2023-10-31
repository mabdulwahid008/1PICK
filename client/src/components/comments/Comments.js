import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from '../../state/Provider'
import { Link } from 'react-router-dom'
import Blockies from 'react-blockies';
import { minifyAddress } from '../../utills'
import { BsArrowReturnRight } from 'react-icons/bs';

function Comments({ event_id }) {
    const { address, setAddress, refresh } = useContext(Context)
    const [comments, setComments] = useState(null)
    const [loading, setLoading] = useState(false)
    const [myBet, setMyBet] = useState(0)
    const [content, setConetnt] = useState('')
    const [subContent, setSubConetnt] = useState('')
    const [p_comment_id, setP_comment_id] = useState(0)
    const [subComments, setSubComments] = useState(-1)

    const fetchComments = async () => {
        const response = await fetch(`/comment/${event_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        })
        const res = await response.json()
        if (response.status === 200) {
            setComments(res)
        }
        else
            toast.error(res.message)
    }

    const mybet = async () => {
        if (!address)
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
            if (parseInt(res) <= 0) {
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

        if(!address || myBet === 0){
            toast.error("Only people who have participated can leave comments.")
        }

        setLoading(true)
        const response = await fetch(`/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                content, e_id: event_id
            })
        })
        const res = await response.json()
        if (response.status === 200) {
            document.getElementById('comment').value = ''
            setConetnt('')
            fetchComments()
        }
        else if (response.status === 401) {
            setAddress(null)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    const postSubSomment = async (e) => {
        e.preventDefault()
        if(!address || myBet === 0){
            toast.error("Only people who have participated can leave comments.")
        }

        setLoading(true)
        const response = await fetch(`/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                content: subContent, e_id: event_id, p_comment_id
            })
        })
        const res = await response.json()
        if (response.status === 200) {
            document.getElementById('sub-comment').value = ''
            setSubConetnt('')
            fetchComments()
        }
        else if (response.status === 401) {
            setAddress(null)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }


    useEffect(() => {
        mybet()
        fetchComments()
    }, [refresh, address])
    return (
        <div className='timeline details-box'>
            <form className='comment-field' onSubmit={postComment}>
                <input type='comment' value={content} id='comment' placeholder='Write something...' required onChange={(e) => { document.getElementById('comment').value = e.target.value.slice(0, 300); if (e.target.value.length <= 300) setConetnt(e.target.value) }} />
                <button disabled={loading}><img src={require('../../assets/done.png')} /></button>
            </form>
            <div className='comments'>
                {!comments || comments?.length === 0 && <p>Be the first to comment on it.</p>}
                {comments?.length > 0 && <>
                    {comments.map((comment, index) => {
                        return <div className='comment' key={index}>
                            <Link to={`/user/${comment.address}`}>
                                <Blockies seed={comment.address} size={3} scale={3} color="#FF385C" bgColor="#00B66D" />
                                {minifyAddress(comment.address)}</Link>
                            <p>{comment.content}</p>
                            <div>
                                <p></p>
                                {/* <p>{comment.created_on.substr(0, 10)}</p> */}
                                <div>
                                    <button className='reply-btn' onClick={() => {
                                                            setSubComments(prevSubComments => {
                                                                if (prevSubComments === 0 || prevSubComments !== index + 1) {
                                                                    return index + 1;
                                                                } else {
                                                                    return 0;
                                                                }
                                                            }); 
                                                            setP_comment_id(comment._id);  
                                                        }} > Reply </button>
                                    <p>{comment.replied}</p>
                                </div>
                            </div>
                            {subComments === index+1 &&
                            <form className='comment-field sub-comment-filed' onSubmit={postSubSomment}>
                                <input type='comment' value={subContent} id='sub-comment' placeholder='Reply' required onChange={(e) => { document.getElementById('sub-comment').value = e.target.value.slice(0, 300); if (e.target.value.length <= 300) setSubConetnt(e.target.value) }} />
                                <button disabled={loading}><img src={require('../../assets/done.png')} /></button>
                            </form>}
                            <hr />
                            <div className='sub-comment'>
                                    {comment.replied_comments?.map((replied, index) => {
                                        console.log(replied);
                                        return <div className='replied-comments' key={index}>
                                            <Link to={`/user/${replied.address}`}>
                                                <BsArrowReturnRight />
                                                <Blockies seed={replied.address} size={3} scale={3} color="#FF385C" bgColor="#00B66D" />
                                                {minifyAddress(replied.address)}</Link>
                                            <p>{replied.content}</p>
                                            {/* <p>{replied.created_on.substr(0,10)}</p> */}
                                            <span></span>
                                        </div>
                                    })}
                                </div>
                        </div>

                    })}
                </>}
            </div>
        </div>
    )
}

export default Comments

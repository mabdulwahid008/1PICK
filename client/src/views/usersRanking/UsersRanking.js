import React, { useEffect, useState } from 'react'
import './UsersRanking.css'
import Blockies from 'react-blockies';
import { Link } from 'react-router-dom';
import { mobEventFilter } from '../../utills/selectStyles';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader'
import { minifyAddress } from '../../utills';


function UsersRanking() {

    const [users, setUsers] = useState(null)

    const options1 = [
        {value: 0, label: 'Score'},
        {value: 1, label: 'Join'},
        {value: 2, label: 'Create'},
    ] 
    const options2 = [
        {value: 0, label: 'High to Low'},
        {value: 1, label: 'Low to High'},
    ] 

    const fetchUsers = async() => {
        const response = await fetch('/user/rankings',{
            method: 'GET',
            headers:{
                'Content-Type' : 'Application/json'
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setUsers(res)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        fetchUsers()
    }, [])

    return (
        <>

            <h2 className='predict-everything'>Users Ranking</h2>
            <div className='mobile-filter-section ranking-filter'>
                <div>
                    <ReactSelect isSearchable={false} value={{value: 0, label: 'Score'}} options={options1} styles={mobEventFilter} onChange={(option) => (option)} />
                </div>
                <div>
                    <ReactSelect isSearchable={false} value={{value: 0, label: 'High to Low'}} options={options2} styles={mobEventFilter} onChange={(option) => (option)} />
                </div>
            </div>
            {!users && <Loader/> }
            {users?.length === 0 && <p>No Users.</p>}
           {users?.length > 0 && <div className='user-ranking'>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Address</th>
                            <th>Join</th>
                            <th>Create</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            return <tr key={index}>
                                        <td>{index+1}</td>
                                        <td><Link to={`/user/${user.address}`}><Blockies seed={user.address} size={5} scale={3} color="#FF385C" bgColor="#00B66D" /> {minifyAddress(user.address)} </Link></td>
                                        <td>{user.joinevents}</td>
                                        <td>{user.createdEvents}</td>
                                    </tr>
                        })}
                    </tbody>
                </table>
            </div>}
        </>
    )
}

export default UsersRanking

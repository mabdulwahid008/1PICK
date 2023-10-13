import React from 'react'
import './UsersRanking.css'
import Blockies from 'react-blockies';
import { Link } from 'react-router-dom';
import { mobEventFilter } from '../../utills/selectStyles';
import ReactSelect from 'react-select';


function UsersRanking() {

    const options1 = [
        {value: 0, label: 'Score'},
        {value: 1, label: 'Join'},
        {value: 2, label: 'Create'},
    ] 
    const options2 = [
        {value: 0, label: 'High to Low'},
        {value: 1, label: 'Low to High'},
    ] 

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
            <div className='user-ranking'>
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
                        <tr>
                            <td>1</td>
                            <td><Link to={`/user/${'add'}`}><Blockies seed={"mekmfkmv"} size={5} scale={3} color="#FF385C" bgColor="#00B66D" /> kgsmbkm </Link></td>
                            <td>5</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td><Link to={`/user/${'add'}`}><Blockies seed={"mekmfkmv"} size={5} scale={3} color="#FF385C" bgColor="#00B66D" /> kgsmbkm </Link></td>
                            <td>5</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default UsersRanking

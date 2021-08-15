import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [bookings,setBookings]=useState([]);
    const [loggedUser, setLoggedUser] =useContext(UserContext)
    useEffect(()=>{
        fetch('http://localhost:5000/booking?email='+loggedUser.email,{
            method: "GET",
            headers:{ 'Content-type': 'application/json',
            authorization : `Bearer ${sessionStorage.getItem('token')}`
        }
        })
        .then(res=>res.json())
        .then(data=>setBookings(data))

    },[])
    return (
        <div>
            <h1>Booking length is {bookings.length}</h1>
            {
                bookings.map(book=><li> {book.name} {(new Date(book.checkIn).toDateString('dd/mm/yyyy'))}  {(new Date(book.checkOut).toDateString('dd/mm/yyyy'))}</li>)
            }
            
        </div>
    );
};

export default Bookings;
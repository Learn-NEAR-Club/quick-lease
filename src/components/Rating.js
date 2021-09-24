import React from 'react';
import star from "../assets/star.svg";
import fstar from "../assets/fstar.png";

function Rating (props){
    const handleClick = (current_rating) => {
        console.log(props.isClickable);
        console.log(current_rating);
        if(props.isClickable){
            //make service call
            props.setShowLoader(true);
            props.rateItem(props.item, current_rating, function(status){
                if(status){
                    console.log("Rated Successfull");
                    props.setShowNotification(true);
                    props.setShowLoader(false);
        
                    setTimeout(() => {
                        props.setShowNotification(false);
                    }, 5000);
                } else {
                    console.log("Failed");
                    props.setShowLoader(false);
                    props.setTransactionStatus(false);
                    props.setMessage("Process failed. Please try again");
                    props.setShowNotification(true);
        
                    setTimeout(() => {
                        props.setShowNotification(false);
                    }, 5000);
                }
            });
        }
    };
    return (
        <div className="rating-star-continer">
            <span className="heading"><b>Rating: </b></span>
            <span onClick={() => handleClick(1)}><img src={props.item.rating >= 0.5 ? fstar : star} /></span>
            <span onClick={() => handleClick(2)}><img src={props.item.rating >= 1.5 ? fstar : star} /></span>
            <span onClick={() => handleClick(3)}><img src={props.item.rating >= 2.5 ? fstar : star} /></span>
            <span onClick={() => handleClick(4)}><img src={props.item.rating >= 3.5 ? fstar : star} /></span>
            <span onClick={() => handleClick(5)}><img src={props.item.rating >= 4.5 ? fstar : star} /></span>
            <p>{props.item.rating} <small>average based on </small>{props.numReviews} <small> reviews. </small></p>
        </div>
    );
}

export default Rating;
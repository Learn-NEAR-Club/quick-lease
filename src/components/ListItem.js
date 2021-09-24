import React, {useState} from 'react';
import Loader from './Loader';
import Notification from './Notification';
import Rating from './Rating';

function ListItem(props){
    const [showLoader, setShowLoader] = useState(false);
    const [showNotification, setShowNotification] = React.useState(false);
    const [transactionStatus, setTransactionStatus] = React.useState(true);
    const [message, setMessage] = React.useState("Process successfully");

    const getItemTitle = () => {
        if(props.page == "listing"){
            if(props.item.owner == window.accountId)
                return "Cannot lease your own item";
            return "Click to lease this item";
        } else if(props.page == "mylisting"){
            if(!props.item.is_available)
                return "Cannot remove an item which is currently leased by someone";
            return "Click to remove this listing";
        }
    }

    const getButtonText = () => {
        console.log(props.page);
        if(props.page == "listing"){
            return "Lease Now";
        } else if (props.page == "mylisting"){
            return "Remove Listing";
        } else {
            // home
            return "Return Now";
        }
    }

    const callback = (status) => {
        if(status){
            console.log("Successfull");
            setShowNotification(true);
            setShowLoader(false);

            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        } else {
            console.log("Failed");
            setShowLoader(false);
            setTransactionStatus(false);
            setMessage("Process failed. Please try again");
            setShowNotification(true);

            setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        }
    };

    const handleSubmit = () => {
        setShowLoader(true);

        if(props.page == "listing"){
            props.onLeaseClick(props.item, callback);
        } else if (props.page == "mylisting"){
            props.onRemoveClick(props.item, callback);
        } else { // home
            props.onReturnClick(props.item, callback);
        }
    }

    return (
        <>
            <div className="col-md-4">
                { showLoader ? <Loader /> : 
                    <div className="card mb-4 box-shadow">
                        <img className="card-img-top img-border list-image" src={ props.item.img } alt="Card image cap" />
                        <p className="card-text font-weight-bold">{ props.item.name }</p>
                        <p className="card-text">{ props.item.desc }</p>
                        <div className="card-body">
                            <h3>{ props.page == "home" ? "Rent Due" : "Rent" }: </h3>
                            {props.page == "home" 
                                ?   <h1 className="card-title pricing-card-title">{ props.item.rent_due } NEAR </h1>
                                :   <h1 className="card-title pricing-card-title">{ props.item.rent }<small> NEAR / { props.item.freq }</small></h1>}
                            <ul className="list-unstyled mt-1 mb-1">
                                { props.page == "home" && <li><b>Rent: </b>{ props.item.rent } NEAR / day</li>}
                                <li><b>Deposit: </b>{ props.item.deposit } NEAR</li>
                                <li><b>Owner: </b>{ props.item.owner } </li>
                                <li>
                                    <Rating isClickable={props.page == "home" ? true : false }
                                        numReviews={props.item.numReviews}
                                        rateItem={props.onRatingClick}
                                        item={props.item}
                                        setShowLoader={setShowLoader}
                                        setShowNotification={setShowNotification}
                                        setTransactionStatus={setTransactionStatus}
                                        setMessage={setMessage}/>
                                </li>
                                { props.item.is_available && props.page == "mylisting" && <li><b>State: </b>Available</li>}
                                { !props.item.is_available && <li><b>Leased by: </b>{ props.item.leaser }</li>}
                            </ul>
                        </div>
                        
                        <button type="button" 
                                className="btn btn-lg btn-outline-primary" 
                                disabled={ props.page == "listing" && props.item.owner == window.accountId 
                                            || props.page == "mylisting" && !props.item.is_available } 
                                onClick={ handleSubmit }
                                title={ getItemTitle() }
                        >{ getButtonText() }</button>
                    </div>
                }
            </div>
            { showNotification && 
                        <Notification message = { message }
                                    success = { transactionStatus } /> }
        </>
        
    );
}

export default ListItem;
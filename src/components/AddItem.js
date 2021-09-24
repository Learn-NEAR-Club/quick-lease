import React, { useState } from "react";
import nearIcon from "../assets/logo-black.svg";
import Notification from "./Notification";
import Loader from "./Loader";
import { utils } from 'near-api-js';

function AddItem(props){
    const [showLoader, setShowLoader] = useState(false);
    const [showNotification, setShowNotification] = React.useState(false);
    const [transactionStatus, setTransactionStatus] = React.useState(true);
    const [message, setMessage] = React.useState("Item added successfully");

    const handleSubmit = (evt) => {
        setShowLoader(true);
        evt.preventDefault();
        var item = {
            name: document.getElementsByName("name")[0].value,
            desc: document.getElementsByName("desc")[0].value,
            rent: document.getElementsByName("rent")[0].value,
            deposit: document.getElementsByName("deposit")[0].value,
            imageURL: document.getElementsByName("imageURL")[0].value
        };
        
        item.rent = utils.format.parseNearAmount(item.rent);
        item.deposit = utils.format.parseNearAmount(item.deposit);
        console.log(item.rent);

        props.addItem(item, function(status){
            if(status){
                setShowLoader(false);
                setShowNotification(true);
      
                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            } else {
                console.log("Add failed. Try again!!");
                setShowLoader(false);
                setTransactionStatus(false);
                setMessage("Adding item failed. Please try again");
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                }, 5000);
            }
        });
    }

    return (
        <>
            { showLoader ? <Loader /> : <AddItemForm handleSubmit={handleSubmit}/> }
            { showNotification && 
                    <Notification message = { message }
                                success = { transactionStatus } /> }
        </>
    );
}

const AddItemForm = (props) => {
    return (
        <>
            <div className="page-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                <h1 className="display-4">Quick Lease</h1>
                <p className="lead">{ props.pageTitle }</p>
            </div>
            <form className="add-item-form" onSubmit={props.handleSubmit}>
                <div className="form-row">                
                    <div className="form-group col-md-4">
                            <label htmlFor="inputName">Name</label>
                            <input type="text" name="name" className="form-control" id="itemName" placeholder="Item Name" />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputRent">Rent(in NEAR)</label>
                        <div className="input-icon">
                            <input type="text" name="rent" className="form-control" placeholder="0.0" />
                            <img src={ nearIcon }></img>
                        </div>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputDeposit">Deposit(in NEAR)</label>
                        <div className="input-icon">
                            <input type="text" name="deposit" className="form-control" placeholder="0.0" />
                            <img src={ nearIcon }></img>
                        </div>
                    </div>
                </div>

                <div className="form-row">                
                    <div className="form-group col-md-8">
                            <label htmlFor="inputEmail4">Image URL</label>
                            <input type="text" name="imageURL" className="form-control" id="inputOwner" placeholder="Image URL" />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputEmail4">Owner</label>
                        <input type="text" name="owner" value={window.accountId} className="form-control-plaintext owner-id" id="inputOwner" placeholder="Owner" readOnly/>
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1">Description</label>
                    <textarea name="desc" className="form-control" id="itemDesc" rows="3"></textarea>
                </div>
                <button type="submit" id="submitButton" value="Submit" className="btn btn-outline-primary">Submit</button>
            </form>
        </>

    );
}

export default AddItem;
import React from 'react';
import ListItem from "./ListItem";

function Listing(props) {
    return (
        <>
            <div className="page-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                <h1 className="display-4">Quick Lease</h1>
                <p>Hi, {window.accountId}</p>
                <p className="lead">{ props.pageTitle }</p>
            </div>

            <div className="container">
                <div className="card-deck mb-3 row text-center">
                    {props.items.map((listItem) =>
                        <ListItem key = {listItem.id } 
                            item={listItem}
                            page={props.page}
                            onLeaseClick={(i,j) => props.handleLeaseClick(i,j)}
                            onReturnClick={(i,j) => props.handleReturnClick(i,j)}
                            onRatingClick={(i,j,k) => props.handleRatingClick(i,j,k)}
                            onRemoveClick={(i,j) => props.handleRemoveClick(i)} 
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default Listing;
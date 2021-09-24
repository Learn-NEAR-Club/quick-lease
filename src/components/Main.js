import '../styles/App.css';
import "../vendor/bootstrap.min.css";
import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import Listing from './Listing';
import AddItem from './AddItem';
import { logout } from '../utils';
import leaseService from '../services/leaseService';

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayItems: []
    };
  }

  componentDidMount() {
    console.log("component did mount is called");
    if (window.walletConnection.isSignedIn()) {
      this.updateStateWithLatestItems();
    }
  }

  componentDidUpdate() {
    console.log("component did update is called");
  }

  updateStateWithLatestItems(){
    leaseService.getAllItems((items) => {
      if(items.length > 0){
        console.log(items.length + " items found");
        this.setState({displayItems: items});
      }
    });
  }

  getAllItems(){
    var items = this.state.displayItems.filter(item => item.is_available);
    return items;
  }

  getUserListings(){
    return this.state.displayItems.filter(item => item.owner == window.accountId );
  };

  getUserLeasedItems(){
    return this.state.displayItems.filter(item => item.leaser == window.accountId );
  }

  leaseItem(item){
    var self = this;
    console.log("Lease item clicked for: " + item.id);
    leaseService.leaseItem(item, function(status){
        if(status){
            console.log("item leased successfully");
            self.updateStateWithLatestItems();
            callback(true);
        } else {          
            callback(false);
        }
    });
  }

  addRating(item, rating, callback) {
    var self = this;
    console.log("Add rating clicked from: " + item.id);
    leaseService.rateItem(item.id, rating, function(status){
      if(status){
          console.log("item rated successfully");
          self.updateStateWithLatestItems();
          callback(true);
      } else {          
          callback(false);
      }
    });
  };

  returnItem(item, callback){
    var self = this;
    console.log("Return item clicked for: " + item.id);
    leaseService.returnItem(item, function(status){
        if(status){
            console.log("item returned successfully");
            self.updateStateWithLatestItems();
            callback(true);
        } else {          
            callback(false);
        }
    });
  }

  removeItem(item, callback){
    var self = this;
    console.log("Remove item clicked for: " + item.id);
    leaseService.deleteItem(item.id, function(status){
        if(status){
            console.log("item removed successfully");
            self.updateStateWithLatestItems();
            callback(true);
        } else {          
            callback(false);
        }
    });
  }

  addItem(item, callback){
    var self = this;
    console.log("adding new Item");
    leaseService.listItem(item, function(itemId){
        if(itemId != 0){
            console.log("item added successfully: " + itemId);
            self.updateStateWithLatestItems();
            callback(true);
        } else {          
            callback(false);
        }
    });
  }

  render(){
    return (
        <Router basename={process.env.PUBLIC_URL}>
          <div className="App">

            <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
              <h5 className="my-0 mr-md-auto font-weight-normal">Quick Lease</h5>
              <nav className="my-2 my-md-0 mr-md-3">
                  <NavLink to="/" name="home" className="p-2 text-dark" exact activeClassName="selected-menu">Home</NavLink>
                  <NavLink to="/listings" name="listings" className="p-2 text-dark" exact activeClassName="selected-menu">All Listings</NavLink>
                  <NavLink to="/myListings" name="myListings" className="p-2 text-dark" exact activeClassName="selected-menu">My Listings</NavLink>
                  <NavLink to="/addItem" name="addItem" className="p-2 text-dark" exact activeClassName="selected-menu">Add Item</NavLink>
              </nav>
              <a className="btn btn-outline-primary" href="#" onClick={ logout }>Sign Out</a>
            </div>

            <Switch>
              <Route path="/listings">
                <Listing items= { this.getAllItems() }
                    handleLeaseClick={(i,j) => this.leaseItem(i,j)}
                    pageTitle={"Lease your favorite items from here"}
                    page={"listing"}/>
              </Route>
              <Route path="/myListings">
                <Listing items={this.getUserListings()}
                        handleRemoveClick={(i,j) => this.removeItem(i,j)}
                        pageTitle={"List of all the items you have listed"}
                        page={"mylisting"}/>
              </Route>
              <Route path="/addItem">
                <AddItem addItem={(i,j) => this.addItem(i,j)}
                        pageTitle={"Add the items you want to lease out here"} />
              </Route>
              <Route path="/">
                <Listing items= { this.getUserLeasedItems() }
                      handleReturnClick={(i,j) => this.returnItem(i,j)}
                      handleRatingClick={(i,j,k) => this.addRating(i,j,k)}
                      pageTitle={"Following items are currently being leased by you"}
                      page={"home"}/>
              </Route>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default Main;

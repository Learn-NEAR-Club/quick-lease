import { utils } from 'near-api-js';
const DEFAULT_GAS = 300000000000000;
import placeholder from "../assets/placeholder.jpeg";

function getAllItems(callback){
    window.contract.get_all_items()
        .then(items => {
            console.log(items);
            var mappedItems = [];
            items.forEach(item => {
                var mappedItem = {
                    id: item.id, 
                    name: item.name, 
                    desc: item.desc, 
                    rent: utils.format.formatNearAmount(item.rent), 
                    freq: "day", 
                    owner: item.owner, 
                    leaser: item.current_leaser, 
                    start_date: parseInt(item.start_date) ? parseInt(item.start_date) : 0,
                    deposit: utils.format.formatNearAmount(item.deposit), 
                    is_available: item.is_available, 
                    rating: item.rating, 
                    numReviews: item.numReviews, 
                    img: item.img ? item.img : placeholder,
                    past_leasers: item.past_leasers,
                    rent_due: calculateRent(item)
                };
                mappedItems.push(mappedItem);
            });
            return callback(mappedItems); 
        })
        .catch(ex => {
            console.log("getting items failed");
            throw ex;
        });
}

function calculateRent(item){
    if(parseInt(item.start_date)){
        const duration = calculate_duration(parseInt(item.start_date), new Date().getTime());
        const rent = utils.format.formatNearAmount(item.rent) * duration;

        return rent.toString();
    }
    return 0;
}
  
function calculate_duration(start_date, end_date){
    if(start_date){
        const diffTime = end_date - start_date;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        console.log(diffTime + " milliseconds");
        console.log(diffDays + " days");
    
        return diffDays;
    }
    return 0;
}

function returnItem(item, callback){
    const rentInYocto = utils.format.parseNearAmount(item.rent_due);
    window.contract.return_item({ item_id: item.id, end_date: (new Date().getTime()).toString() }, DEFAULT_GAS, rentInYocto)
        .then(result => {
            result ? console.log("success") : console.log("failed");
            callback(result);
        })
        .catch(ex => {
            console.log("Return item failed");
            throw ex;
        });
}

function rateItem(itemId, rating, callback){
    window.contract.rate_item({ item_id: itemId, rating: rating })
        .then(result => {
            result ? console.log("success") : console.log("failed");
            callback(result);
        })
        .catch(ex => {
            console.log("Item add failed");
            throw ex;
        });
}

function leaseItem(item, callback){
    const depositInYocto = utils.format.parseNearAmount(item.deposit);
    window.contract.lease_item({ item_id: item.id, start_date: (new Date().getTime()).toString() }, DEFAULT_GAS, depositInYocto)
        .then(result => {
            result ? console.log("success") : console.log("failed");
            callback(result);
        })
        .catch(ex => {
            console.log("Item add failed");
            throw ex;
        });
}

function deleteItem(itemId, callback){
    window.contract.delete_item({ item_id: itemId })
        .then(itemId => {
            console.log("Item listed successfully: " + itemId);
            return callback(itemId);
        })
        .catch(ex => {
            console.log("Item add failed");
            callback(0);
            throw ex;
        });
}

function listItem(item, callback){
    window.contract.list_item({ name: item.name, desc: item.desc, rent: item.rent, img: item.imageURL, deposit: item.deposit, freq: 0 })
        .then(itemId => {
            console.log("Item listed successfully: " + itemId);
            return callback(itemId);
        })
        .catch(ex => {
            console.log("Item add failed");
            callback(0);
            throw ex;
        });
}

export default {
    getAllItems: getAllItems, 
    listItem: listItem,
    returnItem: returnItem,
    rateItem: rateItem,
    leaseItem: leaseItem,
    deleteItem: deleteItem
}
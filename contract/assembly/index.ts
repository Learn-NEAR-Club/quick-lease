import { context, logging, u128, RNG, PersistentMap, PersistentVector, ContractPromiseBatch } from 'near-sdk-as'
// {id: 2, name: "test2", desc: "test", rent: "11", freq: "day", owner: "cryptovaibhav", leaser: "", duration: "", start_date: "", end_date: "", deposit: "100", is_available: true, rating: 2.3, numReviews: 15, img: placeholder },

const enum FreqEnum {
  Day,
  Week,
  Month
}

const nearInYocto = u128.from(1000000000000000000000000);

@nearBindgen
class LeaseItem {
  id: u32;
  name: string;
  desc: string;
  rent: u128;
  freq: FreqEnum;
  owner: string;
  current_leaser: string;
  deposit: u128;
  is_available: bool;
  rating: f64;
  numReviews: u32;
  img: string;
  start_date: u64;
  past_leasers: Array<string>;

  constructor(){
    const rng = new RNG<u32>(1, u32.MAX_VALUE);
    this.id = rng.next();
    this.freq = FreqEnum.Day;
    this.current_leaser = "";
    this.is_available = true;
    this.rating = 0;
    this.numReviews = 0;
    this.past_leasers = [];
    this.start_date = 0;
  }
}

const itemsMap = new PersistentMap<u32, LeaseItem>("a");
const itemsVector = new PersistentVector<u32>("b");

export function get_all_items(): Array<LeaseItem> {
  const itemsArray = new Array<LeaseItem>();

  for (let index = 0; index < itemsVector.length; index++) {
    const item = itemsMap.getSome(itemsVector[index]);
    itemsArray.push(item);
  }

  return itemsArray;
}

export function list_item(name: string, desc: string, rent: u128, freq: FreqEnum, img: string, deposit: u128): u32 {
  const item = new LeaseItem();
  item.name = name;
  item.desc = desc;
  item.rent = rent
  item.freq = freq;
  item.img = img;
  item.deposit = deposit;
  item.owner = context.sender;

  itemsMap.set(item.id, item);
  itemsVector.push(item.id);

  logging.log("item listed successfully: " + item.id.toString());
  return item.id;
}

export function rate_item(item_id: u32, rating: u16): bool {
  const item = itemsMap.getSome(item_id);
  assert(item.current_leaser == context.sender, "Only the current leaser can rate the item");
  logging.log("check");

  const newRating = (item.rating * item.numReviews + rating) / (item.numReviews + 1);
  item.rating = round(newRating, 1);
  item.numReviews = item.numReviews + 1;

  itemsMap.set(item.id, item);
  return true;
}

export function delete_item(item_id: u32): bool{
  assert(itemsMap.contains(item_id), "Item not found in listed items");
  
  var indexOfItem = -1;
  for (let index = 0; index < itemsVector.length; index++) {
    if(itemsVector[index] == item_id){
      indexOfItem = index;
    }
  }
  itemsVector.swap_remove(indexOfItem);
  itemsMap.delete(item_id);

  return true;
}

export function lease_item(item_id: u32, start_date: u64): bool {
  const item = itemsMap.getSome(item_id);
  assert(item.is_available, "Tried to lease a leased item");
  assert(item.deposit == context.attachedDeposit, "Security deposit should equal to " + item.deposit.toString());
  
  item.is_available = false;
  item.current_leaser = context.sender;
  item.start_date = start_date;

  itemsMap.set(item_id, item);
  return true;
}

export function return_item(item_id: u32, end_date: u64): bool {
  const item = itemsMap.getSome(item_id);
  assert(item.is_available == false, "Cannot return an item which is already available");
  
  //calculate rent
  //const day_diff = calculate_duration(item.start_date, end_date);
  // const rent_payable = calculate_rent(item.rent, day_diff);

  // assert(rent_payable == context.attachedDeposit, "Rent which needs to be paid: " + rent_payable.toString());
  logging.log("sending rent to owner account"); 
  make_payment(item.owner, context.attachedDeposit);
  
  // now revert the deposit amount 
  logging.log("reverting security deposit payment");
  make_payment(context.sender, item.deposit);

  item.past_leasers.push(item.current_leaser);
  item.is_available = true;
  item.current_leaser = "";
  item.start_date = 0;
  
  itemsMap.set(item.id, item);
  return true;
}

function make_payment(receiver: string, amount: u128): void{
  logging.log("transferring tokens: " + amount.toString());
  const to_receiver = ContractPromiseBatch.create(receiver);
  to_receiver.transfer(amount);
}

function round(value: f64, precision: u16): f64 {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

// function calculate_rent(rent: u128, duration: u64): u128{
//   const finalRent = u128.mul(rent, u128.from(duration));
//   return finalRent;
// }

// function calculate_duration(start_date: u64, end_date: u64): u64{
//   const diffTime = end_date - start_date;
//   const diffDays: u64 = u64(Math.ceil(diffTime / (1000 * 60 * 60 * 24))); 
//   console.log(diffTime.toString() + " milliseconds");
//   console.log(diffDays.toString() + " days");

//   return diffDays;
// }

export function dummy(min_dep: u128): void{
  // const deposit = u128.div(context.attachedDeposit, nearInYocto);
  const deposit = context.attachedDeposit;
  logging.log("received deposit of: " + deposit.toString());
  logging.log("received min dep of: " + min_dep.toString());

  logging.log(deposit > min_dep);
  assert(deposit > min_dep, "Minimum deposit is 2 NEAR");
  logging.log("test message");
}
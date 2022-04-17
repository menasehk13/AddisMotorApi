function getdrivers() {
  return `
  SELECT
  id,
  firstname,
  lastname,
  photo,
  email,
  gender,
  phonenumber,
  status,
  lat,
  lng,
  activeid,
  service.servicetype 
  FROM
   driver
   JOIN service on driver.serviceid = service.serviceid
   WHERE driver.activeid = 1
   ;
  `;
}

function getdriver(id) {
  return `
  SELECT
    *
FROM
	driver

WHERE
	driver.id = ${id};
  `
}

function add_driver() {
  return `  
          INSERT INTO
          driver
          SET ?
        `;
}
function updatecurrentlocation(data) {
  return `
     UPDATE
        driver
      SET
       lat=${Number(data.lat)},
       lng=${Number(data.lng)}
      WHERE
        id=${data.id} 
`;
}

function updateDriverSocket(data) {
  return `
    UPDATE 
    driver 
    SET
    socketid = "${data.socketid}"
    WHERE 
    id =${data.id};  
  `
}

// on testing we will see the result of our need
// function notifydriver(data){
//     return`

//     `
// }
// total distance and price

function updateStatus(data){
  return `
  UPDATE
	driver
SET
	driver.status = '${data.status}'
WHERE
	driver.id =${data.id} ;
  `
}

function totalPrice(id){
return `
SELECT
	SUM(paymnet.price) AS totalPrice,
	SUM(paymnet.distance) AS totalDistance,
	COUNT(paymentid) AS totalTrip,
  currency
FROM
	paymnet
JOIN  driver on paymnet.driverid = driver.id
WHERE
	paymnet.driverid = ${id} AND DATE(paymnet.date) = CURDATE();
`
}
function currencyView(id){
  `SELECT 
    currency
  FROM 
    driver
  WHERE id=${id}  
  `
}
function history(driverid) {
  return `
  SELECT 
  booking.arrivinglocation,
  booking.startinglocation,
  paymnet.price,
  paymnet.distance,
  paymnet.date,
  price.bookingfee,
  price.tax * paymnet.price as tax, 
  booking.bookingid,
  paymnet.price - paymnet.price * price.tax as earning 
  
  From 
   history
   JOIN user on history.userid = user.id
   JOIN booking on history.bookingid = booking.bookingid
   JOIN paymnet on history.paymentid = paymnet.paymentid 
   JOIN price on price.priceid = paymnet.priceid
   WHERE history.driverid = ${driverid}
   ORDER by paymnet.date DESC
   ;
 `
}

function displaystatus(driverid) {
  return `
    SELECT
       Sum(distance) as Km,
       Sum(price) as Price ,
       count(driverid) as Job
    From
      payment
    Where
      driverid = ${driverid}
    GroupBy date      
    `;
}

export function getOnlineDrivers() {
  return `
     SELECT *   
     FROM 
        driver,active
     Where
     activeid=1 AND status = 'approved'   
    `;
}
export function journey(){
  return `
  INSERT INTO journey
  SET ?
  `
}
function payment(){
  return `
  INSERT INTO paymnet 
SET 
  ?
 ;
  `
}
function viewRating(id){
  return `
  SELECT AVG(ratingandreview.rating) rating
FROM 
ratingandreview 
WHERE
ratingandreview.driverid = ${id};
  `
}

function carInfo(id){
  return `
  SELECT 
cardetail.productionyear,
cardetail.model,
cardetail.licenseplate,
cardetail.color,
service.servicetype,
driverdocument.registration,
driverdocument.Inscurance,
driverdocument.criminalclearance,
FROM 
driver 
Left outer JOIN cardetail on cardetail.id = driver.cardetailid
Left outer JOIN service on service.serviceid = driver.serviceid
Left outer JOIN driverdocument on driverdocument.driverid = driver.id
WHERE 
    driver.id = ${id};
  `
}



function addHistory(){
return `
INSERT INTO history 
SET 
?
`
}
export function booking() {
  return `
    INSERT INTO
        booking
        SET
         ?
        ;
`;
}
function priceId(id){
  return `
  SELECT
	carservicerelation.priceid AS priceId,
	price.price AS price,
 price.bookingfee,
 price.initialprice
FROM
	carservicerelation
	JOIN price ON carservicerelation.priceid = price.priceid
WHERE
	serviceid = ${id};
  `
}
function driverStatus(id){
  return `
  SELECT
	status
FROM
	driver
WHERE
	id = ${id};
  `
}
function checkUser(phonenumber){
  return `
  SELECT
	*
FROM
	driver
WHERE
	phonenumber = "${phonenumber}";
  `
}
function updatePassword(password,id){
  return `
  UPDATE 
driver 
SET
password = "${password}"
WHERE id = ${id};
  `
}
// update notification id 
function updateNotification(id,notificationid){
  return `
UPDATE
driver
SET
driver.notificationid = "${notificationid}"
WHERE
driver.id = ${id};
  `
}

export default {
  getdriver,
  getdrivers,
  add_driver,
  updatecurrentlocation,
  displaystatus,
  history,
  getOnlineDrivers,
  updateDriverSocket,
  updateStatus,
  totalPrice,
  journey,
  priceId,
  payment,
  booking,
  addHistory,
  carInfo,
  viewRating,
  driverStatus,
  currencyView,
  checkUser,
  updatePassword,
  updateNotification
};

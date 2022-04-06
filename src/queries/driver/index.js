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
   Driver
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
	Driver

WHERE
	driver.id = ${id};
  `
}

function add_driver() {
  return `  
          INSERT INTO
          Driver
          SET ?
        `;
}
function updatecurrentlocation(data) {
  return `
     UPDATE
        Driver
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
   History
   
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
      Payment
    Where
      driverid = ${driverid}
    GroupBy date      
    `;
}

export function getOnlineDrivers() {
  return `
     SELECT *   
     FROM 
        Driver,Active
     Where
     activeid=1 AND status = 'approved'   
    `;
}
export function journey(data){
  return `
  INSERT INTO journey
  SET 
  lat = ${data.lat},
  lng =  ${data.lng},
  userid = ${data.userid},
  driverid = ${data.driverid},
  bookingid = ${data.bookingid};
  `
}
function payment(data){
  return `
  INSERT INTO paymnet 
SET 
price = ${data.price},
distance = ${data.distance},
userid = ${data.userid},
priceid = ${data.priceid},
driverid = ${data.driverid},
journeyid =${data.journeyid} ;
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
driverdocument.Inscurance
FROM 
driver 
Left outer JOIN cardetail on cardetail.id = driver.cardetailid
Left outer JOIN service on service.serviceid = driver.serviceid
Left outer JOIN driverdocument on driverdocument.driverid = driver.id
WHERE 
    driver.id = ${id};
  `
}



function addHistory(data){
return `
INSERT INTO history 
SET 
history.driverid = ${data.driverid},
history.paymentid = ${data.paymentid},
history.bookingid = ${data.bookingid},
history.userid = ${data.userid};
`
}
export function booking(data) {
  return `
    INSERT INTO
        Booking
        SET
        arrivinglocation='${data.arriving}',
        startinglocation='${data.starting}',
        userid=${data.userid},
        driverid=${data.driverid},
        status='driver on the way'
`;
}
function priceId(id){
  return `
  SELECT
	carservicerelation.priceid AS priceId,
	price.price AS price,
    price.bookingfee
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
  currencyView
};

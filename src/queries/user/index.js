export function adduser() {
  return `
     INSERT INTO
     user
     SET ?
     `;
}

export function edituser(data) {
  return `
    UPDATE
        user
    SET
        firstname='${data.firstname}',
        lastname='${data.lastname}',
        email='${data.email}'
    WHERE
       id=${data.id};
    `
}

export function getusers() {
  return `
        SELECT *
            FROM
        user 
    `;
}

export function getuser(id) {
  return `
        SELECT *
            FROM
        user 
            WHERE id = '${id}'
    `;
}

export function getuserbyphone(number) {
  return `
        SELECT *
            FROM
        user 
            WHERE phonenumber = '${number}'
    `;
}
export function getService(){
  return `
  SELECT 
    service.servicetype,
    service.servicepicture,
    price.bookingfee,
    price.distance,
    price.price

    FROM carservicerelation
    JOIN service on service.serviceid =  carservicerelation.serviceid
    JOIn price on price.priceid =  carservicerelation.priceid
    order by carservicerelation.relationid DESC
    ;
  `
}

export function displayDriverLocation(){
  return `
  SELECT lat,lng,id,socketid
  from driver 
  WHERE driver.activeid = 1 AND driver.status = "approved" ;
  `
}

export function viewDrivers(data){
  return `
  SELECT 
  driver.lat ,
  driver.lng,
  driver.serviceid,
  (6371 * acos(cos(radians(${data.lat})) * cos(radians(driver.lat)) * cos(radians(driver.lng) - radians(${data.lng})) + sin(radians(${data.lat})) * sin(radians(driver.lat)))) AS distance
 FROM driver
 
 HAVING distance < 30;
  `
}

export function driverInfo(id){
  return `
  SELECT
    driver.firstname,
    driver.lastname,
    driver.phonenumber,
    driver.photo,
    cardetail.color,
    cardetail.productionyear,
    cardetail.licenseplate,
    cardetail.model
FROM
    driver
    JOIN cardetail on driver.cardetailid = cardetail.id
WHERE
    driver.id = ${id};
  `
}

export function requestDriver(data) {
  return `
  SELECT
	driver.id,
	firstname,
	lastname,
	photo,
	phonenumber,
	cardetail.model,
	cardetail.productionyear,
	cardetail.licenseplate,
	cardetail.color,
	lat,
	lng,
	socketid,
	servicetype,
	(6371 * acos(cos(radians(${data.pickLat})) * cos(radians(driver.lat)) * cos(radians(driver.lng) - radians(${data.pickLng})) + sin(radians(${data.pickLat})) * sin(radians(driver.lat)))) AS distance
FROM
	driver
	JOIN cardetail ON driver.cardetailid = cardetail.id
	JOIN service ON driver.serviceid = service.serviceid
WHERE
	activeid = 1
	AND driver.status = 'approved'
	AND currency > 0
	AND driver.serviceid = 4
HAVING
	Distance < 10
ORDER BY
	distance
LIMIT 1;
   
    `;
}


export function history(userid) {
  return `
  SELECT 
  booking.arrivinglocation,
  booking.startinglocation,
  paymnet.price,
  paymnet.distance,
  paymnet.date,
  paymnet.driverid,
  service.servicetype
  From 
   history
   JOIN driver on history.driverid = driver.id
   JOIN booking on history.bookingid = booking.bookingid
   JOIN paymnet on history.paymentid = paymnet.paymentid
   JOIN service on driver.serviceid = service.serviceid 
   WHERE history.userid = 75
   ORDER by paymnet.date DESC  ;   
`;
}
export function totaldistancePrice(serviceid,distance){
  return `
  SELECT 
    price.price + ${distance} + price.bookingfee as totalprice
      from 
    carservicerelation

    JOIN price on carservicerelation.priceid = price.priceid

WHERE carservicerelation.serviceid=${serviceid};
  `
}
export function updateSocket(id,socketid){
  return `
  UPDATE user
set 
socketid = "${socketid}"
WHERE user.id  = ${id};
  `
}

export function journeystarted(data) {
  return `
    INSERT INTO
        Booking
        SET
        status='started';
    INSERT INTO
        journey
    SET 
        lattitude='${data.lattitude}',
        longittude='${data.longittude}',
        bookingid='${data.bookingid}',
        userid='${data.userid}',
        driverid='${data.driverid}'
    `;
}

export function journeylocation(data) {
  return `
UPDATE 
    journey
SET
lattitude='${data.lattitude}',
longittude='${data.longittude}',
`;
}
export function updateFirsttime(id){
  return `
  UPDATE
	user
SET
	firsttime = 0
WHERE
	id = ${id};
  `
}
export function payment(data) {
  return `
    INSERT INTO
        payment
    SET 
        price='${data.price}',
        distance='${data.distance}',
        userid='${data.userid}',
        priceid='${data.priceid}',
        driverid='${data.driverid}',
        journeyid='${data.journeyid}';
    INSERT INTO 
            rattingandreview
    SET
        driverid='${data.userid}',
        userid='${data.driverid}',
        review='${data.review},
        rating='${data.rating}'

    `;
}

function ratingReview(){
  return `
  INSERT INTO 
      ratingandreview 
  SET ? ;
  `
}

export function driverfound(data) {
  return `
INSERT INTO  
   booking
 SET
   startinglocation='${data.origin}',
   arrivinglocation='${data.destination},
   driverid=${data.id},
   userid=${data.id},
   status='Driver on the Way'
   ;
`;
}
function viewRating(id){
  return`
  SELECT AVG(ratingandreview.rating) rating
FROM 
ratingandreview 
WHERE
ratingandreview.driverid = ${id};
  `
}
function cancelReason(data){
  return `
  UPDATE 
  booking 
  SET 
  reason = ${data.reasonid}
  where booking.bookingid = ${data.bookingid};
  `
}
function Reasons(){
  return `
  SELECT
	*
FROM
	reason;`
}
export default {
  adduser,
  edituser,
  getusers,
  getuser,
  getuserbyphone,
  requestDriver,
  driverInfo,
  history,
  journeylocation,
  journeystarted,
  payment,
  driverfound,
  getService,
  displayDriverLocation,
  viewDrivers,
  ratingReview,
  viewRating,
  cancelReason,
  Reasons,
  updateSocket,
  updateFirsttime,
  totaldistancePrice
};

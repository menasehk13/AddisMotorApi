export function adduser() {
  return `
     INSERT INTO
     User
     SET ?
     `;
}

export function edituser(data) {
  return `
    UPDATE
        User
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
        User 
    `;
}

export function getuser(id) {
  return `
        SELECT *
            FROM
        User 
            WHERE id = '${id}'
    `;
}

export function getuserbyphone(number) {
  return `
        SELECT *
            FROM
        User 
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
    JOIn price on price.priceid =  carservicerelation.priceid;
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
  SELECT driver.id,
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
    (6371 * acos(cos(radians(${data.pickLat})) * cos(radians(driver.lat)) * cos(radians(driver.lng) - radians(${data.pickLng})) + sin(radians(${data.pickLat})) * sin(radians(driver.lat)))) AS distance 
From 
  Driver
JOIN cardetail on driver.cardetailid = cardetail.id     
     WHERE activeid = 1 AND driver.status = 'approved'
    Having Distance < 10
    ORDER BY distance
    Limit 5;       
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
  
   History
   
   JOIN driver on history.driverid = driver.id
   JOIN booking on history.bookingid = booking.bookingid
   JOIN paymnet on history.paymentid = paymnet.paymentid
   JOIN service on driver.serviceid = service.serviceid 
   WHERE history.userid = ${userid} 
   ORDER by paymnet.date DESC   
`;
}



export function journeystarted(data) {
  return `
    INSERT INTO
        Booking
        SET
        status='started';
    INSERT INTO
        Journey
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
    Journey
SET
lattitude='${data.lattitude}',
longittude='${data.longittude}',
`;
}
export function payment(data) {
  return `
    INSERT INTO
        Payment
    SET 
        price='${data.price}',
        distance='${data.distance}',
        userid='${data.userid}',
        priceid='${data.priceid}',
        driverid='${data.driverid}',
        journeyid='${data.journeyid}';
    INSERT INTO 
            RattingAndReview
    SET
        driverid='${data.driverid}',
        userid='${data.userid}',
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
   Booking
 SET
   startinglocation='${data.origin}',
   arrivinglocation='${data.destination},
   driverid=${data.driverid},
   userid=${data.userid},
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
  Reasons
};

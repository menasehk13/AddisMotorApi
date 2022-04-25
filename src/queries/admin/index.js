export function getadmins() {
  return `
    SELECT * FROM admin 
  `;
}

export function getadmin(email) {
  return `
    SELECT * FROM admin WHERE email=${email}
  `;
}

export function login(data) {
  return `
  SELECT 
    *
  FROM
   admin
  Where
   email = '${data.email}',
   password = '${data.password}'
  `;
}

export function addadmin() {
  return `
     INSERT INTO
        admin
      SET ?
    ;
    `;
}
export function dashboard(limit) {
  return `
    SELECT *
    FROM
         driver
         LIMIT ${limit}
         `;
  // orderby ${data} ASC
  // SELECT
  //   COUNT(driverid) as drivers,
  //   COUNT (userid) as riders,
  // FROM
  //   Journey
  // WHERE
  //    status = 'started'  ;
}

// dulpacate data
// export function dashboardicons(data) {
//   return `
//  SELECT
//   COUNT(driverid) as drivers,
//   COUNT (userid) as riders,
//  FROM
//    Journey;
// `;
// }

export function drivers() {
  return `
     SELECT 
       *
     FROM
        driver;
    `;
}

export function users(){
  return `
  SELECT 
    *
  FROM 
    user;
  `
}

export function activeDriver(status){
  return `
   select 
    photo,
    CONCAT(firstname," ", lastname) as name,
    phonenumber,
    status,
    lat,
    lng
    FROM 
     driver
     where activeid = 1 and status = "${status}";
     ;
  `
}


export function driverdetail(id) {
  return `
  SELECT 
  firstname,
  lastname,
  email,
  phonenumber,
  photo,
  status,
  gender,
  cardetail.productionyear,
  cardetail.model,
  cardetail.licenseplate,
  cardetail.color,
  service.servicetype,
  AVG(ratingandreview.rating) as rating
  from driver 
  left OUTER JOIN cardetail on cardetail.id= driver.cardetailid
  left OUTER JOIN service on service.serviceid = driver.serviceid
   left OUTER JOIN ratingandreview on ratingandreview.driverid = driver.id
  WHERE driver.id = ${id};
    `;
}

function ratingReview(id){
  return `
  SELECT
	ratingandreview.rating,
	ratingandreview.review,
	ratingandreview.date,
	user.firstname
FROM
	ratingandreview
	LEFT OUTER JOIN user ON ratingandreview.userid = user.id
WHERE
	ratingandreview.driverid = ${id}; 
  `
}

export function driverdetailorder(id) {
  return `
  SELECT 
history.historyid as id,  
CONCAT(user.firstname," ",user.lastname) as name,
booking.startinglocation,
booking.arrivinglocation,
history.date,
paymnet.price 
from 
history 
LEFT OUTER JOIN user on user.id = history.userid
LEFT OUTER JOIN booking on  booking.bookingid = history.bookingid
LEFT OUTER JOIN paymnet on paymnet.paymentid = history.paymentid
WHERE history.driverid= ${id};
    `;
}
function driverorderDetail(id){
  return `
  SELECT 
  booking.bookingid as id,
  booking.arrivinglocation,
  booking.startinglocation,
  paymnet.price,
  paymnet.distance,
  paymnet.date,
  price.bookingfee,
  paymnet.price * price.tax as tax,
  paymnet.price - paymnet.price * price.tax as earning 
  
  From 
   history
   
   JOIN user on history.userid = user.id
   JOIN booking on history.bookingid = booking.bookingid
   JOIN paymnet on history.paymentid = paymnet.paymentid 
   JOIN price on price.priceid = paymnet.priceid
   WHERE history.historyid = ${id}
   ORDER by paymnet.date ASC
   ;
  `
}
export function driverdetailreview(data) {
  return `
      SELECT
        CONCAT(User.firstname," ",User.lastname) as name,
        rating,
        review
      FROM 
        rating,user
      where 
        driverid=${data.id}

      OrderBy date ASC;
    `;
}

export function driverdetaildocument(data) {
  return `
    SELECT 
      userdocuments,
      cardocuments,
    FROM
      driver
    WHERE
      driverid=${data.id}  
    `;
}

export function dispatcher(data) {
  return `
     SELECT *
     FROM
        driver
     WHERE
       status='avaliable' AND activeid=1;
    `;
}
// sending driver a dispatch information with phone
export function sendDriver(data) {
  return `

    `;
}
export function accounting() {
  return `
  SELECT
	MONTHNAME(driver.addeddate) AS Month,
	count(driver.id) as  drivers
FROM
	driver
GROUP BY Month
ORDER BY FIELD(MONTH, 'January', 'February', 'March','April','May','June','July','Augest','September','October' 'December');
    `;
}
export function accountingdrivers() {
  return `
    SELECT *
    FROM
      driver
    OrderBy addeddate;  
    `;
}
export function accountingriders() {
  return `
    SELECT *
    FROM
     user
    OrderBy date; 
    `;
}
// testing must be done and need modification
export function accountingservice() {
  return `
     SELECT *
      FROM 
     service,price,searchradious

      
    `;
}

// need some modification
export function accountingaddservice(data) {
  return `
     INSERT INTO 
      service
     SET 
    `;
}
export function marketingcoupon() {
  return `
    SELECT 
     *
    FROM 
     marketing
    `;
}

export function addmarketing() {
  return `
  INSERT INTO 
  marketing 
  SET
  ?
  ;
  
    `;
}
export function complaints() {
  return `
  SELECT 
  complaints.status,
  CONCAT(driver.firstname,' ', driver.lastname) as drivername,
  CONCAT(user.firstname,' ',user.lastname) as Complaint,
  complaints.content,
  complaints.date
 FROM 
  complaints
  JOIN user on user.id = complaints.userid
  JOIN driver on driver.id = complaints.driverid
 Order By complaints.date ASC ;
    `;
}
export function addDriverSales(data){
  return `
  INSERT INTO 
cardetail 
  SET
cardetail.productionyear="${data.year}",
cardetail.model="${data.model}",
cardetail.color="${data.color}",
cardetail.licenseplate="${data.licenceplate}"
;
`
}
function addNewUserCar(driverid,id){
return `
update 
driver
SET
driver.cardetailid=${id}
WHERE driver.id = ${driverid};

UPDATE 
driver 
SET
driver.status = "pending"
WHERE driver.id = ${driverid};

`
}

function addDriverDocumentSales(id,data) {
  return `INSERT INTO 
  driverdocument 
  SET 
  driverdocument.driverlicence="${data.licencepic}",
  driverdocument.Inscurance="${data.insurancepic}",
  driverdocument.driverid = ${id},
  driverdocument.registration = "${data.registration}",
  driverdocument.criminalclearance ="${data.criminal}";   
    `
}

function dispatchService(data){
  return `
  SELECT
	*,
  cardetail.licenseplate,
	cardetail.model,
	cardetail.color,
	service.servicetype,
	(6371 * acos(cos(radians(${data.lat})) * cos(radians(driver.lat)) * cos(radians(driver.lng) - radians(${data.lng})) + sin(radians(${data.lat})) * sin(radians(driver.lat)))) AS distance
FROM
	driver
	JOIN service ON service.serviceid = driver.serviceid
  JOIN cardetail on cardetail.id = driver.cardetailid
WHERE
	service.servicetype   = "${data.service}"
	AND driver.status = "approved"
HAVING
	distance < 10
ORDER BY
	distance;
  `
}
export function complaintsdetail(data) {
  return `
    SELECT
     CONCAT(firstname," ", lastname) as name,
     subject,
     content,
     status,
     date
    FROM
     complaints
    WHERE
     complaintid = ${data.id} 
    `;
}
export function updateComplaints(data) {
  return `
     UPDATE
      complaints
     SET
      status='${data.status}'
     WHERE
      complaintsid=${data.id}  
    `;
}
function carService(){
  return `
  SELECT
service.servicetype,
carservicerelation.maxCapacity,
paymentmethod.paymentmethod,
searchradius.radius,
price.price,
service.servicepicture

FROM carservicerelation
JOIN service on carservicerelation.serviceid = service.serviceid
JOIN paymentmethod on paymentmethod.paymentmethodid = carservicerelation.paymentmethodid
JOIN searchradius on searchradius.searchradiusid = carservicerelation.searchradiusid
JOIN price on price.priceid = carservicerelation.priceid;
  `
}
// view data of Driver

function DriverDocumentList(id){
  return `
  SELECT 
driverdocument.registration,
driverdocument.Inscurance,
driverdocument.driverlicence,
driverdocument.criminalclearance
from 
driverdocument 
WHERE driverdocument.driverid = ${id};
  `
}
// update profile
function updateProfile(imageupload,id){
  return `
  UPDATE 
  driver
SET
driver.photo = "${imageupload}"
WHERE driver.id= ${id};
  `
}
export default {
  getadmin,
  getadmins,
  login,
  addadmin,
  dashboard,
  drivers,
  users,
  driverdetail,
  driverdetailorder,
  driverdetaildocument,
  driverdetailreview,
  dispatcher,
  sendDriver,
  accounting,
  accountingdrivers,
  accountingservice,
  accountingaddservice,
  accountingriders,
  marketingcoupon,
  addmarketing,
  complaints,
  complaintsdetail,
  updateComplaints,
  activeDriver,
  driverorderDetail,
  carService,
  dispatchService,
 addDriverSales,
 addDriverDocumentSales,
 addNewUserCar,
 ratingReview,
 DriverDocumentList,
 updateProfile
};

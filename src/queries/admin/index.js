export function login(data) {
  return `
  SELECT 
    *
  FROM
   Admin
  Where
   email = '${data.email}',
   password = '${data.password}' 
  `;
}
export function adduser(data) {
  return `
     INSERT INTO
        Admin
      SET
       email='${data.username}',
       password='${data.password}',
       role='${data.role}'  
    ;
    `;
}
export function dashboard(data) {
  return `
    SELECT *
    FROM
         Driver; 
    orderby ${data} ASC;
    SELECT 
      COUNT(driverid) as drivers,
      COUNT (userid) as riders,
    FROM 
      Journey 
    WHERE
       status = 'started'  ;      
    `;
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
        photo,
        CONCAT(firstname," ",lastname) as name,
        phonenumber,
        status,
     FROM
        Driver;
    `;
}
export function addnewdriver(data) {
  return `
    INSERT INTO
        CarDetail
    Set
        productionyear='${data.year}'
        model='${data.model}',
        licenceplate='${data.licenceplate}',
        color='${data.color}';

    INSERT INTO
        DRIVER
    SET
        firsrname='${data.firstname}',
        lastname='${data.lastname},
        photo='${data.picture}',
        gender='${data.gender},
        phonenumber='${data.phonenumber}',
        email='${data.email}',
        serviceid='${data.serviceid}',
        activeid=1,
        addeddate='${Date.now()}',
        status='missing'
        cardetailid=scope_identity()
      ;
    `;
}
export function addnewdocument(data) {
  return `
      UPDATE
       Driver
      SET
       userdocuments='${data.userdocument}',
       cardocuments='${data.cardocument}'
      WHERE
       driverid=${data.driverid}  
    `;
}

export function driverdetail(data) {
  return `
     SELECT *
     FROM 
        Driver,CarDetail,Service
     WHERE
       driverid=${data.driverid};

     SELECT AVG(rating) as rating
     FROM
       RatingAndReview
     Where
         driverid=${data.driverid}
    `;
}
export function driverdetailorder(data) {
  return `
    SELECT 
     CONCAT(driver.firstname," ",drive.lastname) as name,
     startinglocation as startpoint ,
     arrivinglocation as destination,
     date ,
     price 
    FROM History,Driver,Payment,Booking;
    `;
}
export function driverdetailreview(data) {
  return `
      SELECT
        CONCAT(User.firstname," ",User.lastname) as name,
        rating,
        review
      FROM 
        Rating,Users
      where 
        driverid=${data.driverid}

      OrderBy date ASC;
    `;
}

export function driverdetaildocument(data) {
  return `
    SELECT 
      userdocuments,
      cardocuments,
    FROM
      Driver
    WHERE
      driverid=${data.driverid}  
    `;
}

export function dispatcher(data) {
  return `
     SELECT *
     FROM
        Driver
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
      Count(driverid) as drivers
      FROM
       Driver
      OrderBy addeddate;
    SELECT
     Count(userid) as users
    FROM
     User
     OrderBy date;   
    `;
}
export function accountingdrivers() {
  return `
    SELECT *
    FROM
      Driver
    OrderBy addeddate;  
    `;
}
export function accountingriders() {
  return `
    SELECT *
    FROM
     User
    OrderBy date; 
    `;
}
// testing must be done and need modification
export function accountingservice() {
  return `
     SELECT *
      FROM 
     Service,Price,SearchRadious

      
    `;
}
// need some modification
export function accountingaddservice(data) {
  return `
     INSERT INTO 
      Service
     SET 
    `;
}
export function marketingcoupon() {
  return `
    SELECT 
     *
    FROM 
     Marketing
    `;
}

export function addmarketing(data) {
  return `
        INSERT INTO
         title='${data.title}',
         discription='${data.discription}',
         dateadded='${Date.now()}',
         status='active',
         adminid='${data.adminid}'
    `;
}
export function complaints() {
  return `
    SELECT 
     date,
     subject,
     content,
     status
    FROM 
     Complaints
    OrderBy date ASC ;
    `;
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
     Complaints
    WHERE
     complaintid = ${data.id} 
    `;
}
export function updateComplaints(data) {
  return `
     UPDATE
      Complaints
     SET
      status='${data.status}'
     WHERE
      complaintsid=${data.id}  
    `;
}

export default {
  login,
  adduser,
  dashboard,
  drivers,
  addnewdriver,
  addnewdocument,
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
  updateComplaints

}
function getdrivers() {
  return `
    SELECT * FROM Driver
  `;
}

function getdriver(id) {
  return `
    SELECT * FROM Driver WHERE id='${id}'
  `;
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
	SUM(paymnet.distance) AS totalDistance
FROM
	paymnet
WHERE
	paymnet.driverid = ${id}
	AND DATE(paymnet.date) = CURDATE();
`

}
function history(driverid) {
  return `
 SELECT 
 startinglocation,
 arrivinglocation,
 price,
 distance,
From 
 History,User,Booking,Payment
Where
 driver=${driverid} 
GroupBy Payment.date 
 `;
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
  totalPrice
};

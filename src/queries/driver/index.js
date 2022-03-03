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
       lattitude=${data.lat}
       longtuide=${data.lng}
      WHERE
        driverid=${data.driverid} 
`;
}
// on testing we will see the result of our need
// function notifydriver(data){
//     return`

//     `
// }

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
};

function getdrivers() {
  return `
    SELECT * FROM Driver
  `;
}

function getdriver(id) {
  return `
    SELECT * FROM Driver WHERE driverid='${id}'
  `;
}

function add_driver(data) {
  return `
        INSERT INTO
            Driver
        SET
          firstname='${data.firstname}',
          lastname='${data.lastname}',
          gender='${data.gender}',
          email='${data.email}',
          phonenumber='${data.phonenumber}',
          password='${data.password}',
          photo='${data.photo}',
          status='missing',
          addedDate'${Date.now()}'
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
       count(driverid) ad Job
    From
      Payment
    Where
      driverid = ${driverid}
    GroupBy date      
    `;
}

export default {
  getdriver,
  getdrivers,
  add_driver,
  updatecurrentlocation,
  displaystatus,
  history,
};

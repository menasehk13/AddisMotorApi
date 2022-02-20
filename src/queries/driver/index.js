export function add_driver(data){
    return`
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
    `
}
export function updatecurrentlocation(data){
    return `
     UPDATE
        Driver
      SET
       lattitude=${data.lat}
       longtuide=${data.lng}
      WHERE
        driverid=${data.driverid} 
`}
 // on testing we will see the result of our need
// export function notifydriver(data){
//     return`
     
    
//     `
// }

export function history(data){
 return`
 SELECT 
 startinglocation,
 arrivinglocation,
 price,
 distance,
From 
 History,User,Booking,Payment
Where
 driver=${data.driverid} 
GroupBy Payment.date 
 `
}

export function displaystatus(data){
    return`
    SELECT
       Sum(distance) as Km,
       Sum(price) as Price ,
       count(driverid) ad Job
    From
      Payment
    Where
      driverid = ${data.driverid}
    GroupBy date      
    `
}



export function adduser(data) {
  return `
     INSERT INTO
     Users
     SET
       firstname='${data.firstname}',
       lastname='${data.lastname}',
       gender='${data.gender}'
       phonenumber='${data.phonenumber}'
       currency='10'
    `;
}

export function edituser(data) {
  return `
    UPDATE
        User
    SET
        firstname='${data.firstname}',
        lastname='${data.lastname}',
        phonenumber='${data.phonenumber}'
    WHERE
       id='${data.id}'
    `;
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

export function requestDriver(data) {
  return `
    SELECT 
        firstname,
        lastname,
        photo,
        phonenumber,
        lattitude as lat,
        longtuide as lng,
        (6371 * acos(cos(radians(${data.lat})) * cos(radians(Driver.lattitude)) * cos(radians(Driver.longitude) - radians(${data.lng})) + sin(radians(${data.lat})) * sin(radians(Driver.lattitude)))) AS distance    
    From 
        Driver,Service,Active
    Where
        serviceid='${data.service}' And activeid='1'
    Having Distance < 38
    OrderBy Distance
    Limit 10;
          
    `;
}

export function history(userid) {
  return `
    SELECT 
    startinglocation,
    arrivinglocation,
    price,
    distance,
From 
    History,User,Booking,Payment
Where
    userid=${userid} 
GroupBy Payment.date    
`;
}

export function booking(data) {
  return `
    INSERT INTO
        Booking
        SET
        arrivinglocation='${data.arriving}',
        startinglocation='${data.starting}',
        userid='${data.userid}',
        driverid='${data.driverid}',
        status='driver on the way'
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

export default {
  adduser,
  edituser,
  getusers,
  getuser,
  getuserbyphone,
  requestDriver,
  history,
  booking,
  journeylocation,
  journeystarted,
  payment,
  driverfound,
};

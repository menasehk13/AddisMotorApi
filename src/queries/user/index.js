export function adduser(data){
    return`
     INSERT INTO
     Users
     SET
       firstname='${data.firstname}',
       lastname='${data.lastname}',
       phonenumber='${data.phonenumber}'
       currency='10'
    `
}
export function edituser(data){
    return `
    UPDATE
        Users
    SET
    firstname='${data.firstname}',
    lastname='${data.lastname}',
    phonenumber='${data.phonenumber}'
    ` 
}
   
export function getuser(userid){
    return`
        SELECT *
            FROM
        User 
            WHERE userid = '${userid}'
    `
}
export function requestDriver(data){
    return `
    SELECT 
    firstname,
    lastname,
    phonenumber,
    photo
    From Driver,Active
    `
} 
   
export function history(userid){
return `
    SELECT 
    startinglocation,
    arrivinglocation,
    price,
    distance,
From 
    History,User,Booking
Where
    userid=${userid} 
`
}

export function booking(data){
return `
    INSERT INTO
        Booking
        SET
        arrivinglocation='${data.arriving}',
        startinglocation='${data.starting}',
        userid='${data.userid}',
        driverid='${data.driverid}',
        status='driver on the way'
`
}

export function journeystarted(data){
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
    `
}

export function journeylocation(data){
return `
UPDATE 
    Journey
SET
lattitude='${data.lattitude}',
longittude='${data.longittude}',
`
}
export function payment(data){
    return`
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

    `
}

   
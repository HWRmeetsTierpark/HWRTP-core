var sampleRequest = {
    user: "12345678901",            //11-digit EAN code
    request_type: {
        mode: "authentication",     //lookup(search for user in db), authentication(biometric)
        auth_type: "finger",        //finger, face
        data: ""                    //image(BASE64)
    },
    data: ""                        //BASE64 encoded image
}
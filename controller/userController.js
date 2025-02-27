const db = require("../dbConnection");
const { promisify } = require('util');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userRegister = (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
    req.body.email
    )});`,
    (err, result) => {

        console.log(err);
        if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

        if (result.length) {
            /* If email already exist */
            return res.status(409).send({
                status: false,
                message: "Email already exist."
            });
        } else {
            /* If email available */
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).send({
                        status: false,
                        message: err
                    });
                } else {
                    /* Store hashed password in database */
                    db.query(
                    `INSERT INTO users (name, email, password) VALUES ('${
                        req.body.name
                    }', ${db.escape(req.body.email)}, ${db.escape(hash)})`,
                    (err, result) => {
                        
                        console.log(err);
                        if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

                        return res.status(200).send({
                            status: true,
                            message: "The user has been registerd successfully."             
                        });
                    }
                    );
                }
            });
        }
    }
  );
}

exports.userLogin = (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {

        console.log(err);
        if (err) return res.status(400).json({ status: false, message: err.sqlMessage });
            
        /* If user does not exists */
        if (!result.length) {
            return res.status(401).send({
                status: false,
                message: "Invalid credentials."
            });
        }

        /* Check password */
        bcrypt.compare(
            req.body.password,
            result[0]["password"],
            (bErr, bResult) => {
                /* If wrong password */
                if (bErr) {
                    throw bErr;
                    return res.status(401).send({
                        status: false,
                        message: "Invalid credentials."
                    });
                }
                if (bResult) {
                    const token = jwt.sign(
                    { id: result[0].id },
                    "the-super-strong-secrect",
                    { expiresIn: "1h" }
                    );
                    db.query(
                    `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                    );

                    result[0].token = token;

                    /* Remove password key */
                    passwordExist = 'password' in result[0];
                    if(passwordExist){
                        delete result[0].password;
                    }

                    return res.status(200).send({
                        status: true,
                        message: "Login successfull.",
                        data: result[0],
                    });
                }
                return res.status(401).send({
                    status: false,
                    message: "Invalid credentials."
                });
            }
        );
    }
  );
};

exports.userLogout = (req, res, next) => {  
    const theToken = req.headers.authorization.split(" ")[1];
    jwt.sign(theToken, "", { expiresIn: 1 } , (logout, err) => {
        if(logout){
            return res.status(200).send({
                status: true,
                message: "Logout successfull.",
            });
        }else{
            return res.status(401).send({
                status: true,
                message:'Error'
            });
        }
    });
};

exports.getUserDetails = (req, res, next) => {
    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "the-super-strong-secrect");
    db.query(
        "SELECT * FROM users where id=?",
        decoded.id,
        function (err, result, fields) {
            
            console.log(err);
            if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

            /* Remove password key */
            passwordExist = 'password' in result[0];
            if(passwordExist){
                delete result[0].password;
            }

            return res.status(200).send({
                status: true,
                message: "User details get successfully.",
                data: result[0]                
            });

        }
    );
}

exports.updateLanguage = (req, res, next) => {
    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "the-super-strong-secrect");

    const myQuery = `update users set language=? where id = ?`;

    db.query(
        myQuery,
        [req.body.language, decoded.id],
        function (err, result, fields) {
            
            console.log(err);
            if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

            return res.status(200).send({
                status: true,
                message: "Language has been updated successfully."               
            });

        }
    );
}

exports.userAuthenticate = async (req, res, next) => {
    try {
        let headerToken;
    
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            headerToken = req.headers.authorization.split(' ')[1];
        } else {
            const token = req.rawHeaders.filter((t) => {
            return t.startsWith('jwt=');
            });
            headerToken = token[0].split('=')[1];
        }
    
        if (!headerToken)
            return res.status(404).json({ status: false, message: 'Unauthenticated.' });
    
        const decoded = await promisify(jwt.verify)(headerToken, 'the-super-strong-secrect');
    
        db.query(`select * from users where id=${decoded.id}`, (err, rows, fields) => {
            if (rows.length > 0) {
            const user = rows[0];
            req.user = user;
            res.locals.user = user;
            next();
            } else {
            res.status(404).json({
                status: false,
                message: 'No user found',
            });
            }
        });
    } catch (err) {
        // console.log(err);
        res.status(400).json({
            status: false,
            message: 'Unauthenticated.',
        });
    }
};

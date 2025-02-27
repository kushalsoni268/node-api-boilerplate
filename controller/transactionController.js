const db = require("../dbConnection");
const jwt = require("jsonwebtoken");

exports.createTransaction = (req, res, next) => {
    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "the-super-strong-secrect");

    var currentDateTime = new Date();

    const myQuery = `insert into transactions(bill_no, name, amount, date, type, description, created_at, created_by) values(?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        myQuery,
        [req.body.bill_no, req.body.name, req.body.amount, req.body.date, req.body.type, req.body.description, currentDateTime, decoded.id],
        (err, result, fields) => {

            if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

            res.status(200).json({
                status: true,
                message: "Transaction has been created successfully.",
            });
        }
    );
}

exports.updateTransaction = (req, res, next) => {
    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "the-super-strong-secrect");

    var currentDateTime = new Date();

    // $query = "SELECT * FROM transactions where id=? AND created_by=?";

    db.query(
        "SELECT * FROM transactions where id=?",
        [req.body.id],
        function (err, result, fields) {
          
            if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

            var transactionData = result[0];
            var updateByArray = [];

            db.query(
                "SELECT * FROM users where id=?",
                [decoded.id],
                function (err, result, fields) {                  
                    if (err) return res.status(400).json({ status: false, message: err.sqlMessage });
                    var userData = result[0];        
                    
                    if (typeof transactionData !== 'undefined') {
                        if (transactionData.updated_by !== null) {
                            updateByArray = JSON.parse(transactionData.updated_by);               
                            var updateByJson = {id: userData.id, name: userData.name, updated_at: currentDateTime};
                            updateByArray.push(updateByJson);
                        }else{
                            var updateByJson = {id: userData.id, name: userData.name, updated_at: currentDateTime};
                            updateByArray.push(updateByJson);
                        }
                    }
                            
                    var updateByObj = JSON.stringify(updateByArray);

                    const myQuery = `update transactions set bill_no=?, name=?, amount=?, date=?, type=?, description=?, updated_by=? where id = ?`;
    
                    db.query(
                        myQuery,
                        [req.body.bill_no, req.body.name, req.body.amount, req.body.date, req.body.type, req.body.description, updateByObj, req.body.id],
                        (err, result, fields) => {

                            if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

                            res.status(200).json({
                                status: true,
                                message: "Transaction has been updated successfully.",
                            });
                        }
                    );
                }
            );
        }
    );

}

exports.deleteTransaction = (req, res, next) => {
    const id = req.body.id;
    if (!id) return res.status(400).json({ status: false, message: 'Id field is required' });

    db.query(`DELETE from transactions where id='${id}'`, (err, rows, fields) => {

        if (err) return res.status(400).json({ status: false, message: err.sqlMessage });
        
        if (rows.affectedRows > 0) {
            res.status(200).json({
                status: true,
                message: "Transaction deleted successfully."
            });
        } else {
            res.status(400).json({
                status: false,
                message: "Transaction Found found"
            });
        }
    });
}

exports.getAllTransactions = (req, res, next) => {
    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "the-super-strong-secrect");

    // $query = "SELECT transactions.*, users.name as created_by_name FROM transactions LEFT JOIN users on users.id=transactions.created_by WHERE transactions.created_by=? ORDER BY transactions.id DESC";
    $query = "SELECT transactions.*, users.name as created_by_name FROM transactions LEFT JOIN users on users.id=transactions.created_by ORDER BY transactions.id DESC";

    db.query(
        $query,
        function (err, result, fields) {
          
            if (err) return res.status(400).json({ status: false, message: err.sqlMessage });      
            
            result.forEach(function(element, index, array) {
                if (element.updated_by !== null && element.updated_by !== '') {
                    element.updated_by = JSON.parse(element.updated_by);
                }
            })
  
            return res.send({
                status: true,
                message: "Transactions get successfully.",
                data: result              
            });
        }
    );
}

exports.getTransactionDetails = (req, res, next) => {
    const theToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(theToken, "the-super-strong-secrect");

    // $query = "SELECT transactions.*, users.name as created_by_name FROM transactions LEFT JOIN users on users.id=transactions.created_by WHERE transactions.id=? AND transactions.created_by=?";
    $query = "SELECT transactions.*, users.name as created_by_name FROM transactions LEFT JOIN users on users.id=transactions.created_by WHERE transactions.id=?";

    db.query(
        $query,
        [req.body.id],
        function (err, result, fields) {
          
            if (err) return res.status(400).json({ status: false, message: err.sqlMessage });

            if (typeof result[0] !== 'undefined') {
                if (result[0].updated_by !== null && result[0].updated_by !== '') {
                    result[0].updated_by = JSON.parse(result[0].updated_by);
                }
            }
  
            return res.send({
                status: true,
                message: "Transaction details get successfully.",
                data: typeof result[0] !== 'undefined' ? result[0] : null           
            });
        }
    );
}


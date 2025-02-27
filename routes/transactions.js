const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const transactionController = require('../controller/transactionController');

router.post('/create-transaction', userController.userAuthenticate, transactionController.createTransaction);
router.post('/update-transaction', userController.userAuthenticate, transactionController.updateTransaction);
router.delete('/delete-transaction', userController.userAuthenticate, transactionController.deleteTransaction);
router.post('/get-all-transactions', userController.userAuthenticate, transactionController.getAllTransactions);
router.post('/get-transaction-details', userController.userAuthenticate, transactionController.getTransactionDetails);

module.exports = router;

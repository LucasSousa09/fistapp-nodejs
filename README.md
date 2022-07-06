# Fist Node.js Application

My first node.js application. 
The objective of the application is to teach some node.js principles.

## The application is for finance and follows the following requirements:
- It must be possible to create an account
- It must be possible to search the client's bank statement 
- It must be possible to search the client's bank statement by the date
- It must be possible to make a deposit
- It must be possible to make a  withdraw
- It must be possible to update the client's account data
- It must be possible to delete an account

## It also has the following business rules:
- It must not be possible to create an account with a CPF that already exists
- It must not be possible to search for the bank statement of a nonexistent account
- It must not be possible to deposit in a nonexistent account
- It must not be possible to withdraw if the balance is insufficient
- It must not be possible to delete a nonexistent account

## Main learnings:
- Usage of request params (Header params, body params, query params, and route params)
- Usage of Middlewares
- Usage of some HTTP status codes

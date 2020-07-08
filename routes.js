const leaveController = require('./controllers/leaveController');
const employeeController = require('./controllers/employeeController');

module.exports = app => {
    // pre login routes
    // GET route
    app.get('/', leaveController.login);
    app.get('/resetPassword', leaveController.resetPasswordForm);
    //app.get('/findUsername', leaveController.findUserForm);

    // POST route
    app.post('/login', leaveController.checkLogin);
    app.post('/reset/password', leaveController.resetPassword);
    //app.post('/find/User', leaveController.find);


    // logged in routes
    // app.use((req, res, next) => {
    //     if(req.session.currentUser) {
    //         next();
    //     } else {
    //         return res.redirect('/');
    //     }
    // });

    // GET route
    app.get('/:employeeID', leaveController.dash);
    app.get('/:employeeID/:ticketIndex/view', leaveController.view);
    app.get('/:employeeID/application', leaveController.apply);
    app.get('/:employeeID/:ticketIndex/applicationEdit', leaveController.edit);

    // POST route
    app.post('/:employeeID/application', leaveController.applicationSubmit);
    app.put('/:employeeID/:ticketIndex/applicationEdit', leaveController.submitEdit);
    app.post('/:employeeID/:subEmployeeName/:ticketIndex/approve', leaveController.approve);
    app.post('/:employeeID/:subEmployeeName/:ticketIndex/reject', leaveController.reject);

    // DELETE route
    app.delete('/:employeeID/:ticketIndex/deleteTicket', leaveController.deleteTicket);

    // create new employee
    // GET route
    app.get('/:employeeID/employeeCreate', employeeController.createEmployee);
    app.get('/:employeeID/employeeManage', employeeController.viewEmployee);
    app.get('/:employeeID/:employeeEdit', employeeController.editEmployee);
    // POST route
    app.post('/:employeeID/employeeCreate', employeeController.createEmployeeSubmit);
    // PUT route
    app.put('/:employeeID/:employeeEdit/update', employeeController.updateEmployee);
    // DELETE route
    app.delete('/:employeeID/employeeDelete', employeeController.deleteEmployee);

    // app.get('/create', leaveController.toCreate);
    // app.get('/shop/:name', leaveController.show);   
    // app.get('/shop/:name/update', leaveController.edit);

    // //POST route
    // app.post('/shop', leaveController.create);

    // //PUT route
    // app.put('/shop/:name', leaveController.update);

    // // DELETE route
    // app.delete('/shop/:name', leaveController.remove);
};
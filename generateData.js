const faker = require('faker');
const mysql = require('mysql');

// إعداد الاتصال بقاعدة البيانات
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // استبدل باسم المستخدم إذا لزم الأمر
    password: '',  // استبدل بكلمة المرور إذا لزم الأمر
    database: 'crm_db'
});

connection.connect();

// إدراج بيانات الموظفين
function insertEmployees(num) {
    for (let i = 0; i < num; i++) {
        const employee = {
            name: faker.name.findName(),
            position: faker.name.jobTitle(),
            department: faker.commerce.department(),
            email: faker.internet.email()
        };

        connection.query('INSERT INTO employees SET ?', employee, (err, results) => {
            if (err) throw err;
            console.log(`Inserted employee ID: ${results.insertId}`);
        });
    }
}

// إدراج بيانات العملاء
function insertCustomers(num) {
    for (let i = 0; i < num; i++) {
        const customer = {
            name: faker.name.findName(),
            contact: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber()
        };

        connection.query('INSERT INTO customers SET ?', customer, (err, results) => {
            if (err) throw err;
            console.log(`Inserted customer ID: ${results.insertId}`);
        });
    }
}

// إدراج بيانات المهام
function insertTasks(num) {
    connection.query('SELECT id FROM employees', (err, employeeResults) => {
        if (err) throw err;
        
        connection.query('SELECT id FROM customers', (err, customerResults) => {
            if (err) throw err;

            for (let i = 0; i < num; i++) {
                const task = {
                    title: faker.lorem.sentence(),
                    description: faker.lorem.paragraph(),
                    status: faker.random.arrayElement(['Pending', 'In Progress', 'Completed']),
                    due_date: faker.date.future().toISOString().split('T')[0],
                    employee_id: faker.random.arrayElement(employeeResults).id,
                    customer_id: faker.random.arrayElement(customerResults).id
                };

                connection.query('INSERT INTO tasks SET ?', task, (err, results) => {
                    if (err) throw err;
                    console.log(`Inserted task ID: ${results.insertId}`);
                });
            }
        });
    });
}

// استدعاء الدوال لإدراج البيانات
insertEmployees(100);
insertCustomers(100);
insertTasks(100);

connection.end();

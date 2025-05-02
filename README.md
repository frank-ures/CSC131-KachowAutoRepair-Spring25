<div align="center">
   <h1 align="center">Kachow Auto Repair - CSC 131 Project - Spring 2025</h1>
   <img src="./karwebsite/src/components/kar-logo.png" alt="Logo" width="400" height="400">
</div>

---

## Project EmployeeOverview

As websites become increasingly commonplace, many people feel frustrated when they realize that auto repair shops refuse to adapt. Customers expect easy online booking regardless of the industry, so when they find out that most mechanics only offer face-to-face appointment booking, they become annoyed and take their business elsewhere. Many traditional auto repair shops suffer from disorganization, with payroll often being on slow, outdated systems and clients' vehicle service history stored in physical files that are vulnerable to clutter and mismanagement.

Kachow Auto Repair (KAR) provides a website where every service is unified under one platform. This website offers ease for employees and customers. Customers can make an account to schedule appointments online and find a time that suits them the best. With an account, they can also see their vehicle’s comprehensive service history and get appointment reminders and dynamic updates from their mechanic. Employees also benefit from the centralized platform as they can easily see the number of hours they currently have in the pay period and their current list of tasks based on customer appointments. They can also give live updates regarding a customer’s service appointment status. This unified platform will benefit all parties, emphasizing convenience while allowing people to access an auto repair shop with a strong online presence.

## Team Members

* James Camacho - Front-End Developer - jamescamacho@csus.edu
* Ivan Gonzalez - Front-End Developer - ivangonzalez4@csus.edu
* Klayton Hutchins - Full-Stack Developer - klaytonhutchins@csus.edu
* Alan Labra Gomez - Full-Stack Developer - alanlabragomez@csus.edu
* Frank Ures - Development Lead - frankures@csus.edu

## Features

* Customer Dashboard
  * EmployeeSchedule an appointment.
  * View appointment history.
  * View upcoming appointments.
  * Write a review.
* Employee Dashboard
  * View appointments scheduled for the day.
  * Start and stop work on scheduled appointments.
  * View previous appointments you have completed.
  * View your payroll information.
* Administrator Dashboard
  * View employees' payroll information.
  * Manage your employees and their accounts.
  * View appointments scheduled for the day.

## Tech Stack

* <img src="./Frontend/public/images/mongodb.png" alt="MongoDB" width="24" height="24"> MongoDB
* <img src="./Frontend/public/images/expressjs.png" alt="ExpressJS" width="24" height="24"> Express.js
* <img src="./Frontend/public/images/reactjs.svg" alt="ReactJS" width="24" height="24"> React.js
* <img src="./Frontend/public/images/nodejs.svg" alt="NodeJS" width="24" height="24"> Node.js

## Installation

To install the Kachow Auto Repair project:

1. Clone the repository:
`git clone https://github.com/frank-ures/CSC131-KachowAutoRepair-Spring25`
2. Navigate to the project directory:
`cd CSC131-KachowAutoRepair-Spring25`
3. Install dependencies:
`npm install`
4. Set up environment variables in the `.env` file (default port 5000):
`MONGO_URI=your_mongo_uri
PORT=open_port_number`
5. Build the project:
`npm run build`
6. Start the project:
`npm start`

## Usage

To use the Kachow Auto Repair website:

1. Follow the full [installation procedure](#Installation) stated above.
2. Navigate to `http://localhost:5000` (use port number from installation step 4).
3. Create an account or login to an existing account.
4. EmployeeSchedule and manage automotive appointments, or explore other features the website has to offer.

## Contact

* For any questions or inquiries, please contact a [member](#Team-Members) of the development team listed above.
* For bugs or requests about this product, open an issue on the repository.

## License

This project is licensed under the [MIT License](./license.txt).

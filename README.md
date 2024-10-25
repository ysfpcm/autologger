# Autologger

Autologger is a call log management tool built using Next.js, React, TailwindCSS, and Framer Motion. It allows users to generate and manage call logs for customer service and technical support interactions. 

## Features

- **Generate Call Logs**: Automatically generate predefined call logs.
- **Call Management**: Manage different types of customer calls including technical support, customer service, risk management, and ISO agent calls.
- **Limited Call Log Generation**: Users are limited to generating call logs a specified number of times daily.
- **Responsive UI**: Designed with TailwindCSS for a seamless, responsive user experience.

## Technologies Used

- **Next.js**: Version 15.0.1
- **React**: Version 18.3.0
- **TailwindCSS**: Version 3.4.1
- **Framer Motion**: Version 11.11.10
- **Radix UI**: For component composition.

## Getting Started

### Prerequisites

Ensure that you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14.x or later)
- npm (comes with Node.js) or [yarn](https://classic.yarnpkg.com/en/docs/install) as a package manager.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ysfpcm/autologger.git
Navigate to the project directory:

bash
Copy code
cd autologger
Install dependencies:

Using npm:

bash
Copy code
npm install
Or using yarn:

bash
Copy code
yarn install
Running the Development Server
To start the development server, run the following command:

bash
Copy code
npm run dev
The app will be available at http://localhost:3000.

Building for Production
To create a production build, run:

bash
Copy code
npm run build
This will generate optimized static files for your application.

Deployment
You can easily deploy the app to Vercel using the Vercel CLI or the dashboard.

Note:
Ensure that the react and react-dom versions are compatible with other dependencies like framer-motion. For this project, use react@18.x.

Project Structure
/pages: Contains the main Next.js pages.
/public: Static assets like images.
/components: Reusable UI components.
/styles: Global styles and TailwindCSS configuration.
Usage
Generate Call Log: Click the "Generate Call Log" button to automatically generate a new call log with predefined issues and resolutions.
Edit Call Log: Manually edit the issue or action taken for any generated call log.
Limit Generations: Each user is limited to a set number of call log generations per day, after which a warning is displayed.
Dependencies
Here are the major dependencies used in this project:

Next.js: A React framework for production.
React: JavaScript library for building user interfaces.
TailwindCSS: A utility-first CSS framework for styling.
Framer Motion: A production-ready motion library for React.
Radix UI: For handling component composition.
Contributing
Fork the project.
Create your feature branch (git checkout -b feature/new-feature).
Commit your changes (git commit -am 'Add some feature').
Push to the branch (git push origin feature/new-feature).
Open a Pull Request.
License
This project is licensed under the MIT License. See the LICENSE file for more details.

Author
Marc
GitHub Profile

markdown
Copy code

### Key Sections:
- **Project Overview**: Describes the project and its features.
- **Installation and Setup**: Steps to get the project running locally.
- **Usage**: Brief description of the call log generation process.
- **Technologies**: Lists the technologies used in the project.
- **Contributing**: Basic guidelines for contributing to the project.
- **License**: A placeholder for licensing information. You can add an actual license file if needed.

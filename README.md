# Flush Finder

Welcome to Flush Finder, a review website for the restrooms around De La Salle University (DLSU)! This repository contains the source code for our web application, and this README will guide you on how to set up and run the project locally, as well as provide additional information about the project. 

If you are interested in viewing the deployed website, you may visit us at https://flush-finder.onrender.com

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## Introduction

Flush Finder provides users with a user-friendly platform to discover and review buildings and restrooms. We created this website after seeing the numerous posts on the DLSU freedom wall that were asking for the best restrooms around the campus for one to do their business. Our goal is to help our users find the cleanest and most comfortable restrooms to suit their needs

## Features

- **View Establishments:** Visitors and registered users can view establishments and reviews.
- **Registered users:** Registered users can post reviews, edit their profile information (including their picture), and be remembered for extended sessions
- **View User Profile:** Registered users can view profiles of other users
- **Reviews:** Logged-in users can create reviews with titles, bodies, ratings, restroom amenities, and photos. These reviews can be marked as helpful or unhelpful by other users. Reviews can be edited or deleted.
- **Search Establishments / Reviews:** Visitors and registered users can search establishments or reviews based on keywords.
- **Establishment Owner Response:** An additional role, "establishment owner," can respond to reviews. Credentials are already in the database and the establishment owner just needs to log in. 

## Technologies

The project utilizes the following:

- Frontend: HTML, CSS, JavaScript, Bootstrap, Tailwind
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Templating Engine: Handlebars
- User Authentication: Passport.js
- Image Storage: Multer
- Deployment: Render

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/riki-11/CCAPDEV-MCO.git
```
2. Install dependencies:

```
cd <project-folder-path>
npm install
```

## Usage

To run the application, use the following command:
```
npm run dev
```
The application will be available at http://localhost:3000.

For owner accounts, since there is no way to create a new one, they are already registered in the database. The following are the log-in credentials for all owner accounts:
- **username:** henrysy, **password:** password
- **username:** miguelhall, **password:** password
- **username:** velascohall, **password:** password
- **username:** andrew_gonzalez, **password:** password
- **username:** enrique_razon, **password:** password
- **username:** gokongwei, **password:** password

## Contact

If you have any questions or inquiries, please contact us:

- Krizchelle Wong (krizchelle_danielle_wong@dlsu.edu.ph)
- Patrick Leonida (patrick_josh_c_leonida@dlsu.edu.ph)
- Enrique Lejano (enrique_rafael_a_lejano@dlsu.edu.ph)
- Mark Abergos (mark_gabriel_abergos@dlsu.edu.ph)

Feel free to explore our project, and we hope you enjoy using it as much as we enjoyed building it!





